'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

export async function blockAttackerIP(reason: string) {
    const headersList = headers();
    // In a real deployed environment, get real IP. For localhost, it might be ::1
    const ip = (await headersList).get('x-forwarded-for') || '127.0.0.1';

    try {
        await prisma.blockedIP.create({
            data: {
                ipAddress: ip,
                reason: reason,
                isBlocked: true,
                attempts: 1
            }
        });

        console.log(`[SECURITY] Blocked IP: ${ip} for ${reason}`);
        return { success: true, message: 'Threat Neutralized' };
    } catch (error) {
        console.error("Failed to block IP:", error);
        // Duplicate IP error is likely, so we treat it as "already blocked" success
        return { success: true, message: 'IP Already Blacklisted' };
    }
}

export async function unblockIP(id: string) {
    try {
        await prisma.blockedIP.update({
            where: { id },
            data: { isBlocked: false, attempts: 0 }
        });

        revalidatePath('/dashboard/security');
        return { success: true };
    } catch (error) {
        console.error("Failed to unblock IP:", error);
        return { success: false, message: 'Internal Error' };
    }
}

export async function getBlockedIPs() {
    try {
        const ips = await prisma.blockedIP.findMany({
            orderBy: { updatedAt: 'desc' }
        });
        return ips;
    } catch (error) {
        console.error("Failed to fetch blocked IPs:", error);
        return [];
    }
}
