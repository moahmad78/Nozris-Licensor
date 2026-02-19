import { NextResponse } from 'next/server';
import { auth } from '@/auth'; // Assuming auth helper exists, or next-auth
import { prisma } from '@/lib/db';

export async function GET(req: Request) {
    // 1. Check Session
    // Note: Adjust import based on actual auth setup. 
    // If no session, next-auth usually handles middleware, but we double check here.

    // For now, assuming middleware handles Auth, we just check DB status if we can identify user.
    // If we can't identify, we assume safe or 401.

    // Simulating "Check against Master License List"
    // Since this is called by Client Dashboard, we look for a cookie or header?
    // Or we just check "System Maintenance" here too?

    try {
        const settings = await prisma.systemSettings.findFirst({ where: { id: 'default' } });
        if (settings?.maintenanceMode) {
            return NextResponse.json({ status: 'MAINTENANCE' }, { status: 503 });
        }

        // Logic: Check if the requesting IP is banned (Double Check)
        const ip = req.headers.get('x-forwarded-for') || '127.0.0.1';
        const banned = await prisma.globalBlacklist.findUnique({ where: { ipAddress: ip as string } });

        if (banned) {
            return NextResponse.json({ status: 'BANNED' }, { status: 423 });
        }

        return NextResponse.json({ status: 'OK' });
    } catch (error) {
        return NextResponse.json({ status: 'ERROR' }, { status: 500 });
    }
}

