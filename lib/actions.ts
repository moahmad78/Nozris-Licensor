'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

export async function createLicense(formData: FormData) {
    const domain = formData.get('domain') as string;
    const days = formData.get('days') as string;
    const clientEmail = (formData.get('clientEmail') as string) || 'legacy_user@example.com';
    const planName = (formData.get('planName') as string) || 'Standard Plan';
    const monthlyPrice = parseFloat((formData.get('monthlyPrice') as string) || '500');

    // 1. Prevent Duplicate Domains
    const existingLicense = await prisma.license.findFirst({
        where: { domain }
    });

    if (existingLicense) {
        return { error: 'License for this domain already exists.' };
    }

    const licenseKey = crypto.randomBytes(16).toString('hex');
    let validFrom = new Date();
    let expiresAt = new Date();

    if (days === 'custom') {
        const validFromRaw = formData.get('validFrom') as string;
        const validUntilRaw = formData.get('validUntil') as string;

        if (!validFromRaw || !validUntilRaw) {
            return { error: 'Both Start and End dates are required for custom duration.' };
        }

        validFrom = new Date(validFromRaw);
        expiresAt = new Date(validUntilRaw);

        if (expiresAt <= validFrom) {
            return { error: 'End date must be after Start date' };
        }
    } else {
        expiresAt.setDate(expiresAt.getDate() + parseInt(days));
    }

    await prisma.license.create({
        data: {
            domain,
            licenseKey,
            validFrom,
            expiresAt,
            status: 'ACTIVE',
            clientEmail,
            planName,
            monthlyPrice,
        },
    });
    revalidatePath('/dashboard');
    return { success: 'License created successfully!' };
}

export async function extendLicense(licenseId: string, extensionType: string, customDate?: string) {
    const license = await prisma.license.findUnique({
        where: { id: licenseId },
    });

    if (!license) {
        return { error: 'License not found.' };
    }

    const now = new Date();
    // If expired, start from now. If active, start from current expiry.
    let baseDate = license.expiresAt < now ? now : license.expiresAt;
    let newExpiresAt = new Date(baseDate);

    if (extensionType === '1_MONTH') {
        newExpiresAt.setDate(newExpiresAt.getDate() + 30);
    } else if (extensionType === '1_YEAR') {
        newExpiresAt.setDate(newExpiresAt.getDate() + 365);
    } else if (extensionType === 'CUSTOM' && customDate) {
        const customDateObj = new Date(customDate);
        if (customDateObj <= baseDate) {
            return { error: 'New expiry date must be after the current expiry (or today if expired).' };
        }
        newExpiresAt = customDateObj;
    } else {
        return { error: 'Invalid extension type.' };
    }

    await prisma.license.update({
        where: { id: licenseId },
        data: {
            expiresAt: newExpiresAt,
            status: 'ACTIVE', // Reactivate if it was suspended/expired
        },
    });

    revalidatePath('/dashboard');
    return { success: 'License extended successfully!' };
}

export async function submitRenewal(formData: FormData) {
    const domain = formData.get('domain') as string;
    const duration = formData.get('duration') as string;
    const transactionId = formData.get('transactionId') as string;
    const amount = parseFloat(formData.get('amount') as string);

    // Verify license exists
    const license = await prisma.license.findFirst({
        where: { domain }
    });

    if (!license) {
        return { error: 'Domain not found in our system.' };
    }

    await prisma.renewalRequest.create({
        data: {
            licenseId: license.id,
            domain,
            duration,
            amount,
            transactionId,
            status: 'PENDING'
        }
    });

    // TODO: Send email to admin here

    return { success: 'Renewal request submitted! Check email for updates.' };
}

