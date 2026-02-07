import React from 'react';
import { Gavel, FileText } from 'lucide-react';

export default function IdentityVerifiedDoc() {
    return (
        <div className="min-h-screen bg-black text-gray-300 px-6 py-20 font-sans">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-black text-white mb-6 flex items-center gap-4">
                    <Gavel className="text-purple-400" size={40} /> Identity Verified
                </h1>
                <p className="text-xl mb-12">Forensic logging for legal enforcement.</p>

                <div className="space-y-12">
                    <section className="bg-gray-900 border border-gray-800 p-8 rounded-2xl">
                        <h2 className="text-2xl font-bold text-white mb-4">Admissible Evidence</h2>
                        <p className="leading-relaxed mb-6">
                            Our logs are designed to be admissible in court. We timestamp every interaction with anatomic precision
                            and cryptographically sign the logs to prevent tampering.
                        </p>
                        <div className="bg-black p-6 rounded-xl border border-gray-700 font-mono text-sm text-green-400">
                            &#123;<br />
                            &nbsp;&nbsp;"event": "unauthorized_access",<br />
                            &nbsp;&nbsp;"timestamp": "2026-02-07T10:00:00Z",<br />
                            &nbsp;&nbsp;"ip": "103.21.xx.xx",<br />
                            &nbsp;&nbsp;"evidence_hash": "sha256-..."<br />
                            &#125;
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
