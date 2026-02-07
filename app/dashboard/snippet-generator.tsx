'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function SnippetGenerator() {
    const [copied, setCopied] = useState(false);

    const snippet = `
import { useEffect, useState } from 'react';

export function useLicense(licenseKey: string) {
  const [isValid, setIsValid] = useState<boolean | null>(null);

  useEffect(() => {
    async function validate() {
      try {
        const res = await fetch('https://your-domain.com/api/license/validate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            licenseKey, 
            domain: window.location.hostname 
          }),
        });
        const data = await res.json();
        setIsValid(data.valid);
      } catch (error) {
        setIsValid(false);
      }
    }
    validate();
  }, [licenseKey]);

  return isValid;
}
`.trim();

    const handleCopy = () => {
        navigator.clipboard.writeText(snippet);
        setCopied(true);
        toast.success('Snippet copied!');
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-zinc-900 text-zinc-100 p-6 rounded-xl border border-zinc-800">
            <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Use License Hook</h3>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-md transition-colors"
                >
                    {copied ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                    {copied ? 'Copied' : 'Copy Code'}
                </button>
            </div>
            <pre className="font-mono text-sm overflow-x-auto text-zinc-400 bg-black/50 p-4 rounded-lg">
                <code className="language-typescript">{snippet}</code>
            </pre>
        </div>
    );
}
