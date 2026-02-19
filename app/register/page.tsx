'use client';

import { useState } from 'react';
import { register } from '@/lib/actions/auth';
import { verifyOTP } from '@/app/actions/otp';
import Link from 'next/link';
import { Loader2, ShieldCheck, Mail } from 'lucide-react';

export default function RegisterPage() {
    const [step, setStep] = useState<'REGISTER' | 'OTP' | 'SUCCESS_WAIT'>('REGISTER');
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [isPending, setIsPending] = useState(false);
    const [message, setMessage] = useState('');

    async function handleRegister(formData: FormData) {
        setIsPending(true);
        setMessage('');

        // Capture email for next step
        const emailVal = formData.get('email') as string;
        setEmail(emailVal);

        const result = await register(undefined, formData);
        setIsPending(false);

        if (result?.startsWith('OTP_SENT')) {
            setStep('OTP');
            setMessage('Verification code sent to your email.');
        } else {
            setMessage(result || 'Registration failed');
        }
    }

    async function handleVerifyOTP() {
        if (!otp || otp.length !== 6) {
            setMessage('Please enter a valid 6-digit code.');
            return;
        }
        setIsPending(true);
        const result = await verifyOTP(email, otp);
        setIsPending(false);

        if (result.success) {
            setMessage(result.message || 'Success!');
            // Optional: Redirect or show final success screen
            // For Ground Zero: Show "Waiting for Approval" and link to Login
            setStep('SUCCESS_WAIT');
        } else {
            setMessage(result.error || 'Verification failed');
        }
    }

    if (step === 'SUCCESS_WAIT') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="w-full max-w-md space-y-8 rounded-lg border border-gray-200 bg-white p-10 shadow-lg text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                        <ShieldCheck className="h-8 w-8 text-green-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Email Verified</h2>
                    <p className="text-sm text-gray-500">
                        Your account has been created and verified.
                        <br />
                        <strong>Status: Waiting for Admin Approval</strong>
                    </p>
                    <p className="text-xs text-gray-400">
                        You will receive an email once approved.
                    </p>

                    <Link href="/login" className="block w-full justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800">
                        Back to Login
                    </Link>
                </div>
            </div>
        );
    }

    if (step === 'OTP') {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="w-full max-w-md space-y-8 rounded-lg border border-gray-200 bg-white p-10 shadow-lg text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                        <Mail className="h-8 w-8 text-blue-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900">Verify Your Email</h2>
                    <p className="text-sm text-gray-500">
                        We sent a code to <strong>{email}</strong>.<br />
                        Enter it below to complete registration.
                    </p>

                    <div className="mt-6 space-y-4">
                        <input
                            type="text"
                            maxLength={6}
                            value={otp}
                            onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                            className="block w-full text-center text-2xl tracking-widest rounded-md border-gray-300 py-3 shadow-sm focus:border-black focus:ring-black"
                            placeholder="000000"
                        />

                        <button
                            onClick={handleVerifyOTP}
                            disabled={isPending}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-black hover:bg-gray-800 disabled:bg-gray-400"
                        >
                            {isPending ? <Loader2 className="animate-spin w-5 h-5" /> : 'Verify Code'}
                        </button>

                        <button
                            onClick={() => setStep('REGISTER')}
                            className="text-xs text-gray-400 hover:text-gray-600 underline"
                        >
                            Wrong email? Go back
                        </button>
                    </div>

                    {message && (
                        <div className={`mt-4 p-3 rounded text-sm ${message.includes('Success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Default: REGISTER Step
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md space-y-8 rounded-lg border border-gray-200 bg-white p-10 shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Welcome to Nozris
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/login" className="font-medium text-black hover:text-gray-700 underline">
                            Log in
                        </Link>
                    </p>
                </div>
                <form action={handleRegister} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Full Name</label>
                            <input
                                name="name" type="text" required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Email address</label>
                            <input
                                name="email" type="email" required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Password</label>
                            <input
                                name="password" type="password" required
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:bg-gray-400"
                        >
                            {isPending ? <Loader2 className="animate-spin w-5 h-5" /> : 'Create Account'}
                        </button>
                    </div>

                    {message && (
                        <div className={`p-4 rounded-md text-sm ${message.includes('SUCCESS') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                            {message}
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
