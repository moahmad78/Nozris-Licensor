'use client';

import { ShieldAlert, Mail } from 'lucide-react';
import Link from 'next/link';

export default function BlockedPage() {
    return (
        <div className="min-h-screen bg-red-50 flex items-center justify-center p-4 font-sans">
            <div className="bg-white max-w-lg w-full rounded-2xl shadow-xl overflow-hidden border border-red-100">
                <div className="bg-red-600 p-8 flex flex-col items-center text-center">
                    <div className="bg-white/20 p-4 rounded-full mb-4 animate-pulse">
                        <ShieldAlert className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold text-white tracking-tight">Access Denied</h1>
                    <p className="text-red-100 mt-2 font-medium">IP Address Blocked</p>
                </div>

                <div className="p-8 space-y-6">
                    <div className="bg-red-50 p-4 rounded-xl border border-red-100 text-red-800 text-center">
                        <p className="font-semibold text-lg leading-relaxed">
                            "Aapne key ke sath ched-chad ki hai, isliye aapka IP block ho gaya hai. Ab aapko authorised customer support se baat karni hogi."
                        </p>
                    </div>

                    <div className="space-y-4">
                        <p className="text-center text-gray-500 text-sm font-medium uppercase tracking-wider">Contact Support to Unblock</p>

                        <div className="flex flex-col gap-3">
                            <a
                                href="https://wa.me/919264920211"
                                target="_blank"
                                className="flex items-center justify-center gap-3 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all hover:scale-[1.02] shadow-sm font-semibold"
                            >
                                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.248-.57-.397m-5.473 7.616c-3.67 0-6.627-2.957-6.627-6.627S8.329 4.744 12 4.744c3.67 0 6.627 2.957 6.627 6.627 0 3.67-2.957 6.627-6.627 6.627m0-14.771C7.505 1.5 3.855 5.15 3.855 9.645c0 4.495 3.65 8.145 8.145 8.145s8.145-3.65 8.145-8.145S16.495 1.5 12 1.5" />
                                </svg>
                                Chat on WhatsApp (+91 9264920211)
                            </a>

                            <a
                                href="mailto:support@example.com"
                                className="flex items-center justify-center gap-3 px-6 py-4 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all font-semibold"
                            >
                                <Mail className="w-5 h-5" />
                                Email Support
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
