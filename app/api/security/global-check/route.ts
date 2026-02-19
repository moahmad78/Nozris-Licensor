import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const ip = searchParams.get('ip');

    if (!ip) return NextResponse.json({ isBlacklisted: false });

    try {
        const record = await prisma.globalBlacklist.findUnique({
            where: { ipAddress: ip }
        });
        return NextResponse.json({ isBlacklisted: !!record });
    } catch (error) {
        return NextResponse.json({ isBlacklisted: false });
    }
}

