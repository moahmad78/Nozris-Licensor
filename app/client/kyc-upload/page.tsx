'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Upload, FileText, CheckCircle, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import Link from 'next/link';
import { uploadKYCDocument } from '@/app/actions/client-kyc';

function KYCUploadContent() {
    const searchParams = useSearchParams();
    const emailData = searchParams.get('email');
    const [uploaded, setUploaded] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        // Append email if not in form input (it is, but safer to rely on state/hidden if needed)
        // If the user didn't enter it, we might need a fallback.
        // Assuming the form input name="email" is used or we append it.

        toast.promise(uploadKYCDocument(formData), {
            loading: 'Encrypting & Uploading to Vault...',
            success: (data) => {
                setLoading(false);
                if (data.success) {
                    setUploaded(true);
                    return data.message;
                } else {
                    throw new Error(data.message);
                }
            },
            error: (err) => {
                setLoading(false);
                return err.message;
            },
        });
    };

    if (uploaded) {
        return (
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 p-8 text-center animate-in fade-in zoom-in duration-300">
                <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-3">KYC Submitted</h2>
                <p className="text-gray-500 mb-8">
                    Your documents are under review. Expected verification time: <strong>2-4 Hours</strong>.
                    <br />You will receive your License Key via WhatsApp.
                </p>
                <Link href="/client/dashboard" className="block w-full bg-black text-white py-3.5 rounded-xl font-bold hover:bg-gray-800 transition-all">
                    Return to Command Center
                </Link>
            </div>
        );
    }

    return (
        <div className="max-w-xl w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
            <div className="bg-black p-8 text-white">
                <div className="flex items-center gap-2 mb-4">
                    <ShieldCheck className="w-6 h-6 text-green-400" />
                    <span className="font-bold tracking-tight">LicenseGuard KYC</span>
                </div>
                <h1 className="text-2xl font-bold">Verify Your Identity</h1>
                <p className="text-gray-400 mt-2 text-sm">
                    Upload business proof to activate your license securely.
                </p>
            </div>

            <div className="p-8">
                <form onSubmit={handleUpload} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Account Email</label>
                        <input
                            type="email"
                            name="email"
                            defaultValue={emailData || ''}
                            placeholder="Enter your registered email"
                            required
                            className="w-full p-3 bg-gray-50 border border-gray-200 rounded-xl font-bold focus:ring-2 focus:ring-black outline-none"
                        />
                    </div>

                    <div className="space-y-4">
                        <label className="block p-6 border-2 border-dashed border-gray-200 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group">
                            <div className="flex flex-col items-center gap-3">
                                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <div className="text-center">
                                    <p className="font-bold text-gray-900">Business Registration / ID Proof</p>
                                    <p className="text-sm text-gray-400">PDF, JPG or PNG (Max 5MB)</p>
                                </div>
                            </div>
                            <input type="file" name="document" className="hidden" required accept=".pdf,.jpg,.jpeg,.png" />
                        </label>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-black text-white py-4 rounded-xl font-bold hover:bg-gray-800 transition-all shadow-lg flex items-center justify-center gap-2"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <Upload className="w-4 h-4" />}
                        {loading ? 'Encrypting...' : 'Upload & Submit'}
                    </button>

                    <p className="text-center text-xs text-gray-400">
                        Your data is encrypted using AES-256 military grade standards.
                    </p>
                </form>
            </div>
        </div>
    );
}

export default function KYCUploadPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <Toaster position="top-center" />
            <Suspense fallback={<div>Loading...</div>}>
                <KYCUploadContent />
            </Suspense>
        </div>
    );
}