export async function approveRenewal(requestId: string) {
    const request = await prisma.renewalRequest.findUnique({
        where: { id: requestId }
    });

    if (!request) return { error: 'Request not found' };

    const newDurationMonths = parseInt(request.duration);

    // Extend the license
    const license = await prisma.license.findUnique({ where: { id: request.licenseId } });
    if (!license) return { error: 'License not found' };

    const now = new Date();
    // Logic: If expired, start from now. If active, start from expiry.
    let baseDate = license.expiresAt < now ? now : license.expiresAt;
    let newExpiresAt = new Date(baseDate);

    newExpiresAt.setMonth(newExpiresAt.getMonth() + newDurationMonths);

    // Update License
    const updatedLicense = await prisma.license.update({
        where: { id: request.licenseId },
        data: {
            expiresAt: newExpiresAt,
            status: 'ACTIVE'
        }
    });

    // Update Request
    await prisma.renewalRequest.update({
        where: { id: requestId },
        data: { status: 'APPROVED' }
    });

    // 1. Auto-Unblock IP Logic
    // Find blocked IPs that were blocked due to this license key
    await prisma.blockedIP.updateMany({
        where: {
            reason: { contains: updatedLicense.licenseKey }
        },
        data: {
            isBlocked: false,
            attempts: 0
        }
    });

    // 2. Send Success Email
    // Note: PDF Generation on server requires complex setup (e.g. puppeteer). 
    // For now, we send a rich HTML email with the Key and Link.
    const successPageUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/renew/success?key=${updatedLicense.licenseKey}`;

    const emailHtml = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e5e7eb; border-radius: 12px;">
            <div style="text-align: center; margin-bottom: 24px;">
                <h1 style="color: #16a34a; margin: 0;">Renewal Successful! 🎉</h1>
                <p style="color: #6b7280; font-size: 16px;">Your license has been extended securely.</p>
            </div>
            
            <div style="background-color: #f9fafb; padding: 24px; border-radius: 8px; margin-bottom: 24px; text-align: center;">
                <p style="font-size: 12px; color: #6b7280; text-transform: uppercase; font-weight: bold; margin-bottom: 8px;">Your Active License Key</p>
                <code style="display: block; background: #fff; padding: 12px; border: 1px dashed #d1d5db; border-radius: 6px; font-size: 18px; font-weight: bold; color: #111827;">
                    ${updatedLicense.licenseKey}
                </code>
            </div>

            <div style="text-align: center;">
                <a href="${successPageUrl}" style="display: inline-block; background-color: #000; color: #fff; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: bold;">
                    View Integration Guide
                </a>
                <p style="margin-top: 16px; font-size: 14px; color: #6b7280;">
                    Or copy this link: <a href="${successPageUrl}" style="color: #2563eb;">${successPageUrl}</a>
                </p>
            </div>

            <hr style="border: 0; border-top: 1px solid #e5e7eb; margin: 32px 0;" />
            
            <p style="font-size: 12px; color: #9ca3af; text-align: center;">
                Referer: Renewal approved by Admin for domain ${updatedLicense.domain}.<br>
                If your IP was blocked, it has been automatically unblocked.
            </p>
        </div>
    `;

    try {
        await import('@/lib/email').then(mod =>
            mod.sendEmail(
                updatedLicense.clientEmail || 'client@example.com',
                `License Renewal Confirmation: ${updatedLicense.domain}`,
                emailHtml
            )
        );
    } catch (e) {
        console.error("Failed to send renewal email", e);
    }

    revalidatePath('/dashboard/requests');
    revalidatePath('/dashboard');
    return { success: 'Renewal approved, email sent, and IPs unblocked.' };
}

export async function rejectRenewal(requestId: string) {
    await prisma.renewalRequest.update({
        where: { id: requestId },
        data: { status: 'REJECTED' }
    });
    revalidatePath('/dashboard/requests');
    return { success: 'Request rejected' };
}

export async function toggleStatus(id: string, currentStatus: string) {
    const newStatus = currentStatus === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';
    await prisma.license.update({
        where: { id },
        data: { status: newStatus },
    });
    revalidatePath('/dashboard');
}

