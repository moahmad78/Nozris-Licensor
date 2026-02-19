'use client';

import { useState } from 'react';
import { resetPassword } from '@/app/actions/password-reset';
import { useSearchParams, useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';

export default function ResetPasswordPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get('token');

    const [isPending, setIsPending] = useState(false);
    const [message, setMessage] = useState('');

    if (!token) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">
                <div className="p-8 bg-white rounded-lg shadow-md text-center">
                    <h2 className="text-xl font-bold text-red-600 mb-2">Invalid Request</h2>
                    <p className="text-gray-600">No reset token found in URL.</p>
                </div>
            </div>
        );
    }

    async function handleSubmit(formData: FormData) {
        setIsPending(true);
        const password = formData.get('password') as string;
        const confirm = formData.get('confirm') as string;

        const result = await resetPassword(token!, password, confirm);
        setMessage(result);
        setIsPending(false);

        if (result.includes("SUCCESS")) {
            setTimeout(() => router.push('/login'), 3000);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="w-full max-w-md space-y-8 rounded-lg border border-gray-200 bg-white p-10 shadow-lg">
                <div className="text-center">
                    <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                        Reset Password
                    </h2>
                </div>

                <form action={handleSubmit} className="mt-8 space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">New Password</label>
                            <input
                                name="password" type="password" required minLength={6}
                                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black sm:text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
                            <input
                                name="confirm" type="password" required minLength={6}
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
                            {isPending ? <Loader2 className="animate-spin w-5 h-5" /> : 'Set New Password'}
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
