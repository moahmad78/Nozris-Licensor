'use client';

import { useState, useEffect } from 'react';
import {
    Plus, Search, ShieldCheck, Clock,
    Copy, MoreVertical, Ban, Trash2,
    ChevronDown, AlertTriangle, Loader2
} from 'lucide-react';
import { toast } from 'sonner';
import { getLicenses, createManualLicense, revokeLicense, getAllClients } from '@/app/actions/license-actions';
import { useSearchParams } from 'next/navigation';
import { pusherClient } from '@/lib/pusher-client';

export default function LicenseHub() {
    const searchParams = useSearchParams();
    const [licenses, setLicenses] = useState<any[]>([]);
    const [clients, setClients] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState(searchParams.get('filter') || 'all');

    // Form State
    const [formData, setFormData] = useState({
        clientEmail: '',
        domain: '',
        expiresAt: ''
    });
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        const loadInitial = async () => {
            const [l, c] = await Promise.all([getLicenses(), getAllClients()]);
            setLicenses(l);
            setClients(c);
            setLoading(false);
        };
        loadInitial();

        // Zero-Refresh Pusher Listener
        const channel = pusherClient.subscribe('license-update');
        channel.bind('new', (newLicense: any) => {
            setLicenses(prev => [newLicense, ...prev]);
        });
        channel.bind('revoked', ({ id }: { id: string }) => {
            setLicenses(prev => prev.map(l => l.id === id ? { ...l, status: 'SUSPENDED' } : l));
        });

        return () => {
            pusherClient.unsubscribe('license-update');
        };
    }, []);

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        const res = await createManualLicense(formData);
        if (res.success) {
            toast.success("License Key Generated!");
            setFormData({ clientEmail: '', domain: '', expiresAt: '' });
        } else {
            toast.error(res.error || "Failed to generate");
        }
        setSubmitting(false);
    };

    const handleRevoke = async (id: string) => {
        const previousState = [...licenses];

        // Optimistic UI Update
        setLicenses(prev => prev.map(l => l.id === id ? { ...l, status: 'SUSPENDED' } : l));
        toast.info("Processing revocation...");

        try {
            const res = await revokeLicense(id);
            if (!res.success) throw new Error(res.error);
            toast.success("License revoked successfully.");
        } catch (err: any) {
            // Rollback
            setLicenses(previousState);
            toast.error(err.message || "Failed to revoke. Connection error.");
        }
    };

    const copyKey = (key: string) => {
        navigator.clipboard.writeText(key);
        toast.success("Key copied to clipboard!");
    };

    const getDaysRemaining = (expiry: Date) => {
        const diff = new Date(expiry).getTime() - new Date().getTime();
        return Math.ceil(diff / (1000 * 60 * 60 * 24));
    };

    const filteredLicenses = licenses.filter(l => {
        const matchesSearch = l.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
            l.clientEmail.toLowerCase().includes(searchTerm.toLowerCase());

        if (filter === 'expiring') {
            const days = getDaysRemaining(l.expiresAt);
            return matchesSearch && days <= 7 && days > 0 && l.status === 'ACTIVE';
        }
        if (filter === 'expired') {
            const days = getDaysRemaining(l.expiresAt);
            return matchesSearch && (days <= 0 || l.status === 'SUSPENDED');
        }
        return matchesSearch;
    });

    if (loading) return <div className="h-[80vh] flex items-center justify-center"><Loader2 className="w-10 h-10 animate-spin text-gray-200" /></div>;

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-20 animate-in fade-in duration-700">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 px-4">
                <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 mb-2 underline decoration-blue-600 decoration-4 underline-offset-8">LICENSE COMMAND</h1>
                    <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Total Security Issuance & Management Hub</p>
                </div>

                <div className="flex items-center gap-3">
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        <input
                            type="text"
                            placeholder="Search Domain or Client..."
                            className="bg-white border-2 border-gray-100 rounded-2xl py-3 pl-12 pr-6 text-sm font-bold w-full md:w-80 shadow-sm focus:border-blue-600 focus:ring-0 transition-all outline-none"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="bg-black text-white px-6 py-3 rounded-2xl text-xs font-black uppercase tracking-widest border-none focus:ring-2 focus:ring-blue-600 cursor-pointer"
                    >
                        <option value="all">Live (All)</option>
                        <option value="expiring">⚠️ Expiring Soon</option>
                        <option value="expired">🚫 Expired/Revoked</option>
                    </select>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* Generation Panel */}
                <div className="lg:col-span-1">
                    <div className="bg-gray-900 p-8 rounded-[2.5rem] shadow-2xl sticky top-8 border-t-4 border-blue-600">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="bg-blue-600 p-2 rounded-xl"><Plus className="w-4 h-4 text-white" /></div>
                            <h2 className="text-white font-black tracking-tight">MANUAL ISSUE</h2>
                        </div>

                        <form onSubmit={handleGenerate} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">Select Client</label>
                                <select
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm font-bold focus:bg-white/10 focus:border-blue-600 transition-all outline-none appearance-none"
                                    value={formData.clientEmail}
                                    onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                                >
                                    <option value="" className="bg-gray-900">Choose Client...</option>
                                    {clients.map(c => (
                                        <option key={c.id} value={c.email} className="bg-gray-900">{c.name} ({c.domain})</option>
                                    ))}
                                </select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">Authorization Domain</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="example.com"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm font-bold focus:bg-white/10 focus:border-blue-600 transition-all outline-none"
                                    value={formData.domain}
                                    onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 ml-2">Expiry Date</label>
                                <input
                                    type="date"
                                    required
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white text-sm font-bold focus:bg-white/10 focus:border-blue-600 transition-all outline-none"
                                    value={formData.expiresAt}
                                    onChange={(e) => setFormData({ ...formData, expiresAt: e.target.value })}
                                />
                            </div>

                            <button
                                disabled={submitting}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl transition-all shadow-lg shadow-blue-600/20 active:scale-95 flex items-center justify-center gap-2"
                            >
                                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>ISSUE SYSTEM KEY <ShieldCheck className="w-5 h-5" /></>}
                            </button>
                        </form>
                    </div>
                </div>

                {/* Table Panel */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-[3rem] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="bg-gray-50/50 border-b border-gray-100">
                                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Target / Key</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Client Info</th>
                                    <th className="px-8 py-6 text-left text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Lifecycle</th>
                                    <th className="px-8 py-6 text-right text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {filteredLicenses.map(l => {
                                    const days = getDaysRemaining(l.expiresAt);
                                    const isCritical = days <= 3 && l.status === 'ACTIVE';
                                    const isWarning = days <= 7 && days > 3 && l.status === 'ACTIVE';
                                    const isInactive = l.status !== 'ACTIVE' || days <= 0;

                                    return (
                                        <tr
                                            key={l.id}
                                            className={`group transition-colors ${isCritical ? 'bg-red-50/50 hover:bg-red-50' :
                                                    isWarning ? 'bg-amber-50/50 hover:bg-amber-50' :
                                                        'hover:bg-gray-50/50'
                                                }`}
                                        >
                                            <td className="px-8 py-6">
                                                <div className="font-black text-gray-900 mb-1">{l.domain.toUpperCase()}</div>
                                                <div className="flex items-center gap-2 font-mono text-[10px] text-gray-400 bg-gray-50 w-fit px-2 py-1 rounded-md border border-gray-100">
                                                    {l.licenseKey}
                                                    <button onClick={() => copyKey(l.licenseKey)}><Copy className="w-3 h-3 hover:text-blue-600 transition-colors" /></button>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className="text-xs font-bold text-gray-700">{l.clientEmail}</div>
                                                <div className="text-[10px] font-medium text-gray-400">Authorized: {new Date(l.createdAt).toLocaleDateString()}</div>
                                            </td>
                                            <td className="px-8 py-6">
                                                <div className={`p-3 rounded-2xl border flex items-center gap-2 w-fit ${isCritical ? 'bg-red-50 text-red-700 border-red-200 animate-pulse' :
                                                        isWarning ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                            isInactive ? 'bg-gray-50 text-gray-400 border-gray-100' :
                                                                'bg-white border-gray-100 text-emerald-600'
                                                    }`}>
                                                    <Clock className="w-3.5 h-3.5" />
                                                    <span className="text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                                                        {l.status === 'SUSPENDED' ? 'Revoked' :
                                                            days <= 0 ? 'Expired' :
                                                                `Expires in ${days}d`}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-8 py-6 text-right">
                                                <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {l.status === 'ACTIVE' && (
                                                        <button
                                                            onClick={() => handleRevoke(l.id)}
                                                            className="p-3 bg-red-50 text-red-600 rounded-xl hover:bg-red-600 hover:text-white transition-all shadow-sm"
                                                            title="Revoke Immediately"
                                                        >
                                                            <Ban className="w-4 h-4" />
                                                        </button>
                                                    )}
                                                    <button className="p-3 bg-gray-50 text-gray-400 rounded-xl hover:bg-gray-900 hover:text-white transition-all shadow-sm">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        {filteredLicenses.length === 0 && (
                            <div className="p-20 text-center text-gray-300">
                                <AlertTriangle className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                <p className="font-bold uppercase tracking-widest text-xs">No licenses matching selection.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
