'use server';

import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function uploadKYC(formData: FormData) {
    const file = formData.get('file') as File;
    const leadId = formData.get('leadId') as string;

    if (!file || !leadId) {
        return { error: 'File and Lead ID are required.' };
    }

    // Validate Status
    const lead = await prisma.lead.findUnique({ where: { id: leadId } });
    if (!lead) return { error: 'Lead not found.' };

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Ensure directory exists
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    // Generate filename
    // Sanitize extension
    const ext = file.name.split('.').pop();
    const filename = `kyc_${leadId}_${Date.now()}.${ext}`;
    const filepath = join(uploadDir, filename);

    try {
        await writeFile(filepath, buffer);
        const publicPath = `/uploads/${filename}`;

        await prisma.lead.update({
            where: { id: leadId },
            data: { documentUrl: publicPath }
        });

        revalidatePath('/dashboard/leads');
        return { success: true, url: publicPath };
    } catch (error) {
        console.error('Upload error', error);
        return { error: 'Failed to upload document.' };
    }
}

