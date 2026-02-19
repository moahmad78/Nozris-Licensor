'use server';

import { prisma } from '@/lib/db';
import { randomUUID } from 'crypto';
import bcrypt from 'bcryptjs';

export async function sendPasswordResetEmail(email: string) {
    if (!email) return "Email is required";

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return "No user found with this email.";

    // Generate token
    const token = randomUUID();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour

    // Store in DB
    await prisma.passwordResetToken.create({
        data: {
            email,
            token,
            expiresAt,
        }
    });

    // Send Email
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/auth/reset-password?token=${token}`;

    // In production, use your email provider. For now, we log it for dev.
    console.log("------------------------------------------");
    console.log("🔐 PASSWORD RESET LINK:");
    console.log(resetLink);
    console.log("------------------------------------------");

    // Try sending email if configured
    try {
        const { sendEmail } = await import('@/lib/email');
        await sendEmail(
            email,
            "Reset Your Password - Nozris Admin",
            `<p>Click here to reset your password: <a href="${resetLink}">Reset Password</a></p><p>This link expires in 1 hour.</p>`
        );
    } catch (e) {
        console.error("Failed to send reset email, but token generated.");
    }

    return "Password reset link sent! Check your email (or server console in dev).";
}

export async function resetPassword(token: string, newPassword: string, confirmPassword: string) {
    if (!token || !newPassword || !confirmPassword) return "All fields required";
    if (newPassword !== confirmPassword) return "Passwords do not match";
    if (newPassword.length < 6) return "Password must be at least 6 characters";

    // Validate Token
    const resetToken = await prisma.passwordResetToken.findUnique({
        where: { token }
    });

    if (!resetToken) return "Invalid or expired token.";

    if (newPassword.length < 6) return "Password must be at least 6 characters";

    if (resetToken.expiresAt < new Date()) {
        return "Token expired. Please request a new one.";
    }

    // Update User Password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
        where: { email: resetToken.email },
        data: { password: hashedPassword }
    });

    // Delete used token
    await prisma.passwordResetToken.delete({ where: { token } });

    return "SUCCESS: Password reset successfully! You can now login.";
}
