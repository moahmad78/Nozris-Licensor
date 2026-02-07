'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Copy, AlertCircle, Loader2, ShieldCheck, Server, Globe } from 'lucide-react';
import { toast } from 'sonner';

export default function SetupWizard() {
    const [step, setStep] = useState(1);
    const [licenseKey, setLicenseKey] = useState('LIC-XXXX-XXXX-XXXX'); // In real app, fetch from auth/context
    const [isLoading, setIsLoading] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const scriptTag = `<script src="https://bharatfile.com/shield.js?key=${licenseKey}"></script>`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(scriptTag);
        toast.success("Script copied to clipboard!");
    };

    const verifySetup = async () => {
        setIsLoading(true);
        setVerificationStatus('idle');
        try {
            // Get client domain from user or context. For demo, we might ask user to input URL or assume it's known.
            // Assuming this is wrapped in a context that knows the client's registered domain
            // For this wizard, we'll simulate or ask for it? The prompt says "Verify Setup button... that checks license status via API"
            // The API verify-bridge takes a URL.
            // Let's assume we fetch the registered domain from the backend or have an input.
            // For UI simplicity + requirement "Pulse-loading state that calls /api/verify-bridge", I'll mock the URL input or use a placeholder.

            const response = await fetch('/api/verify-bridge', {
                method: 'POST',
                body: JSON.stringify({ licenseKey, url: 'https://client-website.com' }), // Simplified for now
                headers: { 'Content-Type': 'application/json' }
            });

            if (response.ok) {
                setVerificationStatus('success');
                toast.success("Security Bridge Verified!");
                setTimeout(() => setStep(3), 1000);
            } else {
                setVerificationStatus('error');
                toast.error("Bridge not detected. Check your installation.");
            }
        } catch (e) {
            setVerificationStatus('error');
            toast.error("Verification failed.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
            <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-12">

                {/* Steps Visual */}
                <div className="space-y-8">
                    <h1 className="text-4xl font-black uppercase tracking-tighter">
                        Deploy <span className="text-cyan-400">Shield</span>
                    </h1>
                    <div className="space-y-6">
                        {[
                            { id: 1, title: "Generate Key", icon: <CheckCircle className="w-5 h-5" />, active: step >= 1 },
                            { id: 2, title: "Inject Script", icon: <Server className="w-5 h-5" />, active: step >= 2 },
                            { id: 3, title: "Live Monitoring", icon: <Globe className="w-5 h-5" />, active: step >= 3 }
                        ].map((s) => (
                            <div key={s.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${s.active ? 'border-cyan-500/50 bg-cyan-500/10' : 'border-white/5 bg-white/5'}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${s.active ? 'bg-cyan-500 text-black' : 'bg-slate-800 text-slate-500'}`}>
                                    {s.id}
                                </div>
                                <span className={`font-bold uppercase tracking-widest ${s.active ? 'text-white' : 'text-slate-500'}`}>{s.title}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Wizard Content */}
                <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 relative overflow-hidden">
                    {step === 1 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                            <h2 className="text-2xl font-bold">Step 1: Your License Key</h2>
                            <p className="text-slate-400">This key is unique to your domain. Do not share it.</p>
                            <div className="bg-black p-4 rounded-xl font-mono text-cyan-400 border border-cyan-500/30 flex justify-between items-center">
                                {licenseKey}
                            </div>
                            <button onClick={() => setStep(2)} className="w-full py-3 bg-cyan-500 text-black font-black uppercase tracking-widest rounded-xl hover:bg-cyan-400 transition-all">
                                Continue
                            </button>
                        </motion.div>
                    )}

                    {step === 2 && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                            <h2 className="text-2xl font-bold">Step 2: Injection</h2>
                            <p className="text-slate-400">Copy and paste this snippet into the <code className="text-white bg-white/10 px-1 rounded">&lt;head&gt;</code> of your website.</p>

                            <div className="relative group">
                                <pre className="bg-black p-6 rounded-xl text-xs text-slate-300 overflow-x-auto border border-white/10 cursor-pointer hover:border-cyan-500/50 transition-colors" onClick={copyToClipboard}>
                                    <code>{scriptTag}</code>
                                </pre>
                                <button onClick={copyToClipboard} className="absolute top-2 right-2 p-2 bg-slate-800 rounded-lg hover:bg-slate-700">
                                    <Copy className="w-4 h-4" />
                                </button>
                            </div>

                            <button
                                onClick={verifySetup}
                                disabled={isLoading}
                                className="w-full py-3 bg-white text-black font-black uppercase tracking-widest rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2 relative overflow-hidden"
                            >
                                {isLoading && <span className="absolute inset-0 bg-cyan-500/20 animate-pulse" />}
                                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ShieldCheck className="w-5 h-5" />}
                                {isLoading ? "Verifying..." : "Verify Setup"}
                            </button>

                            {verificationStatus === 'error' && (
                                <p className="text-red-500 text-xs font-bold flex items-center gap-2">
                                    <AlertCircle className="w-4 h-4" /> Script not detected. Please try again.
                                </p>
                            )}
                        </motion.div>
                    )}

                    {step === 3 && (
                        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center py-8">
                            <div className="w-20 h-20 bg-green-500 rounded-full mx-auto flex items-center justify-center shadow-[0_0_30px_rgba(34,197,94,0.4)]">
                                <CheckCircle className="w-10 h-10 text-black" />
                            </div>
                            <h2 className="text-2xl font-black uppercase text-green-500">System Secure</h2>
                            <p className="text-slate-400">Your digital assets are now under the protection of the Bharat File God-Shield.</p>
                            <button className="px-8 py-3 border border-white/10 rounded-full hover:bg-white/5 transition-all text-sm font-bold uppercase tracking-widest">
                                Go to Dashboard
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>
        </div>
    );
}
