'use server';

import { prisma } from '@/lib/db';
import { getClientLicenseDetails } from './client-integration';

export async function triggerCloudRestore() {
    const meta = await getClientLicenseDetails();
    if (!meta || meta.key === 'NO_LICENSE_FOUND') return { success: false, error: 'License Not Found' };

    const license = await prisma.license.findUnique({ where: { licenseKey: meta.key } });
    if (!license) return { success: false, error: 'License Not Found' };

    if (license.editMode) {
        return { success: false, error: 'Edit Mode is Active. Disable it to restore.' };
    }

    if (!license.cleanSnapshot) {
        return { success: false, error: 'No Cloud Backup available.' };
    }

    return { success: true, message: 'Restore Signal Sent to Site.' };
}

