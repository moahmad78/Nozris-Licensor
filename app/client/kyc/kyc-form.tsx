'use client';

import { useState } from 'react';
import { updateClientProfile, uploadClientFile } from '@/app/actions/client-kyc';
import { Loader2, ArrowRight, ArrowLeft, Upload, CheckCircle, ShieldCheck, User, MapPin, CreditCard, AlertTriangle, FileText } from 'lucide-react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function KYCForm({ client }: { client: any }) {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);

    // Progress Calculation
    const fields = [client.name, client.profilePhoto, client.address, client.aadharNumber, client.documentUrl];
    const filled = fields.filter(f => f).length;
    const progress = Math.round((filled / 5) * 100);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        formData.append('email', client.email);

        try {
            const response = await fetch('/api/client/kyc', {
                method: 'POST',
                body: formData
            });
            const res = await response.json();

            if (res.error) toast.error(res.error);
            else {
                toast.success("KYC Details Submitted! Mohd Ahmad will verify and notify you soon.");
                setTimeout(() => {
                    router.push('/client/dashboard');
                }, 2000);
            }
        } catch (err) {
            toast.error("Failed to submit KYC");
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, type: 'document' | 'photo') => {
        const file = e.target.files?.[0];
        if (!file) return;

        setLoading(true);
        const fd = new FormData();
        fd.append('file', file);
        fd.append('type', type);

        try {
            const res = await uploadClientFile(client.email, fd);
            if (res.error) toast.error(res.error);
            else toast.success(`${type === 'photo' ? 'Photo' : 'Document'} uploaded!`);
        } catch (err) {
            toast.error("Upload Error");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            {/* Header */}
            <div className="bg-black p-6 text-white flex justify-between items-center">
                <div>
                    <h1 className="text-xl font-bold flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-green-400" />
                        Complete Your KYC
                    </h1>
                    <p className="text-gray-400 text-sm mt-1">Verify your identity to activate full access.</p>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-bold">{progress}%</div>
                    <div className="text-xs text-gray-500">Completed</div>
                </div>
            </div>

            {/* Progress Bar */}
            <div className="h-1 bg-gray-100 w-full">
                <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${progress}%` }}></div>
            </div>

            <div className="p-8">
                <form onSubmit={handleUpdate} className="space-y-6">

                    {/* Step 1: Personal Info */}
                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" /> Personal Information
                            </h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                <input name="name" defaultValue={client.name} required className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Photo</label>
                                <div className="flex items-center gap-4">
                                    {client.profilePhoto && (
                                        <img src={client.profilePhoto} className="w-12 h-12 rounded-full object-cover border" />
                                    )}
                                    <label className="cursor-pointer bg-gray-100 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition flex items-center gap-2">
                                        <Upload className="w-4 h-4" /> Upload Photo
                                        <input type="file" name="profilePhoto" accept="image/*" className="hidden" onChange={(e) => handleFileUpload(e, 'photo')} />
                                    </label>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Address */}
                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <MapPin className="w-5 h-5 text-red-600" /> Address Details
                            </h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Complete Address</label>
                                <textarea name="address" defaultValue={client.address || ''} required rows={3} className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none placeholder:text-gray-400" placeholder="Street, City, State, ZIP Code" />
                            </div>
                        </div>
                    )}

                    {/* Step 3: Identity */}
                    {step === 3 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h2 className="text-lg font-semibold flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-purple-600" /> Identity Verification
                            </h2>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Aadhar Number</label>
                                <input name="aadharNumber" defaultValue={client.aadharNumber || ''} required placeholder="XXXX-XXXX-XXXX" className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-black outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Upload Aadhar Card (Front & Back)</label>
                                <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:bg-gray-50 transition-colors">
                                    {client.documentUrl ? (
                                        <div className="flex flex-col items-center">
                                            <FileText className="w-8 h-8 text-green-500 mb-2" />
                                            <span className="text-sm text-green-600 font-medium">Document Uploaded</span>
                                            <a href={client.documentUrl} target="_blank" className="text-xs text-blue-500 hover:underline mt-1">View Document</a>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer block">
                                            <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                            <span className="text-sm text-gray-500">Click to upload PDF or Image</span>
                                            <input type="file" name="aadharImage" required accept=".pdf,.jpg,.png" className="hidden" onChange={(e) => handleFileUpload(e, 'document')} />
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Navigation */}
                    <div className="flex justify-between pt-4 border-t border-gray-100">
                        {step > 1 ? (
                            <button type="button" onClick={() => setStep(step - 1)} className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-lg flex items-center gap-2 transition">
                                <ArrowLeft className="w-4 h-4" /> Back
                            </button>
                        ) : <div></div>}

                        <button type="submit" disabled={loading} className="px-6 py-2 bg-black text-white rounded-lg flex items-center gap-2 hover:bg-gray-800 transition shadow disabled:opacity-70">
                            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                            {step === 3 ? 'Submit for Verification' : 'Next Step'}
                            {step < 3 && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}


