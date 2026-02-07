'use client';

import { useState } from 'react';
import { Megaphone, X, ExternalLink } from 'lucide-react';

export function GlobalBanner({ announcement }: { announcement?: { id: string, title: string, message: string } | null }) {
    const [isVisible, setIsVisible] = useState(true);

    if (!announcement || !isVisible) return null;

    return (
        <div className="bg-black text-white relative animate-in slide-in-from-top duration-500">
            <div className="max-w-7xl mx-auto px-4 py-3 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex-1 flex items-center gap-3">
                        <span className="flex p-2 rounded-lg bg-white/20">
                            <Megaphone className="h-4 w-4 text-white" />
                        </span>
                        <p className="font-medium text-sm">
                            <span className="hidden md:inline font-bold mr-2">[ IMPORTANT NEWS ]</span>
                            <span className="text-white/90">{announcement.title}:</span>
                            <span className="ml-1 text-white/80 font-normal">{announcement.message}</span>
                        </p>
                    </div>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsVisible(false)}
                            className="p-2 rounded-md hover:bg-white/10 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
