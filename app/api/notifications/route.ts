import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/client-auth-token';

export async function GET() {
    try {
        const cookieStore = await cookies();
        const clientToken = cookieStore.get('client_session')?.value;
        const adminToken = cookieStore.get('auth_token')?.value; // Admin might use a different name

        let target: { email?: string; userId?: string } = {};

        if (clientToken) {
            const decoded = verifyToken(clientToken);
            target.email = decoded.email;
        } else if (adminToken) {
            // Logic for admin if needed
            target.userId = 'Mohd-Ahmad';
        } else {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const notifications = await prisma.notification.findMany({
            where: {
                OR: [
                    { userId: target.userId },
                    { clientEmail: target.email }
                ]
            },
            orderBy: { createdAt: 'desc' },
            take: 20
        });

        return NextResponse.json(notifications);

    } catch (error) {
        console.error("Notifications GET Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    try {
        const { id } = await req.json();
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await prisma.notification.update({
            where: { id },
            data: { isRead: true }
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Notifications PATCH Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
