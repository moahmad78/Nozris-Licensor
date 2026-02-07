'use client';
import React, { useState } from 'react';
import { Mail, MessageSquare, Send, CheckCircle, Shield } from 'lucide-react';

export default function ContactPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            setIsSubmitted(true);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans py-20 px-6 flex items-center justify-center relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-[100px] pointer-events-none" />

            <div className="max-w-xl w-full relative z-10">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-black text-white mb-2 tracking-tight">Contact Support</h1>
                    <p className="text-gray-400">Secure channel for enterprise inquiries and technical assistance.</p>
                </div>

                <div className="bg-gray-900/40 backdrop-blur-xl border border-gray-800 p-8 rounded-3xl shadow-2xl">
                    {isSubmitted ? (
                        <div className="text-center py-10 animate-in fade-in zoom-in duration-500">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-green-500">
                                <CheckCircle size={32} />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-4">Message Received.</h2>
                            <p className="text-gray-400 mb-6">
                                A secure ticket has been created used your ID. <br />
                                Our engineering team will respond within 2 hours.
                            </p>
                            <button
                                onClick={() => setIsSubmitted(false)}
                                className="text-blue-400 hover:text-blue-300 font-bold text-sm"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Full Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                                        placeholder="John Doe"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Company Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                                        placeholder="Acme Corp"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Work Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-4 top-3.5 text-gray-600 w-5 h-5" />
                                    <input
                                        type="email"
                                        required
                                        className="w-full bg-gray-950 border border-gray-800 rounded-lg pl-12 pr-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all"
                                        placeholder="security@company.com"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Security Inquiry</label>
                                <textarea
                                    required
                                    rows={4}
                                    className="w-full bg-gray-950 border border-gray-800 rounded-lg px-4 py-3 text-white focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all resize-none"
                                    placeholder="Describe your issue or integration request..."
                                ></textarea>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-blue-600 hover:bg-blue-500 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <Send size={18} /> Send Secure Message
                                    </>
                                )}
                            </button>

                            <div className="flex items-center justify-center gap-2 text-xs text-gray-600 mt-4">
                                <Shield size={12} />
                                <span>Encrypted Transmission (TLS 1.3)</span>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
