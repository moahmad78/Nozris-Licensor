// Heartbeat API endpoint — validates license health + detects DevTools tampering

import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { verifyHeartbeatToken } from '@/lib/security';

export async function POST(req: Request) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    try {
        const ip = req.headers.get('x-forwarded-for') || 'unknown';
        const body = await req.json();
        const { licenseKey, token, computedStyles } = body;

        if (!licenseKey || !token) {
            return NextResponse.json(
                { status: 'INVALID', reason: 'Missing parameters' },
                { status: 400, headers }
            );
        }

        // 1. Find the license
        const license = await prisma.license.findUnique({
            where: { licenseKey }
        });

        if (!license) {
            return NextResponse.json(
                { status: 'INVALID', reason: 'Unknown license' },
                { status: 404, headers }
            );
        }

        // 2. Verify heartbeat token authenticity + freshness (5 min window)
        const tokenCheck = verifyHeartbeatToken(token, license.id, 10 * 60 * 1000);
        if (!tokenCheck.valid) {
            return NextResponse.json(
                { status: 'TOKEN_EXPIRED', reason: tokenCheck.reason },
                { status: 200, headers }
            );
        }

        // 3. DevTools Tamper Detection
        // If the client-side script detects suspicious computed styles, it sends them here
        if (computedStyles) {
            const { display, visibility, opacity } = computedStyles;
            const isTampered =
                // If root is visible but the script didn't authorize it (no valid cached payload)
                (display === 'block' && body.scriptDidMount === false) ||
                // If someone manually overrode opacity while shield hasn't verified
                (opacity === '1' && body.scriptDidMount === false);

            if (isTampered) {
                const { logActivity } = await import('@/app/actions/activity');
                const { sendWhatsAppMessage } = await import('@/lib/whatsapp');

                // Mark as TAMPERED
                await prisma.license.update({
                    where: { id: license.id },
                    data: { status: 'TAMPERED' }
                });

                // Log tamper event
                await prisma.tamperEvent.create({
                    data: {
                        licenseId: license.id,
                        ipAddress: ip,
                        fileName: 'DevTools Override',
                        severity: 'CRITICAL',
                        description: `DevTools CSS override detected. display:${display}, opacity:${opacity}, visibility:${visibility}`
                    }
                });

                await logActivity({
                    clientEmail: license.clientEmail,
                    type: 'CRITICAL',
                    action: 'DEVTOOLS_TAMPER',
                    message: `DevTools CSS override detected on ${license.domain} from IP ${ip}. License auto-locked.`
                });

                await sendWhatsAppMessage(
                    '919264920211',
                    `🚨 DEVTOOLS TAMPER: Someone at ${license.domain} (IP: ${ip}) manually overrode CSS via DevTools. License has been auto-locked to TAMPERED.`
                );

                return NextResponse.json(
                    { status: 'TAMPERED', reason: 'DevTools override detected' },
                    { status: 200, headers }
                );
            }
        }

        // 4. Update last heartbeat timestamp
        await prisma.license.update({
            where: { id: license.id },
            data: {
                lastChecked: new Date(),
                lastUsedAt: new Date()
            }
        });

        // 5. Check if license is still valid
        const now = new Date();
        if (license.status !== 'ACTIVE') {
            return NextResponse.json(
                { status: 'SUSPENDED', reason: 'License no longer active' },
                { status: 200, headers }
            );
        }

        if (now > license.expiresAt) {
            return NextResponse.json(
                { status: 'EXPIRED', reason: 'License has expired' },
                { status: 200, headers }
            );
        }

        // Generate fresh heartbeat token for next cycle
        const freshToken = Buffer.from(`${license.id}:${Date.now()}`).toString('base64');

        return NextResponse.json(
            { status: 'OK', token: freshToken },
            { status: 200, headers }
        );
    } catch (error) {
        console.error('Heartbeat error:', error);
        return NextResponse.json(
            { status: 'ERROR' },
            { status: 500, headers }
        );
    }
}

export async function OPTIONS() {
    return NextResponse.json({}, {
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        }
    });
}
