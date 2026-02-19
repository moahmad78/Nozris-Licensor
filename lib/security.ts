import { prisma } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';
import { crypto } from 'next/dist/compiled/@edge-runtime/primitives';
import { z } from 'zod';

// Military-Grade Security Secret (Should be in .env)
const SECURITY_SECRET = process.env.SECURITY_SECRET || 'fallback-secret-for-signing';
const NOZRIS_SECRET = process.env.NOZRIS_SECRET || 'nozris-payload-signing-key';

/**
 * Validates the HMAC SHA-256 signature of a payload.
 */
export async function verifyHMACSignature(payload: string, signature: string) {
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(SECURITY_SECRET),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['verify']
    );

    const sigArray = new Uint8Array(
        signature.match(/.{1,2}/g)?.map(byte => parseInt(byte, 16)) || []
    );

    return await crypto.subtle.verify(
        'HMAC',
        key,
        sigArray,
        encoder.encode(payload)
    );
}

/**
 * Generic Schema Validator using Zod to prevent Injection/XSS
 */
/**
 * Validates Domain against License with Dev Mode support.
 */
export function validateDomain(
    requestDomain: string,
    authorizedDomain: string,
    stagingDomain?: string | null,
    devModeUntil?: Date | null
): boolean {
    // 1. Localhost Whitelist (strict: exact match or proper suffix)
    if (
        requestDomain === 'localhost' ||
        requestDomain.startsWith('localhost:') ||
        requestDomain === '127.0.0.1' ||
        requestDomain.startsWith('127.0.0.1:') ||
        requestDomain.endsWith('.local') ||
        requestDomain.endsWith('.test')
    ) return true;

    // 2. Dev Mode Check
    if (devModeUntil && new Date() < devModeUntil) return true;

    // 3. Staging Check
    if (stagingDomain && requestDomain === stagingDomain) return true;

    // 4. Strict Production Check
    return requestDomain === authorizedDomain;
}

export function validateIntegrity(
    incomingHash: string | null,
    storedHash: string | null,
    isEditMode: boolean
): { valid: boolean; reason?: string; actual?: string | null; expected?: string | null } {
    // Policy: If storedHash exists, incomingHash MUST match (unless Edit Mode).

    if (isEditMode) return { valid: true };

    if (storedHash) {
        if (!incomingHash) return { valid: false, reason: 'Missing File Signature', actual: null, expected: storedHash };
        if (incomingHash !== storedHash) return { valid: false, reason: 'File Signature Mismatch', actual: incomingHash, expected: storedHash };
    }

    // If no stored hash, we assume it's a first run, but ideally we should be in Edit Mode to set it. 
    // For now, if no stored hash is set, we might be vulnerable until "Sync" is clicked.
    // Let's allow but flag it? Or assume valid.
    return { valid: true };
}

export const validatePayload = <T>(schema: z.ZodSchema<T>, data: unknown): T => {
    const result = schema.safeParse(data);
    if (!result.success) {
        throw new Error(`Security Violation: Payload Validation Failed - ${result.error.message}`);
    }
    return result.data;
};

export async function checkIPStatus(ip: string) {
    const record = await prisma.blockedIP.findUnique({
        where: { ipAddress: ip }
    });
    return {
        isBlocked: record?.isBlocked || false,
        attempts: record?.attempts || 0
    };
}

export async function registerSuspiciousAttempt(ip: string, reason: string = "Suspicious Activity", threshold: number = 3) {
    try {
        return await prisma.$transaction(async (tx: any) => {
            let record = await tx.blockedIP.findUnique({
                where: { ipAddress: ip }
            });

            if (!record) {
                record = await tx.blockedIP.create({
                    data: {
                        ipAddress: ip,
                        reason: reason,
                        attempts: 1,
                        isBlocked: false
                    }
                });
            } else {
                record = await tx.blockedIP.update({
                    where: { ipAddress: ip },
                    data: {
                        attempts: { increment: 1 },
                        reason: reason
                    }
                });
            }

            if (record.attempts >= threshold && !record.isBlocked) {
                record = await tx.blockedIP.update({
                    where: { ipAddress: ip },
                    data: { isBlocked: true }
                });

                // ZERO-REFRESH: Notify Admin of Auto-Ban
                await pusherServer.trigger('admin-notifications', 'ip-banned', {
                    ip,
                    reason: record.reason,
                    attempts: record.attempts
                });

                // Refresh security stats on dashboard
                await pusherServer.trigger('admin-stats', 'update', {
                    type: 'SECURITY_ALERT',
                    message: `IP Banned: ${ip}`
                });
            }

            return record;
        });
    } catch (error) {
        console.error("Error registering attempt:", error);
        throw error;
    }
}

export async function resetIPStats(id: string) {
    return await prisma.blockedIP.update({
        where: { id },
        data: { isBlocked: false, attempts: 0 }
    });
}

// ─── Nozris Payload System ─────────────────────────────────────

/**
 * Creates an HMAC-signed, Base64-encoded bootstrap payload.
 * The client shield script decodes this to mount the UI.
 * Uses Web Crypto API (compatible with Edge + Node).
 */
export async function createNozrisPayload(licenseId: string, domain: string): Promise<string> {
    const timestamp = Date.now();
    const encoder = new TextEncoder();

    // Create HMAC signature using Web Crypto API
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(NOZRIS_SECRET),
        { name: 'HMAC', hash: 'SHA-256' },
        false,
        ['sign']
    );
    const sigBuffer = await crypto.subtle.sign(
        'HMAC',
        key,
        encoder.encode(`${licenseId}:${timestamp}:${domain}`)
    );
    const sig = Array.from(new Uint8Array(sigBuffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

    // The CSS that reveals the content — obfuscated inside a signed envelope
    const css = [
        '#app-root{display:block!important;opacity:1!important;visibility:visible!important;pointer-events:auto!important}',
        '.license-warning,.lw-overlay{display:none!important}',
        '[data-nozris-pending]{display:block!important}'
    ].join('');

    const envelope = JSON.stringify({
        c: css,
        s: sig,
        t: timestamp,
        l: licenseId,
        d: domain,
        // expires in 24 hours (for cache validation on client)
        x: timestamp + (24 * 60 * 60 * 1000)
    });

    return Buffer.from(envelope).toString('base64');
}

/**
 * Verifies a heartbeat token returned by the client shield.
 * Returns { valid, reason } with reason for rejection.
 */
export function verifyHeartbeatToken(
    token: string,
    licenseId: string,
    maxAgeMs: number = 5 * 60 * 1000 // 5 minutes default
): { valid: boolean; reason?: string } {
    try {
        const decoded = Buffer.from(token, 'base64').toString('utf8');
        const parts = decoded.split(':');
        if (parts.length < 2) return { valid: false, reason: 'Malformed token' };

        const [tokenLicenseId, tokenTimestamp] = parts;
        if (tokenLicenseId !== licenseId) {
            return { valid: false, reason: 'License ID mismatch' };
        }

        const ts = parseInt(tokenTimestamp, 10);
        if (isNaN(ts)) return { valid: false, reason: 'Invalid timestamp' };

        const age = Date.now() - ts;
        if (age > maxAgeMs) {
            return { valid: false, reason: `Token expired (age: ${Math.round(age / 1000)}s)` };
        }

        return { valid: true };
    } catch {
        return { valid: false, reason: 'Token decode failure' };
    }
}
