import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';
import { sendOTPEmail } from '@/lib/mail';

export async function POST(request: Request) {
    try {
        const { email, password } = await request.json();

        if (!email || !password) {
            return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        const passwordsMatch = await bcrypt.compare(password, user.password);
        if (!passwordsMatch) {
            return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
        }

        if (!user.isApproved) {
            return NextResponse.json({ error: "Account not approved" }, { status: 403 });
        }

        // 2FA CHECK
        if (user.twoFactorEnabled) {
            const otp = Math.floor(100000 + Math.random() * 900000).toString();
            const tempToken = uuidv4();

            // Store OTP in database (using twoFactorSecret as a temp store or separate model)
            // For this implementation, we'll use a hidden session model or update user with temporary secret
            await prisma.user.update({
                where: { id: user.id },
                data: { twoFactorSecret: JSON.stringify({ otp, expires: Date.now() + 5 * 60 * 1000, tempToken }) }
            });

            // Send Email
            try {
                await sendOTPEmail(user.email, otp);
            } catch (mailError) {
                console.error("Mail Error:", mailError);
                return NextResponse.json({ error: "Failed to send 2FA email" }, { status: 500 });
            }

            return NextResponse.json({
                status: "REQUIRES_2FA",
                tempToken
            });
        }

        // Normal Login successful - NextAuth will handle the actual session creation via signIn on the client
        return NextResponse.json({ status: "SUCCESS" });

    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
