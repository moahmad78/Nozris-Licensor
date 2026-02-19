'use client';

import { useState, useEffect } from 'react';
import { useFormStatus } from 'react-dom';
import { toast } from 'sonner';
import { User, Phone, MessageCircle, Building, MapPin, Save, ArrowLeft, Loader2, ShieldCheck, FileText, Upload } from 'lucide-react';
import Link from 'next/link';
import { updateClientProfile } from '@/app/actions/profile-sync';
import { getClientLicenseDetails } from '@/app/actions/client-integration'; // To preload data if possible, or just default

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <button
            type="submit"
            disabled={pending}
            className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-500/30 disabled:opacity-50"
        >
            {pending ? <Loader2 className="animate-spin" /> : <Save size={20} />}
            {pending ? 'Syncing Profile...' : 'Save & Sync Profile'}
        </button>
    );
}

export default function ProfilePage() {
    // In a real app, we'd fetch the initial state from Server Component prop or useEffect
    // For now, we allow empty or default

    const handleAction = async (formData: FormData) => {
        const res = await updateClientProfile(formData);
        if (res.success) {
            toast.success(res.message);
        } else {
            toast.error(res.message);
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center justify-center p-6 animate-in fade-in duration-500">
            <div className="w-full max-w-2xl">
                <div className="mb-6 flex items-center justify-between">
                    <Link href="/client/dashboard/settings" className="flex items-center gap-2 text-slate-500 hover:text-slate-900 font-bold transition-colors">
                        <ArrowLeft size={18} /> Back to Settings
                    </Link>
                    <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight">Access Profile</h1>
                </div>

                <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                    <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-2xl font-black border-4 border-white/20 shadow-xl">
                                <User size={32} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Client Identity</h2>
                                <p className="text-blue-200 text-sm">Update your official records for invoices and support.</p>
                            </div>
                        </div>
                        {/* Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                    </div>

                    <form action={handleAction} className="p-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                    <User size={14} /> Full Name
                                </label>
                                <input name="fullName" type="text" placeholder="John Doe" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                    <Building size={14} /> Company Name
                                </label>
                                <input name="companyName" type="text" placeholder="Acme Corp" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                    <Phone size={14} /> Phone Number
                                </label>
                                <input name="phoneNumber" type="tel" placeholder="+1 234 567 8900" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                    <MessageCircle size={14} /> WhatsApp (Critical)
                                </label>
                                <input name="whatsappNumber" type="tel" placeholder="+1 234 567 8900" required className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none transition-all border-emerald-100 bg-emerald-50/30" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-2">
                                <MapPin size={14} /> Full Address
                            </label>
                            <textarea name="fullAddress" placeholder="123 Business Park, Innovation Drive..." rows={3} className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"></textarea>
                        </div>

                        <div className="pt-4">
                            <SubmitButton />
                            <p className="text-center text-[10px] text-slate-400 mt-4 uppercase tracking-widest">
                                Updates are synced immediately with Admin Dashboard
                            </p>
                        </div>
                    </form>
                </div>

                {/* KYC VAULT SECTION */}
                <div className="mt-8 bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
                    <div className="bg-slate-900 p-8 text-white relative overflow-hidden">
                        <div className="relative z-10 flex items-center gap-6">
                            <div className="w-20 h-20 bg-emerald-600 rounded-full flex items-center justify-center text-2xl font-black border-4 border-white/20 shadow-xl">
                                <ShieldCheck size={32} />
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Identity Vault</h2>
                                <p className="text-emerald-200 text-sm">Upload business documents for verification.</p>
                            </div>
                        </div>
                    </div>

                    <div className="p-8">
                        {/* Status Check would go here (fetch from server or pass as prop) */}
                        {/* For now, assuming standard view */}

                        <form action={async (formData) => {
                            const { submitKYCDocument } = await import('@/app/actions/client-kyc-vault');
                            const res = await submitKYCDocument(formData);
                            if (res.success) toast.success(res.message);
                            else toast.error(res.message);
                        }}
                            className="space-y-6"
                        >
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-500 uppercase">Document Type</label>
                                <select name="documentType" className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none">
                                    <option value="GST Certificate">GST Certificate</option>
                                    <option value="Business ID">Business ID / Incorporation</option>
                                    <option value="Aadhar Card">Aadhar Card (Director)</option>
                                </select>
                            </div>

                            <label className="block p-8 border-2 border-dashed border-slate-200 rounded-2xl hover:bg-slate-50 transition-colors cursor-pointer text-center group">
                                <FileText className="w-12 h-12 text-slate-300 mx-auto mb-4 group-hover:text-emerald-500 transition-colors" />
                                <span className="block font-bold text-slate-700">Click to Upload Document</span>
                                <span className="text-xs text-slate-400">PDF, JPG, PNG (Max 5MB)</span>
                                <input type="file" name="document" className="hidden" required accept=".pdf,.jpg,.png" />
                            </label>

                            <button className="w-full py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30">
                                <Upload className="w-5 h-5" /> Submit for Verification
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
