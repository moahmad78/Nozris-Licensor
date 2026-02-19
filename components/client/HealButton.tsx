'use client';

import { useState } from 'react';
import { healSystem } from '@/app/actions/neural-recovery';
import { toast } from 'sonner';
import { RefreshCw, CheckCircle, ShieldAlert } from 'lucide-react';

export function HealButton({ licenseKey }: { licenseKey: string }) {
    const [status, setStatus] = useState<'IDLE' | 'HEALING' | 'SUCCESS' | 'ERROR'>('IDLE');

    const handleHeal = async () => {
        if (!licenseKey) {
            toast.error("License Key not loaded");
            return;
        }

        setStatus('HEALING');
        toast.info("Initiating Neural Recovery Protocol...");

        try {
            const result = await healSystem(licenseKey);
            if (result.success) {
                setStatus('SUCCESS');
                toast.success(result.message);
                setTimeout(() => setStatus('IDLE'), 3000);
            } else {
                setStatus('ERROR');
                toast.error(result.message);
                setTimeout(() => setStatus('IDLE'), 3000);
            }
        } catch (e) {
            setStatus('ERROR');
            toast.error("Critical System Failure during Recovery");
        }
    };

    if (status === 'HEALING') {
        return (
            <button disabled className="w-full py-3 bg-slate-100 rounded-xl flex items-center justify-center gap-2 animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin text-slate-500" />
                <span className="text-xs font-bold text-slate-500">RESTORING INTEGRITY...</span>
            </button>
        );
    }

    if (status === 'SUCCESS') {
        return (
            <button disabled className="w-full py-3 bg-green-500 text-white rounded-xl flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4" />
                <span className="text-xs font-bold">SYSTEM HEALED</span>
            </button>
        );
    }

    return (
        <button
            onClick={handleHeal}
            className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl shadow-lg shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 group"
        >
            <ShieldAlert className="w-4 h-4 group-hover:rotate-12 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest">HEAL SYSTEM</span>
        </button>
    );
}
