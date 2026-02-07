'use client';

import { useState } from 'react';
import { sendLoginOTP, verifyLoginOTP } from '@/app/actions/client-auth';
import { toast, Toaster } from 'sonner';
import { Loader2, Mail, Globe, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ClientLoginPage() {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [email, setEmail] = useState('');
    const [domain, setDomain] = useState('');
    const [otp, setOtp] = useState('');
    const [isPending, setIsPending] = useState(false);

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

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <Toaster />

            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-black p-8 text-white text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm border border-white/20">
                        <Lock className="w-8 h-8 text-white" />
                    </div>
                    <h1 className="text-2xl font-bold">Client Portal</h1>
                    <p className="text-gray-400 mt-2 text-sm">Access your licenses and history securely.</p>
                </div>

                <div className="p-8">
                    {step === 1 ? (
                        <form action={handleSendOTP} className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Registered Email</label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        name="email"
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="client@example.com"
                                        className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Domain Name</label>
                                <div className="relative">
                                    <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                    <input
                                        name="domain"
                                        type="text"
                                        required
                                        value={domain}
                                        onChange={(e) => setDomain(e.target.value)}
                                        placeholder="yourdomain.com"
                                        className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:outline-none transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2 group disabled:opacity-70"
                            >
                                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        Send Login Code
                                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        </form>
                    ) : (
                        <form onSubmit={handleVerify} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center">
                                <h3 className="text-lg font-bold text-gray-900">Verify Identity</h3>
                                <p className="text-sm text-gray-500 mt-1">
                                    Enter the 6-digit code sent to <br />
                                    <span className="font-medium text-black">{email}</span>
                                </p>
                            </div>

                            <div className="flex justify-center">
                                <input
                                    type="text"
                                    required
                                    maxLength={6}
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                    placeholder="000000"
                                    className="w-48 text-center text-3xl font-mono tracking-[0.5em] p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:outline-none transition-all"
                                    autoFocus
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isPending || otp.length < 6}
                                className="w-full bg-green-600 text-white py-3.5 rounded-xl font-bold hover:bg-green-700 transition-all shadow-lg shadow-green-100 flex items-center justify-center gap-2 disabled:opacity-70"
                            >
                                {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                    <>
                                        <ShieldCheck className="w-5 h-5" />
                                        Verify & Login
                                    </>
                                )}
                            </button>

                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                className="w-full text-sm text-gray-400 hover:text-gray-600"
                            >
                                Back to Details
                            </button>
                        </form>
                    )}
                </div>
            </div>

            <div className="mt-8 text-center text-xs text-gray-400">
                &copy; {new Date().getFullYear()} Client Portal. Secure Access.
            </div>
        </div>
    );
}
