'use client';

import { useState } from 'react';
import { ShieldCheck, AlertTriangle, Copy, Check, Zap, Eye, Wifi, Database } from 'lucide-react';
import { toast } from 'sonner';

export function TamperProofSnippet({ licenseKey, baseUrl, domain }: { licenseKey: string, baseUrl: string, domain: string }) {
  const [copied, setCopied] = useState<string | null>(null);

  const key = licenseKey || 'YOUR_LICENSE_KEY';
  const cleanUrl = baseUrl.replace(/\/$/, '');

  // Step 1: Script embed tag
  const scriptEmbed = `<!-- Nozris Shield v2 — Do NOT remove this tag -->
<script data-k="${key}" src="${cleanUrl}/nozris.js" defer></script>`;

  // Step 2: Required CSS
  const cssCode = `/* Nozris Shield — Required Base Styles */
/* The shield script reveals #app-root after license verification */
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
}`;

  // Step 3: HTML structure
  const htmlCode = `<!-- Loading overlay (shown while verifying) -->
<div class="license-warning">
  <p>Loading secure content...</p>
</div>

<!-- ALL website content MUST be inside #app-root -->
<div id="app-root">
  <!-- Your website content here -->
</div>`;

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} copied!`);
    setTimeout(() => setCopied(null), 2000);
  };

  const features = [
    { icon: Zap, label: 'Kill Switch', desc: 'Site stays dead skeleton without the script' },
    { icon: Eye, label: 'DevTools Detection', desc: 'CSS overrides trigger auto-lock + WhatsApp alert' },
    { icon: Wifi, label: 'Heartbeat', desc: 'Random-interval heartbeat verifies license continuously' },
    { icon: Database, label: '24hr Fail-Safe', desc: 'LocalStorage cache keeps sites alive during server downtime' },
  ];

  return (
    <div className="space-y-6 p-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-br from-blue-600 to-cyan-500 rounded-xl shadow-lg shadow-blue-500/20">
          <ShieldCheck className="w-6 h-6 text-white" />
        </div>
        <div>
          <h3 className="font-bold text-xl text-gray-900">Nozris Shield v2 — Functional Lock</h3>
          <p className="text-sm text-gray-500">Hardened protection. Removing the script = broken site.</p>
        </div>
      </div>

      {/* Feature badges */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.label} className="bg-gray-50 border border-gray-100 rounded-xl p-3 space-y-1">
              <div className="flex items-center gap-2">
                <Icon className="w-4 h-4 text-blue-600" />
                <span className="text-xs font-bold text-gray-900">{f.label}</span>
              </div>
              <p className="text-[10px] text-gray-500 leading-snug">{f.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Step 1 */}
      <StepBlock
        step={1}
        title="Embed the Nozris Script"
        description="Add this to the client's <head> or at the bottom of <body>."
        code={scriptEmbed}
        language="html"
        copied={copied === 'step1'}
        onCopy={() => handleCopy(scriptEmbed, 'step1')}
      />

      {/* Step 2 */}
      <StepBlock
        step={2}
        title="Add Required CSS"
        description="Add to the client's main stylesheet. This hides content until verified."
        code={cssCode}
        language="css"
        copied={copied === 'step2'}
        onCopy={() => handleCopy(cssCode, 'step2')}
      />

      {/* Step 3 */}
      <StepBlock
        step={3}
        title="Wrap Content in #app-root"
        description="Client's entire site content must be inside <div id='app-root'>."
        code={htmlCode}
        language="html"
        copied={copied === 'step3'}
        onCopy={() => handleCopy(htmlCode, 'step3')}
      />

      {/* Security Warning */}
      <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl flex gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="text-xs text-amber-800 space-y-1.5 leading-relaxed">
          <p className="font-bold">How Nozris Shield v2 prevents bypass:</p>
          <ul className="list-disc pl-4 space-y-1 text-amber-700">
            <li><strong>Functional Lock:</strong> #app-root is <code>display:none</code> by default — not just opacity</li>
            <li><strong>Signed Payload:</strong> The unlock CSS comes from the server in an HMAC-signed, Base64-encoded envelope</li>
            <li><strong>Kill Switch:</strong> Remove the script → site stays as a dead skeleton forever</li>
            <li><strong>Auto-Detection:</strong> DevTools CSS overrides are detected and reported to admin via WhatsApp</li>
            <li><strong>Heartbeat:</strong> Random 45-90s interval heartbeat keeps verifying. No heartbeat = auto-tamper flag</li>
            <li><strong>Fail-Safe:</strong> 24-hour LocalStorage cache prevents client site downtime if our server goes offline</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function StepBlock({ step, title, description, code, language, copied, onCopy }: {
  step: number;
  title: string;
  description: string;
  code: string;
  language: string;
  copied: boolean;
  onCopy: () => void;
}) {
  return (
    <div className="bg-gray-950 text-gray-100 rounded-xl border border-gray-800 overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3 border-b border-gray-800/60 bg-gray-900/50">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold bg-blue-600 text-white px-2.5 py-0.5 rounded-full">
            STEP {step}
          </span>
          <h4 className="font-semibold text-sm text-gray-200">{title}</h4>
        </div>
        <button
          onClick={onCopy}
          className="flex items-center gap-1.5 text-xs bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg transition-colors"
        >
          {copied ? <Check className="w-3 h-3 text-green-400" /> : <Copy className="w-3 h-3 text-gray-400" />}
          <span className={copied ? 'text-green-400' : 'text-gray-400'}>{copied ? 'Copied!' : 'Copy'}</span>
        </button>
      </div>
      <div className="px-5 py-2 bg-gray-900/30">
        <p className="text-xs text-gray-500 leading-relaxed">{description}</p>
      </div>
      <pre className="font-mono text-xs overflow-x-auto text-gray-400 bg-black/50 px-5 py-4 max-h-[300px]">
        <code className={`language-${language}`}>{code}</code>
      </pre>
    </div>
  );
}
