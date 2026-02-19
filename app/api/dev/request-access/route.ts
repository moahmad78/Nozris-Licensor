import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const { email, licenseKey } = await request.json();

        if (!email || !licenseKey) {
            return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
        }

        // Mock saving this request - Ideally we'd have a DevRequest model
        // For now, we'll just log it or maybe create a generic notification
        // REAL IMPLEMENTATION: await prisma.developerRequest.create(...)

        console.log(`[DEV ACCESS] Request from ${email} for License ${licenseKey}`);

        return NextResponse.json({ success: true, message: 'Request sent to Owner' });
    } catch (e) {
        return NextResponse.json({ error: 'Server Error' }, { status: 500 });
    }
}
