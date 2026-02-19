'use client';

import { useState, useEffect } from 'react';
import { submitPayment } from '@/app/actions/payment-actions';
import { QrCode, ArrowRight, ShieldCheck, CreditCard } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export default function PayPage() {
    const [utr, setUTR] = useState('');
    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState<any>(null);
    const router = useRouter();

    useEffect(() => {
        import('@/app/actions/payment-actions').then(mod => {
            mod.getPaymentStatus().then(setStatus);
        });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (utr.length < 12) {
            toast.error("UTR must be at least 12 characters");
            return;
        }
        setLoading(true);
        const res = await submitPayment(utr);
        if (res.success) {
            router.push('/client/pay/waiting');
        } else {
            toast.error(res.error || "Submission Failed");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row relative">
            {/* REJECTION ALERT */}
            {status?.latestPayment?.status === 'REJECTED' && (
                <div className="absolute top-0 left-0 w-full bg-red-600 text-white z-50 p-4 shadow-xl animate-in slide-in-from-top duration-500">
                    <div className="max-w-4xl mx-auto flex items-start gap-4">
                        <div className="bg-white/20 p-2 rounded-full mt-1">
                            <ShieldCheck className="w-5 h-5 text-white" />
                        </div>
                        <div className="flex-1">
                            <h3 className="font-black uppercase tracking-widest text-sm mb-1">⚠️ Payment Rejected</h3>
                            <p className="text-sm font-medium opacity-90">Reason: <span className="font-bold underline">{status.latestPayment.rejectionReason}</span></p>
                            <p className="text-xs opacity-75 mt-1">Please check your details and resubmit the correct UTR below.</p>
                        </div>
                        <button onClick={() => setStatus(null)} className="text-white/50 hover:text-white">✕</button>
                    </div>
                </div>
            )}

            {/* Left Side: QR & Instructions */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-white border-r border-gray-100">
                <div className="max-w-md mx-auto w-full space-y-8">
                    <div>
                        <h1 className="text-3xl font-black text-gray-900 tracking-tighter mb-2">Secure Payment</h1>
                        <p className="text-gray-500 font-medium">Scan the UPI QR Code to extend your license.</p>
                    </div>

                    <div className="bg-black p-6 rounded-3xl inline-block shadow-2xl transform hover:scale-105 transition-transform duration-300">
                        {/* Placeholder QR or Real one if user provided image. User said "Ahmad's UPI QR" but didn't provide file. Using icon placeholder style. */}
                        <div className="bg-white p-4 rounded-xl aspect-square flex items-center justify-center w-64 h-64 border-2 border-dashed border-gray-300">
                            <QrCode className="w-32 h-32 text-gray-900" />
                            {/* In real implementaton: <img src="/qr.jpg" /> */}
                        </div>
                        <div className="text-center mt-4">
                            <p className="text-white text-xs font-black uppercase tracking-widest opacity-50">Scan with Any UPI App</p>
                        </div>
                    </div>

                    <div className="flex gap-4 opacity-50 grayscale transition-all hover:grayscale-0">
                        {/* Icons for GPay, PhonePe etc essentially implies standard UPI */}
                        <div className="h-8 bg-gray-200 w-12 rounded"></div>
                        <div className="h-8 bg-gray-200 w-12 rounded"></div>
                        <div className="h-8 bg-gray-200 w-12 rounded"></div>
                    </div>
                </div>
            </div>

            {/* Right Side: UTR Form */}
            <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-[#F0F2F5]">
                <div className="max-w-md mx-auto w-full space-y-6">
                    <div className="bg-white p-8 rounded-[2rem] shadow-xl border border-gray-100">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="bg-indigo-100 p-2 rounded-lg text-indigo-600">
                                <ShieldCheck className="w-6 h-6" />
                            </div>
                            <div>
                                <h2 className="text-lg font-black text-gray-900">Verify Transaction</h2>
                                <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Enter UTR / Ref No.</p>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">
                                    12-Digit UTR Number
                                </label>
                                <input
                                    type="text"
                                    value={utr}
                                    onChange={(e) => setUTR(e.target.value.replace(/\D/g, ''))} // number only? usually alphanumeric. let's allow text but strict check.
                                    // Actually UTRs are often numeric but sometimes alphanumeric depending on bank. 
                                    // Let's remove replace restrict if UTR can be alphanumeric. 
                                    // User said "12-Digit", usually numbers. I'll stick to text input but suggest digits.
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 font-mono text-lg font-bold outline-none focus:ring-2 focus:ring-black transition-all placeholder:text-gray-300"
                                    placeholder="e.g. 304981290123"
                                    required
                                    minLength={12}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-4 rounded-xl font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition-all flex items-center justify-center gap-2 group"
                            >
                                {loading ? 'Verifying...' : 'Submit for Approval'}
                                {!loading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>
                    </div>

                    <p className="text-center text-xs font-medium text-gray-400">
                        Verification typically takes 10-15 minutes during business hours.
                    </p>
                </div>
            </div>
        </div>
    );
}
