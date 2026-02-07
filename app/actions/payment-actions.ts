'use server';

import { prisma } from '@/lib/prisma';
import { getClientLicenseDetails } from './client-integration';
import { revalidatePath } from 'next/cache';
import { addDays } from 'date-fns';

export async function submitPayment(utrNumber: string) {
    const meta = await getClientLicenseDetails();
    if (!meta || meta.key === 'NO_LICENSE_FOUND') return { success: false, error: 'License Not Found' };

    const license = await prisma.license.findUnique({ where: { licenseKey: meta.key } });
    if (!license) return { success: false, error: 'License Not Found' };

    // Validate UTR (Basic length check)
    if (utrNumber.length < 12) return { success: false, error: 'Invalid UTR Number. Must be at least 12 digits.' };

    try {
        const payment = await prisma.payment.create({
            data: {
                licenseId: license.id,
                utrNumber: utrNumber,
                amount: license.monthlyPrice,
                status: 'PENDING'
            }
        });

        // Update Subscription Status to indicate pending if not already
        // Actually, we keep it as is, middleware handles the PENDING check via relation or separate status?
        // Let's set subscriptionStatus to 'GRACE_PERIOD' or keep as is?
        // Easier: Just create payment. Middleware queries recent payments? 
        // Or update license to have a 'paymentPending' flag?
        // Let's rely on finding a PENDING payment for this license.

        // NOTIFICATION SYSTEM
        const { sendWhatsAppMessage } = await import('@/lib/whatsapp');
        const alertMsg = `🚨 NEW PAYMENT ALERT!\nClient: ${license.clientEmail} (${license.domain})\nAmount: $${license.monthlyPrice}\nUTR: ${utrNumber}\n\nPlease check Admin Dashboard to Approve/Reject.`;

        const sent = await sendWhatsAppMessage('919264920211', alertMsg); // Default to Ahmad's number

        if (sent) {
            await prisma.payment.update({
                where: { id: payment.id },
                data: { notificationSent: true }
            });
        }

        revalidatePath('/client/pay');
        return { success: true };
    } catch (e: any) {
        if (e.code === 'P2002') return { success: false, error: 'This UTR has already been submitted.' };
        return { success: false, error: 'Payment Submission Failed' };
    }
}

export async function getPaymentStatus() {
    const meta = await getClientLicenseDetails();
    if (!meta || meta.key === 'NO_LICENSE_FOUND') return null;

    const license = await prisma.license.findUnique({
        where: { licenseKey: meta.key },
        include: {
            payments: {
                orderBy: { createdAt: 'desc' },
                take: 1
            }
        }
    });

    if (!license) return null;

    // Check if expired
    const isExpired = new Date(license.expiresAt) < new Date();
    const latestPayment = license.payments[0];

    return {
        isExpired,
        latestPayment
    };
}

// ADMIN ACTIONS

export async function approvePayment(paymentId: string) {
    const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: { license: true }
    });

    if (!payment || payment.status !== 'PENDING') return { success: false, error: 'Invalid Payment' };

    // Approve
    const now = new Date();
    await prisma.$transaction([
        prisma.payment.update({
            where: { id: paymentId },
            data: { status: 'APPROVED' }
        }),
        prisma.license.update({
            where: { id: payment.licenseId },
            data: {
                expiresAt: addDays(now, 365), // Extend by 1 year
                subscriptionStatus: 'PAID',
                lastPaymentDate: now
            }
        })
    ]);

    revalidatePath('/admin/payments');
    return { success: true };
}

export async function rejectPayment(paymentId: string, reason: string) {
    const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: { license: true }
    });

    if (!payment) return { success: false, error: 'Payment not found' };

    await prisma.payment.update({
        where: { id: paymentId },
        data: {
            status: 'REJECTED',
            rejectionReason: reason
        }
    });

    // REJECTION ALERT
    if (payment.license.clientPhone) {
        const { sendWhatsAppMessage } = await import('@/lib/whatsapp');
        const alertMsg = `⚠️ PAYMENT REJECTED: Hi ${payment.license.clientEmail},\n\nAhmad Bhai has rejected your payment for Licensr.\nReason: ${reason}\n\nPlease resubmit with correct details.`;

        await sendWhatsAppMessage(payment.license.clientPhone, alertMsg);
    }

    revalidatePath('/admin/payments');
    return { success: true };
}
