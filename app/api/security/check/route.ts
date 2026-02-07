import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const ip = searchParams.get('ip');

    if (!ip) return NextResponse.json({ isBlocked: false });

    try {
        const record = await prisma.blockedIP.findUnique({
            where: { ipAddress: ip }
        });
        return NextResponse.json({ isBlocked: record?.isBlocked || false });
    } catch (error) {
        return NextResponse.json({ isBlocked: false });
    }
}
