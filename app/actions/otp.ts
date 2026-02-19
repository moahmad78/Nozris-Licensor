'use server';

import { prisma } from '@/lib/db';
import { sendEmail } from '@/lib/email';

const ADMIN_EMAIL = 'moahmadmail92@gmail.com'; // Hardcoded admin email

export async function verifyOTP(email: string, otp: string) {
    if (!email || !otp) return { error: "Missing fields" };

    try {
        // 1. Validate Token
        const record = await prisma.verificationToken.findUnique({
            where: { identifier_token: { identifier: email, token: otp } }
        });

        if (!record) {
            return { error: "Invalid OTP" };
        }

        if (record.expires < new Date()) {
            await prisma.verificationToken.delete({ where: { identifier_token: { identifier: email, token: otp } } });
            return { error: "OTP Expired. Please signup again." };
        }

        // 2. Mark User as Verified (but NOT approved)
        const user = await prisma.user.update({
            where: { email },
            data: { emailVerified: new Date() }
        });

        // 3. Delete OTP
        await prisma.verificationToken.delete({ where: { identifier_token: { identifier: email, token: otp } } });

        // 4. Send Approval Request to Admin
        const secret = process.env.ADMIN_SECRET || 'super_secure_secret_123';
        const approvalLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/admin/approve?id=${user.id}&secret=${secret}`;

        await sendEmail(
            ADMIN_EMAIL,
            "ACTION REQUIRED: Approve New User - Nozris Admin",
            `
            <h2>New User Registration</h2>
            <p><strong>Name:</strong> ${user.name}</p>
            <p><strong>Email:</strong> ${user.email}</p>
            <p><strong>Time:</strong> ${new Date().toLocaleString()}</p>
            <br/>
            <a href="${approvalLink}" style="background:green; color:white; padding:10px 20px; text-decoration:none; border-radius:5px;">Approve User & Give Access</a>
            <p>If you don't approve, they cannot login.</p>
            `
        );

        return { success: true, message: "Email Verified! Waiting for Admin Approval." };

    } catch (error: any) {
        console.error("OTP Verification Error:", error);
        return { error: "Verification failed. Please try again." };
    }
}
