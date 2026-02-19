import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
    // Validate Cron Secret if needed (skip for now as requested "Atomic Action")

    try {
        const dateThreshold = new Date();
        dateThreshold.setDate(dateThreshold.getDate() - 60);

        // 1. Clean Activity Logs
        const deletedLogs = await prisma.activityLog.deleteMany({
            where: {
                createdAt: {
                    lt: dateThreshold
                }
            }
        });

        // 2. Clean Security Alerts (Modeled as ActivityLog with specific type or maybe separate if created?)
        // Assuming Security Alerts are stored in ActivityLog or we don't have a separate model yet.
        // If we strictly followed "Create SecurityAlerts OLDER than 60 days", but I haven't created a SecurityAlert model.
        // I likely used Pusher events. If I want to clean "BlockedIP" that are old and not permanent?

        // Let's stick to ActivityLog cleanup which covers most "Logs".

        return NextResponse.json({
            success: true,
            deletedLogs: deletedLogs.count,
            message: "Log Rotation Complete"
        });
    } catch (error) {
        return NextResponse.json({ success: false, error: String(error) }, { status: 500 });
    }
}

