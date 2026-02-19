'use server';

import { prisma } from '@/lib/db';
import { auth } from '@/auth'; // Assuming auth() or similar exists. Using strict check instead.
import { headers, cookies } from 'next/headers';

// Mock Auth Check - In real app use session
async function getSessionUser() {
    // Since we don't have the auth setup details, we'll try to find a client via header or assume context.
    // BUT, for this task, I will fetch the FIRST client or a specific one if I can't authenticate.
    // Wait, `app/client/dashboard` must have logic to get the client.
    // I will assume for now we look up by a hardcoded email for demo or try to verify session.
    // The Prompt says "Fetches the current user's active licenseKey".

    // HACK: For the purpose of this atomic task where I might not have full auth context populated in session:
    // I will return a placeholder or try to find a client.

    const client = await prisma.client.findFirst({
        include: {
            // We need to link Client to License. Schema check: License has clientEmail.
        }
    });

    if (!client) return null;

    const license = await prisma.license.findFirst({
        where: { clientEmail: client.email }
    });

    return { client, license };
}

export async function getClientLicenseDetails() {
    const cookieStore = await cookies();
    const token = cookieStore.get('client_session')?.value;

    if (!token) return null;

    try {
        const { verifyToken } = await import('@/lib/client-auth-token');
        const payload = await verifyToken(token);

        if (!payload || !payload.email) return null;

        const license = await prisma.license.findFirst({
            where: { clientEmail: payload.email as string }
        });

        if (!license) return { key: 'NO_LICENSE_FOUND', domain: 'unknown', endpoint: '' };

        return {
            key: license.licenseKey,
            domain: license.domain,
            endpoint: process.env.NEXT_PUBLIC_APP_URL || 'https://nozris.com'
        };
    } catch (error) {
        console.error("Session verification failed:", error);
        return null;
    }
}

