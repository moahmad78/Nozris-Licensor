'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function healSystem(licenseKey: string) {
    try {
        const license = await prisma.license.findUnique({
            where: { licenseKey }
        });

        if (!license) {
            return { success: false, message: 'Invalid License Key' };
        }

        // Restore status to ACTIVE
        await prisma.license.update({
            where: { licenseKey },
            data: { status: 'ACTIVE' }
        });

        revalidatePath('/client/dashboard');
        return { success: true, message: 'System Integrity Restored. Neural Shield Reset.' };
    } catch (e) {
        console.error("Heal failed:", e);
        return { success: false, message: 'Recovery Protocol Failed' };
    }
}
