'use server';

import { prisma } from '@/lib/prisma';

export async function getPendingPayments() {
    return await prisma.payment.findMany({
        where: { status: 'PENDING' },
        include: { license: true },
        orderBy: { createdAt: 'desc' }
    });
}
