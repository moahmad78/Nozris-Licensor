'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Verify2FAPage() {
    const [otp, setOtp] = useState('');
    const [loading, setLoading] = useState(false);
    const [tempToken, setTempToken] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const token = localStorage.getItem('2fa_temp_token');
        if (!token) {
            router.push('/login');
            return;
        }
        setTempToken(token);
    }, [router]);

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault();
        if (otp.length < 6) return;

        setLoading(true);
        try {
            const res = await fetch('/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ otp, tempToken })
            });

            const data = await res.json();
            if (res.ok) {
                toast.success("Identity Verified. Redirecting...");
                localStorage.removeItem('2fa_temp_token');
                // Complete login
                window.location.href = '/admin/dashboard';
            } else {
                toast.error(data.error || "Invalid OTP");
            }
        } catch (error) {
            toast.error("Verification failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black flex items-center justify-center p-6 z-[9999]">
            <div className="max-w-md w-full space-y-8 bg-gray-900 border border-gray-800 p-10 rounded-[3rem] shadow-2xl relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-900/20 via-transparent to-transparent opacity-50" />

                <div className="relative z-10 text-center space-y-6">
                    <div className="flex justify-center">
                        <div className="bg-blue-600/10 p-5 rounded-full ring-1 ring-blue-500/20 animate-pulse">
                            <ShieldCheck className="w-12 h-12 text-blue-400" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h1 className="text-3xl font-black tracking-tighter text-white uppercase italic">Security Step Required</h1>
                        <p className="text-xs text-gray-400 font-medium leading-relaxed">
                            Two-Factor Authentication is active. Enter the 6-digit code sent to your registered email to gain access.
                        </p>
                    </div>

                    <form onSubmit={handleVerify} className="space-y-6 pt-4">
                        <div className="space-y-4">
                            <input
                                type="text"
                                maxLength={6}
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))}
                                placeholder="000000"
                                className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 text-center text-4xl font-black tracking-[0.5em] text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-gray-700"
                                required
                                autoFocus
                            />
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest text-center">
                                Code expires in 5 minutes
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading || otp.length < 6}
                            className="w-full bg-white text-black py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-blue-400 hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-3"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify Identity"}
                        </button>
                    </form>

                    <button
                        onClick={() => router.push('/login')}
                        className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em] hover:text-white transition-colors pt-4"
                    >
                        Back to Login
                    </button>
                </div>

                <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-blue-600 rounded-full blur-[100px] opacity-10" />
            </div>
        </div>
    );
}
