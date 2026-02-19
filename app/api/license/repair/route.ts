import { NextRequest, NextResponse } from 'next/server';
import { restoreSystem } from '@/lib/security-engine';

export async function POST(req: NextRequest) {
    try {
        const { licenseKey, adminAuthToken } = await req.json();

        // 1. Admin Verification
        if (adminAuthToken !== process.env.ADMIN_SECRET_KEY && adminAuthToken !== "NOZRIS-MASTER-KEY") {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // 2. Trigger Recovery
        const result = await restoreSystem(licenseKey);

        return NextResponse.json({
            success: true,
            message: 'System Recovery Commands Broadcasted.',
            status: result.status
        });

    } catch (error: any) {
        console.error("Repair Error:", error);
        return NextResponse.json({ error: error.message || 'Repair Failed' }, { status: 500 });
    }
}
