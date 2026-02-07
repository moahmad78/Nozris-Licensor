'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function purgeOldLogs() {
    try {
        const threshold = new Date();
        threshold.setDate(threshold.getDate() - 30);

        const deleted = await prisma.activityLog.deleteMany({
            where: { createdAt: { lt: threshold } }
        });

        const health = await refreshHealthAction();

        return { success: true, count: deleted.count, health };
    } catch (error) {
        console.error("Purge Error:", error);
        return { success: false, error: "Failed to purge logs" };
    }
}

export async function refreshHealthAction() {
    // Mock health for now or actual stats if available
    // In a real app we might read `fs` or `os` modules, similar to lib/server-health.ts
    // For now, re-using logic from lib/server-health if imported, or just basic mock

    // Importing from lib/server-health (assuming it exists as I viewed it earlier)
    const { getServerHealth } = await import('@/lib/server-health');
    return await getServerHealth();
}

export async function toggleMaintenanceMode() {
    try {
        const settings = await prisma.systemSettings.upsert({
            where: { id: 'default' },
            update: {},
            create: { id: 'default' }
        });

        const updated = await prisma.systemSettings.update({
            where: { id: 'default' },
            data: { maintenanceMode: !settings.maintenanceMode }
        });

        revalidatePath('/admin/settings');
        revalidatePath('/client');
        return { success: true, maintenanceMode: updated.maintenanceMode };
    } catch (error) {
        return { success: false, error: "Failed to toggle maintenance" };
    }
}

export async function getSystemStatus() {
    try {
        const settings = await prisma.systemSettings.findFirst({ where: { id: 'default' } });
        return { maintenanceMode: !!settings?.maintenanceMode };
    } catch {
        return { maintenanceMode: false };
    }
}
