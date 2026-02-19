'use server';

import { prisma } from '@/lib/db';

export async function getLiveThreats() {
    try {
        // Fetch last 50 blocked threats
        const logs = await prisma.securityLog.findMany({
            where: {
                status: { not: 'Allowed' }
            },
            orderBy: { timestamp: 'desc' },
            take: 50
        });

        // Map to format expected by LiveThreatMap (coordinates mostly needed)
        // Since we don't have real GeoIP in the log yet (it's 'Unknown' or passed from headers),
        // we might still need to simulate coordinates if missing, or use a lookup.
        // For now, we return the logs.

        return { success: true, data: logs };
    } catch (error) {
        return { success: false, data: [] };
    }
}

export async function getTrafficStats() {
    try {
        // Aggregate traffic for last 24h
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        const logs = await prisma.securityLog.findMany({
            where: {
                timestamp: { gte: twentyFourHoursAgo }
            }
        });

        // Group by hour
        const grouped = new Map<string, { normal: number, threats: number }>();

        // Initialize hours
        for (let i = 0; i < 24; i++) {
            const d = new Date(now.getTime() - i * 60 * 60 * 1000);
            const hour = d.getHours().toString().padStart(2, '0') + ':00';
            grouped.set(hour, { normal: 0, threats: 0 });
        }

        logs.forEach(log => {
            const hour = log.timestamp.getHours().toString().padStart(2, '0') + ':00';
            const entry = grouped.get(hour) || { normal: 0, threats: 0 };

            if (log.status === 'Allowed' || log.status === 'Clean') {
                entry.normal++;
            } else {
                entry.threats++;
            }
            grouped.set(hour, entry);
        });

        // Convert to array and sort
        const data = Array.from(grouped.entries())
            .map(([name, stats]) => ({ name, ...stats }))
            .reverse(); // Oldest first

        return { success: true, data };

    } catch (error) {
        return { success: false, data: [] };
    }
}
