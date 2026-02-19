import React from 'react';
import { ShieldCheck, CheckCircle, Lock, Scale, Server } from 'lucide-react';

export default function TrustBadges() {
    return (
        <div className="flex flex-wrap items-center justify-center gap-4 py-6">

            <div className="flex items-center gap-3 bg-gray-900/50 px-5 py-3 rounded-full border border-gray-800 hover:border-green-500/50 transition-colors cursor-default">
                <ShieldCheck className="w-5 h-5 text-green-500" />
                <span className="text-gray-300 font-medium text-sm">Google Verified Provider</span>
            </div>

            <div className="flex items-center gap-3 bg-gray-900/50 px-5 py-3 rounded-full border border-gray-800 hover:border-blue-500/50 transition-colors cursor-default">
                <Server className="w-5 h-5 text-blue-500" />
                <span className="text-gray-300 font-medium text-sm">VPN Guard Active</span>
            </div>

            <div className="flex items-center gap-3 bg-gray-900/50 px-5 py-3 rounded-full border border-gray-800 hover:border-yellow-500/50 transition-colors cursor-default">
                <Scale className="w-5 h-5 text-yellow-500" />
                <span className="text-gray-300 font-medium text-sm">IT Act 2000 Compliant</span>
            </div>

            <div className="flex items-center gap-3 bg-gray-900/50 px-5 py-3 rounded-full border border-gray-800 hover:border-red-500/50 transition-colors cursor-default">
                <Lock className="w-5 h-5 text-red-500" />
                <span className="text-gray-300 font-medium text-sm">ISO 27001 Certified</span>
            </div>

        </div>
    );
}
