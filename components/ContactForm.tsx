'use client';

import { useState } from "react";
import { ArrowRight, Loader2, Send } from "lucide-react";
import { createSupportTicket } from "@/app/actions/support-actions";
import { toast } from "sonner";

export function ContactForm() {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: 'PRE-SALE QUERY: ',
        message: ''
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const res = await createSupportTicket({
            email: formData.email,
            subject: formData.subject + (formData.subject.includes(formData.name) ? "" : ` - from ${formData.name}`),
            message: formData.message,
            priority: 'HIGH'
        });

        if (res.success) {
            toast.success("Message sent directly to Licensr Support. We will reply shortly.");
            setFormData({ name: '', email: '', subject: 'PRE-SALE QUERY: ', message: '' });
        } else {
            toast.error("Failed to send message. Please try WhatsApp directly.");
        }
        setLoading(false);
    };

    return (
        <section className="py-24 px-6 bg-black border-t border-white/5 relative overflow-hidden" id="contact">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-[100px]" />
            <div className="max-w-3xl mx-auto relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">
                        Priority <span className="text-blue-600 italic">Access</span>
                    </h2>
                    <p className="text-zinc-500 font-medium">Skip the queue. Direct line to our Security Engineers.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 p-8 md:p-12 rounded-[2.5rem] border border-white/10 backdrop-blur-sm">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Your Identity</label>
                            <input
                                required
                                type="text"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-xl p-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-600 transition-colors font-bold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Communication Channel</label>
                            <input
                                required
                                type="email"
                                placeholder="Business Email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full bg-black border border-white/10 rounded-xl p-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-600 transition-colors font-bold"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Requirement</label>
                        <select
                            value={formData.subject}
                            onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                            className="w-full bg-black border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-blue-600 transition-colors font-bold appearance-none cursor-pointer"
                        >
                            <option value="PRE-SALE QUERY: Generic">I have a question about Licensr</option>
                            <option value="PRE-SALE QUERY: Enterprise">I need a Custom Enterprise Plan</option>
                            <option value="PRE-SALE QUERY: Integration">I need help with Integration</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-zinc-400">Briefing</label>
                        <textarea
                            required
                            rows={4}
                            placeholder="Tell us about your security needs..."
                            value={formData.message}
                            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                            className="w-full bg-black border border-white/10 rounded-xl p-4 text-white placeholder:text-zinc-700 focus:outline-none focus:border-blue-600 transition-colors font-bold resize-none"
                        />
                    </div>

                    <button
                        disabled={loading}
                        type="submit"
                        className="w-full bg-white text-black py-4 rounded-xl font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        Transmit Query
                    </button>
                </form>
            </div>
        </section>
    );
}
