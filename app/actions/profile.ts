'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

export async function getProfile() {
    try {
        const profile = await prisma.profile.findFirst();
        if (!profile) {
            // Create default if not exists
            return await prisma.profile.create({
                data: {
                    fullName: 'Admin User',
                    supportEmail: 'support@example.com',
                    whatsappNumber: '+1234567890',
                    contactNumber: '+1234567890'
                }
            });
        }
        return profile;
    } catch (error) {
        console.error("Error fetching profile:", error);
        return null;
    }
}

export async function updateProfile(formData: FormData) {
    const fullName = formData.get('fullName') as string;
    const supportEmail = formData.get('supportEmail') as string;
    const whatsappNumber = formData.get('whatsappNumber') as string;
    const contactNumber = formData.get('contactNumber') as string;
    const logo = formData.get('logo') as string; // Expecting Base64 string

    try {
        const profile = await prisma.profile.findFirst();

        if (profile) {
            await prisma.profile.update({
                where: { id: profile.id },
                data: {
                    fullName,
                    supportEmail,
                    whatsappNumber,
                    contactNumber,
                    logo: logo && logo.length > 0 ? logo : profile.logo, // Only update if new logo provided
                },
            });
        } else {
            await prisma.profile.create({
                data: {
                    fullName,
                    supportEmail,
                    whatsappNumber,
                    contactNumber,
                    logo: logo || null,
                },
            });
        }

        revalidatePath('/dashboard/profile');
        revalidatePath('/dashboard/integration');
        revalidatePath('/dashboard'); // Update sidebar
        revalidatePath('/renew'); // Update renewal page
        return { success: true };
    } catch (error) {
        console.error("Error updating profile:", error);
        return { error: "Failed to update profile" };
    }
}
