'use server';

import { prisma } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';

export async function getAdminDashboardSummary() {
    try {
        const { getLicenseStats } = await import('./license-actions');
        const { expiringSoon } = await getLicenseStats();

        const [pendingKYC, openTickets, securityThreats, totalClients] = await Promise.all([
            prisma.client.count({ where: { kycStatus: 'SUBMITTED' } }),
            prisma.supportTicket.count({ where: { status: { in: ['OPEN', 'IN_PROGRESS'] } } }),
            prisma.client.aggregate({
                _sum: { tamperCount: true }
            }),
            prisma.client.count()
        ]);

        return {
            pendingKYC,
            openTickets,
            securityThreats: securityThreats._sum.tamperCount || 0,
            totalClients,
            expiringSoon
        };
    } catch (error) {
        console.error("Dashboard Summary Error:", error);
        return { pendingKYC: 0, openTickets: 0, securityThreats: 0, totalClients: 0, expiringSoon: 0 };
    }
}

export async function getRecentActivities(limit: number = 20) {
    try {
        // OPTIMIZED: Select only required fields to avoid large JSON/LongText overhead
        const logs = await prisma.activityLog.findMany({
            select: {
                id: true,
                type: true,
                action: true,
                message: true,
                createdAt: true,
                clientEmail: true
            },
            orderBy: { createdAt: 'desc' },
            take: limit
        });

        return logs.map(log => ({
            ...log,
            href: log.action === 'KYC_SUBMITTED' ? '/dashboard/kyc' :
                log.action === 'TICKET_CREATED' ? '/admin/support-center' :
                    log.action === 'TAMPER_ALERT' ? '/dashboard/security' : '/admin/dashboard'
        }));
    } catch (error) {
        console.error("Activity Feed Error:", error);
        return [];
    }
}

export async function triggerAdminAlert(event: string, data: any) {
    try {
        await pusherServer.trigger('admin-notifications', event, data);
        return { success: true };
    } catch (error) {
        return { error: "Alert bypass failure" };
    }
}

