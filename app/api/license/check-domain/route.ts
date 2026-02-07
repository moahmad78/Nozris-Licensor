import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { domain } = await req.json();

        if (!domain) {
            return NextResponse.json({ error: 'Domain is required' }, { status: 400 });
        }

        const license = await prisma.license.findFirst({
            where: { domain }
        });

        if (!license) {
            return NextResponse.json({ error: 'Domain not found' }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            planName: license.planName,
            monthlyPrice: license.monthlyPrice
        });

    } catch (error) {
        console.error('Check domain error:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
