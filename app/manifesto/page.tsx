import React from 'react';
import { ShieldCheck, Target, Lock, Globe } from 'lucide-react';

export default function ManifestoPage() {
    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans selection:bg-red-500/30">

            {/* Hero Section */}
            <section className="relative py-24 border-b border-gray-800 overflow-hidden">
                <div className="absolute inset-0 bg-red-900/5 z-0" />
                <div className="container mx-auto px-6 relative z-10 text-center">
                    <span className="text-red-500 font-mono text-sm uppercase tracking-widest mb-4 block">The Licensr Mission</span>
                    <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tighter uppercase">
                        Code Is <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-600">Power</span>.
                    </h1>
                    <p className="text-xl md:text-2xl text-gray-400 max-w-3xl mx-auto leading-relaxed font-light">
                        We believe that software is the intellectual currency of the future. Protecting it isn't just a business requirement; it's a moral imperative.
                    </p>
                </div>
            </section>

            {/* Core Principles */}
            <section className="py-20 px-6">
                <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">

                    <div className="space-y-6">
                        <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center border border-gray-800">
                            <ShieldCheck className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Absolute Sovereignty</h3>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            A developer must have absolute control over their creation. If a client stops paying, the software should stop working. No negotiations, no delays.
                            <strong className="text-white"> Code sovereignty is non-negotiable.</strong>
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center border border-gray-800">
                            <Target className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Zero Tolerance for Theft</h3>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            Piracy is theft. Unauthorized modification is vandalism. We treat every breach as a hostile act. Our systems are designed to detect, block, and
                            <strong className="text-white"> neutralize threats instantly.</strong>
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center border border-gray-800">
                            <Lock className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Privacy by Integrity</h3>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            We don't spy on users; we verify integrity. Our "Privacy by Integrity" model ensures that we only collect data necessary to prove
                            <strong className="text-white"> authorization and detect fraud.</strong>
                        </p>
                    </div>

                    <div className="space-y-6">
                        <div className="w-12 h-12 bg-gray-900 rounded-xl flex items-center justify-center border border-gray-800">
                            <Globe className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="text-2xl font-bold text-white">Global Enforcement</h3>
                        <p className="text-gray-400 leading-relaxed text-lg">
                            The internet has no borders, and neither does justice. We maintain a global blacklist and legal partnerships to ensure that bad actors face consequences
                            <strong className="text-white"> anywhere in the world.</strong>
                        </p>
                    </div>
                </div>
            </section>

            {/* Closing Statement */}
            <section className="py-24 bg-gray-900/30 border-t border-gray-800 text-center px-6">
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold text-white mb-8">Join the Resistance Against Piracy.</h2>
                    <p className="text-gray-400 mb-10 text-lg">
                        Licensr isn't just a tool; it's a movement to reclaim the value of code.
                    </p>
                    <div className="text-sm font-mono text-gray-600">
                // END TRANSMISSION
                    </div>
                </div>
            </section>

        </div>
    );
}
