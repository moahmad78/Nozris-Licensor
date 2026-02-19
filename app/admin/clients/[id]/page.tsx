import { prisma } from '@/lib/db';
import { ShieldCheck, ShieldAlert, Activity, RefreshCw, Server, AlertTriangle, FileCode, CheckCircle, XCircle, Clock } from 'lucide-react';
import { toast } from 'sonner';
import { verifyKYCDocument } from '@/app/actions/admin-kyc';
// ClientDetailsClient import removed as logical is handled via Server Actions

// Server Component
export default async function ClientDetailsPage({ params }: { params: { id: string } }) {
    const client = await prisma.client.findUnique({
        where: { id: params.id },
        include: { kycDocuments: true, tamperEvents: true } // Fetch documents
    });

    if (!client) return <div>Client Not Found</div>;

    const license = await prisma.license.findFirst({
        where: { clientEmail: client.email }
    });

    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Client Command Center</h1>
                    <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">{client.domain}</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                    <span className="text-xs font-bold text-gray-400 block">STATUS</span>
                    <span className={`font-mono text-sm font-bold ${client.kycStatus === 'VERIFIED' ? 'text-green-600' : 'text-orange-500'}`}>
                        {client.kycStatus}
                    </span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* KYC REVIEW SECTION */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm md:col-span-2">
                    <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-600" /> Identity Verification
                    </h3>

                    {client.kycDocuments.length === 0 ? (
                        <div className="text-center p-8 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-400 font-bold">No Documents Uploaded</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {client.kycDocuments.map((doc: any) => (
                                <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                                    <div className="flex items-center gap-4">
                                        <div className="p-3 bg-white rounded-lg border border-gray-100 shadow-sm">
                                            <FileCode className="text-blue-500" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{doc.type}</p>
                                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                                Uploaded: {new Date(doc.uploadedAt).toLocaleDateString()}
                                            </p>

                                            {doc.status === 'APPROVED' && <span className="text-[10px] font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded uppercase mt-1 inline-block">Verified</span>}
                                            {doc.status === 'REJECTED' && <span className="text-[10px] font-bold text-red-600 bg-red-100 px-2 py-0.5 rounded uppercase mt-1 inline-block">Rejected</span>}
                                            {doc.status === 'PENDING' && <span className="text-[10px] font-bold text-amber-600 bg-amber-100 px-2 py-0.5 rounded uppercase mt-1 inline-block">Pending Review</span>}
                                        </div>
                                    </div>

                                    {doc.status === 'PENDING' && (
                                        <div className="flex gap-2">
                                            <form action={async () => {
                                                'use server';
                                                await verifyKYCDocument(doc.id, 'APPROVED');
                                            }}>
                                                <button className="p-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors" title="Approve">
                                                    <CheckCircle size={18} />
                                                </button>
                                            </form>

                                            <form action={async () => {
                                                'use server';
                                                await verifyKYCDocument(doc.id, 'REJECTED', 'Document Unclear/Invalid');
                                            }}>
                                                <button className="p-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors" title="Reject">
                                                    <XCircle size={18} />
                                                </button>
                                            </form>
                                        </div>
                                    )}

                                    <a href={doc.documentUrl} target="_blank" className="text-xs font-bold text-blue-600 hover:underline">
                                        View File
                                    </a>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                w
                {/* Quick Details */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                    <h3 className="font-bold text-gray-800 mb-4">Client Profile</h3>
                    <div className="space-y-3 text-sm">
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">Name</span>
                            <span className="font-bold">{client.name}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">Email</span>
                            <span className="font-bold">{client.email}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">WhatsApp</span>
                            <span className="font-bold">{client.whatsapp}</span>
                        </div>
                        <div className="flex justify-between border-b pb-2">
                            <span className="text-gray-500">Address</span>
                            <span className="font-bold max-w-[150px] truncate text-right">{client.address || 'N/A'}</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
