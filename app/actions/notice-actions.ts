'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function createNotice(title: string, content: string, category: 'UPDATE' | 'PUBLIC' | 'PERSONAL' = 'PUBLIC') {
    try {
        await prisma.notification.create({
            data: {
                title,
                message: content,
                type: 'INFO', // Mapping category if needed, or update schema
                userId: 'ALL', // Broadcast
                isRead: false
            }
        });
        revalidatePath('/client/dashboard');
        return { success: true, message: 'Notice Published' };
    } catch (e) {
        return { success: false, message: 'Failed to publish notice' };
    }
}

export async function getNotices() {
    try {
        // Fetch last 5 global notices
        return await prisma.notification.findMany({
            where: { userId: 'ALL' },
            orderBy: { createdAt: 'desc' },
            take: 5
        });
    } catch (e) {
        return [];
    }
}
