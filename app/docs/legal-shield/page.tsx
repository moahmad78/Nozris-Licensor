import React from 'react';
import { Scale, ScrollText } from 'lucide-react';

export default function LegalShieldDoc() {
    return (
        <div className="min-h-screen bg-black text-gray-300 px-6 py-20 font-sans">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-black text-white mb-6 flex items-center gap-4">
                    <Scale className="text-yellow-400" size={40} /> Automated Legal Shield
                </h1>
                <p className="text-xl mb-12">Instant legal notices generated upon breach detection.</p>

                <div className="space-y-12">
                    <section className="bg-gray-900 border border-gray-800 p-8 rounded-2xl">
                        <h2 className="text-2xl font-bold text-white mb-4">How it Works</h2>
                        <p className="leading-relaxed mb-6">
                            When a threat is confirmed (e.g., unauthorized file modification), Licensr's backend triggers the
                            Legal Shield module.
                        </p>
                        <div className="space-y-4">
                            <div className="flex gap-4 items-start">
                                <div className="p-2 bg-yellow-500/10 rounded"><ScrollText className="text-yellow-500" /></div>
                                <div>
                                    <h4 className="font-bold text-white">1. Notice Generation</h4>
                                    <p className="text-sm">A PDF Cease & Desist notice is drafted, citing specific sections of the IT Act 2000 (Section 66) and Copyright Act.</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-start">
                                <div className="p-2 bg-yellow-500/10 rounded"><Scale className="text-yellow-500" /></div>
                                <div>
                                    <h4 className="font-bold text-white">2. Delivery</h4>
                                    <p className="text-sm">The notice is emailed to the verified owner for review, and optionally dispatched to the intruder's ISP abuse contact.</p>
                                </div>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}
