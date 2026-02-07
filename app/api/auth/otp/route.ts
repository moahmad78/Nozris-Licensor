import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
    try {
        const { email, domain } = await req.json();

        if (!email || !domain) {
            return NextResponse.json({ error: 'Email and domain are required' }, { status: 400 });
        }

        // 1. Verify existence
        const license = await prisma.license.findFirst({
            where: {
                clientEmail: email,
                domain: { contains: domain, mode: 'insensitive' },
                status: 'ACTIVE'
            }
        });

        if (!license) {
            return NextResponse.json({ error: 'No license found for this email and domain combination.' }, { status: 404 });
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

        console.log(`Triggering direct OTP send for ${email}...`);
        const emailSent = await sendEmail(email, 'Your Login OTP', html);

        if (!emailSent) {
            console.error(`FAILED: OTP for ${email} could not be sent via API Route.`);
            return NextResponse.json({ error: 'Failed to send OTP email.' }, { status: 500 });
        }

        console.log(`OTP [${otp}] sent to [${email}] via API Route`);
        return NextResponse.json({ success: true });

    } catch (error) {
        console.error("OTP Route Error:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
