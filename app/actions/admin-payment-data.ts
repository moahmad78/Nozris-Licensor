'use server';

import { prisma } from '@/lib/db';

export async function getPendingPayments() {
    return await prisma.payment.findMany({
        where: { status: 'PENDING' },
        include: { license: true },
        orderBy: { createdAt: 'desc' }
    });
}

