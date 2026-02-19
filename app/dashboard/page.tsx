import { NotificationBell } from '@/components/notification-bell';
import { EditLicenseModal } from '@/components/edit-license-modal';
import { DatePopup } from "@/components/date-popup";
import { prisma } from '@/lib/db';
import { License } from '@prisma/client';
import { Trash2, CheckCircle, XCircle, RefreshCw, Smartphone, CalendarClock, Power, Users, FileWarning, ShieldAlert, ArrowRight } from 'lucide-react';
import { createLicense, toggleStatus, deleteLicense } from '@/lib/actions'; // Server Actions
import { SearchInput, CopyButton, Toaster } from './components'; // Client Components
import { SignOutButton } from '@/components/ui/sign-out-button';
import { LicenseRenewalModal } from '@/components/license-renewal-modal';
import { checkHeartbeats } from '@/app/actions/anti-tamper';
import { TriangleAlert, ShieldAlert as AlertIcon } from 'lucide-react';

import Link from 'next/link';
import { getNotifications, getUnreadCount } from '@/app/actions/notification-actions';
import { getSupportAnalytics } from '@/app/actions/support-actions';
import { Star } from 'lucide-react';
import { SecurityCommandCenter } from '@/components/SecurityCommandCenter';

export default async function Dashboard(props: {
    searchParams: Promise<{ q?: string; status?: string }>;
}) {
    const searchParams = await props.searchParams;
    const analytics = await getSupportAnalytics();
    const query = searchParams.q || '';
    const status = searchParams.status;

    const now = new Date();

    // 1. Calculate Counts (Server Side)
    const totalLeads = await prisma.lead.count();
    const pendingLeads = await prisma.lead.count({ where: { status: 'PENDING' } });
    const pendingClients = await prisma.client.count({
        where: { NOT: { kycStatus: 'VERIFIED' } }
    });
    const pendingKYC = pendingLeads + pendingClients;

    const activeClients = await prisma.license.count({
        where: { status: 'ACTIVE', deletedAt: null, expiresAt: { gte: now } }
    });

    const expiredCount = await prisma.license.count({
        where: { OR: [{ expiresAt: { lt: now } }, { status: { not: 'ACTIVE' } }], deletedAt: null }
    });
    const blockedCount = await prisma.blockedIP.count({ where: { isBlocked: true } });
    const alertCount = expiredCount + blockedCount;

    // ... (Filter logic for table kept same for now, or adjusted if needed? 
    // The table shows Licenses, so current logic is fine for table. 
    // I only update the Cards above the table).

    // 2. Filter the List Data (Keep existing logic for license table)
    let whereClause: any = {
        deletedAt: null,
        OR: [
            { domain: { contains: query } },
            { clientEmail: { contains: query } },
            { licenseKey: { contains: query } },
        ],
    };

    if (status === 'active') {
        whereClause = { ...whereClause, validFrom: { lte: now }, expiresAt: { gte: now }, status: 'ACTIVE' };
    } else if (status === 'scheduled') {
        whereClause = { ...whereClause, validFrom: { gt: now } };
    } else if (status === 'expired') {
        whereClause = { ...whereClause, OR: [{ expiresAt: { lt: now } }, { status: { not: 'ACTIVE' } }] };
    }

    let licenses: License[] = [];
    try {
        licenses = await prisma.license.findMany({
            where: whereClause,
            orderBy: { createdAt: 'desc' },
        });
    } catch (error) {
        console.error("Failed to fetch licenses:", error);
    }

    // 3. Fetch Pending Renewal Requests
    const pendingRequests = await prisma.renewalRequest.findMany({
        where: { status: "PENDING" },
        orderBy: { createdAt: "desc" },
        take: 5
    });

    const target = { userId: 'Mohd-Ahmad' };
    const [notifs, unreadCount] = await Promise.all([
        getNotifications(target),
        getUnreadCount(target)
    ]);

    return (
        <>
            <Toaster />
            <div className="max-w-7xl mx-auto space-y-8">
                <header className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Dashboard</h2>
                        <div className="flex items-center gap-4 mt-1">
                            <nav className="flex gap-4">
                                <Link href="/dashboard" className="text-sm font-bold text-black border-b-2 border-black">Licensing</Link>
                                <Link href="/dashboard/clients" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">Client Directory</Link>
                                <Link href="/dashboard/leads" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">Leads</Link>
                                <Link href="/dashboard/kyc" className="text-sm font-medium text-gray-500 hover:text-black transition-colors">KYC Centre</Link>
                            </nav>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="w-full max-w-sm">
                            <SearchInput />
                        </div>
                        <NotificationBell
                            initialNotifications={JSON.parse(JSON.stringify(notifs))}
                            unreadCount={unreadCount}
                            target={target}
                        />
                        <div className="ml-2 pl-4 border-l border-gray-200">
                            <SignOutButton />
                        </div>
                    </div>
                </header>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <Card
                        title="Total Leads"
                        value={totalLeads}
                        icon={<Users className="w-5 h-5 text-blue-600" />}
                        href="/dashboard/leads"
                        isActive={false}
                    />
                    <Card
                        title="Pending KYC"
                        value={pendingKYC}
                        icon={<FileWarning className="w-5 h-5 text-yellow-600" />}
                        href="/dashboard/kyc"
                        isActive={pendingKYC > 0}
                        animatePulse={pendingKYC > 0}
                        colorClass="yellow"
                    />
                    <Card
                        title="Active Clients"
                        value={activeClients}
                        icon={<CheckCircle className="w-5 h-5 text-green-600" />}
                        href="/dashboard?status=active"
                        isActive={status === 'active'}
                    />
                    <Card
                        title="Support Rating"
                        value={analytics?.avgRating || 0}
                        suffix={`/ 5 (${analytics?.ratingCount || 0} reviews)`}
                        icon={<Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />}
                        href="/admin/support-center"
                        isActive={false}
                        colorClass="yellow"
                    />
                </div>

                {/* Security Command Center — Dark Cyber Section */}
                <div className="bg-[#050510] rounded-2xl p-6 border border-gray-800 -mx-2 shadow-xl">
                    <SecurityCommandCenter
                        licenses={licenses.map(l => ({
                            id: l.id,
                            domain: l.domain,
                            status: l.status,
                            lastChecked: l.lastChecked?.toISOString() || null,
                        }))}
                    />
                </div>

                {/* Tamper Alerts */}
                {licenses.filter(l => l.status === 'TAMPERED').length > 0 && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-6 space-y-4 animate-in fade-in slide-in-from-top-4 duration-500">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-red-600 text-white rounded-lg animate-pulse">
                                    <TriangleAlert className="w-5 h-5" />
                                </div>
                                <div>
                                    <h2 className="text-lg font-bold text-red-900 flex items-center gap-2">
                                        Tamper Alerts Detected! 🚨
                                    </h2>
                                    <p className="text-sm text-red-700">The following domains have removed the license code or attempted a security bypass.</p>
                                </div>
                            </div>
                            <form action={async () => {
                                'use server';
                                await checkHeartbeats();
                            }}>
                                <button className="text-xs font-bold text-red-800 hover:underline bg-red-100 px-3 py-1.5 rounded-lg border border-red-200">
                                    Re-scan All Domains
                                </button>
                            </form>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {licenses.filter(l => l.status === 'TAMPERED').map(l => (
                                <div key={l.id} className="bg-white border border-red-100 p-4 rounded-xl flex items-center justify-between shadow-sm">
                                    <div>
                                        <div className="font-bold text-gray-900 text-sm truncate max-w-[150px]">{l.domain}</div>
                                        <div className="text-[10px] text-gray-400 font-mono">{l.licenseKey}</div>
                                    </div>
                                    <Link
                                        href={`/dashboard/clients`}
                                        className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
                                    >
                                        <ArrowRight className="w-4 h-4" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {/* List */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="text-xl font-semibold">Licenses</h2>
                            <span className="text-xs text-gray-400">Showing {licenses.length} results</span>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm">
                                <thead className="bg-gray-50 text-gray-500">
                                    <tr>
                                        <th className="px-6 py-3 font-medium text-left w-[300px]">Details</th>
                                        <th className="px-6 py-3 font-medium text-left w-[150px]">Plan & Price</th>
                                        <th className="px-6 py-3 font-medium text-left w-[200px]">Status & Usage</th>
                                        <th className="px-6 py-3 font-medium text-left w-[200px]">Update</th>
                                        <th className="px-6 py-3 font-medium text-center w-[200px]">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {licenses.length === 0 && (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-8 text-center text-gray-400">No licenses found matching "{query}"{status ? ` with status "${status}"` : ''}.</td>
                                        </tr>
                                    )}
                                    {licenses.map((license) => {
                                        const isExpired = new Date() > license.expiresAt;
                                        const isSuspended = license.status !== 'ACTIVE';
                                        return (
                                            <tr key={license.id} className="hover:bg-gray-50 transition-colors group">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-gray-900">{license.domain}</div>
                                                    <div className="text-xs text-gray-500 mt-0.5">{license.clientEmail || 'No email'}</div>
                                                    <div className="flex items-center gap-2 mt-1">
                                                        <code className="text-xs text-gray-400 font-mono bg-gray-50 px-1 rounded truncate max-w-[120px]" title={license.licenseKey}>
                                                            {license.licenseKey}
                                                        </code>
                                                        <CopyButton text={license.licenseKey} />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900">{license.planName || 'Standard'}</div>
                                                    <div className="text-xs text-gray-500">₹{license.monthlyPrice}/mo</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <Badge status={isSuspended ? 'Suspended' : isExpired ? 'Expired' : new Date() < license.validFrom ? 'Scheduled' : 'Active'} />
                                                    </div>
                                                    <div className="text-xs text-gray-400">
                                                        <span>{new Date(license.validFrom).toLocaleDateString()}</span>
                                                        <span className="mx-1">-</span>
                                                        <span>{new Date(license.expiresAt).toLocaleDateString()}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-500">
                                                    <DatePopup date={license.updatedAt || license.createdAt} />
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <EditLicenseModal license={license} />
                                                        <LicenseRenewalModal licenseId={license.id} currentExpiresAt={license.expiresAt} />
                                                        <form action={toggleStatus.bind(null, license.id, license.status)}>
                                                            <button
                                                                title={license.status === 'ACTIVE' ? 'Suspend License' : 'Activate License'}
                                                                className={`p-2 rounded-md transition-colors ${license.status === 'ACTIVE'
                                                                    ? 'bg-green-50 text-green-600 hover:bg-red-50 hover:text-red-600'
                                                                    : 'bg-red-50 text-red-500 hover:bg-green-50 hover:text-green-600'
                                                                    }`}
                                                            >
                                                                <Power className="w-4 h-4" />
                                                            </button>
                                                        </form>
                                                        <form action={deleteLicense.bind(null, license.id)}>
                                                            <button title="Delete" className="p-2 hover:bg-red-50 rounded-md text-gray-400 hover:text-red-600">
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </form>
                                                    </div>
                                                </td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>


            </div>
        </>
    );
}

function Card({ title, value, icon, href, isActive, animatePulse = false, colorClass, suffix }: { title: string, value: number | string, icon: any, href: string, isActive: boolean, animatePulse?: boolean, colorClass?: string, suffix?: string }) {
    let baseBorder = "border-gray-100 hover:border-gray-300";
    if (isActive) baseBorder = "border-black ring-1 ring-black";
    if (colorClass === 'yellow' && animatePulse) baseBorder = "border-yellow-400 ring-2 ring-yellow-200 animate-pulse bg-yellow-50";
    if (colorClass === 'red') baseBorder = "border-red-200 bg-red-50";

    return (
        <Link
            href={href}
            className={`block bg-white p-6 rounded-xl shadow-sm border flex items-center justify-between transition-all ${baseBorder}`}
        >
            <div>
                <p className={`text-sm font-medium ${colorClass === 'yellow' ? 'text-yellow-700' : (colorClass === 'red' ? 'text-red-700' : 'text-gray-500')}`}>{title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">
                    {value}
                    {suffix && <span className="text-xs font-medium text-gray-400 ml-1">{suffix}</span>}
                </p>
            </div>
            <div className={`p-3 rounded-full ${colorClass === 'yellow' ? 'bg-yellow-100' : (colorClass === 'red' ? 'bg-red-100' : 'bg-gray-50')}`}>
                {icon}
            </div>
        </Link>
    );
}

function Badge({ status }: { status: string }) {
    const styles = {
        Active: 'bg-green-100 text-green-700',
        Expired: 'bg-amber-100 text-amber-700',
        Suspended: 'bg-red-100 text-red-700',
        Scheduled: 'bg-blue-100 text-blue-700',
        TAMPERED: 'bg-red-600 text-white font-black animate-pulse shadow-lg shadow-red-200',
        'ATTEMPTED CLONING': 'bg-red-800 text-white font-black animate-bounce shadow-xl shadow-red-500',
    }
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-600'}`}>{status}</span>
    );
}

