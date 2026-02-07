import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

const ALGORITHM = 'aes-256-gcm';
const SECRET_KEY = process.env.BACKUP_SECRET || 'v00mit-sup3r-s3cr3t-b4ckup-k3y-2026';

export async function generateEncryptedBackup() {
    try {
        // 1. Collect Data from all key models
        const [users, blockedIps, globalBlacklist, licenses, activities] = await Promise.all([
            prisma.user.findMany(),
            prisma.blockedIP.findMany(),
            prisma.globalBlacklist.findMany(),
            prisma.license.findMany(),
            prisma.activityLog.findMany() // Changed from prisma.activity to prisma.activityLog
        ]);

        const backupData = JSON.stringify({
            timestamp: new Date().toISOString(),
            version: "1.0",
            data: { users, blockedIps, globalBlacklist, licenses, activities }
        });

        // 2. Encrypt Data
        const iv = crypto.randomBytes(12);
        const cipher = crypto.createCipheriv(ALGORITHM, crypto.scryptSync(SECRET_KEY, 'salt', 32), iv);

        let encrypted = cipher.update(backupData, 'utf8', 'hex');
        encrypted += cipher.final('hex');

        const authTag = cipher.getAuthTag().toString('hex');

        // Combine IV, AuthTag, and Encrypted Data
        const finalBackup = JSON.stringify({
            iv: iv.toString('hex'),
            authTag,
            data: encrypted
        });

        return finalBackup;
    } catch (error) {
        console.error("Backup Generation Failed:", error);
        throw new Error("Failed to generate encrypted backup");
    }
}

export async function decryptBackup(encryptedBackupStr: string) {
    try {
        const { iv, authTag, data } = JSON.parse(encryptedBackupStr);

        const decipher = crypto.createDecipheriv(
            ALGORITHM,
            crypto.scryptSync(SECRET_KEY, 'salt', 32),
            Buffer.from(iv, 'hex')
        );

        decipher.setAuthTag(Buffer.from(authTag, 'hex'));

        let decrypted = decipher.update(data, 'hex', 'utf8');
        decrypted += decipher.final('utf8');

        return JSON.parse(decrypted);
    } catch (error) {
        console.error("Decryption Failed:", error);
        throw new Error("Invalid backup file or secret key");
    }
}
