'use server';

import { processRecoveryPackage } from '@/lib/recovery-engine';
import { connectAndRestore } from '@/lib/cpanel-restorer';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import AdmZip from 'adm-zip';
import path from 'path';
import fs from 'fs';

export async function triggerManualBackup(licenseKey: string) {
    try {
        // Real Zip Generation
        const zip = new AdmZip();

        // 1. Create Manifest
        const manifest = {
            version: "2.0",
            timestamp: new Date().toISOString(),
            license: licenseKey,
            db_dump: "database.sql",
            web_root: "public_html"
        };
        zip.addFile("manifest.json", Buffer.from(JSON.stringify(manifest, null, 2), "utf8"));

        // 2. Add Dummy DB Dump (In real app, pg_dump/mysqldump)
        zip.addFile("database.sql", Buffer.from("-- Real Database Dump Placeholder\nSELECT * FROM users;", "utf8"));

        // 3. Add Configs
        zip.addFile("config.json", Buffer.from(JSON.stringify({ env: "production", secure: true }), "utf8"));

        // 4. Save to Public for Download
        const fileName = `snapshot-${Date.now()}.nozris`;
        const uploadDir = path.join(process.cwd(), 'public', 'backups');

        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        const filePath = path.join(uploadDir, fileName);
        zip.writeZip(filePath);

        return {
            success: true,
            message: 'Golden Snapshot Created Successfully',
            downloadUrl: `/backups/${fileName}`
        };
    } catch (e) {
        console.error("Backup Failed:", e);
        return { success: false, message: 'Backup Generation Failed' };
    }
}

export async function restoreFromBackup(formData: FormData) {
    const file = formData.get('backupFile') as File;
    const licenseKey = formData.get('licenseKey') as string;

    if (!file || !licenseKey) {
        return { success: false, message: 'Invalid Backup File' };
    }

    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const tempPath = path.join(process.cwd(), 'temp_uploads', file.name);

        // Ensure temp dir exists
        const tempDir = path.dirname(tempPath);
        if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

        fs.writeFileSync(tempPath, buffer);

        // 1. Process Package (Real Zip Check)
        const engineResult = await processRecoveryPackage(tempPath);

        // 2. Trigger Restoration Logic (FTP)
        const cpanelResult = await connectAndRestore(tempPath, 'client-server.com');

        // Cleanup
        try { fs.unlinkSync(tempPath); } catch { }

        const fullLogs = [...engineResult.log, ...cpanelResult.log];

        if (engineResult.success && cpanelResult.success) {
            await prisma.license.update({
                where: { licenseKey: licenseKey },
                data: { status: 'ACTIVE' }
            });

            revalidatePath('/client/dashboard');
            return { success: true, message: 'System Healed via Universal Engine', logs: fullLogs };
        } else {
            return { success: false, message: 'Restoration Failed', logs: fullLogs };
        }
    } catch (e: any) {
        console.error("Restore Error:", e);
        return { success: false, message: `Server Verification Failed: ${e.message}` };
    }
}
