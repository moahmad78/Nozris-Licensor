import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { ip, domain, method = 'email' } = await req.json();

        // 1. Log the Warning Action
        console.log(`Sending Legal Notice to ${ip} for ${domain}`);

        // 2. Mock Sending Email/WhatsApp (Integration would go here)
        // e.g., await sendEmail({ to: `abuse@${domain}`, subject: "LEGAL NOTICE", ... })

        const message = `
        URGENT LEGAL NOTICE:
        
        This is an automated security alert from Licensr.
        Your IP [${ip}] has been logged attempting unauthorized access to protected intellectual property on [${domain}].
        
        We have captured your device fingerprint and location data.
        Immediate legal action has been initiated under the Indian IT Act, 2000 and International Copyright Laws.
        
        Cease and desist immediately to avoid further prosecution.
        `;

        // Simulate success
        return NextResponse.json({
            success: true,
            status: "Warning Dispatched",
            target: ip,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        return NextResponse.json({ error: 'Failed to dispatch warning' }, { status: 500 });
    }
}
