'use server';

import { prisma } from '@/lib/db';
import { revalidatePath } from 'next/cache';

export async function globalSiteLock(licenseKey: string) {
    try {
        // In a real scenario, this would set a flag in Redis or DB that the middleware checks
        // For now, we simulate the database update
        await prisma.license.update({
            where: {
                licenseKey: licenseKey
            },
            data: {
                status: 'LOCKED',
                // metadata: { lockdown_reason: 'PANIC_BUTTON_TRIGGERED' } // if schema supported
            }
        });

        // Set Cookie for Instant Middleware Block
        const { cookies } = await import('next/headers');
        cookies().set('site_status', 'LOCKED', {
            path: '/',
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24 * 365 // 1 Year Lock
        });

        console.log(`[CRITICAL] GLOBAL LOCKDOWN TRIGGERED FOR LICENSE: ${licenseKey}`);

        revalidatePath('/client/dashboard');
        return { success: true, message: 'SITE LOCKED DOWN. ALL ACCESS REVOKED.' };
    } catch (e) {
        return { success: false, message: 'Lockdown Failed. Contact Support.' };
    }
}
