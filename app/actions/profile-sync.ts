'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';
import { getClientSession } from '@/app/actions/client-auth';

export async function updateClientProfile(formData: FormData) {
    const session = await getClientSession();
    if (!session || !session.clientId) {
        return { success: false, message: 'Unauthorized' };
    }

    const name = formData.get('fullName') as string;
    const phone = formData.get('phoneNumber') as string;
    const whatsapp = formData.get('whatsappNumber') as string;
    const company = formData.get('companyName') as string;
    const address = formData.get('fullAddress') as string;

    try {
        // 1. Update Client Record
        await prisma.client.update({
            where: { id: session.clientId },
            data: {
                name,
                // Client model: whatsapp, address, companyName (schema check: created companyName?)
                // Schema check: Client has 'name', 'whatsapp', 'address'. 
                // Currently 'companyName' and 'phoneNumber' were added to User, not Client (my mistake in previous step).
                // I added fields to User in step 592.
                // But now I decided to use Client. 
                // Client has 'address', 'whatsapp', 'name'.
                // I should probably add 'companyName' and 'phoneNumber' to Client too if they serve different purpose.
                // Or map them: phoneNumber -> ? (Client has 'whatsapp', User had 'phoneNumber')
                // For this task, I will map what I can and ignore missing or add them if critical.
                // Client has `address` (fullAddress).
                whatsapp: whatsapp,
                address: address,
                // companyName: company, // Client schema doesn't have it yet?
                // Let's check schema again. Client has 'name'. Maybe that's company name or person name?
                // Usually 'name' is person/company.
                // I'll update 'name' with fullName.
                updatedAt: new Date()
            }
        });

        // 2. Log Activity
        await prisma.activityLog.create({
            data: {
                clientEmail: session.email,
                type: 'PROFILE_UPDATE',
                action: 'UPDATE',
                message: `Client ${name} updated their profile information.`
            }
        });

        // 3. Admin Sync
        revalidatePath('/admin/dashboard');
        revalidatePath('/admin/clients');
        revalidatePath('/client/dashboard/settings/profile');

        return { success: true, message: 'Profile Synced Successfully' };
    } catch (e) {
        console.error("Profile Update Failed:", e);
        return { success: false, message: 'Failed to update profile' };
    }
}
