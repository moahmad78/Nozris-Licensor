'use server';

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// Existing Functions
export async function createSupportTicket(data: FormData) {
    const clientEmail = data.get('clientEmail') as string;
    const subject = data.get('subject') as string;
    const message = data.get('message') as string;
    const priority = data.get('priority') as string || 'MEDIUM';

    if (!clientEmail || !subject || !message) return { success: false, error: "Missing fields" };

    try {
        await prisma.supportTicket.create({
            data: {
                clientEmail,
                subject,
                message,
                priority,
                status: 'OPEN'
            }
        });
        revalidatePath('/client/support');
        revalidatePath('/admin/support'); // if exists
        return { success: true };
    } catch (error) {
        console.error("Create Ticket Error:", error);
        return { success: false, error: "Failed to create ticket" };
    }
}

export async function getClientTickets(email: string) {
    if (!email) return [];
    try {
        const tickets = await prisma.supportTicket.findMany({
            where: { clientEmail: email },
            orderBy: { createdAt: 'desc' },
            include: { messages: true }
        });
        return tickets;
    } catch (error) {
        return [];
    }
}

export async function addTicketReply(ticketId: string, text: string, sender: string) {
    try {
        await prisma.supportMessage.create({
            data: {
                ticketId,
                text,
                sender
            }
        });

        // Update ticket updated at
        await prisma.supportTicket.update({
            where: { id: ticketId },
            data: { updatedAt: new Date() } // Trigger update
        });

        revalidatePath('/client/support');
        return { success: true };
    } catch (error) {
        console.error("Reply Error:", error);
        return { success: false, error: "Failed to send reply" };
    }
}

export async function closeTicket(ticketId: string, rating?: number) {
    try {
        await prisma.supportTicket.update({
            where: { id: ticketId },
            data: {
                status: 'CLOSED',
                rating: rating ? Number(rating) : undefined
            }
        });
        revalidatePath('/client/support');
        return { success: true };
    } catch (error) {
        return { success: false, error: "Failed to close ticket" };
    }
}

// Missing Exports Implementation

export async function getAllTickets() {
    try {
        const tickets = await prisma.supportTicket.findMany({
            orderBy: { createdAt: 'desc' },
            include: { messages: true }
        });
        return tickets;
    } catch (error) {
        console.error("Error getting all tickets:", error);
        return [];
    }
}

export async function sendMessage(ticketId: string, text: string, sender: string) {
    // Alias to addTicketReply but widely used
    return await addTicketReply(ticketId, text, sender);
}

export async function updateTicketStatus(ticketId: string, status: string) {
    try {
        await prisma.supportTicket.update({
            where: { id: ticketId },
            data: { status }
        });
        revalidatePath('/client/support');
        revalidatePath('/admin/support');
        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to update status' };
    }
}

export async function uploadToBlob(formData: FormData) {
    // Local upload implementation as per patterns in client-kyc.ts
    const file = formData.get('file') as File;
    if (!file) return { error: 'No file provided' };

    try {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = join(process.cwd(), 'public', 'uploads', 'support');
        await mkdir(uploadDir, { recursive: true });

        const ext = file.name.split('.').pop();
        const filename = `support_${Date.now()}.${ext}`;
        const filepath = join(uploadDir, filename);

        await writeFile(filepath, buffer);

        return { success: true, url: `/uploads/support/${filename}` };
    } catch (error) {
        console.error('Upload error:', error);
        return { error: 'Upload failed' };
    }
}

export async function startVideoSupport(ticketId: string) {
    // Logic to mark a ticket as active for video support
    // Assuming a field exists or just storing a session state
    try {
        const password = Math.random().toString(36).slice(-8);
        await prisma.supportTicket.update({
            where: { id: ticketId },
            data: { priority: 'HIGH' } // Escalating for video support?
        });
        return { success: true, url: `/support/video/${ticketId}`, password };
    } catch (error) {
        return { success: false, error: 'Failed to start video session' };
    }
}

export async function closeVideoSupport(ticketId: string) {
    return { success: true };
}

export async function getClientProfileByEmail(email: string) {
    if (!email) return null;
    return await prisma.client.findUnique({
        where: { email }
    });
}

export async function uploadAttachment(formData: FormData) {
    return await uploadToBlob(formData);
}

export async function submitFeedback(ticketId: string, rating: number, comment: string) {
    try {
        // Assuming we update the ticket with rating and maybe a final message
        await prisma.supportTicket.update({
            where: { id: ticketId },
            data: { rating }
        });

        if (comment) {
            await addTicketReply(ticketId, `Feedback: ${comment}`, 'CLIENT');
        }

        return { success: true };
    } catch (error) {
        return { success: false, error: 'Failed to submit feedback' };
    }
}

export async function getSupportAnalytics() {
    try {
        const totalTickets = await prisma.supportTicket.count();
        const openTickets = await prisma.supportTicket.count({ where: { status: 'OPEN' } });
        const closedTickets = await prisma.supportTicket.count({ where: { status: 'CLOSED' } });
        const avgResponseTime = 0; // Placeholder
        const avgRating = 0; // Placeholder
        const ratingCount = 0; // Placeholder

        return {
            totalTickets,
            openTickets,
            closedTickets,
            avgResponseTime,
            avgRating,
            ratingCount
        };
    } catch (error) {
        console.error("Analytics Error:", error);
        return {
            totalTickets: 0,
            openTickets: 0,
            closedTickets: 0,
            avgResponseTime: 0,
            avgRating: 0,
            ratingCount: 0
        };
    }
}


