import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendMultiChannelNotification } from '@/lib/notifications';

export async function GET() {
    try {
        const history = await prisma.announcement.findMany({
            orderBy: { sentAt: 'desc' },
            take: 10
        });
        return NextResponse.json({ history });
    } catch (error) {
        return NextResponse.json({ error: 'Failed' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { title, message } = await req.json();

        if (!title || !message) {
            return NextResponse.json({ error: 'Title and message are required' }, { status: 400 });
        }

        // 1. Fetch all clients
        const clients = await prisma.client.findMany({
            select: { email: true, whatsapp: true, name: true }
        });

        // 2. Create internal notifications for all clients
        // createMany is efficient but Prisma doesn't support it on all adapters/engines easily with SQLite/uuid
        // We will use a loop for now or a single transaction if needed, but for "all users", let's be careful.
        // Assuming reasonably sized client list for now.

        const notificationsData = clients.map((client: { email: string; whatsapp: string; name: string }) => ({
            clientEmail: client.email,
            title: `📣 Announcement: ${title}`,
            message: message,
            type: 'INFO'
        }));

        await prisma.notification.createMany({
            data: notificationsData
        });

        // 3. Create Announcement Log
        await prisma.announcement.create({
            data: { title, message }
        });

        // 4. Simultaneous Blast (WhatsApp + Email)
        // We'll fire these off in parallel
        await Promise.all(clients.map(async (client: { email: string; whatsapp: string; name: string }) => {
            return sendMultiChannelNotification(
                { email: client.email },
                { title: `📣 ${title}`, message },
                { email: true, whatsapp: true, db: false } // db is false because we already did createMany
            );
        }));

        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("Broadcast Error:", error);
        return NextResponse.json({ error: 'Failed to broadcast' }, { status: 500 });
    }
}

