'use server';

import { generateEncryptedBackup } from '@/lib/backup-service';
import { revalidatePath } from 'next/cache';

export async function manualBackupAction() {
    try {
        const encryptedData = await generateEncryptedBackup();

        // Return the data to the client for download
        return {
            success: true,
            data: encryptedData,
            filename: `nozris_backup_${new Date().toISOString().split('T')[0]}.vmt`
        };
    } catch (error) {
        return { success: false, error: "Backup generation failed" };
    }
}

export async function restoreFromUploadAction(fileContent: string) {
    // Logic to parse and restore would go here
    // For now, we verify integrity
    try {
        const { decryptBackup } = await import('@/lib/backup-service');
        const decrypted = await decryptBackup(fileContent);

        if (decrypted.data) {
            revalidatePath('/admin/dashboard');
            return { success: true, message: "Backup integrity verified. Restoration ready." };
        }
        return { success: false, error: "Invalid backup format" };
    } catch (error) {
        return { success: false, error: "Failed to decrypt backup" };
    }
}