export async function deleteLicense(id: string) {
    // Soft delete
    await prisma.license.update({
        where: { id },
        data: { deletedAt: new Date() }
    });
    revalidatePath('/dashboard');
}

export async function restoreLicense(id: string) {
    await prisma.license.update({
        where: { id },
        data: { deletedAt: null }
    });
    revalidatePath('/dashboard/bin');
    revalidatePath('/dashboard');
}

export async function forceDeleteLicense(id: string) {
    await prisma.license.delete({
        where: { id },
    });
    revalidatePath('/dashboard/bin');
}

export async function updateLicense(id: string, formData: FormData) {
    const domain = formData.get('domain') as string;
    const clientEmail = formData.get('clientEmail') as string;
    const planName = formData.get('planName') as string;
    const monthlyPrice = parseFloat(formData.get('monthlyPrice') as string);

    // Basic validation
    if (!domain || !clientEmail || !planName || isNaN(monthlyPrice)) {
        return { error: 'All fields are required.' };
    }

    try {
        await prisma.license.update({
            where: { id },
            data: {
                domain,
                clientEmail,
                planName,
                monthlyPrice
            }
        });
        revalidatePath('/dashboard');
        return { success: 'License details updated successfully!' };
    } catch (error) {
        console.error("Update error:", error);
        return { error: 'Failed to update license. Domain might be duplicate.' };
    }
}

export async function terminateClientAccount(clientEmail: string) {
    try {
        // 1. Update all licenses for this client to TERMINATED
        await prisma.license.updateMany({
            where: { clientEmail },
            data: { status: 'TERMINATED' }
        });

        // 2. Fetch client name for notification
        const client = await prisma.client.findUnique({
            where: { email: clientEmail }
        });

        const name = client?.name || "Client";
        const whatsapp = client?.whatsapp;

        // 3. Send WhatsApp Alert
        if (whatsapp) {
            const { sendWhatsAppMessage } = await import('@/lib/whatsapp');
            const msg = `⚠️ *Account Terminated!* Hello ${name}, aapka account baar-baar security ched-chad की वजह से TERMINATE कर दिया गया है। Contact Mohd Ahmad (+91 9264920211) for restoration.`;
            await sendWhatsAppMessage(whatsapp, msg);
        }

        revalidatePath('/dashboard');
        revalidatePath('/dashboard/clients');
        return { success: 'Client account terminated successfully.' };
    } catch (error) {
        console.error("Termination error:", error);
        return { error: 'Failed to terminate account.' };
    }
}

export async function restoreClientAccount(clientEmail: string) {
    try {
        // 1. Reset all licenses to ACTIVE
        await prisma.license.updateMany({
            where: { clientEmail, status: 'TERMINATED' },
            data: { status: 'ACTIVE' }
        });

        // 2. Reset tamperCount
        await prisma.client.update({
            where: { email: clientEmail },
            data: { tamperCount: 0 }
        });

        revalidatePath('/dashboard');
        revalidatePath('/dashboard/clients');
        return { success: 'Client account restored successfully.' };
    } catch (error) {
        console.error("Restoration error:", error);
        return { error: 'Failed to restore account.' };
    }
}
export async function getSecurityStats() {
    try {
        const activeDeployments = await prisma.license.count({
            where: { status: 'ACTIVE' }
        });

        const terminatedDomains = await prisma.license.count({
            where: {
                status: {
                    in: ['TERMINATED', 'ATTEMPTED CLONING']
                }
            }
        });

        const blockedIPs = await prisma.blockedIP.aggregate({
            _sum: {
                attempts: true
            }
        });

        // Add a base of 5000 to hacking attempts for psychological impact as requested
        const totalBlockedAttempts = (blockedIPs._sum.attempts || 0) + 5432;

        return {
            activeDeployments,
            terminatedDomains,
            totalBlockedAttempts
        };
    } catch (error) {
        console.error("Stats fetch error:", error);
        return {
            activeDeployments: 0,
            terminatedDomains: 0,
            totalBlockedAttempts: 5432
        };
    }
}
