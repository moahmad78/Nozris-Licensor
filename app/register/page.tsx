'use client';

import { useState } from 'react';
import { submitLead } from '@/app/actions/leads';
import { toast, Toaster } from 'sonner';
import { Loader2, ShieldCheck, User, Mail, Smartphone, Globe, ArrowRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function RegisterPage() {
    const [isPending, setIsPending] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (formData: FormData) => {
        setIsPending(true);
        try {
            const result = await submitLead(formData);
            if (result.error) {
                toast.error(result.error);
            } else {
                setIsSubmitted(true);
                toast.success("Registration Received!");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsPending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <Toaster />

            <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                <div className="bg-black p-8 text-white">
                    <div className="flex justify-between items-start">
                        <div>
                            <div className="inline-flex items-center gap-2 mb-4">
                                <ShieldCheck className="w-6 h-6 text-green-400" />
                                <span className="font-bold tracking-tight">LicenseGuard</span>
                            </div>
                            <h1 className="text-3xl font-bold">Secure Your Website</h1>
                            <p className="text-gray-400 mt-2">Register for a secured license and protect your intellectual property.</p>
                        </div>
                    </div>
                </div>

                <div className="p-8">
                    {!isSubmitted ? (
                        <form action={handleSubmit} className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <input
                                            name="name" type="text" required placeholder="John Doe"
                                            className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Business Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <input
                                            name="email" type="email" required placeholder="john@business.com"
                                            className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
                                    <div className="relative">
                                        <Smartphone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <input
                                            name="whatsapp" type="tel" required placeholder="+91 98765 43210"
                                            className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Target Domain</label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                                        <input
                                            name="domain" type="text" required placeholder="mysite.com"
                                            className="w-full pl-10 p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isPending}
                                    className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg shadow-gray-200 flex items-center justify-center gap-2 group disabled:opacity-70"
                                >
                                    {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                                        <>
                                            Get Secured Now
                                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                                <p className="text-center text-xs text-gray-400 mt-4">
                                    Verification required. Admin (Mohd Ahmad) will contact you for KYC.
                                </p>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center py-12 animate-in fade-in zoom-in duration-300">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-3">Verification Pending</h2>
                            <p className="text-gray-500 max-w-sm mx-auto mb-8">
                                Your registration has been received. Our team will verify your details and contact you shortly for KYC documents (Aadhar/Business Proof).
                            </p>
                            <Link href="/" className="text-black font-medium hover:underline">
                                Return to Home
                            </Link>
                        </div>
                    )}
                </div>

                {/* Footer link for existing clients */}
                {!isSubmitted && (
                    <div className="bg-gray-50 p-4 text-center border-t border-gray-100">
                        <span className="text-sm text-gray-500">Already verified? </span>
                        <Link href="/client/login" className="text-sm font-bold text-black hover:underline">
                            Login here
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
