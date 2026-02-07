'use client';

import { generateCertificatePDF } from '@/lib/client-pdf';
import { NotificationBell } from '@/components/notification-bell';
import { Shield, Clock, CheckCircle, AlertTriangle, FileText, Download, User, MapPin, Smartphone, CreditCard, ShieldCheck, LogOut, AlertCircle, Calendar, LifeBuoy, MessageSquare } from 'lucide-react';
import { logoutClient } from '@/app/actions/client-auth';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast, Toaster } from 'sonner';
import { GlobalBanner } from '@/components/global-banner';
import { ExpiryTimer } from '@/components/expiry-timer';

export function ClientDashboardView({
    licenses,
    profile,
    userEmail,
    clientData,
    initialNotifications = [],
    unreadCount = 0,
    latestAnnouncement = null
}: {
    licenses: any[],
    profile: any,
    userEmail: string,
    clientData?: any,
    initialNotifications?: any[],
    unreadCount?: number,
    latestAnnouncement?: any
}) {
    const router = useRouter();

    const handleLogout = async () => {
        await logoutClient();
        router.push('/client/login');
    };

    const handleDownload = (license: any) => {
        const pdfData = {
            senderName: profile.fullName,
            senderEmail: profile.supportEmail,
            senderWhatsapp: profile.whatsappNumber,
            senderAddress: "Gorakhpur, UP",
            logo: profile.logo,

            clientName: "Valued Customer",
            // We can add more client details if available

            licenseKey: license.licenseKey,
            domain: license.domain,
            planName: license.planName,
            price: license.monthlyPrice,
            expiryDate: license.expiresAt
        };
        generateCertificatePDF(pdfData);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col">
            <GlobalBanner announcement={latestAnnouncement} />
            <Toaster position="bottom-right" />

            {/* Navbar */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="bg-black text-white p-1.5 rounded-lg">
                            <ShieldCheck className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-gray-900 text-lg hidden sm:block">Client Portal</span>
                        <div className="h-4 w-px bg-gray-200 mx-2 hidden sm:block"></div>
                        <Link href="/client/support" className="text-sm font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1.5 px-3 py-1.5 rounded-lg hover:bg-blue-50 transition-all">
                            <LifeBuoy className="w-4 h-4" />
                            Support
                        </Link>
                    </div>
                    <div className="flex items-center gap-4">
                        <NotificationBell
                            initialNotifications={initialNotifications}
                            unreadCount={unreadCount}
                            target={{ email: userEmail }}
                        />
                        <div className="text-right hidden sm:block">
                            <div className="text-sm font-medium text-gray-900">{clientData?.name || userEmail}</div>

                            {clientData?.kycStatus === 'VERIFIED' ? (
                                <div className="flex items-center gap-1 text-xs text-green-600 font-bold bg-green-50 px-2 py-0.5 rounded-full border border-green-100">
                                    <ShieldCheck className="w-3 h-3" />
                                    ✅ Fully Verified
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 text-xs text-yellow-600 font-bold bg-yellow-50 px-2 py-0.5 rounded-full border border-yellow-100 animate-pulse">
                                    <AlertTriangle className="w-3 h-3" />
                                    KYC Required
                                </div>
                            )}
                        </div>
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Logout"
                        >
                            <LogOut className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </header >

            {/* Content */}
            <main className="flex-1 max-w-7xl mx-auto px-4 py-8 w-full space-y-6">

                {/* KYC Notifications */}
                {clientData?.kycStatus === 'VERIFIED' ? (
                    <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-xl shadow-sm animate-in slide-in-from-top-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="bg-green-100 p-2 rounded-full">
                                    <ShieldCheck className="w-6 h-6 text-green-600" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-green-800">✅ Verification Successful!</h3>
                                    <p className="text-sm text-green-700">The Licensr Team has verified your documents. Your high-security license is now ACTIVE. 🛡️</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-bold border border-green-200">ACTIVE</span>
                            </div>
                        </div>
                    </div>
                ) : clientData?.kycStatus === 'SUBMITTED' ? (
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-r-xl shadow-sm animate-in slide-in-from-top-2">
                        <div className="flex items-center gap-3">
                            <AlertCircle className="w-6 h-6 text-blue-600" />
                            <div>
                                <h3 className="font-bold text-blue-800">Documents Submitted</h3>
                                <p className="text-sm text-blue-700">Our team is reviewing your KYC documents. We'll notify you once verified.</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-xl shadow-sm animate-in slide-in-from-top-2">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <AlertTriangle className="w-6 h-6 text-yellow-600" />
                                <div className="flex-1">
                                    <h3 className="font-bold text-yellow-800">Action Required: Complete Your KYC</h3>
                                    <p className="text-sm text-yellow-700">Your profile is incomplete. Verify your identity to ensure uninterrupted access.</p>
                                </div>
                            </div>
                            <button
                                onClick={() => window.location.href = '/client/kyc'}
                                className="bg-yellow-100 text-yellow-800 px-4 py-2 rounded-lg text-sm font-bold hover:bg-yellow-200 transition-colors"
                            >
                                Complete Now &rarr;
                            </button>
                        </div>
                    </div>
                )}

                {/* Real-time Expiry Watch (First Active License) */}
                {licenses.length > 0 && licenses[0].status === 'ACTIVE' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="md:col-span-1">
                            <ExpiryTimer expiryDate={licenses[0].expiresAt} label="Primary License Clock" />
                        </div>
                    </div>
                )}

                {/* Search & Filter */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Your Licenses</h1>
                        <p className="text-gray-500 mt-1">Manage subscriptions and download authorized certificates.</p>
                    </div>
                    <div className="flex gap-2">
                        {/* Summary Stats or Actions */}
                    </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Domain / Key</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Plan Details</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Expiry</th>
                                    <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {licenses.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="py-12 text-center text-gray-500">
                                            No licenses found for your account.
                                        </td>
                                    </tr>
                                ) : (
                                    licenses.map((license) => {
                                        const isExpired = new Date(license.expiresAt) < new Date();
                                        const isActive = license.status === 'ACTIVE' && !isExpired;

                                        return (
                                            <tr key={license.id} className="hover:bg-gray-50 transition-colors">
                                                <td className="py-4 px-6">
                                                    <div className="font-medium text-gray-900">{license.domain}</div>
                                                    <code className="text-xs font-mono text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded mt-1 inline-block">
                                                        {license.licenseKey}
                                                    </code>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="text-sm text-gray-900">{license.planName}</div>
                                                    <div className="text-xs text-gray-500">₹{license.monthlyPrice}/mo</div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold
                                                        ${license.status === 'TAMPERED' ? 'bg-red-600 text-white animate-pulse' : isActive ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}
                                                    `}>
                                                        {license.status === 'TAMPERED' ? <AlertTriangle className="w-3 h-3" /> : isActive ? <ShieldCheck className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                                                        {license.status === 'TAMPERED' ? 'BREACHED / CODE MISSING' : isActive ? 'ACTIVE' : 'EXPIRED'}
                                                    </span>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                                        <Calendar className="w-4 h-4 text-gray-400" />
                                                        {new Date(license.expiresAt).toLocaleDateString()}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-right">
                                                    {isActive ? (
                                                        <div className="flex items-center justify-end gap-2">
                                                            {clientData?.kycStatus === 'VERIFIED' && (
                                                                <button
                                                                    onClick={() => handleDownload(license)}
                                                                    className="inline-flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm"
                                                                >
                                                                    <FileText className="w-4 h-4 text-green-400" />
                                                                    Certificate
                                                                </button>
                                                            )}
                                                            <button
                                                                onClick={() => handleDownload(license)}
                                                                className="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 hover:text-black transition-colors"
                                                            >
                                                                <Download className="w-4 h-4" />
                                                                Invoice
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <a
                                                            href={`/renew?domain=${license.domain}`}
                                                            className="inline-flex items-center gap-2 px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors shadow-sm"
                                                        >
                                                            <CreditCard className="w-4 h-4" />
                                                            Renew
                                                        </a>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 border border-blue-100 p-6 rounded-xl flex items-start gap-4">
                        <div className="p-3 bg-white rounded-lg shadow-sm">
                            <ShieldCheck className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="font-bold text-gray-900">Secure Access</h3>
                            <p className="text-sm text-gray-600 mt-1">Your data is encrypted and secure. Access logs are monitored.</p>
                        </div>
                    </div>
                    {/* More cards... */}
                </div>

            </main>
        </div >
    );
}
