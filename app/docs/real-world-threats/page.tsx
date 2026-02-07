import React from 'react';
import { AlertTriangle, FileWarning, EyeOff, Server } from 'lucide-react';

export default function RealWorldThreatsDoc() {
    return (
        <div className="min-h-screen bg-black text-gray-300 px-6 py-20 font-sans">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-black text-white mb-6 flex items-center gap-4">
                    <AlertTriangle className="text-orange-400" size={40} /> Real-World Threat Neutralization
                </h1>
                <p className="text-xl mb-12">Defending against the tools hackers actually use.</p>

                <div className="space-y-8">
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            <FileWarning className="text-red-500" /> CPanel Theft
                        </h3>
                        <p>
                            We detect when files are copied via CPanel File Manager by checking for missing environment variables
                            that differ between a live server execution and a file-copy operation.
                        </p>
                    </div>
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            <EyeOff className="text-blue-500" /> Media Scraping
                        </h3>
                        <p>
                            Anti-scraping logic prevents `wget`, `curl`, and standard browser "Save As" commands.
                            We serve media through a blob proxy that validates the session before rendering.
                        </p>
                    </div>
                    <div className="bg-gray-900 p-6 rounded-xl border border-gray-800">
                        <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                            <Server className="text-purple-500" /> Malware Injection
                        </h3>
                        <p>
                            Real-time input sanitization blocks malicious payloads (XSS/SQLi) attempting to inject code
                            into your database or execute scripts on your server.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
