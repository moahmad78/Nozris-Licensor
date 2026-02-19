'use client';

import React, { useState, useEffect } from 'react';
import { Shield, Lock, Terminal, Activity, Cpu, ShieldAlert, Fingerprint, Box } from 'lucide-react';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';

export default function ShieldAccessVault() {
    const [systemKey, setSystemKey] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const handleAccess = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        // This is a psychological gate for the System Key
        if (systemKey !== "ALFA-OMEGA-99") { // Hypothetical internal key
            toast.error("INVALID SYSTEM KEY - ACCESS DENIED");
            setSubmitting(false);
            return;
        }

        // Proceed to Next-Auth Sign-In
        signIn();
    };

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-6 relative overflow-hidden font-sans">
            {/* Dark Tech Background Particles (Simulated) */}
            <div className="absolute inset-0 z-0 opacity-20">
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute bg-blue-500 rounded-full blur-xl animate-pulse"
                        style={{
                            width: Math.random() * 300 + 'px',
                            height: Math.random() * 300 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                            animationDelay: Math.random() * 5 + 's',
                            opacity: Math.random() * 0.5
                        }}
                    />
                ))}
            </div>

            <main className="relative z-10 w-full max-w-lg">
                <div className="bg-gray-900/60 backdrop-blur-3xl border border-gray-800 p-10 rounded-[40px] shadow-2xl relative">
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2">
                        <div className="w-24 h-24 bg-blue-600 rounded-3xl flex items-center justify-center shadow-[0_0_50px_rgba(37,99,235,0.4)] border-4 border-black animate-bounce-slow">
                            <Shield size={48} className="text-white" />
                        </div>
                    </div>

                    <div className="text-center mt-12 mb-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 border border-green-500/20 text-green-400 text-[10px] font-mono tracking-widest uppercase mb-4 rounded-full">
                            <Activity size={12} className="animate-pulse" /> Secure Connection Established
                        </div>
                        <h1 className="text-3xl font-black tracking-tighter mb-2">ACCESS VAULT</h1>
                        <p className="text-gray-500 text-sm font-medium italic">Authorized Mohd Ahmad access only.</p>
                    </div>

                    <form onSubmit={handleAccess} className="space-y-8">
                        <div>
                            <label className="text-[10px] uppercase font-black tracking-[0.2em] text-gray-500 mb-2 block px-1">Global System Key</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-blue-500 transition-colors" size={20} />
                                <input
                                    type="password"
                                    value={systemKey}
                                    onChange={(e) => setSystemKey(e.target.value)}
                                    placeholder="•••• •••• ••••"
                                    className="w-full bg-black border border-gray-800 rounded-2xl py-5 pl-12 pr-6 text-white text-lg font-mono outline-none focus:border-blue-600 focus:shadow-[0_0_20px_rgba(37,99,235,0.1)] transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            disabled={submitting}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:bg-gray-800 text-white py-5 rounded-2xl font-black text-lg tracking-wide shadow-xl shadow-blue-900/20 active:scale-95 transition-all flex items-center justify-center gap-3"
                        >
                            {submitting ? (
                                <Cpu className="animate-spin" size={24} />
                            ) : (
                                <><Fingerprint size={24} /> INITIALIZE LOGIN SESSION</>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 pt-8 border-t border-gray-800/50 flex flex-col items-center gap-4">
                        <div className="flex items-center gap-2 text-gray-600 text-[11px] font-mono">
                            <Box size={14} /> ENCRYPTED_TUNNEL: ACTIVE
                        </div>
                        <div className="flex items-center gap-2 text-gray-700 text-[9px] font-bold tracking-[0.3em] uppercase">
                            Property of Nozris Security
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
