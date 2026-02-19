import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { checkIPStatus, registerSuspiciousAttempt } from '@/lib/security';
import { rateLimiter } from '@/lib/rate-limiter';

export async function POST(req: Request) {
    // CORS Headers
    const headers = {
        'Access-Control-Allow-Origin': '*', // Adjust this to restrict domains if needed
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (req.method === 'OPTIONS') {
        return NextResponse.json({}, { headers });
    }

    try {
        // Detect IP
        const ip = req.headers.get('x-forwarded-for') || 'unknown';

        // Check Block Status
        const { isBlocked } = await checkIPStatus(ip);
        if (isBlocked) {
            return NextResponse.json(
                { valid: false, reason: 'Access Denied. IP Blocked.' },
                { status: 403, headers }
            );
        }

        // Rate Limiting — 20 req/min
        const { allowed, remaining, resetAt } = rateLimiter.check(ip);
        if (!allowed) {
            return NextResponse.json(
                { valid: false, reason: 'Rate limit exceeded. Try again later.' },
                {
                    status: 429,
                    headers: {
                        ...headers,
                        ...rateLimiter.headers({ remaining, resetAt })
                    }
                }
            );
        }

        const body = await req.json();
        const { licenseKey, domain, tamper } = body;

        console.log(`Validation Req: ${licenseKey} from ${ip} ${tamper ? '[TAMPER ALERT]' : ''}`);

        if (tamper) {
            const { logActivity } = await import('@/app/actions/activity');
            const { sendWhatsAppMessage } = await import('@/lib/whatsapp');

            // Log Activity
            await logActivity({
                clientEmail: body.clientEmail || 'unknown',
                type: 'CRITICAL',
                action: 'SECURITY_TAMPER',
                message: `Tamper alert detected for domain ${domain}. Client script may have been modified or bypassed.`
            });

            // Update License Status to TAMPERED (Lock it)
            if (licenseKey) {
                await prisma.license.updateMany({
                    where: { licenseKey },
                    data: { status: 'TAMPERED' }
                });
            }

            // Send Priority WhatsApp Alert
            await sendWhatsAppMessage('919264920211', `🚨 SECURITY TAMPER DETECTED: A client at domain ${domain} (Key: ${licenseKey}) has attempted to bypass the security check. The license has been automatically locked to TAMPERED status.`);

            return NextResponse.json({ valid: false, reason: 'Security violation logged. License Locked.' }, { status: 403, headers });
        }

        if (!licenseKey || !domain) {
            return NextResponse.json(
                { valid: false, reason: 'Missing licenseKey or domain' },
                { status: 400, headers }
            );
        }

        const license = await prisma.license.findUnique({
            where: { licenseKey },
        });

        if (!license) {
            // Log Suspicious Activity
            await registerSuspiciousAttempt(ip, `Invalid Key Attempt: ${licenseKey}`);

            return NextResponse.json(
                { valid: false, reason: 'Invalid license key' },
                { status: 200, headers }
            );
        }

        // Check for Termination / Excessive Tampering
        const client = await prisma.client.findUnique({
            where: { email: license.clientEmail }
        });

        if (license.status === 'TERMINATED' || license.status === 'TAMPERED' || (client && client.tamperCount >= 3)) {
            return NextResponse.json({
                valid: false,
                reason: 'License TERMINATED due to security tampering. Contact Mohd Ahmad (+91 9264920211) to restore.',
                status: 'TERMINATED'
            }, { status: 403, headers });
        }

        // Check if domain matches (Strict Security)
        const origin = req.headers.get('origin') || req.headers.get('referer');
        if (!origin) {
            return NextResponse.json(
                { valid: false, reason: 'Missing Origin/Referer header' },
                { status: 403, headers }
            );
        }

        // Create Normalize Helper
        const normalize = (url: string) => url.replace(/(^\w+:|^)\/\//, '').replace(/\/$/, '');
        const requestDomain = normalize(origin);
        const authorizedDomain = normalize(license.domain);
        const stagingDomain = license.domain ? normalize(license.domain) : null;

        // Use Centralized Domain Validation
        const { validateDomain } = await import('@/lib/security');
        const isValid = validateDomain(
            requestDomain,
            authorizedDomain,
            stagingDomain,
            license.editModeExpiry
        );

        if (!isValid) {
            // Log security alert
            const { logActivity } = await import('@/app/actions/activity');
            const { sendWhatsAppMessage } = await import('@/lib/whatsapp');

            // Check if it's a localhost attempt that failed (extra clarity)
            const isLocal = requestDomain.includes('localhost') || requestDomain.includes('127.0.0.1');

            await logActivity({
                clientEmail: license.clientEmail,
                type: 'CRITICAL',
                action: 'ATTEMPTED_CLONING',
                message: `CRITICAL: Unauthorized domain: ${requestDomain}. Key: ${license.licenseKey}. ${isLocal ? '(Localhost not whitelisted due to strict settings? Check logic)' : ''}`
            });

            await prisma.license.update({
                where: { id: license.id },
                data: { status: 'ATTEMPTED CLONING' }
            });

            // Send Priority WhatsApp Alert
            await sendWhatsAppMessage('919264920211', `🚨 CLONING ATTEMPT DETECTED: A license key (${license.licenseKey}) is being used on an UNAUTHORIZED domain: ${requestDomain}. The status has been marked as ATTEMPTED CLONING.`);

            return NextResponse.json(
                { valid: false, reason: 'Unauthorized Domain (CLONING DETECTED)', status: 'ATTEMPTED CLONING' },
                { status: 403, headers }
            );
        }

        if (license.status !== 'ACTIVE') {
            return NextResponse.json(
                { valid: false, reason: 'License suspended' },
                { status: 200, headers }
            );
        }

        const now = new Date();
        if (now < license.validFrom || now > license.expiresAt) {
            return NextResponse.json(
                { valid: false, reason: 'License not active yet or expired' },
                { status: 200, headers }
            );
        }

        // Update lastChecked and lastUsedAt
        // INTEGRITY CHECK
        const fileHash = body.fileHash || null;

        await prisma.license.update({
            where: { id: license.id },
            data: {
                lastChecked: now,
                lastUsedAt: now,
                // lastSeenHash removed as it does not exist on License
            }
        });

        const { validateIntegrity } = await import('@/lib/security');
        // Using cleanSnapshot instead of fileHash as requested for validation against the trusted source
        const integrity = validateIntegrity(fileHash, license.cleanSnapshot, license.editMode);

        if (!integrity.valid) {
            const { logActivity } = await import('@/app/actions/activity');
            const { sendWhatsAppMessage } = await import('@/lib/whatsapp');

            await logActivity({
                clientEmail: license.clientEmail,
                type: 'CRITICAL',
                action: 'INTEGRITY_VIOLATION',
                message: `CRITICAL: File integrity mismatch. Reason: ${integrity.reason}. License: ${license.licenseKey}`
            });

            // LOG TAMPER EVENT
            await prisma.tamperEvent.create({
                data: {
                    licenseId: license.id,
                    ipAddress: ip,
                    fileName: 'Main Client Bundle', // In a real scenario, this might come from the payload
                    severity: 'HIGH',
                    oldHash: integrity.expected,
                    newHash: integrity.actual,
                    description: integrity.reason || 'Unknown Integrity Error'
                }
            });

            // LOCKDOWN
            await prisma.license.update({
                where: { id: license.id },
                data: { status: 'TAMPERED' } // or a specific INTEGRITY_LOCK status
            });

            await sendWhatsAppMessage('919264920211', `🚨 INTEGRITY ERROR: ${integrity.reason} on ${license.domain}. License Locked.`);

            return NextResponse.json(
                { valid: false, reason: `Integrity Violation: ${integrity.reason}`, status: 'TAMPERED' },
                { status: 403, headers }
            );
        }

        // Generate signed, encoded bootstrap payload (not plain CSS)
        const { createNozrisPayload } = await import('@/lib/security');
        const payload = await createNozrisPayload(license.id, license.domain);

        // Heartbeat token: licenseId:timestamp in Base64
        const heartbeatToken = Buffer.from(`${license.id}:${now.getTime()}`).toString('base64');

        return NextResponse.json({
            valid: true,
            payload,
            heartbeatToken,
            status: license.status
        }, { headers });
    } catch (error) {
        console.error('Error validating license:', error);
        return NextResponse.json(
            { valid: false, error: 'Internal Server Error' },
            { status: 500, headers }
        );
    }
}

export async function OPTIONS() {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };
    return NextResponse.json({}, { headers });
}

