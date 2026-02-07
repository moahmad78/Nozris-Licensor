'use server';

import { prisma } from '@/lib/prisma';
import { sendWhatsAppMessage } from '@/lib/whatsapp';

export async function processKYCReminders() {
    console.log('Starting KYC Reminder Job...');
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);

    let sentCount = 0;

    try {
        // 1. Process Leads (Status: PENDING)
        const pendingLeads = await prisma.lead.findMany({
            where: {
                status: 'PENDING',
                OR: [
                    { lastReminderSent: null },
                    { lastReminderSent: { lte: threeDaysAgo } }
                ]
            }
        });

        for (const lead of pendingLeads) {
            const message = `⚠️ *Attention Required!*
Hello ${lead.name}, your KYC for ${lead.domain} is still incomplete.
Please upload your Aadhar Card and Address details in the Client Portal to activate your security license.

*Admin:* Mohd Ahmad (+91 9264920211)
*Login here:* https://voomet.com/client/login`;

            await sendWhatsAppMessage(lead.whatsapp, message);
            await prisma.lead.update({
                where: { id: lead.id },
                data: { lastReminderSent: now }
            });
            sentCount++;
        }

        // 2. Process Clients (Status: PENDING)
        const pendingClients = await prisma.client.findMany({
            where: {
                kycStatus: 'PENDING',
                OR: [
                    { lastReminderSent: null },
                    { lastReminderSent: { lte: threeDaysAgo } }
                ]
            }
        });

        for (const client of pendingClients) {
            const message = `⚠️ *Attention Required!*
Hello ${client.name}, your KYC for ${client.domain} is still incomplete.
Please upload your Aadhar Card and Address details in the Client Portal to activate your security license.

*Admin:* Mohd Ahmad (+91 9264920211)
*Login here:* https://voomet.com/client/login`;

            await sendWhatsAppMessage(client.whatsapp, message);
            await prisma.client.update({
                where: { id: client.id },
                data: { lastReminderSent: now }
            });
            sentCount++;
        }

        console.log(`KYC Reminder Job Completed. Sent ${sentCount} reminders.`);
        return { success: true, sentCount };

    } catch (error) {
        console.error('Error processing KYC reminders:', error);
        return { success: false, error: 'Failed to process reminders' };
    }
}
