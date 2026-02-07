import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import {
    User, Shield, Globe, Calendar, CreditCard,
    ChevronLeft, FileText, ArrowRight, AlertCircle,
    CheckCircle, MessageCircle, Clock, ExternalLink,
    TrendingUp, History, AlertTriangle, Power, RotateCcw
} from 'lucide-react';
import Link from 'next/link';
import { AdminNotesEditor } from '../notes-editor';
import { getClientHistory } from '@/app/actions/activity';
import { ExportButton } from '../export-button';
import { terminateClientAccount, restoreClientAccount } from '@/lib/actions';

export default async function ClientDetailPage({ params }: { params: { id: string } }) {
    const client = await prisma.client.findUnique({
        where: { id: params.id }
    });

    if (!client) notFound();

    // Fetch related data
    const licenses = await prisma.license.findMany({
        where: { clientEmail: client.email },
        orderBy: { createdAt: 'desc' }
    });

    const activities = await getClientHistory(client.email);

    // Prepare Detailed Export Data
    const detailedHistory = [
        ...licenses.map(l => ({
            "Event Date": new Date(l.createdAt).toLocaleString(),
            "Type": "LICENSE_ISSUED",
            "Plan": l.planName,
            "Price (₹)": l.monthlyPrice,
            "License Key": l.licenseKey,
            "Expiry Date": new Date(l.expiresAt).toLocaleDateString(),
            "Details": `Issued for ${l.domain}`
        })),
        ...activities.filter(a => a.type === 'CRITICAL' || a.action.includes('BLOCK')).map(a => ({
            "Event Date": new Date(a.createdAt).toLocaleString(),
            "Type": "SECURITY_EVENT",
            "Plan": "-",
            "Price (₹)": 0,
            "License Key": "-",
            "Expiry Date": "-",
            "Details": a.message
        }))
    ].sort((a, b) => new Date(b["Event Date"]).getTime() - new Date(a["Event Date"]).getTime());

    // Stats calculation
    const totalSpent = licenses.reduce((acc, curr) => acc + curr.monthlyPrice, 0); // Need real invoice table for precision, using plan price as proxy
    const joinDate = new Date(client.createdAt);
    const daysSince = Math.floor((new Date().getTime() - joinDate.getTime()) / (1000 * 3600 * 24));

    return (
        <div className="max-w-5xl mx-auto space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <Link
                    href="/dashboard/clients"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-black transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Back to Directory
                </Link>
                <div className="text-right">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest
                        ${client.kycStatus === 'VERIFIED' ? 'bg-green-50 text-green-700 border-green-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'}
                    `}>
                        {client.kycStatus}
                    </span>
                </div>
            </div>

            {/* Profile Overview Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gray-900 h-24 w-full relative">
                    <div className="absolute -bottom-12 left-8 w-24 h-24 rounded-2xl bg-white border-4 border-white shadow-lg overflow-hidden flex items-center justify-center">
                        {client.profilePhoto ? (
                            <img src={client.profilePhoto} alt={client.name} className="w-full h-full object-cover" />
                        ) : (
                            <User className="w-10 h-10 text-gray-300" />
                        )}
                    </div>
                </div>
                <div className="pt-16 pb-8 px-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">{client.name}</h1>
                        <p className="text-gray-500 flex items-center gap-2 mt-1">
                            <Globe className="w-4 h-4" />
                            {client.domain}
                        </p>
                    </div>
                    <div className="flex items-center gap-3">
                        <ExportButton
                            variant="secondary"
                            data={detailedHistory}
                            filename={`History_${client.name.replace(/\s+/g, '_')}`}
                            label="Export History"
                        />
                        <a
                            href={`https://wa.me/${client.whatsapp.replace(/\D/g, '')}`}
                            target="_blank"
                            className="inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 border border-green-200 rounded-xl text-sm font-bold hover:bg-green-100 transition-all"
                        >
                            <MessageCircle className="w-4 h-4" />
                            WhatsApp Client
                        </a>
                        <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-all">
                            <Calendar className="w-5 h-5 text-gray-400" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                        <TrendingUp className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">₹{totalSpent.toLocaleString()}</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                        <Clock className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Client Since</p>
                        <p className="text-2xl font-bold text-gray-900">{daysSince} Days</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Active Licenses</p>
                        <p className="text-2xl font-bold text-gray-900">{licenses.filter(l => l.status === 'ACTIVE').length}</p>
                    </div>
                </div>
            </div>

            {/* Details Split */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Timeline & Notes */}
                <div className="lg:col-span-2 space-y-8">

                    {/* Timeline */}
                    <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-8">
                            <History className="w-5 h-5 text-gray-400" />
                            A-to-Z Relationship Timeline
                        </h3>

                        <div className="relative space-y-8">
                            <div className="absolute left-4 top-2 bottom-2 w-px bg-gray-100"></div>

                            {/* onboarding event inferred from creation date */}
                            <div className="relative pl-12">
                                <div className="absolute left-2.5 top-0 w-3 h-3 rounded-full bg-blue-500 border-4 border-blue-100"></div>
                                <div>
                                    <p className="text-sm font-bold text-gray-900">Application Received (Onboarding)</p>
                                    <p className="text-xs text-gray-500 mt-1">Client submitted "Get Started" form for domain {client.domain}.</p>
                                    <p className="text-[10px] text-gray-400 font-medium mt-2 uppercase tracking-widest">{new Date(client.createdAt).toLocaleString()}</p>
                                </div>
                            </div>

                            {/* Map recorded activities */}
                            {activities.map((activity, idx) => (
                                <div key={activity.id} className="relative pl-12">
                                    <div className={`absolute left-2.5 top-0 w-3 h-3 rounded-full border-4
                                        ${activity.type === 'CRITICAL' ? 'bg-red-500 border-red-100' :
                                            activity.type === 'ACTION' ? 'bg-green-500 border-green-100' :
                                                'bg-gray-400 border-gray-100'}
                                    `}></div>
                                    <div>
                                        <p className="text-sm font-bold text-gray-900 uppercase tracking-tight">{activity.action.replace(/_/g, ' ')}</p>
                                        <p className="text-xs text-gray-500 mt-1">{activity.message}</p>
                                        <p className="text-[10px] text-gray-400 font-medium mt-2 uppercase tracking-widest">{new Date(activity.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}

                            {/* Subscription History */}
                            {licenses.map(license => (
                                <div key={license.id} className="relative pl-12">
                                    <div className="absolute left-2.5 top-0 w-3 h-3 rounded-full bg-black border-4 border-gray-200"></div>
                                    <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                        <p className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                            <CreditCard className="w-4 h-4 text-gray-400" />
                                            License Issued: {license.planName}
                                        </p>
                                        <div className="grid grid-cols-2 gap-4 mt-2">
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">License Key</p>
                                                <code className="text-xs text-gray-600">{license.licenseKey}</code>
                                            </div>
                                            <div>
                                                <p className="text-[10px] text-gray-400 font-bold uppercase">Status</p>
                                                <p className="text-xs font-bold text-blue-600">{license.status}</p>
                                            </div>
                                        </div>
                                        <p className="text-[10px] text-gray-400 font-medium mt-3 uppercase tracking-widest">{new Date(license.createdAt).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <AdminNotesEditor clientId={client.id} initialNotes={client.adminNotes || ''} />
                </div>

                {/* Right Column: Files & Actions */}
                <div className="space-y-8">

                    {/* Document Vault */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-900 flex items-center gap-2 mb-6">
                            <FileText className="w-5 h-5 text-gray-400" />
                            Document Vault
                        </h3>
                        <div className="space-y-3">
                            {client.documentUrl ? (
                                <a
                                    href={client.documentUrl}
                                    target="_blank"
                                    className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-all">
                                            <FileText className="w-4 h-4" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-bold text-gray-900 uppercase">Aadhar Card / KYC</p>
                                            <p className="text-[10px] text-gray-400">Verified identity document</p>
                                        </div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-black" />
                                </a>
                            ) : (
                                <div className="text-center py-6 border-2 border-dashed border-gray-100 rounded-xl">
                                    <AlertCircle className="w-6 h-6 text-gray-300 mx-auto" />
                                    <p className="text-[10px] text-gray-400 font-bold uppercase mt-2">No KYC File Uploaded</p>
                                </div>
                            )}

                            {client.profilePhoto && (
                                <a
                                    href={client.profilePhoto}
                                    target="_blank"
                                    className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition-all">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <div className="text-left">
                                            <p className="text-xs font-bold text-gray-900 uppercase">Profile Photo</p>
                                            <p className="text-[10px] text-gray-400">Client display picture</p>
                                        </div>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-gray-300 group-hover:text-black" />
                                </a>
                            )}
                        </div>
                    </div>

                    {/* KYC Info Summary */}
                    <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl">
                        <h3 className="font-bold flex items-center gap-2 mb-6">
                            <Shield className="w-5 h-5 text-blue-400" />
                            KYC Details
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Aadhar Number</p>
                                <p className="text-sm font-medium">{client.aadharNumber || "Not provided"}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Contact WhatsApp</p>
                                <p className="text-sm font-medium">{client.whatsapp}</p>
                            </div>
                            <div>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Communication Address</p>
                                <p className="text-sm text-gray-300 leading-relaxed truncate-3-lines">{client.address || "Not provided"}</p>
                            </div>
                        </div>
                    </div>

                    {/* Danger Zone: Termination Control */}
                    <div className="bg-red-50 border border-red-100 p-6 rounded-2xl space-y-4 shadow-sm">
                        <div className="flex items-center gap-3 text-red-600">
                            <AlertTriangle className="w-5 h-5" />
                            <h3 className="font-bold">Security Control Center</h3>
                        </div>

                        <div className="p-3 bg-white rounded-xl border border-red-100 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Tamper Attempts</p>
                                <p className={`text-xl font-black ${client.tamperCount >= 3 ? 'text-red-600 animate-pulse' : 'text-gray-900'}`}>
                                    {client.tamperCount} / 3
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Status</p>
                                <p className={`text-xs font-bold ${licenses.some(l => l.status === 'TERMINATED') ? 'text-red-600' : 'text-green-600'}`}>
                                    {licenses.some(l => l.status === 'TERMINATED') ? 'TERMINATED' : 'In Good Standing'}
                                </p>
                            </div>
                        </div>

                        {licenses.some(l => l.status === 'TERMINATED') ? (
                            <form action={async () => {
                                'use server';
                                await restoreClientAccount(client.email);
                            }}>
                                <button className="w-full py-3 bg-black text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 transition-all shadow-md">
                                    <RotateCcw className="w-4 h-4" />
                                    Restore Account
                                </button>
                            </form>
                        ) : (
                            client.tamperCount >= 3 && (
                                <form action={async () => {
                                    'use server';
                                    await terminateClientAccount(client.email);
                                }}>
                                    <button className="w-full py-3 bg-red-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-md">
                                        <Power className="w-4 h-4" />
                                        Terminate Account
                                    </button>
                                </form>
                            )
                        )}

                        <p className="text-[10px] text-center text-gray-400 font-medium">
                            {client.tamperCount < 3
                                ? "Termination option will unlock if client hits 3 tamper attempts."
                                : "Excessive tampering detected. You can now terminate this account."}
                        </p>
                    </div>

                </div>
            </div>
        </div>
    );
}
