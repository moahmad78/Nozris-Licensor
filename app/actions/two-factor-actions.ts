'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function toggle2FA(userId: string, enabled: boolean) {
    try {
        await prisma.user.update({
            where: { id: userId },
            data: { twoFactorEnabled: enabled }
        });
        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error) {
        return { error: "Failed to update 2FA settings" };
    }
}

export async function getSecuritySettings(userId: string) {
    try {
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: { twoFactorEnabled: true }
        });
        return user;
    } catch (error) {
        return null;
    }
}
