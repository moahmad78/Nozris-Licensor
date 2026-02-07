'use client';

import { Loader2, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';

export default function WaitingPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white p-12 rounded-[2.5rem] shadow-2xl border border-gray-100 text-center max-w-lg w-full relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x"></div>

                <div className="mx-auto bg-indigo-50 w-24 h-24 rounded-full flex items-center justify-center mb-6 relative">
                    <div className="absolute inset-0 rounded-full border-4 border-indigo-100 animate-ping opacity-20"></div>
                    <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
                </div>

                <h1 className="text-3xl font-black text-gray-900 tracking-tight mb-3">Processing Payment...</h1>
                <p className="text-gray-500 font-medium mb-8">
                    We have received your UTR details. Our team is verifying the transaction. Your license will be activated automatically upon approval.
                </p>

                <div className="bg-gray-50 rounded-xl p-4 mb-8 text-left">
                    <h3 className="text-xs font-black uppercase tracking-widest text-gray-400 mb-2">Next Steps</h3>
                    <ul className="space-y-2 text-sm font-medium text-gray-600">
                        <li className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            <span>UTR Submitted Securely</span>
                        </li>
                        <li className="flex items-center gap-2">
                            <Loader2 className="w-4 h-4 text-indigo-500 animate-spin" />
                            <span>Admin Verification in Progress</span>
                        </li>
                    </ul>
                </div>

                <Link href="/client/dashboard" className="text-xs font-bold uppercase tracking-widest text-indigo-600 hover:text-indigo-800 hover:underline">
                    Check Status
                </Link>
            </div>
        </div>
    );
}
