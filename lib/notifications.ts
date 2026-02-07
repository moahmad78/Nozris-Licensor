import { prisma } from './prisma';
import { sendEmail } from './email';
import { sendWhatsAppMessage } from './whatsapp';

export async function sendMultiChannelNotification(
    target: { email?: string; userId?: string },
    data: { title: string; message: string; type?: 'SUCCESS' | 'WARNING' | 'INFO' | 'CRITICAL' },
    channels: { db?: boolean; email?: boolean; whatsapp?: boolean } = { db: true }
) {
    // 1. Internal DB Notification
    if (channels.db) {
        await prisma.notification.create({
            data: {
                userId: target.userId,
                clientEmail: target.email,
                title: data.title,
                message: data.message,
                type: data.type || 'INFO'
            }
        });
    }

    // 2. Email Alert
    if (channels.email && target.email) {
        const html = `
            <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: ${data.type === 'CRITICAL' ? '#dc2626' : '#2563eb'};">${data.title}</h2>
                <p>${data.message}</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; color: #666;">Voomet LicenseGuard &copy; 2026</p>
            </div>
        `;
        await sendEmail(target.email, data.title, html).catch(console.error);
    }

    // 3. WhatsApp Alert
    if (channels.whatsapp && target.email) {
        const client = await prisma.client.findUnique({ where: { email: target.email } });
        if (client && client.whatsapp) {
            const waMsg = `🔔 *${data.title}*\n\n${data.message}`;
            await sendWhatsAppMessage(client.whatsapp, waMsg).catch(console.error);
        }
    }
}
