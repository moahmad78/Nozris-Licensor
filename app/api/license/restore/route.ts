import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { checkIPStatus } from '@/lib/security';

export async function POST(req: Request) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };

    if (req.method === 'OPTIONS') {
        return NextResponse.json({}, { headers });
    }

    try {
        const body = await req.json();
        const { licenseKey } = body;
        const ip = req.headers.get('x-forwarded-for') || 'unknown';

        // Security Check
        const { isBlocked } = await checkIPStatus(ip);
        if (isBlocked) {
            return NextResponse.json({ error: 'Access Denied' }, { status: 403, headers });
        }

        const license = await prisma.license.findUnique({
            where: { licenseKey },
        });

        if (!license) {
            return NextResponse.json({ error: 'Invalid License' }, { status: 404, headers });
        }

        // Rule: Only allow restore if Edit Mode is OFF (Prevent dev overwrite)
        if (license.editMode) {
            return NextResponse.json({
                error: 'Cannot restore while Edit Mode is active. Please disable Edit Mode first.'
            }, { status: 400, headers });
        }

        if (!license.cleanSnapshot) {
            return NextResponse.json({ error: 'No backup found for this license.' }, { status: 404, headers });
        }

        // Log the Restore Action
        const { logActivity } = await import('@/app/actions/activity');
        await logActivity({
            clientEmail: license.clientEmail,
            type: 'SYSTEM',
            action: 'CLOUD_RESTORE',
            message: `Cloud Restore initiated for license ${license.licenseKey} from IP ${ip}.`
        });

        return NextResponse.json({
            success: true,
            backup: license.cleanSnapshot,
            message: 'Restore packet generated successfully.'
        }, { headers });

    } catch (error) {
        console.error('Restore Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500, headers });
    }
}

export async function OPTIONS() {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
    };
    return NextResponse.json({}, { headers });
}

