'use server';

import { prisma } from "@/lib/prisma";
import { logActivity } from "./activity";
import { sendWhatsAppMessage } from "@/lib/whatsapp";
import { revalidatePath } from "next/cache";

export async function checkHeartbeats() {
    try {
        const now = new Date();
        const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

        // Find active licenses that haven't checked in for 24+ hours
        const inactiveLicenses = await prisma.license.findMany({
            where: {
                status: 'ACTIVE',
                lastUsedAt: {
                    lt: twentyFourHoursAgo
                },
                // Only check licenses older than 24 hours to avoid alerting new ones immediately
                createdAt: {
                    lt: twentyFourHoursAgo
                },
                deletedAt: null
            }
        });

        if (inactiveLicenses.length === 0) {
            return { success: true, count: 0 };
        }

        for (const license of inactiveLicenses) {
            // 1. Update status
            await prisma.license.update({
                where: { id: license.id },
                data: { status: 'TAMPERED' }
            });

            // Increment Tamper Count for the client
            await prisma.client.update({
                where: { email: license.clientEmail },
                data: { tamperCount: { increment: 1 } }
            });

            // 2. Log Activity
            await logActivity({
                clientId: license.id,
                clientEmail: license.clientEmail,
                type: 'CRITICAL',
                action: 'CODE_REMOVED',
                message: `License code removal detected for domain ${license.domain}. Heartbeat stopped for >24 hours.`
            });

            // 3. Trigger WhatsApp Alert to Admin
            await sendWhatsAppMessage('919264920211', `🚨 TAMPER ALERT: The license code for ${license.domain} (${license.clientEmail}) appears to have been REMOVED. Heartbeat stopped for 24+ hours.`);

            // 4. Trigger WhatsApp Alert to Client (Optional/User requested)
            const client = await prisma.client.findUnique({
                where: { email: license.clientEmail }
            });

            if (client && client.whatsapp) {
                const clientMsg = `⚠️ *Security Breach Alert!* Hello ${client.name}, we detected that the 'Licensr.' security code has been removed from ${license.domain}. This is a violation of our terms and your website layout may break. Please restore the code immediately or contact Mohd Ahmad (+91 9264920211).`;
                await sendWhatsAppMessage(client.whatsapp, clientMsg);
            }

            // 5. Trigger Email Alert (Placeholder for email logic)
            // if (client) {
            //     await sendEmail({
            //         to: client.email,
            //         subject: "Security Integration Failure Detected",
            //         text: `Hello ${client.name}, the security code for ${license.domain} is missing...`
            //     });
            // }
        }

        revalidatePath('/dashboard');
        revalidatePath('/dashboard/clients');

        return { success: true, count: inactiveLicenses.length };
    } catch (error) {
        console.error("Failed to check heartbeats:", error);
        return { success: false, error: "Internal Server Error" };
    }
}
