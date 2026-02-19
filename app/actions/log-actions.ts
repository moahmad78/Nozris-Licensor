'use server';

import { prisma } from '@/lib/db';
import { getClientLicenseDetails } from './client-integration';

export async function getTamperLogs(licenseId?: string) {
    let targetLicenseId = licenseId;

    if (!targetLicenseId) {
        // Must be client context
        const meta = await getClientLicenseDetails();
        if (!meta || meta.key === 'NO_LICENSE_FOUND') return [];
        const license = await prisma.license.findUnique({ where: { licenseKey: meta.key } });
        if (!license) return [];
        targetLicenseId = license.id;
    }

    return await prisma.tamperEvent.findMany({
        where: { licenseId: targetLicenseId },
        orderBy: { detectedAt: 'desc' },
        take: 50
    });
}

