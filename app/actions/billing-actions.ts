'use server';

import { prisma } from '@/lib/db';
import { getClientLicenseDetails } from './client-integration';

export async function getBillingDetails() {
    const meta = await getClientLicenseDetails();
    if (!meta || meta.key === 'NO_LICENSE_FOUND') return { license: null, history: [] };

    // 1. Fetch License (without billingHistory which is not in schema)
    const license = await prisma.license.findUnique({
        where: { licenseKey: meta.key },
        select: {
            id: true,
            licenseKey: true,
            domain: true,
            expiresAt: true,
            monthlyPrice: true,
            subscriptionStatus: true,
            clientEmail: true,
            lastPaymentDate: true
        }
    });

    if (!license) return { license: null, history: [] };

    // 2. Fetch Client to get billingHistory
    // Link via email since no direct relation exists
    const client = await prisma.client.findUnique({
        where: { email: license.clientEmail }
    });

    let history = [];
    try {
        if (client && client.billingHistory) {
            history = JSON.parse(client.billingHistory);
        }
    } catch (e) {
        history = [];
    }

    return { license, history };
}

