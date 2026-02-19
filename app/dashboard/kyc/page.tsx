import { prisma } from '@/lib/db';
import { KYCTable } from './kyc-table';
import { ShieldAlert } from 'lucide-react';
import { ReminderTrigger } from './reminder-trigger';

export default async function KYCAdminPage() {
    const pendingClients = await prisma.client.findMany({
        where: { NOT: { kycStatus: 'VERIFIED' } },
        orderBy: { updatedAt: 'desc' }
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2">
                        <ShieldAlert className="w-6 h-6 text-yellow-500" />
                        KYC Verification Centre
                    </h1>
                    <p className="text-gray-500">Review pending client verifications.</p>
                </div>
                <ReminderTrigger />
            </header>
            <KYCTable clients={JSON.parse(JSON.stringify(pendingClients))} />
        </div>
    );
}

