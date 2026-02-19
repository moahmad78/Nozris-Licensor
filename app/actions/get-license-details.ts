'use server';

import { prisma } from '@/lib/db';

export async function getLicenseDetails(key: string) {
    if (!key || key.length < 5) return null;

    try {
        const license = await prisma.license.findUnique({
            where: { licenseKey: key },
            select: {
                domain: true,
                status: true,
                createdAt: true,
                expiresAt: true,
                planName: true,
                monthlyPrice: true
            }
        });

        if (!license) return null;

        return {
            domain: license.domain,
            status: license.status,
            createdAt: license.createdAt,
            expiresAt: license.expiresAt,
            planName: license.planName,
            amount: license.monthlyPrice
        };
    } catch (error) {
        console.error("Error fetching license:", error);
        return null;
    }
}

