import React from 'react';

export default function TermsOfService() {
    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans py-20 px-6">
            <div className="max-w-3xl mx-auto space-y-8">
                <h1 className="text-4xl font-black text-white mb-2">Terms of Service</h1>
                <p className="text-gray-500 text-sm border-b border-gray-800 pb-8">
                    Last Updated: February 7, 2026
                </p>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">1. Acceptance of Terms</h2>
                    <p>
                        By integrating Nozris API or SDKs into your software application, you agree to be bound by these Terms.
                        If you do not agree, you must immediately remove all Nozris code from your projects.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">2. Anti-Reverse Engineering</h2>
                    <p>
                        You strictly agree NOT to attempts to reverse engineer, decompile, or disassemble the Nozris client libraries.
                        Any such attempt is a violation of these terms and may be flagged by our automated systems as a hostile action,
                        resulting in an immediate account ban and potential legal action.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">3. Liability Disclaimer</h2>
                    <p>
                        Nozris provides security mechanisms on an "AS IS" basis. While we strive for perfection, no security system is theoretically impenetrable.
                        Nozris shall not be liable for any indirect, incidental, or consequential damages arising from the use or inability to use our service.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">4. Termination of License</h2>
                    <p>
                        We reserve the right to terminate service to any account that is found to be:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-400">
                        <li>Using our platform to protect illegal or malicious software (Malware, Ransomware).</li>
                        <li>Attempting to probe or attack our infrastructure.</li>
                        <li>Violating payment terms.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">5. Governing Law</h2>
                    <p>
                        These terms shall be governed by and construed in accordance with the laws of India.
                        Any disputes shall be subject to the exclusive jurisdiction of the courts in New Delhi, India.
                    </p>
                </section>

                <div className="pt-8 border-t border-gray-800 text-sm text-gray-500">
                    © 2026 Nozris Security Solutions. All rights reserved.
                </div>
            </div>
        </div>
    );
}
