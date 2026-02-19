'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function verifyKYCDocument(documentId: string, status: 'APPROVED' | 'REJECTED', reason?: string) {
    try {
        const doc = await prisma.kYCDocument.findUnique({
            where: { id: documentId },
            include: { client: true }
        });

        if (!doc) return { success: false, message: 'Document not found' };

        // 1. Update Document Status
        await prisma.kYCDocument.update({
            where: { id: documentId },
            data: {
                status,
                rejectionReason: reason || null,
                reviewedAt: new Date(),
                reviewedBy: 'Admin' // In real app, get admin session
            }
        });

        // 2. Update Client Status (Aggregate)
        // If APPROVED, set Client to VERIFIED (if no other pending?)
        // If REJECTED, set Client to ACTION_REQUIRED or similar? 
        // For simplicity: If this doc is APPROVED, we verify the client.

        let clientStatus = doc.client.kycStatus;

        if (status === 'APPROVED') {
            clientStatus = 'VERIFIED';
            await prisma.client.update({
                where: { id: doc.clientId },
                data: { kycStatus: 'VERIFIED' }
            });

            // Log Activity
            await prisma.activityLog.create({
                data: {
                    clientEmail: doc.client.email,
                    type: 'KYC_VERIFICATION',
                    action: 'APPROVED',
                    message: `KYC Document (${doc.type}) Verified by Admin.`
                }
            });

            // TODO: Send Email Notification
        } else {
            clientStatus = 'REJECTED';
            await prisma.client.update({
                where: { id: doc.clientId },
                data: { kycStatus: 'REJECTED', adminNotes: reason }
            });

            // Log Activity
            await prisma.activityLog.create({
                data: {
                    clientEmail: doc.client.email,
                    type: 'KYC_VERIFICATION',
                    action: 'REJECTED',
                    message: `KYC Document (${doc.type}) Rejected: ${reason}`
                }
            });
        }

        revalidatePath(`/admin/clients/${doc.clientId}`);
        revalidatePath('/admin/dashboard');

        return { success: true, message: `Document ${status}` };
    } catch (e) {
        console.error("KYC Verification Error:", e);
        return { success: false, message: 'Verification Failed' };
    }
}
