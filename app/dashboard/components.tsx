'use client';

import { Search, Copy, Check } from 'lucide-react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { toast, Toaster as SonnerToaster } from 'sonner';
import { useState } from 'react';

export function Toaster() {
    return <SonnerToaster position="bottom-right" />;
}

export function SearchInput() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const { replace } = useRouter();

    function handleSearch(term: string) {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('q', term);
        } else {
            params.delete('q');
        }
        replace(`${pathname}?${params.toString()}`);
    }

    return (
        <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
                className="block w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-black sm:text-sm transition-shadow shadow-sm"
                placeholder="Search domains or emails..."
                onChange={(e) => handleSearch(e.target.value)}
                defaultValue={searchParams.get('q')?.toString()}
            />
        </div>
    );
}

export function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        toast.success('License key copied to clipboard');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <button
            onClick={handleCopy}
            className={`p-1.5 rounded-md transition-colors ${copied ? 'text-green-600 bg-green-50' : 'text-gray-400 hover:text-gray-900 hover:bg-gray-100'
                }`}
            title="Copy License Key"
        >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
        </button>
    );
}
