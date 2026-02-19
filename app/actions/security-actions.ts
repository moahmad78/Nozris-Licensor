'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { pusherServer } from '@/lib/pusher';

export async function getPrisoners() {
    try {
        return await prisma.blockedIP.findMany({
            where: { isBlocked: true },
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        return [];
    }
}

export async function releasePrisoner(ip: string) {
    try {
        await prisma.blockedIP.update({
            where: { ipAddress: ip },
            data: { isBlocked: false, attempts: 0, reason: "Forgiven by Admin" }
        });

        // Trigger real-time release
        await pusherServer.trigger('admin-stats', 'update', {
            type: 'SECURITY_RELEASE',
            ip
        });

        revalidatePath('/admin/dashboard');
        return { success: true };
    } catch (error) {
        return { error: "Failed to release prisoner" };
    }
}

export async function checkIPLockdown(ip: string) {
    try {
        const record = await prisma.blockedIP.findUnique({
            where: { ipAddress: ip }
        });
        return record?.isBlocked || false;
    } catch (error) {
        return false;
    }
}

// MILITARY-GRADE: Global Blacklist Actions
export async function getGlobalBlacklist() {
    try {
        return await prisma.globalBlacklist.findMany({
            orderBy: { createdAt: 'desc' }
        });
    } catch (error) {
        return [];
    }
}

export async function addToGlobalBlacklist(ip: string, reason: string, fingerprint?: string) {
    try {
        const record = await prisma.globalBlacklist.create({
            data: { ipAddress: ip, reason, deviceFingerprint: fingerprint }
        });

        // MANDATORY: Network Synchronization via Pusher
        await pusherServer.trigger('global-security', 'global-ban', {
            ip,
            fingerprint,
            reason
        });

        revalidatePath('/admin/dashboard');
        return { success: true, record };
    } catch (error) {
        return { error: "Failed to add to global blacklist" };
    }
}

export async function removeFromGlobalBlacklist(ip: string) {
    try {
        await prisma.globalBlacklist.delete({
            where: { ipAddress: ip }
        });
        revalidatePath('/admin/dashboard');
        return { success: true };
    } catch (error) {
        return { error: "Failed to remove from global blacklist" };
    }
}

