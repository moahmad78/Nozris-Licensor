'use client';

import { useState, useEffect } from 'react';
import { X, ShieldCheck, Mail, Lock, ArrowRight, User, Globe, Smartphone, Loader2, CheckCircle, ShieldAlert } from 'lucide-react';
import { toast } from 'sonner';
import { submitLead } from '@/app/actions/leads';
import { sendLoginOTP, verifyLoginOTP } from '@/app/actions/client-auth';
import { useRouter } from 'next/navigation';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialView?: 'login' | 'register';
}

export default function AuthModal({ isOpen, onClose, initialView = 'register' }: AuthModalProps) {
    const [view, setView] = useState<'login' | 'register'>(initialView);
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    // Reset view when modal opens
    useEffect(() => {
        if (isOpen) setView(initialView);
    }, [isOpen, initialView]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            {/* Dark Glass Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-xl animate-in fade-in duration-500"
                onClick={onClose}
            />

            {/* Modal Content - Glassmorphism */}
            <div className="relative w-full max-w-lg bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 text-white">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-2 bg-white/5 hover:bg-white/10 rounded-full text-gray-400 hover:text-white transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col w-full h-full p-8 md:p-10">
                    <div className="text-center mb-8">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 mb-4 shadow-lg shadow-black/20">
                            <ShieldCheck size={32} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                        </div>
                        <h2 className="text-3xl font-bold text-white tracking-tight">
                            {view === 'login' ? 'Welcome Back' : 'Secure Entry'}
                        </h2>
                        <p className="text-gray-400 text-sm mt-2">
                            {view === 'login' ? 'Access your encrypted dashboard.' : 'Initialize protection protocol.'}
                        </p>
                    </div>

                    {view === 'login' ? (
                        <LoginForm onClose={onClose} />
                    ) : (
                        <RegisterForm />
                    )}

                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                        <button
                            onClick={() => setView(view === 'login' ? 'register' : 'login')}
                            className="text-sm text-gray-400 hover:text-white transition-colors"
                        >
                            {view === 'login' ? (
                                <>New to Nozris? <span className="text-white font-bold underline decoration-white/30 hover:decoration-white">Initialize Setup</span></>
                            ) : (
                                <>Already protected? <span className="text-white font-bold underline decoration-white/30 hover:decoration-white">Login Access</span></>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function LoginForm({ onClose }: { onClose: () => void }) {
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [domain, setDomain] = useState('');
    const [otp, setOtp] = useState('');
    const [isPending, setIsPending] = useState(false);
    const router = useRouter();

    const handleSendOTP = async (formData: FormData) => {
        setIsPending(true);
        try {
            const result = await sendLoginOTP(formData);
            if (result.error) {
                toast.error(result.error);
            } else {
                toast.success("OTP sent to your email!");
                setStep(2);
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsPending(false);
        }
    };

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsPending(true);
        try {
            const result = await verifyLoginOTP(email, otp);
            if (result.success) {
                toast.success("Login Successful!");
                onClose();
                router.push('/client/dashboard');
            } else {
                toast.error(result.error || "Verification failed");
            }
        } catch (error) {
            toast.error("An error occurred");
        } finally {
            setIsPending(false);
        }
    };

    if (step === 2) {
        return (
            <form onSubmit={handleVerify} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="text-center p-4 bg-white/5 border border-white/10 rounded-xl mb-6">
                    <p className="text-sm text-gray-400">Enter code sent to</p>
                    <p className="font-bold text-white text-lg tracking-wide">{email}</p>
                </div>

                <div className="flex justify-center">
                    <input
                        type="text"
                        required
                        maxLength={6}
                        value={otp}
                        onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                        placeholder="000000"
                        className="w-full text-center text-4xl font-mono tracking-[0.5em] p-4 bg-black/50 border border-white/20 rounded-2xl focus:ring-2 focus:ring-white focus:border-white text-white placeholder-gray-700 outline-none transition-all shadow-inner"
                        autoFocus
                    />
                </div>

                <button
                    type="submit"
                    disabled={isPending || otp.length < 6}
                    className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                >
                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Verify & Login'}
                </button>
                <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="w-full text-xs text-gray-500 hover:text-white mt-4"
                >
                    Different Email?
                </button>
            </form>
        );
    }

    return (
        <form action={handleSendOTP} className="space-y-5 animate-in fade-in slide-in-from-left-4 duration-300">
            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 pl-1">Business Email</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                    <input
                        name="email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="name@company.com"
                        className="w-full pl-12 p-3.5 bg-white/5 border border-white/10 rounded-xl focus:bg-white/10 focus:border-white/30 focus:ring-0 text-white placeholder-gray-600 outline-none transition-all"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 pl-1">Verified Domain</label>
                <div className="relative">
                    <Globe className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                    <input
                        name="domain"
                        type="text"
                        required
                        value={domain}
                        onChange={(e) => setDomain(e.target.value)}
                        placeholder="yourdomain.com"
                        className="w-full pl-12 p-3.5 bg-white/5 border border-white/10 rounded-xl focus:bg-white/10 focus:border-white/30 focus:ring-0 text-white placeholder-gray-600 outline-none transition-all"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.2)] mt-4"
            >
                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                        Send Login Code <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
        </form>
    );
}

function RegisterForm() {
    const [isPending, setIsPending] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const handleSubmit = async (formData: FormData) => {
        setIsPending(true);
        setErrorMsg(null);
        try {
            const result = await submitLead(formData);
            if (result.error) {
                if (result.code === 409) {
                    setErrorMsg(result.error);
                } else {
                    toast.error(result.error);
                }
            } else {
                setIsSubmitted(true);
                setSuccessMessage(result.message || 'Request Received! Check your email/WhatsApp in 3 hours.');
                toast.success('Request Received! Check your email/WhatsApp in 3 hours.', { duration: 8000 });
                // NO redirect — stay on the page
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again.");
        } finally {
            setIsPending(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="text-center py-10 animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6 border border-green-500/30 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                    <CheckCircle className="w-10 h-10" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">Nozris Protocol Initialized!</h3>
                <p className="text-gray-400 mb-2 text-sm max-w-xs mx-auto">{successMessage}</p>
                <p className="text-[11px] text-gray-600 font-mono mt-4">You will receive a confirmation on WhatsApp & Email.</p>
            </div>
        );
    }

    return (
        <form action={handleSubmit} className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
            {errorMsg && (
                <div className="p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                    <ShieldAlert className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                    <div>
                        <p className="text-sm font-bold text-red-400">{errorMsg}</p>
                        <button
                            type="button"
                            onClick={() => window.dispatchEvent(new CustomEvent('open-auth-modal', { detail: { view: 'login' } }))}
                            className="text-xs text-white underline mt-1 hover:text-red-200"
                        >
                            Log in here
                        </button>
                    </div>
                </div>
            )}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 pl-1">Full Name</label>
                    <div className="relative">
                        <User className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                        <input
                            name="name" type="text" required placeholder="John Doe"
                            className="w-full pl-11 p-3 bg-white/5 border border-white/10 rounded-xl focus:bg-white/10 focus:border-white/30 focus:ring-0 text-white placeholder-gray-600 outline-none transition-all text-sm"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2 pl-1">Phone (WA)</label>
                    <div className="relative">
                        <Smartphone className="absolute left-4 top-3.5 w-4 h-4 text-gray-500" />
                        <input
                            name="whatsapp" type="tel" required placeholder="+91..."
                            className="w-full pl-11 p-3 bg-white/5 border border-white/10 rounded-xl focus:bg-white/10 focus:border-white/30 focus:ring-0 text-white placeholder-gray-600 outline-none transition-all text-sm"
                        />
                    </div>
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 pl-1">Business Email</label>
                <div className="relative">
                    <Mail className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                    <input
                        name="email" type="email" required placeholder="name@company.com"
                        className="w-full pl-12 p-3.5 bg-white/5 border border-white/10 rounded-xl focus:bg-white/10 focus:border-white/30 focus:ring-0 text-white placeholder-gray-600 outline-none transition-all"
                    />
                </div>
            </div>

            <div>
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2 pl-1">Target Domain</label>
                <div className="relative">
                    <Globe className="absolute left-4 top-3.5 w-5 h-5 text-gray-500" />
                    <input
                        name="domain" type="text" required placeholder="yourwebsite.com"
                        className="w-full pl-12 p-3.5 bg-white/5 border border-white/10 rounded-xl focus:bg-white/10 focus:border-white/30 focus:ring-0 text-white placeholder-gray-600 outline-none transition-all"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-white text-black py-4 rounded-xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2 group disabled:opacity-50 shadow-[0_0_20px_rgba(255,255,255,0.2)] mt-4"
            >
                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                    <>
                        Start Protection <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </>
                )}
            </button>
        </form>
    );
}
