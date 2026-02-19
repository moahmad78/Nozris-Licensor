import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { otp, tempToken } = await request.json();

        const user = await prisma.user.findFirst({
            where: {
                twoFactorSecret: {
                    contains: tempToken
                }
            }
        });

        if (!user || !user.twoFactorSecret) {
            return NextResponse.json({ error: "Invalid or expired session" }, { status: 401 });
        }

        const twoFactorData = JSON.parse(user.twoFactorSecret);

        if (twoFactorData.otp !== otp) {
            return NextResponse.json({ error: "Invalid verification code" }, { status: 401 });
        }

        if (Date.now() > twoFactorData.expires) {
            return NextResponse.json({ error: "Code expired" }, { status: 401 });
        }

        // Success - Clear the temp secret
        await prisma.user.update({
            where: { id: user.id },
            data: { twoFactorSecret: null }
        });

        // The client will now perform the actual NextAuth signIn call
        return NextResponse.json({ success: true });

    } catch (error) {
        return NextResponse.json({ error: "Verification failed" }, { status: 500 });
    }
}

