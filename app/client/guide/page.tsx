'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { CodeBlock } from '@/components/client/code-block';
import { getClientLicenseDetails } from '@/app/actions/client-integration';
import { Loader2, Zap, CheckCircle2, Globe, ShieldCheck, Sparkles, Search, ChevronDown, ChevronUp, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function IntegrationGuidePage() {
    const [loading, setLoading] = useState(true);
    const [details, setDetails] = useState<{ key: string, domain: string, endpoint: string } | null>(null);
    const [activeTab, setActiveTab] = useState<'NEXT' | 'REACT' | 'NODE' | 'HTML'>('NEXT');
    const [testing, setTesting] = useState(false);

    // FAQ State
    const [searchQuery, setSearchQuery] = useState('');
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    useEffect(() => {
        getClientLicenseDetails().then((data) => {
            setDetails(data);
            setLoading(false);
        });
    }, []);

    const handleTest = async () => {
        setTesting(true);
        // Simulate network delay for "Real" feel
        await new Promise(r => setTimeout(r, 1500));

        if (details?.key === 'NO_LICENSE_FOUND') {
            toast.error("No Active License Found");
        } else {
            toast.success("INTEGRATION VERIFIED", {
                description: `License active for ${details?.domain}. Events are being received.`
            });
        }
        setTesting(false);
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
    );

    const snippets = {
        NEXT: `// app/layout.tsx
import { LicenseGuard } from '@voomit/license-guard';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <LicenseGuard 
           licenseKey="${details?.key}" 
           domain="${details?.domain}" 
        />
        {children}
      </body>
    </html>
  );
}`,
        REACT: `// App.jsx
import { useEffect } from 'react';
import { verifyLicense } from './utils/license';

function App() {
  useEffect(() => {
    verifyLicense('${details?.key}');
  }, []);

  return <div className="App">...</div>;
}`,
        NODE: `// server.js
const { verify } = require('@voomit/node-sdk');

app.use(async (req, res, next) => {
   const status = await verify('${details?.key}', req.hostname);
   if (!status.valid) return res.status(403).send('License Invalid');
   next();
});`,
        HTML: `<script src="${details?.endpoint}/api/sdk.js"></script>
<script>
  window.LicenseGuard.init({
    key: "${details?.key}",
    domain: "${details?.domain}"
  });
</script>`
    };

    const faqs = [
        {
            question: "Why am I getting a 'Domain Mismatch' error?",
            answer: "This error occurs when the domain requesting verification does not match the authorized domain in your license settings. Ensure you are testing from the correct environment.",
            action: { label: "Manage Domain", href: "/client/licenses" }
        },
        {
            question: "How do I renew my license key?",
            answer: "You can extend your license validity by purchasing a renewal pack. Updates are applied instantly upon payment confirmation.",
            action: { label: "Renew Now", href: "/client/renew" }
        },
        {
            question: "Can I use one key for multiple sub-domains?",
            answer: "Yes, our wildcard support allows main domain licenses to cover all sub-domains (e.g., app.yoursite.com, dev.yoursite.com) automatically.",
            action: null
        },
        {
            question: "What happens if my server IP changes?",
            answer: "Our system primarily validates the domain name. However, if you have enabled strict IP-locking, you will need to update your authorized IP in the settings.",
            action: { label: "Review Security Settings", href: "/client/settings" }
        },
        {
            question: "How do I test locally?",
            answer: "For local development (localhost), the system enters 'Dev Mode' automatically. No license verification is strictly enforced on 127.0.0.1.",
            action: null
        }
    ];

    const filteredFaqs = faqs.filter(f =>
        f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.answer.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 space-y-12">
            <header className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-600">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-[10px] font-[1000] uppercase tracking-[0.4em]">Smart Integration</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-[1000] tracking-tight uppercase italic leading-none text-gray-900">
                    Deployment <span className="text-indigo-600">Guide</span>
                </h1>
                <p className="text-gray-500 font-medium max-w-2xl">
                    Copy-paste these secure snippets directly into your application. They are pre-signed with your specific license credentials.
                </p>
            </header>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                <div className="lg:col-span-2 space-y-12">
                    {/* TABS & CODE */}
                    <div className="space-y-8">
                        <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
                            {['NEXT', 'REACT', 'NODE', 'HTML'].map((t) => (
                                <button
                                    key={t}
                                    onClick={() => setActiveTab(t as any)}
                                    className={`px-8 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all ${activeTab === t
                                        ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-200'
                                        : 'bg-white text-gray-400 hover:bg-gray-100'
                                        }`}
                                >
                                    {t}
                                </button>
                            ))}
                        </div>

                        <CodeBlock code={snippets[activeTab]} language={activeTab.toLowerCase()} />

                        <div className="bg-white p-8 rounded-3xl border border-gray-100 space-y-6">
                            <h3 className="text-lg font-black uppercase italic tracking-tight">Installation Checklist</h3>
                            <div className="space-y-4">
                                {[
                                    "Copy the snippet to your project root",
                                    "Verify the environment variables are set",
                                    "Deploy to production domain"
                                ].map((step, i) => (
                                    <div key={i} className="flex items-center gap-4">
                                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">
                                            {i + 1}
                                        </div>
                                        <span className="text-sm font-bold text-gray-600">{step}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* FAQ SECTION */}
                    <div className="space-y-6 pt-8 border-t border-gray-200">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <h2 className="text-3xl font-[1000] italic uppercase tracking-tighter">Common Questions</h2>
                            <div className="relative">
                                <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    placeholder="Search troubleshooting..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 pr-6 py-3 bg-white border border-gray-200 rounded-xl text-xs font-bold w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            {filteredFaqs.length === 0 ? (
                                <div className="p-8 text-center text-gray-400 font-bold text-xs uppercase tracking-widest">No answers found for "{searchQuery}"</div>
                            ) : (
                                filteredFaqs.map((faq, i) => (
                                    <div key={i} className="bg-white border border-gray-100 rounded-2xl overflow-hidden transition-all hover:shadow-lg hover:shadow-gray-100">
                                        <button
                                            onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            className="w-full flex items-center justify-between p-6 text-left"
                                        >
                                            <span className="text-sm font-black text-gray-900">{faq.question}</span>
                                            {openFaq === i ? <ChevronUp className="w-5 h-5 text-indigo-500" /> : <ChevronDown className="w-5 h-5 text-gray-300" />}
                                        </button>

                                        {openFaq === i && (
                                            <div className="px-6 pb-6 animate-in slide-in-from-top-2 duration-200">
                                                <p className="text-xs text-gray-500 font-medium leading-relaxed mb-4">
                                                    {faq.answer}
                                                </p>
                                                {faq.action && (
                                                    <Link
                                                        href={faq.action.href}
                                                        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-indigo-600 hover:text-indigo-800 transition-colors bg-indigo-50 px-4 py-2 rounded-lg"
                                                    >
                                                        {faq.action.label} <ArrowRight className="w-3 h-3" />
                                                    </Link>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    {/* CREDENTIALS CARD */}
                    <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-black uppercase tracking-widest text-gray-400">Your Credentials</h3>
                            <ShieldCheck className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">License Key</p>
                                <p className="font-mono text-xs font-bold truncate">{details?.key}</p>
                            </div>
                            <div className="p-4 bg-gray-50 rounded-2xl space-y-1">
                                <p className="text-[10px] font-bold text-gray-400 uppercase">Authorized Domain</p>
                                <div className="flex items-center gap-2">
                                    <Globe className="w-3 h-3 text-indigo-500" />
                                    <p className="font-mono text-xs font-bold truncate">{details?.domain}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DEBUGGER */}
                    <div className="bg-black text-white p-8 rounded-[2.5rem] relative overflow-hidden group">
                        <div className="relative z-10 space-y-6">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-[1000] italic uppercase">Live Debugger</h3>
                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest leading-relaxed">
                                    Ping the LicenseGuard Network to verify your integration is active.
                                </p>
                            </div>
                            <button
                                onClick={handleTest}
                                disabled={testing}
                                className="w-full bg-white text-black py-4 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-400 transition-all flex items-center justify-center gap-2"
                            >
                                {testing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />}
                                Test Integration
                            </button>
                        </div>
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-indigo-600 rounded-full blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity" />
                    </div>
                </div>
            </div>
        </div>
    );
}
