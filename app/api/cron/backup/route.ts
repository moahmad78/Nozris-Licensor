import { NextResponse } from 'next/server';
import { generateEncryptedBackup } from '@/lib/backup-service';
import { put } from '@vercel/blob';

export async function GET(request: Request) {
    // 1. Secret Key Check (Vercel Cron Header)
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
        return new NextResponse('Unauthorized', { status: 401 });
    }

    try {
        console.log("CRON: Starting Daily Backup...");
        const encryptedData = await generateEncryptedBackup();

        const filename = `backups/backup_${new Date().toISOString().replace(/:/g, '-')}.vmt`;

        // 2. Upload to Vercel Blob
        const { url } = await put(filename, encryptedData, {
            access: 'public',
            addRandomSuffix: false,
        });

        console.log(`CRON: Backup successful. URL: ${url}`);

        return NextResponse.json({ success: true, url });
    } catch (error) {
        console.error("CRON: Backup failed:", error);
        return NextResponse.json({ success: false, error: "Backup process failed" }, { status: 500 });
    }
}
