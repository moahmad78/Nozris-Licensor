'use client';

import { useState, useEffect } from 'react';
import { submitRenewal } from '@/lib/actions';
import { checkLicenseStatus } from '@/app/actions/check-status';
import { getProfile } from '@/app/actions/profile';
import { toast, Toaster } from 'sonner';
import { Loader2, Search, CheckCircle, Smartphone, MessageCircle, Mail, AlertTriangle, Download, ShieldCheck, RefreshCw } from 'lucide-react';
import { generateCertificatePDF } from '@/lib/client-pdf';

export default function RenewPage() {
    // Mode: 'RENEW' or 'CHECK'
    const [mode, setMode] = useState<'RENEW' | 'CHECK'>('RENEW');

    // Renew State
    const [step, setStep] = useState(1);
    const [domain, setDomain] = useState('');
    const [duration, setDuration] = useState('1');
    const [transactionId, setTransactionId] = useState('');
    const [isPending, setIsPending] = useState(false);

    // Check Status State
    const [checkKey, setCheckKey] = useState('');
    const [checkResult, setCheckResult] = useState<any>(null);
    const [isChecking, setIsChecking] = useState(false);

    // Profile State
    const [profile, setProfile] = useState<any>(null);
    const [supportContacts, setSupportContacts] = useState({ whatsapp: '', email: '' });
    const [logo, setLogo] = useState('');

    useEffect(() => {
        async function loadProfile() {
            const data = await getProfile();
            setProfile(data); // Store full profile for PDF
            if (data) {
                setSupportContacts({
                    whatsapp: data.whatsappNumber,
                    email: data.supportEmail
                });
                if (data.logo) {
                    setLogo(data.logo);
                }
            }
        }
        loadProfile();
    }, []);

    const baseRate = 500;
    const amount = parseInt(duration) * baseRate;

    // --- Actions ---

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (domain.includes('.')) {
            setStep(2);
        } else {
            toast.error("Please enter a valid domain");
        }
    };

    const handleSubmitRenewal = async (formData: FormData) => {
        setIsPending(true);
        formData.append('domain', domain);
        formData.append('duration', duration);
        formData.append('amount', amount.toString());
        formData.append('transactionId', transactionId);

        try {
            const result = await submitRenewal(formData);
            if (result?.error) {
                toast.error(result.error);
            } else {
                setStep(3);
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsPending(false);
        }
    };

    const handleCheckStatus = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!checkKey || checkKey.length < 5) {
            toast.error("Please enter a valid license key");
            return;
        }

        setIsChecking(true);
        setCheckResult(null);

        try {
            const result = await checkLicenseStatus(checkKey);
            if (result.error) {
                toast.error(result.error);
                if (result.blocked) {
                    // Could redirect to blocked page, but toast is enough for now
                    window.location.href = '/blocked';
                }
            } else {
                setCheckResult(result.data);
                toast.success("License Found!");
            }
        } catch (error) {
            toast.error("Failed to check status");
        } finally {
            setIsChecking(false);
        }
    };

    const handleDownloadCertificate = () => {
        if (!checkResult || !profile) return;

        const pdfData = {
            ...checkResult,
            senderName: profile.fullName,
            senderEmail: profile.supportEmail,
            senderWhatsapp: profile.whatsappNumber,
            senderAddress: "Gorakhpur, UP", // Or fetch from profile if available
            logo: profile.logo,
            licenseKey: checkKey,
            price: 500 // Assuming standard price access or fetch
        };
        generateCertificatePDF(pdfData);
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <Toaster />
            <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-100 p-8">

                {/* Header / Logo */}
                <div className="text-center mb-6">
                    <div className="flex justify-center mb-4">
                        {logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={logo} alt="Company Logo" className="h-16 object-contain" />
                        ) : null}
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900">License Portal</h1>
                </div>

                {/* Mode Switcher */}
                <div className="flex p-1 bg-gray-100 rounded-xl mb-8">
                    <button
                        onClick={() => setMode('RENEW')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${mode === 'RENEW' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <RefreshCw className="w-4 h-4" />
                        Renew License
                    </button>
                    <button
                        onClick={() => setMode('CHECK')}
                        className={`flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-medium rounded-lg transition-all ${mode === 'CHECK' ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-gray-700'
                            }`}
                    >
                        <ShieldCheck className="w-4 h-4" />
                        Check Status
                    </button>
                </div>

                {/* --- RENEW VIEW --- */}
                {mode === 'RENEW' && (
                    <>
                        {step === 1 && (
                            <form onSubmit={handleSearch} className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Domain Name</label>
                                    <div className="relative">
                                        <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            required
                                            placeholder="yourwebsite.com"
                                            value={domain}
                                            onChange={(e) => setDomain(e.target.value)}
                                            className="w-full pl-10 p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                                            autoFocus
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors">
                                    Continue to Renewal
                                </button>
                            </form>
                        )}

                        {step === 2 && (
                            <form action={handleSubmitRenewal} className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                                <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                                    <span className="text-xs text-gray-400 uppercase tracking-wider font-semibold">Renewing For</span>
                                    <div className="font-medium text-gray-900 text-lg">{domain}</div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Duration</label>
                                    <select
                                        value={duration}
                                        onChange={(e) => setDuration(e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:outline-none appearance-none bg-white"
                                    >
                                        <option value="1">1 Month</option>
                                        <option value="3">3 Months</option>
                                        <option value="6">6 Months</option>
                                        <option value="12">1 Year (Best Value)</option>
                                    </select>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-blue-50 text-blue-900 rounded-xl border border-blue-100">
                                    <span className="font-medium">Total Amount</span>
                                    <span className="text-xl font-bold">₹{amount}</span>
                                </div>

                                <div className="space-y-4">
                                    <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center text-center">
                                        <Smartphone className="w-8 h-8 text-gray-300 mb-2" />
                                        <p className="text-sm text-gray-500">Scan QR to Pay</p>
                                        <div className="text-xs text-gray-400 mt-1">(Placeholder Image)</div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Transaction ID / UTR</label>
                                        <input
                                            type="text"
                                            required
                                            placeholder="Enter payment reference"
                                            value={transactionId}
                                            onChange={(e) => setTransactionId(e.target.value)}
                                            className="w-full p-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:outline-none"
                                        />
                                    </div>
                                </div>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setStep(1)}
                                        className="flex-1 py-3 text-gray-600 bg-white border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                                    >
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="flex-[2] bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 flex justify-center"
                                    >
                                        {isPending ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Submit Request'}
                                    </button>
                                </div>
                            </form>
                        )}

                        {step === 3 && (
                            <div className="text-center py-8 animate-in fade-in zoom-in duration-300">
                                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <CheckCircle className="w-8 h-8" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">Request Submitted!</h3>
                                <p className="text-gray-500 mb-6">
                                    We have received your renewal request for <span className="font-medium">{domain}</span>.
                                    You will receive a confirmation once the Admin approves it.
                                </p>
                                <button
                                    onClick={() => { setStep(1); setDomain(''); setTransactionId(''); }}
                                    className="text-black font-medium hover:underline"
                                >
                                    Submit Another Request
                                </button>
                            </div>
                        )}
                    </>
                )}

                {/* --- CHECK STATUS VIEW --- */}
                {mode === 'CHECK' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
                        {!checkResult ? (
                            <form onSubmit={handleCheckStatus} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">License Key</label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="Enter your license key..."
                                        value={checkKey}
                                        onChange={(e) => setCheckKey(e.target.value)}
                                        className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-black focus:outline-none font-mono text-sm"
                                        autoFocus
                                    />
                                </div>
                                <button
                                    type="submit"
                                    disabled={isChecking}
                                    className="w-full bg-black text-white py-3 rounded-xl font-medium hover:bg-gray-800 transition-colors disabled:opacity-70 flex justify-center"
                                >
                                    {isChecking ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Check Status'}
                                </button>
                            </form>
                        ) : (
                            <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200 space-y-4">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-bold text-gray-900">License Details</h3>
                                    {checkResult.status === 'ACTIVE' ? (
                                        <span className="flex items-center gap-1 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-bold">
                                            <CheckCircle className="w-3 h-3" /> ACTIVE
                                        </span>
                                    ) : (
                                        <span className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded-full text-xs font-bold">
                                            <AlertTriangle className="w-3 h-3" /> EXPIRED
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Domain</span>
                                        <span className="font-medium text-gray-900">{checkResult.domain}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Plan</span>
                                        <span className="font-medium text-gray-900">{checkResult.planName}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Expires</span>
                                        <span className={`font-medium ${checkResult.status === 'EXPIRED' ? 'text-red-600' : 'text-gray-900'}`}>
                                            {new Date(checkResult.expiresAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-200 flex flex-col gap-3">
                                    {checkResult.status === 'ACTIVE' ? (
                                        <button
                                            onClick={handleDownloadCertificate}
                                            className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 text-gray-700 py-2.5 rounded-xl font-medium hover:bg-gray-50 transition-colors shadow-sm"
                                        >
                                            <Download className="w-4 h-4" />
                                            Download Certificate
                                        </button>
                                    ) : (
                                        <button
                                            onClick={() => { setMode('RENEW'); setDomain(checkResult.domain); setStep(2); }}
                                            className="w-full flex items-center justify-center gap-2 bg-red-600 text-white py-2.5 rounded-xl font-bold hover:bg-red-700 transition-colors shadow-sm animate-pulse"
                                        >
                                            Renew Now
                                        </button>
                                    )}
                                    <button
                                        onClick={() => { setCheckResult(null); setCheckKey(''); }}
                                        className="text-xs text-gray-400 hover:text-gray-600 hover:underline text-center"
                                    >
                                        Check Another Key
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Dynamic Support Section */}
                <div className="mt-8 pt-6 border-t border-gray-100">
                    <p className="text-xs font-semibold text-gray-400 text-center uppercase tracking-wider mb-3">Need Help?</p>
                    <div className="flex gap-2 justify-center">
                        {supportContacts.whatsapp && (
                            <a
                                href={`https://wa.me/${supportContacts.whatsapp.replace(/[^0-9]/g, '')}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100 transition-colors"
                            >
                                <MessageCircle className="w-4 h-4" />
                                Chat with Support
                            </a>
                        )}
                        {supportContacts.email && (
                            <a
                                href={`mailto:${supportContacts.email}`}
                                className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors"
                            >
                                <Mail className="w-4 h-4" />
                                Email Us
                            </a>
                        )}
                    </div>
                </div>
            </div>

            <div className="mt-8 text-center text-xs text-gray-400">
                &copy; {new Date().getFullYear()} License Manager. Secure Payments.
            </div>
        </div>
    );
}
