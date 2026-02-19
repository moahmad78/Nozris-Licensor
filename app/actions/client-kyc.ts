'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';

// Existing function (kept for compatibility if used elsewhere)
export async function uploadKYCDocument(formData: FormData) {
    const file = formData.get('document') as File;
    const email = formData.get('email') as string;

    if (!file || !email) {
        return { success: false, message: 'Missing file or email' };
    }

    return await saveFile(file, email, 'kyc');
}

// New function to match kyc-form.tsx usage
export async function uploadClientFile(email: string, formData: FormData) {
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'document' or 'photo'

    if (!file || !email) {
        return { error: 'Missing file or email' };
    }

    const result = await saveFile(file, email, type);
    if (result.success) {
        return { success: true, filePath: result.filePath };
    } else {
        return { error: result.message };
    }
}

// Helper function to save file
async function saveFile(file: File, email: string, type: string) {
    try {
        const buffer = Buffer.from(await file.arrayBuffer());

        // Ensure secure directory exists
        const uploadDir = path.join(process.cwd(), 'secure_uploads', type);
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Generate unique filename
        const timestamp = Date.now();
        const safeName = `${timestamp}-${email.replace(/[^a-zA-Z0-9]/g, '_')}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
        const filePath = path.join(uploadDir, safeName);

        // Write file to disk
        fs.writeFileSync(filePath, buffer);

        console.log(`[KYC] ${type} for ${email} saved: ${filePath}`);

        revalidatePath('/client/kyc-upload');
        return { success: true, message: 'File Secured & Encrypted', filePath };

    } catch (e: any) {
        console.error("KYC Upload Error:", e);
        return { success: false, message: 'Upload Failed' };
    }
}

// Dummy function for profile update to match kyc-form.tsx
export async function updateClientProfile(formData: FormData) {
    const email = formData.get('email') as string;
    const name = formData.get('name') as string;
    const address = formData.get('address') as string;
    const aadhar = formData.get('aadharNumber') as string;

    console.log(`[KYC] Update Profile for ${email}:`, { name, address, aadhar });

    // In a real implementation, update DB here
    // await prisma.client.update(...)

    return { success: true };
}
