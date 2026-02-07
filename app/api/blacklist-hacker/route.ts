import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { pusherServer } from '@/lib/pusher';

export async function POST(req: NextRequest) {
    try {
        const { ip, reason = "Global Security Violation", country = "Unknown", isProxy = false } = await req.json();

        // 1. Create Global Blacklist Record
        const record = await prisma.globalBlacklist.upsert({
            where: { ipAddress: ip },
            update: {
                reason,
                country,
                isProxy,
                isGlobal: true,    // Enforce Global flag
            },
            create: {
                ipAddress: ip,
                reason,
                country,
                isProxy,
                isGlobal: true
            }
        });

        // 2. Trigger Global Threat Event
        await pusherServer.trigger('global-threat-map', 'new-threat', {
            ip,
            country,
            isProxy,
            reason,
            timestamp: new Date().toISOString()
        });

        // 3. Log to local BlockedIP as well for redundancy
        await prisma.blockedIP.upsert({
            where: { ipAddress: ip },
            update: { isBlocked: true, reason },
            create: { ipAddress: ip, isBlocked: true, reason }
        });

        return NextResponse.json({ success: true, message: `IP ${ip} Added to Global Shield` });

    } catch (error) {
        console.error("Blacklist Error:", error);
        return NextResponse.json({ error: 'Failed to blacklist IP' }, { status: 500 });
    }
}
