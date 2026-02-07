'use client';

import { LogOut } from 'lucide-react';
import { logout } from '@/lib/actions/auth';

export function SignOutButton() {
    return (
        <form action={logout}>
            <button
                type="submit"
                className="flex items-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
                <LogOut className="h-4 w-4" />
                Sign Out
            </button>
        </form>
    );
}
