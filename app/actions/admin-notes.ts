'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function updateAdminNotes(clientId: string, notes: string) {
    try {
        await prisma.client.update({
            where: { id: clientId },
            data: { adminNotes: notes }
        });
        revalidatePath(`/dashboard/clients/${clientId}`);
        return { success: true };
    } catch (error) {
        console.error('Failed to update admin notes:', error);
        return { success: false };
    }
}
