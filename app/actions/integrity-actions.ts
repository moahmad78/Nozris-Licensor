'use server';

import { prisma } from '@/lib/prisma';
import { getClientLicenseDetails } from './client-integration';
import { revalidatePath } from 'next/cache';

export async function toggleEditMode(enable: boolean) {
    const meta = await getClientLicenseDetails();
    if (!meta || meta.key === 'NO_LICENSE_FOUND') return { success: false, error: 'License Not Found' };

    try {
        const license = await prisma.license.findUnique({ where: { licenseKey: meta.key } });
        if (!license) return { success: false, error: 'License Not Found' };

        await prisma.client.update({
            where: { email: license.clientEmail },
            data: { isEditMode: enable },
        });
        revalidatePath('/client/dashboard');
        return { success: true };
    } catch (e) {
        return { success: false, error: 'Failed to toggle Edit Mode' };
    }
}

export async function syncAndLock(currentHash?: string) {
    const meta = await getClientLicenseDetails();
    if (!meta || meta.key === 'NO_LICENSE_FOUND') return { success: false, error: 'License Not Found' };

    try {
        const license = await prisma.license.findUnique({ where: { licenseKey: meta.key } });
        if (!license) return { success: false, error: 'License Not Found' };

        // Find the client to get the lastSeenHash if not provided
        const client = await prisma.client.findUnique({ where: { email: license.clientEmail } });
        if (!client) return { success: false, error: 'Client Not Found' };

        const hashToSync = currentHash || client.lastSeenHash;

        if (!hashToSync) {
            return { success: false, error: 'No file signature detected yet. Please trigger a site load first.' };
        }

        await prisma.client.update({
            where: { email: license.clientEmail },
            data: {
                fileHash: hashToSync,
                isEditMode: false, // Lock it immediately
                // status: 'ACTIVE' // 'status' doesn't exist on Client in a simple way (it has kycStatus, subscriptionStatus). Removing to avoid error.
            }
        });
        revalidatePath('/client/dashboard');
        return { success: true };
    } catch (e) {
        return { success: false, error: 'Failed to sync integrity.' };
    }
}

export async function getIntegrityStatus() {
    const meta = await getClientLicenseDetails();
    if (!meta || meta.key === 'NO_LICENSE_FOUND') return null;

    const license = await prisma.license.findUnique({ where: { licenseKey: meta.key } });
    if (!license) return null;

    const client = await prisma.client.findUnique({
        where: { email: license.clientEmail },
        select: { isEditMode: true, fileHash: true, lastSeenHash: true, kycStatus: true }
    });

    // Map kycStatus to a generic status if needed, or just return what we have
    return client ? { ...client, status: client.kycStatus } : null;
}
