'use client';

import { useSearchParams } from 'next/navigation';
import { CheckCircle, Copy, Check, Download, ArrowRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

export default function RenewalSuccessPage() {
    const searchParams = useSearchParams();
    const key = searchParams.get('key');
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        if (key) {
            navigator.clipboard.writeText(key);
            setCopied(true);
            toast.success("License key copied to clipboard");
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if (!key) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Loading...</h1>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-4">
            <div className="max-w-lg w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-green-100">
                <div className="bg-green-600 p-10 text-center">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6 backdrop-blur-sm">
                        <CheckCircle className="w-10 h-10 text-white" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-2">Renewal Successful!</h1>
                    <p className="text-green-100 font-medium">Your license is now ACTIVE.</p>
                </div>

                <div className="p-8 space-y-8">
                    <div className="space-y-3">
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider block text-center">Your License Key</label>
                        <div
                            onClick={handleCopy}
                            className="group relative bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl p-4 text-center cursor-pointer hover:border-green-500 hover:bg-green-50/50 transition-all"
                        >
                            <code className="text-lg font-mono font-bold text-gray-900 break-all">
                                {key}
                            </code>
                            <div className="absolute inset-0 flex items-center justify-center bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px] rounded-xl">
                                <span className="flex items-center gap-2 text-green-700 font-bold">
                                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                                    {copied ? 'Copied!' : 'Click to Copy'}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <a
                            href="/dashboard/integration"
                            className="flex items-center justify-center gap-3 w-full py-4 bg-black text-white rounded-xl font-bold hover:bg-gray-800 transition-all hover:scale-[1.02] shadow-lg shadow-gray-200"
                        >
                            <Download className="w-5 h-5" />
                            Download Integration Guide
                        </a>

                        <a
                            href="/"
                            className="flex items-center justify-center gap-2 text-sm text-gray-500 hover:text-gray-900 transition-colors"
                        >
                            Return to Homepage
                            <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}
