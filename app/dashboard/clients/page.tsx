import { prisma } from '@/lib/db';
import Link from 'next/link';
import { User, Globe, Shield, Calendar, Search, Users, ArrowRight } from 'lucide-react';
import { ExportButton } from './export-button';

export default async function ClientsPage({
    searchParams
}: {
    searchParams: { q?: string }
}) {
    const query = searchParams.q || '';

    // Fetch clients and their licenses to calculate revenue
    const clients = await prisma.client.findMany({
        where: query ? {
            OR: [
                { name: { contains: query, mode: 'insensitive' } },
                { email: { contains: query, mode: 'insensitive' } },
                { domain: { contains: query, mode: 'insensitive' } }
            ]
        } : {},
        // Since we don't have a direct relation in schema (clientEmail is used), 
        // we'll fetch them separately or use a join if we had relations.
        // But let's fetch all licenses and map them.
        orderBy: { createdAt: 'desc' }
    });

    const allLicenses = await prisma.license.findMany();

    const exportData = clients.map((client: any) => {
        const clientLicenses = allLicenses.filter((l: any) => l.clientEmail === client.email);
        const totalRevenue = clientLicenses.reduce((acc: number, curr: any) => acc + curr.monthlyPrice, 0);

        return {
            "Name": client.name,
            "Authorized Domain": client.domain,
            "Email": client.email,
            "WhatsApp": client.whatsapp,
            "KYC Status": client.kycStatus,
            "Total Revenue (₹)": totalRevenue,
            "Relationship Start": new Date(client.createdAt).toLocaleDateString()
        };
    });

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-900">
                        <Users className="w-6 h-6 text-blue-600" />
                        Client Directory
                    </h1>
                    <p className="text-gray-500">Manage your relationship and history with every client.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    <form action="/dashboard/clients" method="GET" className="flex bg-white border border-gray-200 rounded-xl px-4 py-2 items-center gap-2 w-full md:w-80 shadow-sm focus-within:ring-2 focus-within:ring-blue-100 transition-all">
                        <Search className="w-4 h-4 text-gray-400" />
                        <input
                            name="q"
                            type="text"
                            defaultValue={query}
                            placeholder="Search by name, email, domain..."
                            className="text-sm outline-none w-full bg-transparent"
                        />
                        {query && (
                            <Link href="/dashboard/clients" className="text-xs text-gray-400 hover:text-black">Clear</Link>
                        )}
                    </form>
                    <ExportButton
                        data={exportData}
                        filename="Voomet_Clients_List"
                        label="Export All Clients"
                    />
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {clients.length === 0 ? (
                    <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <Search className="w-8 h-8 text-gray-300" />
                        </div>
                        <h3 className="font-bold text-gray-900">No clients found</h3>
                        <p className="text-sm text-gray-500 mt-1">Try adjusting your search query or clear the filter.</p>
                        <Link href="/dashboard/clients" className="text-blue-600 text-sm font-bold mt-4 inline-block">View all clients</Link>
                    </div>
                ) : (
                    clients.map((client: any) => {
                        const clientLicenses = allLicenses.filter((l: any) => l.clientEmail === client.email);
                        return (
                            <Link
                                key={client.id}
                                href={`/dashboard/clients/${client.id}`}
                                className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group"
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center font-bold text-lg border border-blue-100 uppercase">
                                        {client.name.charAt(0)}
                                    </div>
                                    {clientLicenses.some((l: any) => l.status === 'TERMINATED') ? (
                                        <span className="px-2 py-1 rounded-lg text-[10px] font-black bg-red-600 text-white border border-red-700 uppercase tracking-wider animate-pulse">
                                            TERMINATED
                                        </span>
                                    ) : (
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold border uppercase tracking-wider
                                            ${client.kycStatus === 'VERIFIED' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'}
                                        `}>
                                            {client.kycStatus}
                                        </span>
                                    )}
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{client.name}</h3>
                                    <p className="text-xs text-gray-500 truncate">{client.email}</p>
                                </div>
                                <div className="mt-4 pt-4 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-[11px] text-gray-400 font-medium">
                                        <Globe className="w-3.5 h-3.5" />
                                        {client.domain}
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-300 group-hover:text-black group-hover:translate-x-1 transition-all" />
                                </div>
                            </Link>
                        );
                    })
                )}
            </div>
        </div>
    );
}

