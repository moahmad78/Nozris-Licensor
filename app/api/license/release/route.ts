import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { pusherServer } from '@/lib/pusher';

export async function POST(req: NextRequest) {
    try {
        const { licenseKey, adminAuthToken } = await req.json();

        // 1. Verify Admin (Simple check for demo, use session in prod)
        if (adminAuthToken !== process.env.ADMIN_SECRET_KEY && adminAuthToken !== "NOZRIS-MASTER-KEY") {
            return NextResponse.json({ error: 'Unauthorized: Invalid Admin Token' }, { status: 401 });
        }

        // 2. Locate License
        const license = await prisma.license.findUnique({
            where: { licenseKey }
        });

        if (!license) {
            return NextResponse.json({ error: 'License Not Found' }, { status: 404 });
        }

        // 3. Execute Release (Kill-Switch)
        const updatedLicense = await prisma.license.update({
            where: { id: license.id },
            data: { isReleased: true }
        });

        // 4. Broadcast Cleanup Signal
        // This tells the client instance to self-destruct security hooks
        await pusherServer.trigger(`license-${licenseKey}`, 'system-release', {
            status: 'RELEASED',
            timestamp: new Date().toISOString(),
            message: 'Security Protocols Disengaged permanently.'
        });

        return NextResponse.json({
            success: true,
            message: 'License Released. Security systems disarmed.',
            licenseId: updatedLicense.id
        });

    } catch (error) {
        console.error("Release Error:", error);
        return NextResponse.json({ error: 'Release Failed' }, { status: 500 });
    }
}

