'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getNotifications(target: { email?: string; userId?: string }) {
    try {
        return await prisma.notification.findMany({
            where: {
                OR: [
                    { userId: target.userId || undefined },
                    { clientEmail: target.email || undefined }
                ]
            },
            orderBy: { createdAt: 'desc' },
            take: 20
        });
    } catch (error) {
        console.error("Fetch Notifications Error:", error);
        return [];
    }
}

export async function getUnreadCount(target: { email?: string; userId?: string }) {
    try {
        return await prisma.notification.count({
            where: {
                isRead: false,
                OR: [
                    { userId: target.userId || undefined },
                    { clientEmail: target.email || undefined }
                ]
            }
        });
    } catch (error) {
        return 0;
    }
}

export async function markAllNotificationsAsRead(target: { email?: string; userId?: string }) {
    try {
        await prisma.notification.updateMany({
            where: {
                isRead: false,
                OR: [
                    { userId: target.userId || undefined },
                    { clientEmail: target.email || undefined }
                ]
            },
            data: { isRead: true }
        });
        revalidatePath('/');
        return { success: true };
    } catch (error) {
        return { error: 'Failed' };
    }
}

export async function createNotification(data: {
    userId?: string;
    clientEmail?: string;
    title: string;
    message: string;
    type?: 'SUCCESS' | 'WARNING' | 'INFO' | 'CRITICAL'
}) {
    try {
        const notification = await prisma.notification.create({
            data: {
                userId: data.userId,
                clientEmail: data.clientEmail,
                title: data.title,
                message: data.message,
                type: data.type || 'INFO'
            }
        });
        revalidatePath('/');
        return { success: true, notification };
    } catch (error) {
        console.error("Create Notification Error:", error);
        return { error: 'Failed to create notification' };
    }
}

