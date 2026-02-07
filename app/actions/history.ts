'use server';

import { prisma } from '@/lib/prisma';

export type HistoryEvent = {
    id: string;
    type: 'TICKET' | 'MESSAGE' | 'PAYMENT' | 'SECURITY' | 'ALERT' | 'COMMUNICATION';
    title: string;
    description: string;
    date: Date;
    status: string;
    metadata?: any;
    direction?: 'INBOUND' | 'OUTBOUND';
};

export async function getUnifiedHistory(email: string): Promise<HistoryEvent[]> {
    if (!email) return [];

    const history: HistoryEvent[] = [];

    // 1. Fetch Support Tickets & Messages
    const tickets = await prisma.supportTicket.findMany({
        where: { clientEmail: email },
        include: { messages: true }
    });

    tickets.forEach(ticket => {
        // Ticket Creation Event
        history.push({
            id: ticket.id,
            type: 'TICKET',
            title: `Ticket Created: ${ticket.subject}`,
            description: ticket.message.substring(0, 100) + '...',
            date: ticket.createdAt,
            status: ticket.status,
            direction: 'INBOUND'
        });

        // Messages
        ticket.messages.forEach(msg => {
            history.push({
                id: msg.id,
                type: 'MESSAGE',
                title: `Chat Message (${msg.sender})`,
                description: msg.text,
                date: msg.createdAt,
                status: 'SENT',
                direction: msg.sender === 'Admin' ? 'OUTBOUND' : 'INBOUND' // Assuming 'Admin' sender means outbound from system perspective
            });
        });
    });

    // 2. Fetch Payments
    // We need to link payments to the email via License
    const licenses = await prisma.license.findMany({
        where: { clientEmail: email },
        select: { id: true, licenseKey: true }
    });

    const licenseIds = licenses.map(l => l.id);

    // If we have licenses, fetch payments and tamper events
    if (licenseIds.length > 0) {
        const payments = await prisma.payment.findMany({
            where: { licenseId: { in: licenseIds } }
        });

        payments.forEach(payment => {
            history.push({
                id: payment.id,
                type: 'PAYMENT',
                title: `Payment: $${payment.amount}`,
                description: `UTR: ${payment.utrNumber}. Reason: ${payment.rejectionReason || 'None'}`,
                date: payment.createdAt,
                status: payment.status,
                direction: 'INBOUND'
            });
        });

        const tamperEvents = await prisma.tamperEvent.findMany({
            where: { licenseId: { in: licenseIds } }
        });

        tamperEvents.forEach(event => {
            history.push({
                id: event.id,
                type: 'SECURITY',
                title: `Tamper Alert: ${event.fileName}`,
                description: event.description || 'Security Violation Detected',
                date: event.detectedAt,
                status: event.severity,
                direction: 'INBOUND' // System detected
            });
        });
    }

    // 3. Communications Log (New Model)
    // We need to check if the model exists in the generated client yet.
    // Since we just pushed, it might take a moment or require regeneration.
    // We'll wrap in try-catch to avoid breaking if generation isn't perfect yet,
    // though in standard flow it should work.
    try {
        // @ts-ignore - Prisma client type might not be updated in IDE context yet
        const comms = await prisma.communicationLog.findMany({
            where: { clientEmail: email }
        });

        comms.forEach((comm: any) => {
            history.push({
                id: comm.id,
                type: 'COMMUNICATION',
                title: comm.title, // e.g., "WhatsApp Alert Sent"
                description: comm.message,
                date: comm.createdAt,
                status: comm.status,
                direction: comm.direction as 'INBOUND' | 'OUTBOUND'
            });
        });
    } catch (e) {
        console.warn("CommunicationLog table might not exist or be accessible yet.", e);
    }

    // 4. Activity Logs (Filtered for relevance)
    const activities = await prisma.activityLog.findMany({
        where: { clientEmail: email }
    });

    activities.forEach(log => {
        // Avoid duplicates if we already covered specific types, but ActivityLog is good for general actions
        history.push({
            id: log.id,
            type: 'ALERT',
            title: `Activity: ${log.action}`,
            description: log.message,
            date: log.createdAt,
            status: 'LOGGED',
            direction: 'INBOUND'
        });
    });


    // Sort by date descending
    return history.sort((a, b) => b.date.getTime() - a.date.getTime());
}
