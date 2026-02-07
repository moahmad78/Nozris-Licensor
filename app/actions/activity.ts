'use server';

import { prisma } from '@/lib/prisma';

export async function logActivity({
    clientId,
    clientEmail,
    type,
    action,
    message
}: {
    clientId?: string;
    clientEmail?: string;
    type: 'INFO' | 'WARNING' | 'CRITICAL' | 'ACTION' | 'SYSTEM';
    action: string;
    message: string;
}) {
    try {
        await prisma.activityLog.create({
            data: {
                clientId,
                clientEmail,
                type,
                action,
                message
            }
        });
        return { success: true };
    } catch (error) {
        console.error('Failed to log activity:', error);
        return { success: false };
    }
}

export async function getClientHistory(email: string) {
    return await prisma.activityLog.findMany({
        where: { clientEmail: email },
        orderBy: { createdAt: 'desc' }
    });
}
