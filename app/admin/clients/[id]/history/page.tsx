import { notFound, redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { getUnifiedHistory } from '@/app/actions/history';
import HistoryTimeline from '@/components/HistoryTimeline';

export default async function AdminClientHistoryPage({ params }: { params: { id: string } }) {
    // Await params as per Next.js App Router latest specs for dynamic routes (sometimes required)
    const { id } = await params;

    const client = await prisma.client.findUnique({
        where: { id }
    });

    if (!client) {
        notFound();
    }

    const history = await getUnifiedHistory(client.email);

    return (
        <div className="p-8 max-w-5xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Communication Vault</h1>
                <p className="text-gray-500 mt-2">
                    Full record for <span className="font-semibold text-gray-800">{client.name}</span> ({client.domain})
                </p>
                <div className="mt-4 flex gap-4 text-sm text-gray-400">
                    <p>Email: {client.email}</p>
                    <p>WhatsApp: {client.whatsapp}</p>
                </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-1">
                <HistoryTimeline events={history} title="Full History Record" />
            </div>
        </div>
    );
}
