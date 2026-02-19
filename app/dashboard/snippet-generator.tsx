'use client';

import { useState } from 'react';
import { Copy, Check, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function SnippetGenerator({ licenseKey, domain }: { licenseKey?: string; domain?: string }) {
  const [copied, setCopied] = useState<string | null>(null);

  // Generate the obfuscated embed tag
  const shieldUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/nozris.js`
    : 'https://your-domain.com/nozris.js';

  const keyDisplay = licenseKey || 'YOUR_LICENSE_KEY';

  // === Snippet 1: Script embed tag ===
  const embedSnippet = `<!-- Nozris Shield v2 — Do NOT remove -->
<script data-k="${keyDisplay}" src="${shieldUrl}" defer></script>`;

  // === Snippet 2: Required CSS (client must add to their stylesheet) ===
  const cssSnippet = `/* Nozris Shield — Required Base Styles */
/* The shield script will reveal #app-root after verification */
#app-root {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
}
.license-warning {
  display: flex;
  position: fixed;
  top: 0; left: 0;
  width: 100%; height: 100%;
  z-index: 999999;
  background: #0a0a0a;
  color: #71717a;
  align-items: center;
  justify-content: center;
  font-family: system-ui, sans-serif;
  text-align: center;
}
.license-warning p {
  font-size: 0.875rem;
}`;

  // === Snippet 3: Required HTML skeleton ===
  const htmlSnippet = `<!-- Add this BEFORE your main content -->
<div class="license-warning">
  <p>Loading secure content...</p>
</div>

<!-- Your actual site content MUST be inside #app-root -->
<div id="app-root">
  <!-- All your website content goes here -->
</div>`;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-zinc-900 to-zinc-800 text-white p-6 rounded-xl border border-zinc-700">
        <div className="flex items-center gap-3 mb-3">
          <div className="p-2 bg-green-500/20 rounded-lg">
            <Shield className="w-5 h-5 text-green-400" />
          </div>
          <h3 className="font-bold text-lg">Nozris Integration Kit</h3>
        </div>
        <p className="text-sm text-zinc-400 leading-relaxed">
          Follow all 3 steps below to integrate the Nozris Shield into your client&apos;s website.
          {domain && <> Currently configured for <code className="text-green-400 bg-green-500/10 px-1.5 py-0.5 rounded text-xs font-mono">{domain}</code>.</>}
        </p>
      </div>

      {/* Step 1: Script Tag */}
      <CodeBlock
        step={1}
        title="Embed the Nozris Script"
        description="Add this script tag to the <head> or bottom of <body> of the client's HTML."
        code={embedSnippet}
        language="html"
        copied={copied === 'Script tag'}
        onCopy={() => handleCopy(embedSnippet, 'Script tag')}
      />

      {/* Step 2: CSS */}
      <CodeBlock
        step={2}
        title="Add Required CSS"
        description="Add these styles to the client's main stylesheet. This ensures the site is hidden by default until the shield verifies the license."
        code={cssSnippet}
        language="css"
        copied={copied === 'CSS'}
        onCopy={() => handleCopy(cssSnippet, 'CSS')}
      />

      {/* Step 3: HTML Structure */}
      <CodeBlock
        step={3}
        title="Wrap Content in #app-root"
        description="The client's entire site content must be inside a <div id='app-root'>. Add the loading overlay before it."
        code={htmlSnippet}
        language="html"
        copied={copied === 'HTML'}
        onCopy={() => handleCopy(htmlSnippet, 'HTML')}
      />

      {/* Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 shrink-0" />
        <div className="text-sm text-amber-800 space-y-1">
          <p className="font-semibold">Important Security Notes:</p>
          <ul className="list-disc list-inside space-y-0.5 text-amber-700">
            <li>Removing the script will leave the site as a broken skeleton</li>
            <li>The shield sends periodic heartbeats — tampering is auto-detected</li>
            <li>DevTools CSS overrides are monitored and reported</li>
            <li>If our server is down, sites stay live for 24 hours via cache</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function CodeBlock({ step, title, description, code, language, copied, onCopy }: {
  step: number;
  title: string;
  description: string;
  code: string;
  language: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="bg-zinc-900 text-zinc-100 rounded-xl border border-zinc-800 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-zinc-800">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold bg-zinc-700 text-zinc-300 px-2 py-0.5 rounded-full">
            STEP {step}
          </span>
          <h4 className="font-semibold text-sm">{title}</h4>
        </div>
        <button
          onClick={onCopy}
          className="flex items-center gap-1.5 text-xs bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>
      <div className="px-5 py-2">
        <p className="text-xs text-zinc-500 leading-relaxed">{description}</p>
      </div>
      <pre className="font-mono text-xs overflow-x-auto text-zinc-400 bg-black/40 px-5 py-4 m-0">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}
