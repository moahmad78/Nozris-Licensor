'use client';

import { Calendar, CreditCard } from 'lucide-react';

export default function SubscriptionCard({ licenseKey }: { licenseKey: string }) {
    return (
        <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-6 rounded-3xl text-white shadow-lg relative overflow-hidden">
            {/* Decor */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl -translate-y-1/2 translate-x-1/2" />

            <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <p className="text-indigo-100 text-xs font-bold uppercase tracking-widest">Nozris Pro</p>
                        <h3 className="text-2xl font-black italic">Active</h3>
                    </div>
                    <div className="bg-white/20 p-2 rounded-xl">
                        <CreditCard className="text-white" size={24} />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3 bg-white/10 p-3 rounded-xl">
                        <Calendar size={18} className="text-indigo-200" />
                        <div>
                            <p className="text-[10px] text-indigo-200 uppercase">Expires In</p>
                            <p className="text-sm font-bold">14 Days, 6 Hours</p>
                        </div>
                    </div>

                    <button className="w-full py-3 bg-white text-indigo-600 font-bold rounded-xl shadow-lg hover:bg-indigo-50 transition-colors uppercase text-xs tracking-widest">
                        Renew License Now
                    </button>
                </div>
            </div>
        </div>
    );
}
