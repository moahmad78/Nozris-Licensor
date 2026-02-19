'use client';

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Lock, Unlock, AlertTriangle, Zap } from 'lucide-react';
import { toast } from 'sonner';

interface IntegrityManagerProps {
    initialEditMode: boolean;
    initialIsUnlimited: boolean;
    initialExpiry: string | null;
}

export default function IntegrityManager({
    initialEditMode,
    initialIsUnlimited,
    initialExpiry
}: IntegrityManagerProps) {
    const [isReleased, setIsReleased] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleRelease = async () => {
        if (!confirm("DANGER: This will permanently remove specific security protections for this client. Are you sure?")) return;

        setLoading(true);
        try {
            // Hardcoded key for demo purpose as requested by "Physical Deployment" context
            const response = await fetch('/api/license/release', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    licenseKey: "DEMO-LICENSE-KEY", // In real app, fetch from context
                    adminAuthToken: "NOZRIS-MASTER-KEY"
                })
            });

            if (response.ok) {
                setIsReleased(true);
                toast.success("Security Protocols Disengaged");
            } else {
                toast.error("Release Authentication Failed");
            }
        } catch (error) {
            toast.error("System Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-black uppercase tracking-tight flex items-center gap-2">
                    <ShieldCheck className="w-6 h-6 text-blue-600" />
                    Integrity Status
                </h3>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase tracking-widest">
                    Active
                </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <Lock className="w-5 h-5 text-gray-400" />
                        <span className="font-bold text-sm text-gray-700">Edit Mode Guard</span>
                    </div>
                    <p className="text-xs text-gray-500">Prevents unauthorized code changes.</p>
                    <div className="mt-3">
                        <span className={`text-xs font-bold ${initialEditMode ? 'text-red-500' : 'text-green-500'}`}>
                            {initialEditMode ? 'UNLOCKED (Risk)' : 'LOCKED (Secure)'}
                        </span>
                    </div>
                </div>

                <div className="p-4 bg-gray-50 border border-gray-200 rounded-xl">
                    <div className="flex items-center gap-3 mb-2">
                        <Zap className="w-5 h-5 text-gray-400" />
                        <span className="font-bold text-sm text-gray-700">Rapid Response</span>
                    </div>
                    <p className="text-xs text-gray-500">Latency & uptime monitoring.</p>
                    <div className="mt-3">
                        <span className="text-xs font-bold text-green-500">OPERATIONAL</span>
                    </div>
                </div>
            </div>

            {/* DANGER ZONE */}
            <div className="border border-red-200 bg-red-50 rounded-2xl p-6 mt-6 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-5">
                    <AlertTriangle className="w-32 h-32 text-red-900" />
                </div>

                <h4 className="text-red-700 font-bold text-lg mb-2 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5" /> Danger Zone
                </h4>
                <p className="text-sm text-red-600/80 mb-6 max-w-sm">
                    Authorizing a permanent release will disengage all anti-theft protocols.
                    This action is irreversible and logs a high-priority audit event.
                </p>

                {isReleased ? (
                    <div className="bg-red-200 text-red-800 px-4 py-3 rounded-lg font-bold text-center border border-red-300">
                        LICENSE RELEASED
                    </div>
                ) : (
                    <button
                        onClick={handleRelease}
                        disabled={loading}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-200 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs"
                    >
                        <Unlock className="w-4 h-4" />
                        {loading ? 'Authorizing...' : 'Authorize Permanent Release'}
                    </button>
                )}
            </div>
        </div>
    );
}
