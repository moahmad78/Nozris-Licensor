import React from 'react';

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans py-20 px-6">
            <div className="max-w-3xl mx-auto space-y-8">
                <h1 className="text-4xl font-black text-white mb-2">Privacy Policy</h1>
                <p className="text-gray-500 text-sm border-b border-gray-800 pb-8">
                    Last Updated: February 7, 2026
                </p>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">1. Data Collection & Usage</h2>
                    <p>
                        In compliance with the <strong className="text-white">Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011</strong> under the IT Act, 2000,
                        Nozris collects specific data points essential for security enforcement.
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-400">
                        <li><strong>Network Identity:</strong> Public IP addresses, Proxy detection flags, and VPN signatures.</li>
                        <li><strong>Device Fingerprinting:</strong> Browser User-Agent, Screen Resolution, Timezone, and OS details for anti-spoofing.</li>
                        <li><strong>Access Logs:</strong> Timestamps of every API call and license handshake for audit trails.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">2. Purpose of Collection</h2>
                    <p>
                        The primary purpose of data collection is <strong>Cybersecurity and Fraud Prevention</strong>. We do not sell data to third-party advertisers.
                        Data is used exclusively to:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-400">
                        <li>Authenticate legitimate license holders.</li>
                        <li>Identify and block malicious actors (Brute-force attackers, Scrapers).</li>
                        <li>Generate forensic reports for legal prosecution in cases of software piracy.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">3. Information Sharing</h2>
                    <p>
                        We may share collected data with law enforcement agencies (Cyber Crime Cells) upon valid legal request or court order,
                        specifically to aid in the investigation of digital offenses under the IT Act, 2000.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">4. Data Security</h2>
                    <p>
                        All stored data is encrypted using AES-256 standards. Our databases are isolated and protected by the same neural defense systems that protect our clients.
                    </p>
                </section>

                <div className="pt-8 border-t border-gray-800 text-sm text-gray-500">
                    © 2026 Nozris Security Solutions. All rights reserved.
                </div>
            </div>
        </div>
    );
}
