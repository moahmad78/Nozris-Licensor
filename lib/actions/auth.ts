'use server';

import { signIn, signOut } from '@/auth';
import { AuthError } from 'next-auth';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';

export async function authenticate(prevState: string | undefined, formData: FormData) {
    try {
        await signIn('credentials', formData);
    } catch (error) {
        if (error instanceof AuthError) {
            switch (error.type) {
                case 'CredentialsSignin':
                    return 'Invalid credentials.';
                default:
                    return 'Something went wrong.';
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

    // Check if user exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
        return "User already exists";
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                isApproved: false, // Explicitly set to false
            }
        });

        // Trigger Admin Notification
        const { sendAdminNotification } = await import('@/lib/email');
        await sendAdminNotification(email);

        return "Account created! Please wait for Admin approval.";
    } catch (error) {
        console.error("Registration error:", error);
        return "Failed to create user";
    }
}

export async function logout() {
    await signOut({ redirectTo: '/login' });
}

