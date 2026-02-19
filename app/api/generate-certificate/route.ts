import { NextRequest, NextResponse } from 'next/server';
import QRCode from 'qrcode';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { name, domain, date, verificationCode } = body;

        if (!verificationCode) {
            return NextResponse.json({ error: 'Verification code is required' }, { status: 400 });
        }

        const verificationUrl = `https://nozris.com/verify/${verificationCode}`;
        const qrCodeDataUrl = await QRCode.toDataURL(verificationUrl);

        // High-end SVG Certificate Generation
        const svg = `
      <svg width="800" height="600" xmlns="http://www.w3.org/2000/svg">
        <!-- Background -->
        <rect width="800" height="600" fill="#000" />
        <rect x="20" y="20" width="760" height="560" fill="none" stroke="#D4AF37" stroke-width="2" />
        <rect x="30" y="30" width="740" height="540" fill="none" stroke="#D4AF37" stroke-width="1" />

        <!-- Header -->
        <text x="400" y="100" font-family="serif" font-size="40" fill="#D4AF37" text-anchor="middle" font-weight="bold">CERTIFICATE OF PROTECTION</text>
        <text x="400" y="140" font-family="sans-serif" font-size="14" fill="#888" text-anchor="middle" letter-spacing="2">OFFICIAL SECURITY VALIDATION</text>

        <!-- Content -->
        <text x="400" y="240" font-family="sans-serif" font-size="18" fill="#FFF" text-anchor="middle">This certifies that the digital assets of</text>
        <text x="400" y="280" font-family="serif" font-size="32" fill="#FFF" text-anchor="middle" font-weight="bold">${name}</text>
        <text x="400" y="320" font-family="sans-serif" font-size="16" fill="#888" text-anchor="middle">(${domain})</text>

        <text x="400" y="380" font-family="sans-serif" font-size="14" fill="#AAA" text-anchor="middle">Are protected by Nozris's Military Grade Encryption Protocols.</text>
        <text x="400" y="400" font-family="sans-serif" font-size="14" fill="#AAA" text-anchor="middle">Any unauthorized access or code theft will trigger immediate corruption.</text>

        <!-- Date -->
        <text x="200" y="500" font-family="sans-serif" font-size="12" fill="#666" text-anchor="middle">Date of Issue</text>
        <text x="200" y="520" font-family="sans-serif" font-size="14" fill="#FFF" text-anchor="middle">${date}</text>

        <!-- Signature -->
        <text x="600" y="500" font-family="serif" font-size="20" fill="#D4AF37" text-anchor="middle" font-style="italic">Mohd Ahmad</text>
        <text x="600" y="520" font-family="sans-serif" font-size="12" fill="#666" text-anchor="middle">Founder, Nozris</text>

        <!-- QR Code -->
        <image x="350" y="450" width="100" height="100" href="${qrCodeDataUrl}" />
      </svg>
    `;

        return new NextResponse(svg, {
            headers: {
                'Content-Type': 'image/svg+xml',
                'Content-Disposition': `attachment; filename="certificate-${domain}.svg"`,
            },
        });

    } catch (error) {
        console.error("Certificate Generation Error:", error);
        return NextResponse.json({ error: 'Failed to generate certificate' }, { status: 500 });
    }
}
