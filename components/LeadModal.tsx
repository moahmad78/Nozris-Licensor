'use client';

import React, { useState } from 'react';
import { X, ShieldCheck, ChevronRight, Loader2, Globe, Server, Terminal, Lock, LogIn } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface LeadModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function LeadModal({ isOpen, onClose }: LeadModalProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        website: '',
        platform: 'Next.js'
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulation of API logic
        await new Promise(resolve => setTimeout(resolve, 1500));

        toast.success("PROTOCOL INITIATED. WELCOME TO NOZRIS.");
        setIsLoading(false);
        onClose();
        setFormData({ name: '', website: '', platform: 'Next.js' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
            {/* Close Overlay (Click outside) */}
            <div className="absolute inset-0 z-0" onClick={onClose} />

            <div className="bg-[#020617] border border-blue-500/20 w-full max-w-lg relative animate-in zoom-in-95 duration-300 shadow-2xl shadow-blue-900/20 rounded-2xl overflow-hidden">

                {/* Docs Style Header */}
                <div className="bg-slate-900/50 p-6 border-b border-blue-900/20 flex justify-between items-start">
                    <div>
                        <h3 className="text-xl font-bold text-white flex items-center gap-3 tracking-tight">
                            <ShieldCheck size={20} className="text-blue-500" /> Secure Protocol
                        </h3>
                        <p className="text-sm text-slate-400 font-medium mt-1">
                            Initialize defense systems for your application.
                        </p>
                    </div>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-8">

                    {/* EXISTING CUSTOMER LOGIN SHORTCUT */}
                    <div className="p-4 border border-dashed border-slate-800 rounded-xl bg-slate-900/50 text-center">
                        <p className="text-xs text-slate-400 mb-3 font-semibold uppercase tracking-wider">Existing Nozris Client?</p>
                        <Link href="/customer/dashboard">
                            <button className="w-full py-3 bg-white text-slate-950 font-bold rounded-lg text-sm transition-all hover:bg-blue-50 flex items-center justify-center gap-2 shadow-sm">
                                Access Dashboard <LogIn size={14} />
                            </button>
                        </Link>
                    </div>

                    <div className="flex items-center gap-4 text-slate-800">
                        <div className="h-px bg-current flex-1" />
                        <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">OR START NEW</span>
                        <div className="h-px bg-current flex-1" />
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Project Name / Operator
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. Mohd Ahmad"
                                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg p-3 text-white text-sm outline-none transition-all placeholder:text-slate-700 font-medium"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Asset URL
                            </label>
                            <input
                                type="url"
                                required
                                placeholder="https://your-project.com"
                                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg p-3 text-white text-sm outline-none transition-all placeholder:text-slate-700 font-medium"
                                value={formData.website}
                                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                                Tech Stack
                            </label>
                            <select
                                className="w-full bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-lg p-3 text-white text-sm outline-none transition-all appearance-none cursor-pointer font-medium"
                                value={formData.platform}
                                onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
                            >
                                <option value="Next.js">Next.js (React)</option>
                                <option value="WordPress">WordPress / PHP</option>
                                <option value="Shopify">Shopify Liquid</option>
                                <option value="Enterprise">Enterprise Custom</option>
                            </select>
                        </div>

                        <button
                            disabled={isLoading}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
                        >
                            {isLoading ? <Loader2 className="animate-spin" /> : <>Initiate Protocol <ShieldCheck size={18} /></>}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
