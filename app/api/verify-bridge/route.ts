import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
    try {
        const { url, licenseKey } = await req.json();

        if (!url || !licenseKey) {
            return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
        }

        // Validate URL format
        const targetUrl = url.startsWith('http') ? url : `https://${url}`;

        // Fetch the client's page
        const response = await fetch(targetUrl, {
            headers: { 'User-Agent': 'Nozris-Verifier/1.0' }
        });

        if (!response.ok) {
            return NextResponse.json({ error: `Failed to reach site: ${response.statusText}` }, { status: 400 });
        }

        const html = await response.text();

        // Check for the script tag
        // We look for specific signature of our script
        const scriptSignature = `nozris.com/nozris.js?key=${licenseKey}`;

        if (html.includes(scriptSignature)) {
            return NextResponse.json({ success: true, message: "Shield Detected Active" });
        } else {
            return NextResponse.json({ success: false, error: "Script tag not found in HTML response" }, { status: 404 });
        }

    } catch (error) {
        console.error("Verify Bridge Error:", error);
        return NextResponse.json({ error: "Verification Failed" }, { status: 500 });
    }
}
