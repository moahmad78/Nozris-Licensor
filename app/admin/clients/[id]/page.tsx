'use client';

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, Activity, RefreshCw, Server, AlertTriangle, FileCode } from 'lucide-react';
import { toast } from 'sonner';

export default function ClientDetailsPage({ params }: { params: { id: string } }) {
    const [repairing, setRepairing] = useState(false);

    // Mock Data (In real app, fetch via server component or useEffect)
    const client = {
        id: params.id,
        name: "Acme Corp",
        domain: "acme.com",
        licenseKey: "LICENSE-XYZ-123",
        status: "CORRUPTED", // Simulated corrupted state
        health: "CRITICAL",
        lastBackup: "2026-02-05 14:00"
    };

    const handleRepair = async () => {
        if (!confirm("Confirm System Restore? This will overwrite current live files with the Clean Snapshot.")) return;

        setRepairing(true);
        try {
            const response = await fetch('/api/license/repair', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    licenseKey: client.licenseKey,
                    adminAuthToken: "LICENSR-MASTER-KEY"
                })
            });

            if (response.ok) {
                toast.success("Recovery Signal Broadcasted. System Restoring...");
                // Optimistic UI update
                client.status = "SECURE";
                client.health = "HEALTHY";
            } else {
                toast.error("Repair Failed");
            }
        } catch (error) {
            toast.error("Network Error");
        } finally {
            setRepairing(false);
        }
    };

    return (
        <div className="p-8 space-y-8 bg-gray-50 min-h-screen">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">Client Command Center</h1>
                    <p className="text-gray-500 font-bold uppercase text-xs tracking-widest">{client.domain}</p>
                </div>
                <div className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
                    <span className="text-xs font-bold text-gray-400 block">LICENSE KEY</span>
                    <span className="font-mono text-sm font-bold text-black">{client.licenseKey}</span>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* System Health Card */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm md:col-span-2 flex flex-col justify-between relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-6 opacity-5">
                        <Activity className="w-32 h-32 text-red-500 animate-pulse" />
                    </div>

                    <div>
                        <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center gap-2">
                            <Server className="w-5 h-5 text-blue-600" /> System Health
                        </h3>
                        {client.health === 'CRITICAL' ? (
                            <div className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                                <AlertTriangle className="w-3 h-3" /> Integrity Compromised
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-2 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest mb-4">
                                <ShieldCheck className="w-3 h-3" /> System Nominal
                            </div>
                        )}
                        <p className="text-gray-500 text-sm max-w-md">
                            Automatic diagnostics detected unauthorized file modification signature.
                            The system is currently effectively disabled (God-Mode Lock).
                        </p>
                    </div>

                    <div className="mt-8 flex gap-4">
                        <button
                            onClick={handleRepair}
                            disabled={repairing}
                            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl shadow-lg shadow-blue-200 transition-all flex items-center gap-2 uppercase tracking-widest text-xs"
                        >
                            <ShieldCheck className={`w-4 h-4 ${repairing ? 'animate-spin' : ''}`} />
                            {repairing ? 'Restoring...' : 'REPAIR & RESTORE SITE'}
                        </button>
                    </div>
                </div>

                {/* Quick Actions / Snapshot Info */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <FileCode className="w-5 h-5 text-gray-400" />
                        <h3 className="font-bold text-gray-800">Clean Snapshot</h3>
                    </div>
                    <div className="bg-gray-100 rounded-lg p-3 text-xs font-mono text-gray-600 break-all">
                        HASH: sha256-834j...92x
                    </div>
                    <p className="text-xs text-gray-400">
                        Last Clean Backup: <span className="font-bold text-gray-600">{client.lastBackup}</span>
                    </p>
                    <div className="pt-4 border-t border-gray-100">
                        <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold py-2 rounded-lg text-xs uppercase transition-colors">
                            View Forensics
                        </button>
                    </div>
                </div>

            </div>
        </div>
    );
}
