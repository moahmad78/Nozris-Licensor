import React from 'react';
import { ShieldCheck, Lock } from 'lucide-react';

export default function SSLSecureDoc() {
    return (
        <div className="min-h-screen bg-black text-gray-300 px-6 py-20 font-sans">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-black text-white mb-6 flex items-center gap-4">
                    <ShieldCheck className="text-green-400" size={40} /> SSL Secure Encryption
                </h1>
                <p className="text-xl mb-12">Military-grade protection for your data in transit.</p>

                <div className="space-y-12">
                    <section className="bg-gray-900 border border-gray-800 p-8 rounded-2xl">
                        <h2 className="text-2xl font-bold text-white mb-4">Technical Specs</h2>
                        <ul className="space-y-4">
                            <li className="flex items-center gap-3"><Lock className="text-green-500" size={20} /> <strong>AES-256 Encryption:</strong> All payloads are encrypted before leaving the client.</li>
                            <li className="flex items-center gap-3"><Lock className="text-green-500" size={20} /> <strong>TLS 1.3 Strict:</strong> We refuse connections from outdated security protocols.</li>
                            <li className="flex items-center gap-3"><Lock className="text-green-500" size={20} /> <strong>Certificate Pinning:</strong> Prevents Man-in-the-Middle (MitM) attacks.</li>
                        </ul>
                    </section>
                </div>
            </div>
        </div>
    );
}
