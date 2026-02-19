'use client';
import Link from 'next/link';
import { ShieldCheck, Menu, X, ArrowRight, Activity } from 'lucide-react';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import LeadModal from './LeadModal';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [isLeadModalOpen, setIsLeadModalOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    // HIDDEN KEYBOARD SHORTCUT: Ctrl+Shift+L
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'L') {
                router.push('/shield-access-vault');
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [router]);

    const isSensitive = pathname.startsWith('/dashboard') ||
        pathname.startsWith('/admin') ||
        pathname.startsWith('/login') ||
        pathname.startsWith('/client') ||
        pathname.startsWith('/shield-access-vault');

    if (isSensitive) {
        return null;
    }

    const scrollToThreatMonitor = (e: React.MouseEvent) => {
        e.preventDefault();
        setIsOpen(false);
        const element = document.getElementById('threat-monitor');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        } else {
            // Fallback if not on home page
            router.push('/#threat-monitor');
        }
    };

    return (
        <nav className="absolute top-0 left-0 w-full z-50 border-b border-slate-800/10 bg-slate-950/80 backdrop-blur-md">
            <div className="w-full px-6 md:px-12">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="bg-blue-500/10 p-2 rounded-lg border border-blue-500/20 group-hover:border-blue-500 transition-colors">
                            <ShieldCheck className="w-6 h-6 text-blue-500" />
                        </div>
                        <span className="text-xl font-bold tracking-tight text-white group-hover:text-blue-500 transition-colors">
                            Nozris
                        </span>
                    </Link>

                    {/* Desktop Menu - Documentation Style */}
                    <div className="hidden md:flex items-center gap-8">
                        <button
                            onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { view: 'login' } }))}
                            className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
                        >
                            Login
                        </button>
                        <Link href="/pricing" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">
                            Pricing
                        </Link>
                        <Link href="/contact" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">
                            Contact
                        </Link>

                        {/* Desktop CTA - THREAT INTELLIGENCE */}
                        <div className="flex items-center gap-3 ml-4 pl-6 border-l border-slate-800">
                            <button
                                onClick={scrollToThreatMonitor}
                                className="bg-blue-600/90 hover:bg-blue-500 text-white px-5 py-2 rounded-lg text-sm font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.5)] flex items-center gap-2 border border-blue-400/50 animate-pulse"
                            >
                                <Activity size={16} className="animate-spin-slow" />
                                Threat Intelligence
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu button */}
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/50 focus:outline-none"
                        >
                            {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <div className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-slate-800 animate-fade-in">
                    <div className="px-4 pt-2 pb-6 space-y-2">
                        <Link href="/docs" className="text-slate-400 hover:text-white block px-3 py-3 rounded-md text-base font-medium border-b border-slate-800/50">
                            Documentation
                        </Link>
                        <Link href="/pricing" className="text-slate-400 hover:text-white block px-3 py-3 rounded-md text-base font-medium border-b border-slate-800/50">
                            Pricing
                        </Link>
                        <Link href="/contact" className="text-slate-400 hover:text-white block px-3 py-3 rounded-md text-base font-medium border-b border-slate-800/50">
                            Contact
                        </Link>

                        <div className="grid grid-cols-1 pt-4">
                            <button
                                onClick={scrollToThreatMonitor}
                                className="text-center bg-blue-600 hover:bg-blue-500 text-white flex justify-center items-center gap-2 px-3 py-3 rounded-lg text-sm font-bold w-full shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse"
                            >
                                <Activity size={16} />
                                Threat Intelligence
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <LeadModal isOpen={isLeadModalOpen} onClose={() => setIsLeadModalOpen(false)} />
        </nav>
    );
}
