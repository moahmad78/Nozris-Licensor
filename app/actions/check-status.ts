'use server';

import { prisma } from '@/lib/db';
import { checkIPStatus, registerSuspiciousAttempt } from '@/lib/security';
import { headers } from 'next/headers';

export async function checkLicenseStatus(key: string) {
    const headersList = await headers();
    const ip = headersList.get('x-forwarded-for') || 'unknown';

    // 1. Security Check
    const { isBlocked } = await checkIPStatus(ip);
    if (isBlocked) {
        return { error: 'Access Denied. IP Blocked.', blocked: true };
    }

    if (!key || key.length < 5) {
        return { error: 'Invalid Key Format' };
    }

    // 2. Fetch License
    const license = await prisma.license.findUnique({
        where: { licenseKey: key }
    });

    // 3. Handle Not Found (Security Event)
    if (!license) {
        // Register attempt with threshold 5
        const result = await registerSuspiciousAttempt(ip, `Invalid Status Check: ${key}`, 5);
        if (result.isBlocked) {
            return { error: 'Too many invalid attempts. IP Blocked.', blocked: true };
        }
        return { error: 'License Not Found' };
    }

    // 4. Return Details
    const now = new Date();
    const isExpired = now > license.expiresAt;

    return {
        success: true,
        data: {
            planName: license.planName,
            domain: license.domain,
            expiresAt: license.expiresAt.toISOString(),
            status: license.status === 'ACTIVE' && !isExpired ? 'ACTIVE' : 'EXPIRED',
            validFrom: license.validFrom.toISOString()
        }
    };
}

