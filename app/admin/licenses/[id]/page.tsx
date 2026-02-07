'use client';

import { useState, useEffect } from 'react';
import { updateLicenseDevSettings, getLicenseDetails } from '@/app/actions/license-actions';
import { Loader2, Code2, AlertTriangle, CheckCircle2, Save, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { TamperLogTable } from '@/components/security/tamper-log-table';
import IntegrityManager from '@/components/IntegrityManager';

export default function LicenseDetailPage({ params }: { params: { id: string } }) {
    const [license, setLicense] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [stagingDomain, setStagingDomain] = useState('');
    const [devMode, setDevMode] = useState(false);
    const [saving, setSaving] = useState(false);
    const router = useRouter();

    useEffect(() => {
        getLicenseDetails(params.id).then((l) => {
            if (l) {
                setLicense(l);
                setStagingDomain(l.stagingDomain || '');
                setDevMode(l.devModeUntil ? new Date(l.devModeUntil) > new Date() : false);
            }
            setLoading(false);
        });
    }, [params.id]);

    const handleSave = async () => {
        setSaving(true);
        const res = await updateLicenseDevSettings(params.id, stagingDomain, devMode);
        if (res.success) {
            toast.success("Developer Settings Updated");
            router.refresh();
        } else {
            toast.error("Update Failed");
        }
        setSaving(false);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="w-10 h-10 animate-spin text-gray-400" />
        </div>
    );

    if (!license) return <div>License not found</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 space-y-8">
            <Link href="/admin/licenses" className="flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors bg-white w-fit px-4 py-2 rounded-lg border border-gray-200 text-xs font-bold uppercase tracking-wider">
                <ArrowLeft className="w-4 h-4" /> Back to List
            </Link>

            <header className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-600">
                    <Code2 className="w-5 h-5" />
                    <span className="text-[10px] font-[1000] uppercase tracking-[0.4em]">Developer Control</span>
                </div>
                <h1 className="text-4xl font-[1000] tracking-tight uppercase italic text-gray-900">
                    License <span className="text-gray-400">#{license.licenseKey.slice(0, 8)}...</span>
                </h1>
            </header>

            <div className="max-w-2xl bg-white p-8 rounded-[2.5rem] shadow-sm border border-gray-100 space-y-8">
                {/* Replaced manual dev mode with IntegrityManager */}
                <div className="flex items-center gap-4 border-b border-gray-100 pb-8">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                        <Code2 className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black uppercase">Start Edit Session</h2>
                        <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Enable editing on client site</p>
                    </div>
                </div>

                <IntegrityManager
                    initialEditMode={license.editMode || false}
                    initialIsUnlimited={license.isUnlimited || false}
                    initialExpiry={license.editModeExpiry || null}
                />

                <div className="space-y-6 pt-8 border-t border-gray-100">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-500">Staging Domain</label>
                        <input
                            type="text"
                            value={stagingDomain}
                            onChange={(e) => setStagingDomain(e.target.value)}
                            placeholder="e.g., staging.client-site.com"
                            className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <p className="text-[10px] text-gray-400 font-medium">Secondary domain authorized for testing. Bypasses main domain check.</p>
                    </div>

                    <div className="pt-4">
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition-all flex items-center justify-center gap-2"
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                            Save Staging Settings
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-2xl mx-auto">
                <TamperLogTable licenseId={params.id} />
            </div>
        </div>
    );
}
