import Link from 'next/link';
import { Github, Twitter, Linkedin, MessageSquare, ShieldCheck, Ticket, Server, FileText, Scale, Globe } from 'lucide-react';

export default function Footer() {
    return (
        <footer className="bg-black border-t border-gray-900 text-gray-400 py-16">
            <div className="w-full px-6 md:px-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">

                    {/* Brand/About */}
                    <div className="md:col-span-1 space-y-6">
                        <div className="flex items-center gap-2">
                            <ShieldCheck className="w-8 h-8 text-blue-600" />
                            <h3 className="text-2xl font-black text-white tracking-tight text-white uppercase">Nozris</h3>
                        </div>
                        <p className="text-sm leading-relaxed text-gray-500 font-medium italic">
                            Advanced Code Protection & Legal Enforcement. Safeguarding the future of software with military-grade precision.
                        </p>
                        <div className="flex gap-4 pt-2">
                            <a href="#" className="hover:text-blue-500 transition-colors"><Twitter size={20} /></a>
                            <a href="#" className="hover:text-blue-500 transition-colors"><Github size={20} /></a>
                            <a href="#" className="hover:text-blue-500 transition-colors"><Linkedin size={20} /></a>
                        </div>
                    </div>

                    {/* Platform Links */}
                    <div className="space-y-4">
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest border-b border-gray-800 pb-2 mb-4">Platform</h4>
                        <ul className="space-y-3">
                            <li><Link href="/docs" className="hover:text-blue-500 transition-colors text-sm flex items-center gap-2"><FileText size={14} /> Documentation</Link></li>
                            <li><Link href="/pricing" className="hover:text-blue-500 transition-colors text-sm flex items-center gap-2"><Ticket size={14} /> Pricing & Plans</Link></li>
                            <li><Link href="/docs/api" className="hover:text-blue-500 transition-colors text-sm flex items-center gap-2"><Globe size={14} /> Public API</Link></li>
                            <li><Link href="/status" className="hover:text-green-500 transition-colors text-sm flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" /> System Status</Link></li>
                        </ul>
                    </div>

                    {/* Resources & Support */}
                    <div className="space-y-4">
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest border-b border-gray-800 pb-2 mb-4">Resources</h4>
                        <ul className="space-y-3">
                            <li><Link href="/docs/emergency-protocol" className="hover:text-blue-500 transition-colors text-sm">Emergency Protocols</Link></li>
                            <li><Link href="/docs/threat-demo" className="hover:text-blue-500 transition-colors text-sm">Threat Intelligence Demo</Link></li>
                            <li>
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center gap-2 text-blue-400 hover:text-white transition-all text-sm font-bold uppercase tracking-tighter"
                                >
                                    Contact Security Support &rarr;
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div className="space-y-4">
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest border-b border-gray-800 pb-2 mb-4">Legal Compliance</h4>
                        <ul className="space-y-3">
                            <li><Link href="/legal/notice" className="hover:text-blue-500 transition-colors text-sm flex items-center gap-2"><Scale size={14} /> Legal Notice & IP</Link></li>
                            <li><Link href="/legal/privacy" className="hover:text-blue-500 transition-colors text-sm">Privacy Policy</Link></li>
                            <li><Link href="/legal/terms" className="hover:text-blue-500 transition-colors text-sm">Terms & Conditions</Link></li>
                            <li><Link href="/manifesto" className="hover:text-red-500 transition-colors text-sm font-bold italic underline">The Nozris Manifesto</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-900 pt-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-sm font-medium text-gray-600 uppercase tracking-widest">© 2026 Nozris Security Solutions. Absolute Protection.</p>

                    <div className="flex flex-col items-end gap-1">
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.6)]"></span>
                            <span className="font-mono text-[10px] uppercase text-green-500/80 tracking-widest">Global Status: SECURE</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-[9px] text-gray-700 font-mono tracking-widest uppercase">
                            <ShieldCheck className="w-3 h-3 text-gray-700" />
                            OFF-SHORE ENCRYPTION ACTIVE
                        </div>
                    </div>

                </div>
            </div>
        </footer>
    );
}
