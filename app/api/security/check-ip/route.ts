import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const ip = searchParams.get('ip');

    if (!ip) return NextResponse.json({ isBlocked: false });

    try {
        const blocked = await prisma.globalBlacklist.findUnique({
            where: { ipAddress: ip },
            select: { id: true }
        });

        return NextResponse.json({ isBlocked: !!blocked });
    } catch (error) {
        return NextResponse.json({ isBlocked: false });
    }
}
