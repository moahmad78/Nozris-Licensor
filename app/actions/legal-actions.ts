'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function getPolicy(type: 'TERMS' | 'PRIVACY' | 'REFUND') {
    try {
        const policy = await prisma.legalPolicy.findUnique({
            where: { type }
        });
        return policy;
    } catch (error) {
        console.error("Get Policy Error:", error);
        return null;
    }
}

export async function updatePolicy(type: 'TERMS' | 'PRIVACY' | 'REFUND', content: string) {
    try {
        const policy = await prisma.legalPolicy.upsert({
            where: { type },
            update: { content, updatedAt: new Date() },
            create: { type, content }
        });

        // Revalidate public pages
        if (type === 'TERMS') revalidatePath('/terms-of-service');
        if (type === 'PRIVACY') revalidatePath('/privacy-policy');
        if (type === 'REFUND') revalidatePath('/refund-policy');

        revalidatePath('/admin/legal');
        return { success: true, policy };
    } catch (error) {
        console.error("Update Policy Error:", error);
        return { error: "Failed to update policy" };
    }
}

