import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { addDays } from 'date-fns';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        // Mock Webhook Payload Structure
        // { event: 'payment.success', payload: { licenseKey: '...', amount: 500, transactionId: '...' } }

        const { event, payload } = body;

        if (event !== 'payment.success') {
            return NextResponse.json({ ignored: true });
        }

        const { licenseKey, amount, transactionId } = payload;

        const license = await prisma.license.findUnique({ where: { licenseKey } });
        if (!license) return NextResponse.json({ error: 'License Not Found' }, { status: 404 });

        // Fetch Client for Billing History
        const client = await prisma.client.findUnique({ where: { email: license.clientEmail } });

        // Parse existing history from Client
        let history = [];
        try {
            history = client?.billingHistory ? JSON.parse(client.billingHistory) : [];
        } catch (e) { }

        // Add new transaction
        const newTransaction = {
            id: transactionId || Math.random().toString(36).substr(2, 9),
            date: new Date().toISOString(),
            amount: amount || license.monthlyPrice,
            status: 'PAID'
        };
        history.unshift(newTransaction);

        // Extend Expiry
        const newExpiry = addDays(license.expiresAt > new Date() ? license.expiresAt : new Date(), 365);

        // Update Client History
        if (client) {
            await prisma.client.update({
                where: { email: license.clientEmail },
                data: { billingHistory: JSON.stringify(history) }
            });
        }

        // Update License Status
        await prisma.license.update({
            where: { id: license.id },
            data: {
                expiresAt: newExpiry,
                subscriptionStatus: 'PAID',
                lastPaymentDate: new Date(),
            }
        });

        // Log it
        const { logActivity } = await import('@/app/actions/activity');
        await logActivity({
            clientEmail: license.clientEmail,
            type: 'INFO',
            action: 'PAYMENT_SUCCESS',
            message: `Recurring Payment Success. Extended to ${newExpiry.toISOString()}.`
        });

        return NextResponse.json({ success: true, newExpiry });

    } catch (error) {
        console.error('Webhook Error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
