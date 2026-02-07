'use client';

import { useState } from 'react';
import { Copy, Check, Terminal } from 'lucide-react';
import { toast } from 'sonner';

interface CodeBlockProps {
    code: string;
    language?: string;
}

export function CodeBlock({ code, language = 'javascript' }: CodeBlockProps) {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        toast.success("Snippet copied to clipboard");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="relative group rounded-2xl overflow-hidden bg-black border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between px-4 py-2 bg-white/5 border-b border-white/5">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50" />
                    <div className="w-3 h-3 rounded-full bg-amber-500/20 border border-amber-500/50" />
                    <div className="w-3 h-3 rounded-full bg-emerald-500/20 border border-emerald-500/50" />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-gray-500 uppercase">{language}</span>
                    <button
                        onClick={handleCopy}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-gray-400" />}
                    </button>
                </div>
            </div>
            <pre className="p-6 overflow-x-auto text-sm font-mono leading-relaxed text-gray-300">
                <code>{code}</code>
            </pre>
        </div>
    );
}
