'use server';


import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { pusherServer } from '@/lib/pusher';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { sendWhatsAppMessage } from "@/lib/whatsapp";

export async function updateClientProfile(email: string, data: any) {
    if (!email) return { error: 'Unauthorized' };

    try {
        const client = await prisma.client.findUnique({ where: { email } });
        if (!client) return { error: 'Client not found' };

        // Determine if KYC is complete
        // If updating multiple fields, we check completeness after update.
        // Or we rely on the specific step logic.

        await prisma.client.update({
            where: { email },
            data: {
                ...data,
                updatedAt: new Date()
            }
        });

        // Check completeness logic
        // We'll do this in a separate check or here.
        // Re-fetch to check?
        const updated = await prisma.client.findUnique({ where: { email } });
        if (updated) {
            const isComplete = updated.name && updated.email && updated.aadharNumber && updated.address && updated.documentUrl;
            if (isComplete && updated.kycStatus === 'PENDING') {
                // Auto-submit
                await prisma.client.update({
                    where: { email },
                    data: { kycStatus: 'SUBMITTED' }
                });

                // Trigger Admin Alert & Stats
                await pusherServer.trigger('admin-notifications', 'kyc-submitted', {
                    name: updated.name,
                    email: updated.email
                });

                const { getAdminDashboardSummary } = await import('@/app/actions/admin-actions');
                const summary = await getAdminDashboardSummary();
                await pusherServer.trigger('admin-stats', 'update', summary);

                // Log Activity
                const { logActivity } = await import('@/app/actions/activity');
                await logActivity({
                    clientId: updated.id,
                    clientEmail: updated.email,
                    type: 'ACTION',
                    action: 'KYC_SUBMITTED',
                    message: `${updated.name} submitted KYC documents for ${updated.domain}`
                });
            }
        }

        revalidatePath('/client/dashboard');
        revalidatePath('/client/kyc');
        return { success: true };
    } catch (error) {
        console.error("KYC Update Error", error);
        return { error: 'Failed to update profile' };
    }
}

export async function uploadClientFile(email: string, formData: FormData) {
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'document' or 'photo'

    if (!file || !email) return { error: 'Missing file or user' };

    try {
        const client = await prisma.client.findUnique({ where: { email } });
        if (!client) return { error: 'Client not found' };

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const uploadDir = join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });

        const ext = file.name.split('.').pop();
        const filename = `${type}_${client.id}_${Date.now()}.${ext}`;
        const filepath = join(uploadDir, filename);
        const publicPath = `/uploads/${filename}`;

        await writeFile(filepath, buffer);

        const updateData: any = {};
        if (type === 'document') updateData.documentUrl = publicPath;
        if (type === 'photo') updateData.profilePhoto = publicPath;

        await prisma.client.update({
            where: { email },
            data: updateData
        });

        // Re-check status logic same as above
        const updated = await prisma.client.findUnique({ where: { email } });
        if (updated) {
            const isComplete = updated.name && updated.email && updated.aadharNumber && updated.address && updated.documentUrl;
            if (isComplete && updated.kycStatus === 'PENDING') {
                await prisma.client.update({
                    where: { email },
                    data: { kycStatus: 'SUBMITTED' }
                });
            }
        }

        revalidatePath('/client/kyc');
        return { success: true, url: publicPath };
    } catch (error) {
        console.error("File Upload Error", error);
        return { error: 'Upload failed' };
    }
}

export async function approveClientKYC(clientId: string) {
    try {
        const client = await prisma.client.findUnique({ where: { id: clientId } });
        if (!client) return { error: 'Client not found' };

        // 1. Update KYC Status
        await prisma.client.update({
            where: { id: clientId },
            data: { kycStatus: 'VERIFIED' }
        });

        // 2. Activate License(s) if any
        await prisma.license.updateMany({
            where: { clientEmail: client.email },
            data: { status: 'ACTIVE' }
        });

        // 3. Send WhatsApp Notification
        const waMsg = `🎉 *KYC Verified Successfully!*
Hello ${client.name}, Mohd Ahmad has verified your documents for ${client.domain}. 
Your high-security license is now ACTIVE. 🛡️

*Next Steps:*
1. Login to your Client Portal.
2. Download your Integration Guide.
3. Copy your License Key to secure your site.

Welcome to the family!`;

        await sendWhatsAppMessage(client.whatsapp, waMsg).catch(console.error);

        // 4. Send Email Notification
        const { sendEmail } = await import('@/lib/email');
        const emailHtml = `
            <div style="font-family: sans-serif; padding: 20px; max-width: 600px; margin: auto; border: 1px solid #eee; border-radius: 10px;">
                <h2 style="color: #059669;">🎉 KYC Verified Successfully!</h2>
                <p>Hello <strong>${client.name}</strong>,</p>
                <p>Mohd Ahmad has officially verified your identity documents for <strong>${client.domain}</strong>.</p>
                <p>Your high-security license is now <strong>ACTIVE</strong> and ready for integration. 🛡️</p>
                
                <div style="background: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                    <h4 style="margin-top: 0;">Next Steps:</h4>
                    <ul style="margin-bottom: 0;">
                        <li>Login to your <a href="${process.env.NEXT_PUBLIC_APP_URL}/client/dashboard">Client Portal</a>.</li>
                        <li>Download your Integration Guide & Certificate.</li>
                        <li>Apply your License Key to secure your site.</li>
                    </ul>
                </div>
                
                <p>Welcome to the family!</p>
                <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                <p style="font-size: 12px; text-align: center; color: #6b7280;">Voomet LicenseGuard &copy; 2026</p>
            </div>
        `;

        await sendEmail(client.email, 'KYC Verified Successfully! 🚀', emailHtml).catch(console.error);

        // 5. Log activity
        const { logActivity } = await import('@/app/actions/activity');
        await logActivity({
            clientId: client.id,
            clientEmail: client.email,
            type: 'ACTION',
            action: 'KYC_VERIFIED',
            message: `KYC documents verified by admin for ${client.domain}.`
        });

        revalidatePath('/dashboard/kyc');
        revalidatePath('/client/dashboard');
        revalidatePath(`/dashboard/clients/${clientId}`);

        // Zero-Refresh Trigger
        const { getAdminDashboardSummary } = await import('@/app/actions/admin-actions');
        const summary = await getAdminDashboardSummary();
        await pusherServer.trigger('admin-stats', 'update', summary);

        return { success: true };

    } catch (error) {
        console.error("KYC Approval Error", error);
        return { error: 'Approval Failed' };
    }
}
