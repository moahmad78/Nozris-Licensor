'use client';

import { useState } from 'react';
import { authenticate } from '@/lib/actions/auth';
import { sendPasswordResetEmail } from '@/app/actions/password-reset';
import Link from 'next/link';
import { useActionState } from 'react';

export default function LoginPage() {
    const [errorMessage, dispatch, isPending] = useActionState(authenticate, undefined);

    // Forgot Password State
    const [showForgot, setShowForgot] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetMessage, setResetMessage] = useState('');
    const [isResetting, setIsResetting] = useState(false);

    async function handleForgot() {
        if (!resetEmail) return;
        setIsResetting(true);
        const msg = await sendPasswordResetEmail(resetEmail);
        setResetMessage(msg);
        setIsResetting(false);
    }

    if (showForgot) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="w-full max-w-md space-y-8 rounded-lg border border-gray-200 bg-white p-10 shadow-lg">
                    <div className="text-center">
                        <h2 className="mt-6 text-2xl font-bold text-gray-900">Reset Password</h2>
                        <p className="mt-2 text-sm text-gray-600">Enter your email to receive a reset link.</p>
                    </div>
                    <div className="mt-8 space-y-6">
                        <div>
                            <label htmlFor="reset-email" className="sr-only">Email address</label>
                            <input
                                id="reset-email"
                                type="email"
                                required
                                value={resetEmail}
                                onChange={(e) => setResetEmail(e.target.value)}
                                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:z-10 focus:border-black focus:ring-black sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <button
                            onClick={handleForgot}
                            disabled={isResetting}
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 disabled:bg-gray-400"
                        >
                            {isResetting ? 'Sending...' : 'Send Reset Link'}
                        </button>

                        {resetMessage && (
                            <p className="text-sm text-center text-blue-600 bg-blue-50 p-2 rounded">{resetMessage}</p>
                        )}

                        <div className="text-center">
                            <button onClick={() => setShowForgot(false)} className="text-sm font-medium text-gray-600 hover:text-black">
                                Back to Login
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md space-y-8 rounded-lg border border-gray-200 bg-white p-10 shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Welcome to Nozris
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Or{' '}
                        <Link href="/register" className="font-medium text-black hover:text-gray-700 underline">
                            create a new account
                        </Link>
                    </p>
                </div>
                <form action={dispatch} className="mt-8 space-y-6">
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div className="mb-4">
                            <label htmlFor="email" className="sr-only">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                                placeholder="Email address"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="sr-only">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="relative block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                                placeholder="Password"
                            />
                        </div>
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="text-sm">
                            <button type="button" onClick={() => setShowForgot(true)} className="font-medium text-gray-600 hover:text-black">
                                Forgot your password?
                            </button>
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="group relative flex w-full justify-center rounded-md border border-transparent bg-black px-4 py-2 text-sm font-medium text-white hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 disabled:bg-gray-400"
                        >
                            {isPending ? 'Logging in...' : 'Log In'}
                        </button>
                    </div>
                    <div
                        className="flex h-8 items-end space-x-1"
                        aria-live="polite"
                        aria-atomic="true"
                    >
                        {errorMessage && (
                            <>
                                <p className="text-sm text-red-500">{errorMessage}</p>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
