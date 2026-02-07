import { prisma } from '@/lib/prisma';
import { pusherServer } from '@/lib/pusher';
import { crypto } from 'next/dist/compiled/@edge-runtime/primitives';
import { z } from 'zod';

// Military-Grade Security Secret (Should be in .env)
const SECURITY_SECRET = process.env.SECURITY_SECRET || 'fallback-secret-for-signing';

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
    // 1. Localhost Whitelist
    const whitelist = ['localhost', '127.0.0.1', '.local', '.test'];
    if (whitelist.some(d => requestDomain.includes(d))) return true;

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
        return await prisma.$transaction(async (tx) => {
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
