'use server';

import { prisma } from '@/lib/db';
import { sendEmail } from '@/lib/email';
import { sendWhatsAppMessage } from '@/lib/whatsapp';
import { revalidatePath } from 'next/cache';

export async function submitLead(formData: FormData) {
    try {
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const whatsapp = formData.get('whatsapp') as string;
        const domain = formData.get('domain') as string;

        if (!name || !email || !whatsapp || !domain) {
            return { error: 'All fields are required.' };
        }

        // ── Duplicate Check: Domain (across Clients, Licenses, AND Leads) ──
        const domainInClient = await prisma.client.findFirst({
            where: { domain: { equals: domain, mode: 'insensitive' } }
        });
        const domainInLicense = await prisma.license.findFirst({
            where: { domain: { contains: domain, mode: 'insensitive' }, deletedAt: null }
        });
        const domainInLead = await prisma.lead.findFirst({
            where: { domain: { equals: domain, mode: 'insensitive' }, status: { not: 'REJECTED' } }
        });

        if (domainInClient || domainInLicense || domainInLead) {
            return { error: 'This domain is already under our protection protocol.', code: 409 };
        }

        // ── Duplicate Check: Email (across Clients AND Leads) ──
        const emailInClient = await prisma.client.findUnique({
            where: { email }
        });
        const emailInLead = await prisma.lead.findFirst({
            where: { email: { equals: email, mode: 'insensitive' }, status: { not: 'REJECTED' } }
        });

        if (emailInClient) {
            return { error: 'This email is already registered with us. Please login instead.', code: 409 };
        }
        if (emailInLead) {
            return { error: 'This email is already registered with us.', code: 409 };
        }

        // ── Create Lead ──
        await prisma.lead.create({
            data: { name, email, whatsapp, domain }
        });

        // Send WhatsApp Notification (Non-blocking)
        const message = `🚀 *New Lead Alert!*
*Name:* ${name}
*Domain:* ${domain}
*Email:* ${email}
*WhatsApp:* ${whatsapp}

Buddy, ek naya client aaya hai! Inse contact karke Aadhar Card mangiye aur verification process shuru kijiye.`;

        sendWhatsAppMessage('919264920211', message).catch(err => console.error("Background WA Error:", err));

        return {
            success: true,
            message: 'Shield Protocol Initialized! Our team will verify your details and contact you within 3 hours.'
        };
    } catch (error: any) {
        console.error("Submit Lead Error:", error);
        return { error: `Server Error: ${error.message || 'Database connection failed'}` };
    }
}

export async function getLeads() {
    return await prisma.lead.findMany({
        orderBy: { createdAt: 'desc' }
    });
}

function generateLicenseKey() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segment = () => Array(4).fill(0).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `${segment()}-${segment()}-${segment()}-${segment()}`;
}

export async function approveLead(leadId: string) {
    try {
        const lead = await prisma.lead.findUnique({ where: { id: leadId } });
        if (!lead) return { error: 'Lead not found' };

        // 1. Create Client
        // Check if client exists first
        let client = await prisma.client.findUnique({ where: { email: lead.email } });
        if (!client) {
            client = await prisma.client.create({
                data: {
                    name: lead.name,
                    email: lead.email,
                    whatsapp: lead.whatsapp,
                    domain: lead.domain,
                    documentUrl: lead.documentUrl,
                    kycStatus: 'VERIFIED'
                }
            });
        }
        // Update if exists (Optional, maybe not override? But usually we want latest KYC)
        else if (lead.documentUrl) {
            await prisma.client.update({
                where: { email: lead.email },
                data: {
                    documentUrl: lead.documentUrl,
                    kycStatus: 'VERIFIED'
                }
            });
        }

        // Notify Client via WhatsApp
        const waMsg = `🎉 *KYC Verified Successfully!*
Hello ${lead.name}, Mohd Ahmad has verified your documents for ${lead.domain}. 
Your high-security license is now ACTIVE. 🛡️

*Next Steps:*
1. Login to your Client Portal.
2. Download your Integration Guide.
3. Copy your License Key to secure your site.

Welcome to the family!`;

        sendWhatsAppMessage(lead.whatsapp, waMsg).catch(console.error);

        // 2. Generate and Create License
        const licenseKey = generateLicenseKey();
        const expiresAt = new Date();
        expiresAt.setMonth(expiresAt.getMonth() + 1); // 1 Month Default

        await prisma.license.create({
            data: {
                domain: lead.domain,
                licenseKey,
                clientEmail: lead.email,
                expiresAt,
                planName: "Standard Plan",
                status: 'ACTIVE'
            }
        });

        // 3. Send Verified/Welcome Email
        const html = `
            <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #059669;">🎉 KYC Verified Successfully!</h2>
                <p>Hello <strong>${lead.name}</strong>,</p>
                <p>Mohd Ahmad has verified your documents for <strong>${lead.domain}</strong>.</p>
                <p>Your high-security license is now <strong>ACTIVE</strong>. 🛡️</p>
                
                <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <p style="margin-top: 0; font-weight: bold;">License Key: <code style="background: #e5e7eb; padding: 2px 5px; border-radius: 4px;">${licenseKey}</code></p>
                    <h4 style="margin-bottom: 10px;">Next Steps:</h4>
                    <ul style="margin-bottom: 0;">
                        <li>Login to your <a href="${process.env.NEXT_PUBLIC_APP_URL}/client/dashboard">Client Portal</a>.</li>
                        <li>Download your Integration Guide.</li>
                        <li>Copy your License Key to secure your site.</li>
                    </ul>
                </div>
                
                <p>Welcome to the family!</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; text-align: center; color: #6b7280;">Voomet LicenseGuard &copy; 2026</p>
            </div>
        `;

        await sendEmail(lead.email, 'KYC Verified Successfully! 🚀', html);

        // 4. Update Lead Status
        await prisma.lead.update({
            where: { id: leadId },
            data: { status: 'APPROVED' }
        });

        // 5. Log activity
        const { logActivity } = await import('@/app/actions/activity');
        await logActivity({
            clientEmail: lead.email,
            type: 'ACTION',
            action: 'LEAD_APPROVED',
            message: `Account approved and license issued for ${lead.domain}.`
        });

        revalidatePath('/dashboard/leads');
        revalidatePath('/dashboard/clients');
        return { success: true };

    } catch (error) {
        console.error("Approval Error", error);
        return { error: 'Failed to approve lead.' };
    }
}

export async function rejectLead(leadId: string) {
    await prisma.lead.update({
        where: { id: leadId },
        data: { status: 'REJECTED' }
    });
    revalidatePath('/dashboard/leads');
    return { success: true };
}

