import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { sendEmail } from '@/lib/email';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('id');
    const secret = searchParams.get('secret');

    const EXPECTED_SECRET = process.env.ADMIN_SECRET || 'super_secure_secret_123';

    if (!userId || secret !== EXPECTED_SECRET) {
        return new NextResponse("<h1>🚫 Unauthorized Access</h1>", { status: 403, headers: { 'Content-Type': 'text/html' } });
    }

    try {
        // 1. Approve User
        const user = await prisma.user.update({
            where: { id: userId },
            data: { isApproved: true }
        });

        // 2. Send Welcome Email
        await sendEmail(
            user.email,
            "🎉 Account Approved! Welcome to Nozris",
            `
            <h1>Access Granted</h1>
            <p>Hello ${user.name || 'User'},</p>
            <p>Your account has been approved by the Administrator.</p>
            <p>You can now log in using your email and password.</p>
            <br/>
            <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/login">Login to Dashboard</a>
            `
        );

        return new NextResponse(`
            <div style="font-family: sans-serif; text-align: center; padding: 50px;">
                <h1 style="color: green;">✅ User Approved Successfully!</h1>
                <p>User <strong>${user.email}</strong> has been notified.</p>
                <p>You can close this window.</p>
            </div>
        `, { headers: { 'Content-Type': 'text/html' } });

    } catch (error) {
        console.error("Approval Error:", error);
        return new NextResponse("<h1>❌ Error Approving User</h1>", { status: 500, headers: { 'Content-Type': 'text/html' } });
    }
}
