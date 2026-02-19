'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { prisma } from '@/lib/db';
import bcrypt from 'bcryptjs';
import { randomInt } from 'crypto';

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            // Auth.js v5 wraps custom Error messages from authorize()
            // Extract the original message from the cause chain
            const cause = (error as any)?.cause?.err?.message;

            switch (error.type) {
                case 'CredentialsSignin':
                    return cause || 'Invalid credentials.';
                case 'CallbackRouteError':
                    return cause || 'Authentication failed.';
                default:
                    return cause || 'Something went wrong.';
            }
        }
        throw error;
    }
}

export async function register(prevState: string | undefined, formData: FormData) {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    if (!email || !password) {
        return "Email and password are required";
    }

    if (password.length < 6) {
        return "Password must be at least 6 characters";
    }

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        // If user exists but is NOT verified/approved, maybe we should allow re-sending OTP?
        // For now, stick to basic check.
        return "User already exists";
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Check if this is the first user — make them ADMIN & auto-approve
        const userCount = await prisma.user.count();
        const isFirstUser = userCount === 0;

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: isFirstUser ? 'ADMIN' : 'USER',
                isApproved: isFirstUser, // First user auto-approved
                emailVerified: isFirstUser ? new Date() : null, // First user verified
            }
        });

        // ── 1. If First User (Admin), just return success ──
        if (isFirstUser) {
            return "SUCCESS: Admin account created! You can now log in.";
        }

        // ── 2. For Normal Users: Generate OTP & Send Email ──
        const otp = randomInt(100000, 999999).toString();
        const expires = new Date(Date.now() + 1000 * 60 * 15); // 15 mins

        await prisma.verificationToken.create({
            data: {
                identifier: email,
                token: otp,
                expires
            }
        });

        const { sendEmail } = await import('@/lib/email');

        // DEV LOG:
        console.log("---------------------------------------------------");
        console.log(`🔐 OTP for ${email}: ${otp}`);
        console.log("---------------------------------------------------");

        await sendEmail(
            email,
            "Your Verification Code - Nozris Security",
            `<p>Your verification code is: <strong>${otp}</strong></p><p>This code expires in 15 minutes.</p><p>Protected by Nozris.</p>`
        );

        // Return special string to trigger UI switch
        return `OTP_SENT:${email}`;

    } catch (error) {
        console.error("Registration error:", error);
        return "Failed to create user";
    }
}

export async function logout() {
    await signOut({ redirectTo: '/login' });
}
