import React from 'react';
import { ArrowRight, Globe, Code, Shield, Cpu, Lock, Terminal } from 'lucide-react';
import Link from 'next/link';
import PlatformGrid from '@/components/PlatformGrid';
import { notFound } from 'next/navigation';

// Mock Data Source - In a real app this might come from a CMS or config
const categoryData: Record<string, { title: string; subtitle: string; icon: React.ReactNode; color: string }> = {
    'universal-protection': {
        title: 'Universal Language Support',
        subtitle: 'From React Frontends to Python Backends, we speak every language of modern development. See how we secure your specific stack.',
        icon: <Globe className="w-12 h-12 text-indigo-500" />,
        color: 'text-indigo-500'
    },
    'web-security': {
        title: 'Web Application Defense',
        subtitle: 'Protecting the browser layer. React, Vue, Angular, and Plain HTML/JS.',
        icon: <Code className="w-12 h-12 text-blue-500" />,
        color: 'text-blue-500'
    },
    'mobile-app-shield': {
        title: 'Mobile App Hardening',
        subtitle: 'Native and Hybrid protection for iOS and Android packages.',
        icon: <Shield className="w-12 h-12 text-green-500" />,
        color: 'text-green-500'
    }
};

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;
    const data = categoryData[category];

    if (!data) {
        // Fallback for categories not explicitly defined with unique headers, 
        // or redirect to general docs. For now, let's assume universal-protection is main target.
        if (category !== 'universal-protection') {
            // We can return a generic page or 404. 
            // Given the strict request, we'll focus on rendering the Grid for universal 
            // and maybe generic for others.
        }
    }

    // Default fallback if data missing (safety net)
    const content = data || {
        title: 'Security Documentation',
        subtitle: 'Detailed technical specifications for Nozris protection modules.',
        icon: <Terminal className="w-12 h-12 text-gray-500" />,
        color: 'text-gray-500'
    };

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-indigo-900">
            <main className="max-w-6xl mx-auto py-20 px-6">

                {/* Navigation */}
                <div className="mb-12 border-b border-gray-800 pb-8">
                    <Link href="/docs" className={`${content.color} hover:opacity-80 flex items-center gap-2 mb-6 font-mono text-sm uppercase tracking-wider`}>
                        <ArrowRight className="rotate-180" size={16} /> Back to Hub
                    </Link>
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-gray-900 rounded-2xl border border-gray-800">
                            {content.icon}
                        </div>
                        <div>
                            <h1 className="text-4xl md:text-6xl font-black mb-4 tracking-tighter">
                                {content.title}
                            </h1>
                            <p className="text-xl text-gray-400 font-light max-w-2xl">
                                {content.subtitle}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Content Area */}
                <section className="space-y-16">

                    {/* The Language Grid - Present on Universal Protection Page */}
                    {category === 'universal-protection' && (
                        <div className="animate-fade-in-up">
                            <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                <Cpu className="text-indigo-500" /> Supported Technologies
                            </h2>
                            <PlatformGrid />
                        </div>
                    )}

                    {/* Detailed Technical Specs (Generic for now, or specific) */}
                    <div className="bg-gray-900/30 border border-gray-800 rounded-3xl p-10">
                        <h2 className="text-3xl font-bold mb-6">How We Lock It Down</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-3">1. Compile-Time Injection</h3>
                                <p className="text-gray-400 leading-relaxed mb-6">
                                    We don't just wrap your code; we become part of it. During your build process (`npm run build`),
                                    our plugin injects encrypted heartbeat checks into random parts of your chunk files.
                                </p>
                                <div className="bg-black p-4 rounded-xl border border-gray-800 font-mono text-xs text-gray-500">
                                    <span className="text-purple-400">return</span> window.__NOZRIS__ ? <span className="text-blue-400">originalFn()</span> : <span className="text-red-500">crash()</span>;
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white mb-3">2. Polymorphic Obfuscation</h3>
                                <p className="text-gray-400 leading-relaxed mb-6">
                                    The protection logic changes shape with every deployment. An attacker cannot simply define a static
                                    "bypass pattern" because the variable names and control flow graph are re-randomized daily.
                                </p>
                                <ul className="space-y-2 text-sm text-gray-400">
                                    <li className="flex items-center gap-2"><Lock size={14} className="text-green-500" /> Control Flow Flattening</li>
                                    <li className="flex items-center gap-2"><Lock size={14} className="text-green-500" /> String Encryption (AES-256)</li>
                                    <li className="flex items-center gap-2"><Lock size={14} className="text-green-500" /> Dead Code Injection</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Integration CTA */}
                    <nav className="flex gap-6 text-sm font-medium text-gray-400">
                        <Link href="/docs/command-dashboard" className="hover:text-white transition-colors">Command Center</Link>
                        <Link href="/docs/watchdog" className="hover:text-white transition-colors">Watchdog</Link>
                        <Link href="/docs/proxy-shield" className="hover:text-white transition-colors">Proxy Shield</Link>
                    </nav>

                </section>
            </main>
        </div>
    );
}

// Function to generate static params for static export
export async function generateStaticParams() {
    return [
        { category: 'universal-protection' },
        { category: 'web-security' },
        { category: 'mobile-app-shield' },
    ];
}
