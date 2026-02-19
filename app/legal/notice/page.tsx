import React from 'react';

export default function LegalNotice() {
    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans py-20 px-6">
            <div className="max-w-3xl mx-auto space-y-8">
                <h1 className="text-4xl font-black text-white mb-2">Legal Notice & IP Protection</h1>
                <p className="text-gray-500 text-sm border-b border-gray-800 pb-8">
                    Effective Date: February 7, 2026
                </p>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">1. Intellectual Property Rights</h2>
                    <p>
                        The software, code, algorithms, and designs protected by the Nozris platform remain the sole intellectual property of their respective creators (Nozris).
                        The User (Licensee) is granted a limited, non-transferable, revocable license to use the software under the specific terms agreed upon.
                    </p>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">2. Prohibited Acts: "Code Tampering"</h2>
                    <p>
                        "Code Tampering" is defined as any unauthorized modification, alteration, or deletion of the software's source code, binary files, or configuration.
                        This specifically includes:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-400">
                        <li>Bypassing, removing, or disabling the Nozris protection module.</li>
                        <li>Modifying the license validation logic or "call home" functionality.</li>
                        <li>Reverse engineering, decompiling, or disassembling any part of the application.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">3. License Revocation</h2>
                    <p>
                        Nozris, acting on behalf of Nozris, reserves the right to immediately and automatically revoke the license if "Code Tampering" is detected.
                        Upon revocation:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-400">
                        <li>The software may cease to function immediately.</li>
                        <li>Access to data within the software may be locked.</li>
                        <li>A permanent "License Violation" notice may be displayed.</li>
                        <li>The incident will be logged in the Nozris Global Blacklist.</li>
                    </ul>
                </section>

                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-white">4. Legal Recourse Under IT Act, 2000</h2>
                    <p>
                        Unauthorized access to computer systems, data theft, and source code tampering are punishable offenses under
                        <strong className="text-white"> Sections 43, 65, and 66 of the Information Technology Act, 2000 (India)</strong>.
                        Nozris maintains forensic logs sufficient to support criminal and civil prosecution.
                    </p>
                </section>

                <div className="pt-8 border-t border-gray-800 text-sm text-gray-500">
                    © 2026 Nozris Security Solutions. All rights reserved.
                </div>
            </div>
        </div>
    );
}
