'use server';

import { prisma } from '@/lib/prisma';
import { sendEmail } from '@/lib/email';
import { cookies } from 'next/headers';
import { signToken } from '@/lib/client-auth-token';

export async function sendLoginOTP(formData: FormData) {
    const email = formData.get('email') as string;
    const domain = formData.get('domain') as string;

    if (!email || !domain) return { error: 'Both fields are required' };

    // 1. Verify existence
    const license = await prisma.license.findFirst({
        where: {
            clientEmail: email,
            domain: { contains: domain, mode: 'insensitive' },
            status: 'ACTIVE' // flexible match
        }
    });

    if (!license) {
        return { error: 'No license found for this email and domain combination.' };
    }

    // 2. Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    // 3. Store OTP
    await prisma.clientOTP.create({
        data: {
            email,
            otp,
            expiresAt
        }
    });

    // 4. Send Email
    const html = `
        <div style="font-family: sans-serif; padding: 20px;">
            <h2>Secure Login Code</h2>
            <p>Use the following OTP to log in to your Client Portal:</p>
            <h1 style="color: #000; letter-spacing: 5px; font-size: 32px;">${otp}</h1>
            <p>This code expires in 10 minutes.</p>
        </div>
    `;

    const emailSent = await sendEmail(email, 'Your Login OTP', html);

    if (!emailSent) {
        console.error(`FAILED: OTP for ${email} could not be sent.`);
        return { error: 'Failed to send OTP email. Please try again later.' };
    }

    console.log(`OTP [${otp}] sent to [${email}]`);

    return { success: true, email };
}

export async function verifyLoginOTP(email: string, otp: string) {
    // 1. Find Valid OTP
    const record = await prisma.clientOTP.findFirst({
        where: {
            email,
            otp,
            expiresAt: { gt: new Date() }
        },
        orderBy: { createdAt: 'desc' }
    });

    if (!record) {
        return { error: 'Invalid or Expired OTP' };
    }

    // 2. Set Session (Cookie)
    // 24 hours expiry
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000;
    const payload = { email, expiresAt };
    const token = signToken(payload);

    (await cookies()).set('client_session', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24, // 24 hours
        path: '/',
    });

    // Clean up used OTP (Optional, or leave for cron)
    await prisma.clientOTP.delete({ where: { id: record.id } });

    return { success: true };
}

export async function logoutClient() {
    (await cookies()).delete('client_session');
    return { success: true };
}
