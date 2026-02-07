import React from 'react';
import { Server, Link as LinkIcon, Code } from 'lucide-react';

export default function ApiDocsPage() {
    return (
        <div className="min-h-screen bg-black text-gray-300 font-sans py-20 px-6">
            <div className="max-w-5xl mx-auto">
                <div className="mb-12 border-b border-gray-800 pb-8">
                    <h1 className="text-4xl font-black text-white mb-4">API Reference</h1>
                    <p className="text-xl text-gray-400">
                        Direct integration endpoints for the Licensr Security Engine.
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Sidebar / Nav (Conceptual) */}
                    <div className="hidden lg:block space-y-4 text-sm font-mono text-gray-500">
                        <div className="font-bold text-white mb-2">ENDPOINTS</div>
                        <div className="cursor-pointer hover:text-blue-500">POST /license/validate</div>
                        <div className="cursor-pointer hover:text-blue-500">POST /license/activate</div>
                        <div className="cursor-pointer hover:text-blue-500">POST /license/restore</div>
                        <div className="cursor-pointer hover:text-red-500 font-bold border-l-2 border-red-500 pl-2">POST /license/log_intrusion</div>
                        <div className="cursor-pointer hover:text-blue-500">GET /status</div>
                    </div>

                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-16">

                        {/* Validate Endpoint */}
                        <section id="validate" className="space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="bg-green-500/20 text-green-400 font-mono text-xs px-2 py-1 rounded">POST</span>
                                <h2 className="text-2xl font-bold text-white">/api/license/validate</h2>
                            </div>
                            <p className="text-gray-400">
                                Validates a license key against the current domain and device fingerprint. This is the core heartbeat of the protection system.
                            </p>

                            <div className="space-y-2">
                                <div className="text-sm font-mono text-gray-500">Request Body</div>
                                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                                    <pre className="text-blue-300">
                                        {`{
  "key": "LICENSE-KEY-XXXX",
  "domain": "example.com",
  "fingerprint": "a1b2c3d4e5f6...", 
  "version": "1.0.2"
}`}
                                    </pre>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="text-sm font-mono text-gray-500">Response (200 OK)</div>
                                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                                    <pre className="text-green-300">
                                        {`{
  "valid": true,
  "status": "active",
  "owner": "Client Name",
  "next_check": 3600 
}`}
                                    </pre>
                                </div>
                            </div>
                        </section>

                        {/* Log Intrusion Endpoint (NEW) */}
                        <section id="log_intrusion" className="space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="bg-green-500/20 text-green-400 font-mono text-xs px-2 py-1 rounded">POST</span>
                                <h2 className="text-2xl font-bold text-white">/api/license/log_intrusion</h2>
                            </div>
                            <p className="text-gray-400">
                                A dedicated endpoint for reporting detected security breaches.
                                This function is automatically called by the client SDK when anomalies like <strong className="text-white">File Tampering</strong> or <strong className="text-white">Unauthorized Media Scraping</strong> are detected local-side.
                            </p>

                            <div className="bg-red-900/10 border border-red-500/20 p-4 rounded-lg">
                                <p className="text-red-400 text-sm font-bold mb-2">⚠ WARNING:</p>
                                <p className="text-gray-400 text-sm">
                                    Logs sent to this endpoint are immediately flagged as "High Severity".
                                    Multiple reports from the same IP will trigger an automatic global ban.
                                </p>
                            </div>

                            <div className="space-y-2">
                                <div className="text-sm font-mono text-gray-500">Request Body</div>
                                <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                                    <pre className="text-blue-300">
                                        {`{
  "license_key": "LICENSE-KEY-XXXX",
  "threat_level": "critical",
  "breach_type": "file_tampering", // or 'media_scraping', 'sql_injection'
  "evidence": {
     "file": "/core/auth.ts",
     "detected_hash": "0x12a...",
     "expected_hash": "0x98b..."
  }
}`}
                                    </pre>
                                </div>
                            </div>
                        </section>

                        {/* Restore Endpoint */}
                        <section id="restore" className="space-y-6">
                            <div className="flex items-center gap-3">
                                <span className="bg-green-500/20 text-green-400 font-mono text-xs px-2 py-1 rounded">POST</span>
                                <h2 className="text-2xl font-bold text-white">/api/license/restore</h2>
                            </div>
                            <p className="text-gray-400">
                                Initiates a self-healing sequence. If a local file verification fails, this endpoint returns the secure hash or signed snapshot for restoration.
                            </p>
                            <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                                <pre className="text-blue-300">
                                    {`{
  "key": "LICENSE-KEY-XXXX",
  "integrity_token": "signed_token_from_header"
}`}
                                </pre>
                            </div>
                        </section>

                        <div className="pt-8 border-t border-gray-800">
                            <div className="bg-blue-900/10 border border-blue-500/20 rounded-xl p-6">
                                <h4 className="text-blue-400 font-bold mb-2 flex items-center gap-2"><Server size={16} /> Security Note</h4>
                                <p className="text-sm text-gray-400">
                                    All API requests must include the <code className="text-white">X-Licensr-Signature</code> header.
                                    Requests without a valid signature will be rejected immediately by the edge firewall.
                                </p>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}
