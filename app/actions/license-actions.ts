'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateLicenseDevSettings(licenseId: string, stagingDomain: string, enableDevMode: boolean) {
    const data: any = {
        stagingDomain: stagingDomain || null,
    };

    if (enableDevMode) {
        const tomorrow = new Date();
        tomorrow.setHours(tomorrow.getHours() + 24);
        data.devModeUntil = tomorrow;
    } else {
        data.devModeUntil = null;
    }

    try {
        await prisma.license.update({
            where: { id: licenseId },
            data
        });
        revalidatePath(`/admin/licenses/${licenseId}`);
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update settings' };
    }
}

export async function getLicenseDetails(id: string) {
    return await prisma.license.findUnique({
        where: { id },
    });
}

export async function getLicenseStats() {
    const total = await prisma.license.count();
    const active = await prisma.license.count({ where: { status: 'ACTIVE' } });
    return { total, active };
}

// Added missing exports
export async function getAllClients() {
    try {
        return await prisma.client.findMany({
            orderBy: { createdAt: 'desc' },
        });
    } catch (error) {
        return [];
    }
}

export async function getAllLicenses() {
    try {
        return await prisma.license.findMany({
            orderBy: { createdAt: 'desc' },
        });
    } catch (error) {
        return [];
    }
}

// Alias for page compatibility
export const getLicenses = getAllLicenses;

export async function createManualLicense(data: { clientEmail: string, domain: string, expiresAt: string }) {
    try {
        const license = await prisma.license.create({
            data: {
                clientEmail: data.clientEmail,
                domain: data.domain,
                expiresAt: new Date(data.expiresAt),
                licenseKey: `LIC-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
                status: 'ACTIVE'
            }
        });
        revalidatePath('/admin/licenses');
        return { success: true, license };
    } catch (error) {
        console.error("Create License Error:", error);
        return { success: false, error: 'Failed to create license' };
    }
}

export async function revokeLicense(id: string) {
    try {
        await prisma.license.update({
            where: { id },
            data: { status: 'SUSPENDED' }
        });
        revalidatePath('/admin/licenses');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to revoke license' };
    }
}
