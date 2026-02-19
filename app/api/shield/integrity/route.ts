import { NextResponse, NextRequest } from 'next/server';
import { prisma } from '@/lib/db';
import { blockAttackerIP } from '@/app/actions/security';
import { headers } from 'next/headers';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const host = searchParams.get('host');
    const ip = request.ip || request.headers.get('x-forwarded-for') || '127.0.0.1';

    if (!host) {
        return NextResponse.json({ status: 'INVALID_REQUEST' }, { status: 400 });
    }

    // Check License Status
    const license = await prisma.license.findFirst({
        where: { domain: host }
    });

    if (!license) {
        // Domain not authorized
        await blockAttackerIP(`Unauthorized Domain: ${host}`);
        return NextResponse.json({ status: 'BLOCKED_DOMAIN' });
    }

    if (license.status === 'SUSPENDED' || license.status === 'TAMPERED') {
        return NextResponse.json({ status: 'TAMPERED' });
    }

    return NextResponse.json({ status: 'SECURE' });
}

export async function POST(request: Request) {
    const body = await request.json();

    if (body.event === 'BREACH_DEPLOYED') {
        // Log the breach
        console.log(`[NEURAL SHIELD] Breach deployed on ${body.host}: ${body.reason}`);

        // Auto-suspend license
        await prisma.license.updateMany({
            where: { domain: body.host },
            data: { status: 'TAMPERED' }
        });

        // Block Caller IP (User accessing the site)
        await blockAttackerIP(`Neural Shield Trigger: ${body.host} - ${body.reason}`);
    }

    return NextResponse.json({ received: true });
}
