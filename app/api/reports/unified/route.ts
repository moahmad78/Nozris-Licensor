import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { startOfDay, endOfDay, parseISO } from 'date-fns';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const dateParam = searchParams.get('date');

    const date = dateParam ? parseISO(dateParam) : new Date();
    const start = startOfDay(date);
    const end = endOfDay(date);

    try {
        const [licenses, payments, tickets, messages] = await Promise.all([
            prisma.license.findMany({
                where: { createdAt: { gte: start, lte: end } },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.payment.findMany({
                where: { createdAt: { gte: start, lte: end } },
                include: { license: true },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.supportTicket.findMany({
                where: { createdAt: { gte: start, lte: end } },
                include: { messages: true },
                orderBy: { createdAt: 'desc' }
            }),
            prisma.supportMessage.findMany({
                where: { createdAt: { gte: start, lte: end } },
                include: { ticket: true },
                orderBy: { createdAt: 'desc' }
            })
        ]);

        return NextResponse.json({
            meta: { date: start, count: licenses.length + payments.length + tickets.length },
            data: {
                licenses,
                payments,
                tickets,
                messages
            }
        });
    } catch (error) {
        console.error("Unified Report Error:", error);
        return NextResponse.json({ error: "Failed to fetch unified report" }, { status: 500 });
    }
}
