import { useState, useEffect } from 'react';
import { toggleEditMode, syncAndLock, getIntegrityStatus } from '@/app/actions/integrity-actions';
import { triggerCloudRestore } from '@/app/actions/restore-actions';
import { Lock, Unlock, RefreshCw, AlertTriangle, CheckCircle2, Cloud } from 'lucide-react';
import { toast } from 'sonner';

export function IntegrityManager() {
    const [status, setStatus] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const refresh = () => {
        getIntegrityStatus().then(setStatus);
    };

    useEffect(() => { refresh(); }, []);

    const handleToggle = async () => {
        setLoading(true);
        const res = await toggleEditMode(!status.isEditMode);
        if (res.success) {
            toast.success(status.isEditMode ? "Edit Mode Disabled" : "Edit Mode Enabled");
            refresh();
        } else {
            toast.error("Action Failed");
        }
        setLoading(false);
    };

    const handleSync = async () => {
        setLoading(true);
        const res = await syncAndLock();
        if (res.success) {
            toast.success("System Locked & Synced", { description: "New file signature approved." });
            refresh();
        } else {
            toast.error(res.error || "Sync Failed");
        }
        setLoading(false);
    };

    const [restoring, setRestoring] = useState(false);
    const handleRestore = async () => {
        if (!confirm("Are you sure? This will overwrite recent changes with the Cloud Backup.")) return;
        setRestoring(true);
        const res = await triggerCloudRestore();
        if (res.success) {
            toast.success("Restore Initiated", { description: "Clean code is being deployed." });
        } else {
            toast.error(res.error || "Restore Failed");
        }
        setTimeout(() => setRestoring(false), 2000);
    };

    if (!status) return <div className="animate-pulse bg-gray-100 h-full rounded-3xl" />;

    return (
        <div className="flex flex-col h-full justify-between space-y-6">
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 ${status.isEditMode ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {status.isEditMode ? <Unlock className="w-4 h-4" /> : <Lock className="w-4 h-4" />}
                        <span className="text-[10px] font-black uppercase tracking-widest">
                            {status.isEditMode ? 'Edit Mode ON' : 'Tamper-Proof'}
                        </span>
                    </div>

                    <button
                        onClick={handleToggle}
                        disabled={loading}
                        className={`w-10 h-5 rounded-full p-1 transition-colors ${status.isEditMode ? 'bg-amber-500' : 'bg-gray-300'}`}
                    >
                        <div className={`w-3 h-3 bg-white rounded-full transition-transform ${status.isEditMode ? 'translate-x-5' : 'translate-x-0'}`} />
                    </button>
                </div>

                <p className="text-2xl font-[1000] tracking-tighter italic text-gray-900">
                    {status.isEditMode ? 'UNLOCKED' : 'SECURE'}
                </p>

                {status.isEditMode ? (
                    <div className="bg-amber-50 border border-amber-100 p-3 rounded-xl flex gap-2 items-start">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <p className="text-[9px] text-amber-700 font-bold leading-tight uppercase">
                            Warning: Any file changes will be allowed. Sync when done.
                        </p>
                    </div>
                ) : (
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed">
                        Codebase locked. Unauthorized changes will trigger immediate shutdown.
                    </p>
                )}
            </div>

            {status.isEditMode && (
                <button
                    onClick={handleSync}
                    disabled={loading}
                    className="w-full bg-black text-white py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-600 transition-all flex items-center justify-center gap-2"
                >
                    <RefreshCw className={`w-3 h-3 ${loading ? 'animate-spin' : ''}`} />
                    Sync & Lock
                </button>
            )}

            {!status.isEditMode && (
                <div className="space-y-3">
                    <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        <span className="text-[10px] font-bold text-gray-400">Integrity Verified</span>
                    </div>

                    <div className="pt-2 border-t border-gray-100">
                        <button
                            onClick={handleRestore}
                            disabled={restoring}
                            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 group relative overflow-hidden"
                        >
                            {restoring ? (
                                <CheckCircle2 className="w-4 h-4 animate-bounce" />
                            ) : (
                                <Cloud className="w-4 h-4 group-hover:scale-110 transition-transform" />
                            )}
                            <span className="relative z-10">{restoring ? 'Restoring...' : 'Cloud Restore'}</span>
                        </button>
                        <p className="text-[9px] text-center text-gray-300 font-bold uppercase tracking-widest mt-2">
                            Reverts to last clean backup
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
