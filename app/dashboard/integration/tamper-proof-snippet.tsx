'use client';

import { useState } from 'react';
import { ShieldCheck, AlertTriangle, Terminal, Copy, Check } from 'lucide-react';
import { toast } from 'sonner';

export function TamperProofSnippet({ licenseKey, baseUrl, domain }: { licenseKey: string, baseUrl: string, domain: string }) {
    const [copied, setCopied] = useState(false);

    const key = licenseKey || 'YOUR_LICENSE_KEY';
    const site = domain || 'window.location.hostname';
    const cleanUrl = baseUrl.replace(/\/$/, '');

    // The script is designed to be "Deep Integrated"
    const scriptCode = `<!-- Voomet LicenseGuard: Deep Integration (Tamper-Proof) -->
<style id="voomet-core-v3">
  body { opacity: 0; filter: blur(10px); transition: all 1s; }
  .main-container-secure { display: none !important; }
  .voomet-shield-error { 
    display: none; position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
    background: #000; color: #ff3333; z-index: 9999999; flex-direction: column; 
    align-items: center; justify-content: center; font-family: 'Courier New', monospace;
    padding: 20px; text-transform: uppercase;
  }
</style>

<div id="v-shield-e" class="voomet-shield-error">
  <h1 style="font-size:3rem">🚨 SYSTEM TAMPER DETECTED</h1>
  <p style="font-size:1.2rem; margin-top:10px">FATAL ERROR: Core Security Files Missing or Modified.</p>
  <p style="color:#666; margin-top:20px">Error ID: VX-990-TAMPER | Contact: Mohd Ahmad</p>
</div>

<script>
(function(_v,_k,_d,_u){
  const _ac = () => {
    document.addEventListener('contextmenu', e => e.preventDefault());
    document.addEventListener('selectstart', e => e.preventDefault());
    document.addEventListener('keydown', e => {
      if (e.keyCode === 123 || (e.ctrlKey && e.shiftKey && (e.keyCode === 73 || e.keyCode === 74)) || (e.ctrlKey && e.keyCode === 85)) {
        e.preventDefault();
        alert('Copyright Protected. Contact Mohd Ahmad for licensing.');
        return false;
      }
    });
  };

  const _s = () => {
    // Hard Domain Binding Check
    if (window.location.hostname !== _d && !window.location.hostname.includes('localhost')) {
        _f('CORRUPTED');
        return;
    }

    _ac(); // Initialize Anti-Copy

    fetch(_u, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licenseKey: _k, domain: _d })
    }).then(r => r.json()).then(o => {
      if (o.valid && o.payload) {
        // Unlock site and inject critical classes
        const style = document.createElement('style');
        style.innerHTML = o.payload + " .main-container-secure { display: block !important; }";
        document.head.appendChild(style);
        document.body.style.opacity = "1";
        document.body.style.filter = "none";
        
        // Background Heartbeat every 5 mins
        setTimeout(_s, 300000);
      } else if (o.status === 'TERMINATED' || o.status === 'ATTEMPTED CLONING') {
        _f(o.status);
      } else { _f(); }
    }).catch(_f);
  };

  const _f = (s) => {
    const e = document.getElementById('v-shield-e');
    if (s === 'TERMINATED') {
      e.innerHTML = '<h1 style="font-size:3rem">🔒 ACCOUNT TERMINATED</h1><p style="font-size:1.2rem; margin-top:10px">Your license has been permanently revoked due to security tampering.</p><p style="color:#666; margin-top:20px">Contact: Mohd Ahmad (+91 9264920211)</p>';
    } else if (s === 'CORRUPTED' || s === 'ATTEMPTED CLONING') {
      e.innerHTML = '<h1 style="font-size:3rem; color:#ff4444">⚠️ SYSTEM CORRUPTED</h1><p style="font-size:1.2rem; margin-top:10px">Unauthorized Domain Detected. This website is operating on a STOLEN license.</p><p style="color:#666; margin-top:20px">Reported to System Administrator.</p>';
      document.body.style.background = '#000';
      document.body.style.color = '#fff';
    }
    e.style.display = 'flex';
    document.body.querySelectorAll('*').forEach(n => { n.style.display = 'none'; });
    if (s !== 'TERMINATED' && s !== 'CORRUPTED' && s !== 'ATTEMPTED CLONING') {
       fetch(_u, { method: 'POST', body: JSON.stringify({ licenseKey: _k, domain: _d, tamper: true }) });
    }
  };

  window.addEventListener('load', _s);
})('VOOMET', "${key}", ${domain ? `"${domain}"` : 'window.location.hostname'}, "${cleanUrl}/api/license/validate");
</script>`.trim();

    const handleCopy = () => {
        navigator.clipboard.writeText(scriptCode);
        setCopied(true);
        toast.success("Tamper-Proof snippet copied!");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">Deep Integration (Tamper-Proof)</h3>
                        <p className="text-xs text-gray-500">Core features are physically locked until the license is verified.</p>
                    </div>
                </div>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all shadow-md active:scale-95"
                >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                    {copied ? "Copied" : "Copy Secure Script"}
                </button>
            </div>

            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-10 group-hover:opacity-20 transition duration-1000"></div>
                <div className="relative bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                    <div className="flex items-center justify-between px-4 py-2 border-b border-gray-800 bg-gray-950/50">
                        <div className="flex gap-1.5">
                            <div className="w-2.5 h-2.5 rounded-full bg-red-500/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/50" />
                            <div className="w-2.5 h-2.5 rounded-full bg-green-500/50" />
                        </div>
                        <span className="text-[10px] font-mono font-bold text-gray-500 uppercase tracking-widest">secure_integration.html</span>
                    </div>
                    <pre className="p-6 overflow-x-auto text-[13px] font-mono text-blue-300 leading-relaxed custom-scrollbar max-h-[400px]">
                        <code>{scriptCode}</code>
                    </pre>
                </div>
            </div>

            <div className="bg-blue-50/50 border border-blue-100 p-4 rounded-xl flex gap-3">
                <AlertTriangle className="w-5 h-5 text-blue-600 shrink-0" />
                <div className="text-xs text-blue-800 leading-relaxed">
                    <p className="font-bold mb-1">How it prevents bypass:</p>
                    <ul className="list-disc pl-4 space-y-1">
                        <li><strong>Feature Locking:</strong> The website is invisible by default (body opacity: 0).</li>
                        <li><strong>Server Payload:</strong> The styles required to "reveal" the site are only served after successful validation.</li>
                        <li><strong>Soft Destruct:</strong> If the script is deleted, the site stays invisible forever (Error: Incomplete Core Files).</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
