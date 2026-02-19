import React from 'react';
import { ShieldCheck, CheckCircle, Globe, Lock } from 'lucide-react';
import Link from 'next/link';

export default function VerificationPage({ params }: { params: { id: string } }) {
    // In a real app, verify the ID against the database here.
    const verificationId = params.id;

    return (
        <div className="min-h-screen bg-black flex items-center justify-center p-4">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl max-w-lg w-full p-8 text-center space-y-8 shadow-2xl shadow-blue-900/20">

                <div className="relative inline-block">
                    <div className="absolute inset-0 bg-green-500 blur-3xl opacity-20 rounded-full animate-pulse"></div>
                    <ShieldCheck className="w-24 h-24 text-green-500 relative z-10 mx-auto" />
                </div>

                <div className="space-y-4">
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight">Verified Secure</h1>
                    <p className="text-gray-400">
                        The domain associated with this ID is currently protected by Nozris.
                    </p>
                </div>

                <div className="bg-black/50 rounded-xl p-6 border border-gray-800 space-y-4">
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Verification ID</span>
                        <span className="text-white font-mono">{verificationId}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Status</span>
                        <span className="text-green-400 font-bold flex items-center gap-2">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
                            ACTIVE PROTECTION
                        </span>
                    </div>
                </div>

                <div className="bg-blue-900/20 border border-blue-900/50 rounded-xl p-4 flex items-start gap-4 text-left">
                    <Lock className="w-6 h-6 text-blue-400 shrink-0 mt-1" />
                    <div>
                        <h3 className="text-blue-400 font-bold text-sm uppercase mb-1">Military Grade Encryption</h3>
                        <p className="text-xs text-gray-300 leading-relaxed">
                            This property is shielded against source code theft, tampering, and unauthorized access.
                        </p>
                    </div>
                </div>

                <Link href="/" className="block w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors">
                    Get Nozris Protection
                </Link>

                <p className="text-xs text-gray-600 uppercase tracking-widest">Trusted by 500+ Businesses Globally</p>

            </div>
        </div>
    );
}
