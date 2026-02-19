import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendMultiChannelNotification } from '@/lib/notifications';

export async function POST(req: Request) {
    try {
        const { clientId } = await req.json();

        if (!clientId) {
            return NextResponse.json({ error: 'Client ID is required' }, { status: 400 });
        }

        const client = await prisma.client.findUnique({ where: { id: clientId } });
        if (!client) {
            return NextResponse.json({ error: 'Client not found' }, { status: 404 });
        }

        // 1. Update KYC Status to APPROVED
        await prisma.client.update({
            where: { id: clientId },
            data: { kycStatus: 'VERIFIED' } // Use 'VERIFIED' to match schema default logic
        });

        // 2. Activate any pending licenses
        await prisma.license.updateMany({
            where: { clientEmail: client.email },
            data: { status: 'ACTIVE' }
        });

        // 3. Trigger 3-Way Notification for Client
        await sendMultiChannelNotification(
            { email: client.email },
            {
                title: 'KYC Verified Successfully! 🚀',
                message: `Congratulations ${client.name}! Your KYC has been verified by Mohd Ahmad. Your licenses are now ACTIVE.`,
                type: 'SUCCESS'
            },
            { db: true, email: true, whatsapp: true }
        );

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("KYC Approval Route Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

