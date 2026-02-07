'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { verifyToken } from '@/lib/client-auth-token';
import { prisma } from '@/lib/prisma';
import { KYCForm } from './kyc-form';

export default async function KYCPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('client_session')?.value;

    if (!token) redirect('/client/login');
    const decoded = verifyToken(token);
    if (!decoded) redirect('/client/login');

    const client = await prisma.client.findUnique({
        where: { email: decoded.email }
    });

    if (!client) redirect('/client/login');

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-3xl w-full">
                <KYCForm client={client} />
            </div>
        </div>
    );
}
