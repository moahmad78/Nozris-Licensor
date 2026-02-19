import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const email = formData.get('email') as string;
        const name = formData.get('name') as string;
        const address = formData.get('address') as string;
        const aadharNumber = formData.get('aadharNumber') as string;
        const profilePhotoFile = formData.get('profilePhoto') as File;
        const aadharImageFile = formData.get('aadharImage') as File;

        if (!email) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const updateData: any = {
            name,
            address,
            aadharNumber,
            updatedAt: new Date()
        };

        const uploadDir = join(process.cwd(), 'public', 'uploads');
        await mkdir(uploadDir, { recursive: true });

        // Handle Profile Photo
        if (profilePhotoFile && profilePhotoFile.size > 0) {
            const ext = profilePhotoFile.name.split('.').pop();
            const filename = `photo_${Date.now()}_${email.replace(/[@.]/g, '_')}.${ext}`;
            const buffer = Buffer.from(await profilePhotoFile.arrayBuffer());
            await writeFile(join(uploadDir, filename), buffer);
            updateData.profilePhoto = `/uploads/${filename}`;
        }

        // Handle Aadhar Image
        if (aadharImageFile && aadharImageFile.size > 0) {
            const ext = aadharImageFile.name.split('.').pop();
            const filename = `aadhar_${Date.now()}_${email.replace(/[@.]/g, '_')}.${ext}`;
            const buffer = Buffer.from(await aadharImageFile.arrayBuffer());
            await writeFile(join(uploadDir, filename), buffer);
            updateData.documentUrl = `/uploads/${filename}`;
        }

        // Update Client and set status
        await prisma.client.update({
            where: { email },
            data: {
                ...updateData,
                kycStatus: 'SUBMITTED'
            }
        });

        // Trigger notification logic
        const { sendMultiChannelNotification } = await import('@/lib/notifications');
        await sendMultiChannelNotification(
            { userId: 'Mohd-Ahmad' },
            {
                title: 'New KYC Submission 📄',
                message: `Client ${name} (${email}) has submitted their KYC documents for verification.`,
                type: 'INFO'
            },
            { db: true }
        );

        return NextResponse.json({ success: true, message: 'KYC Details Submitted! Mohd Ahmad will verify and notify you soon.' });

    } catch (error) {
        console.error("KYC Route Error:", error);
        return NextResponse.json({ error: 'Failed to submit KYC' }, { status: 500 });
    }
}

