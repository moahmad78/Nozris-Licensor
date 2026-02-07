import { NextResponse } from 'next/server';
import { pusherServer } from '@/lib/pusher';
import { sendEmail } from '@/lib/email';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { ip, url, reason, userAgent } = body;

        // 1. Trigger Real-Time Dashboard Alert (Siren)
        await pusherServer.trigger('admin-stats', 'security-alert', {
            ip,
            url,
            reason,
            timestamp: new Date().toISOString()
        });

        // 2. Send Critical Email Notification
        // Only sending for high-severity or distinct limits could be better, but user requested IMMEDIATE Action.
        const html = `
            <div style="font-family: monospace; background: #000; color: #ff0000; padding: 20px;">
                <h1>CRITICAL SECURITY ALERT</h1>
                <p><strong>IP Address:</strong> ${ip}</p>
                <p><strong>Target URL:</strong> ${url}</p>
                <p><strong>Reason:</strong> ${reason}</p>
                <p><strong>User Agent:</strong> ${userAgent}</p>
                <hr style="border-color: #333;" />
                <p style="color: #fff;">System has automatically blocked this request.</p>
            </div>
        `;

        // Assuming sendEmail handles standard Nodemailer transport
        await sendEmail(
            'moahmadmail92@gmail.com',
            `🚨 SECURITY IMPEACHMENT: ${ip}`,
            html
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Log Attack Error:", error);
        return NextResponse.json({ success: false }, { status: 500 });
    }
}
