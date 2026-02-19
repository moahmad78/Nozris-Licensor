import { Terminal, Copy, CheckCircle, Code2, AlertTriangle, Shield } from 'lucide-react';
import Link from 'next/link';

export default function ShieldDocs() {
    return (
        <div className="min-h-screen bg-white text-gray-900 font-sans">
            <div className="max-w-4xl mx-auto px-6 py-12">

                {/* Header */}
                <div className="border-b border-gray-200 pb-8 mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-indigo-600 rounded-lg">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <span className="font-mono text-sm font-bold text-indigo-600 tracking-wider">DEVELOPER RESOURCES</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-4">Nozris Integration Guide</h1>
                    <p className="text-xl text-gray-500 max-w-2xl">
                        Complete reference for integrating the Nozris Neural Shield into your web applications.
                        Secure your revenue with just one line of code.
                    </p>
                </div>

                <div className="space-y-16">

                    {/* Quick Start */}
                    <section id="quick-start" className="scroll-mt-24">
                        <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold">1</div>
                            Quick Start
                        </h2>
                        <div className="prose prose-slate max-w-none">
                            <p className="text-gray-600 mb-4">
                                The fastest way to protect your site. Add this script tag to the <code>&lt;head&gt;</code> of your HTML file,
                                before any other scripts or CSS.
                            </p>

                            <div className="bg-[#0f172a] rounded-xl overflow-hidden shadow-lg border border-gray-800 my-6">
                                <div className="flex items-center justify-between px-4 py-2 bg-gray-900 border-b border-gray-800">
                                    <div className="flex gap-1.5">
                                        <div className="w-3 h-3 rounded-full bg-red-500" />
                                        <div className="w-3 h-3 rounded-full bg-yellow-500" />
                                        <div className="w-3 h-3 rounded-full bg-green-500" />
                                    </div>
                                    <span className="text-xs font-mono text-gray-400">index.html</span>
                                </div>
                                <div className="p-6 overflow-x-auto">
                                    <pre className="text-sm font-mono text-blue-300">
                                        &lt;!-- Nozris Protection --&gt;{'\n'}
                                        &lt;script{'\n'}
                                        src="https://nozris.com/nozris.js"{'\n'}
                                        data-key="YOUR_LICENSE_KEY"{'\n'}
                                        defer{'\n'}
                                        &gt;&lt;/script&gt;
                                    </pre>
                                </div>
                            </div>

                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg my-6">
                                <div className="flex gap-3">
                                    <AlertTriangle className="w-5 h-5 text-yellow-600 shrink-0" />
                                    <div className="text-sm text-yellow-800">
                                        <strong>Important:</strong> Do not defer or async this script if you want to prevent the "Content Flash".
                                        For maximum security, it should be blocking to ensure the DOM is protected immediately.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Framework Guides */}
                    <section id="frameworks" className="scroll-mt-24">
                        <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold">2</div>
                            Framework Integration
                        </h2>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Next.js */}
                            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-black rounded-lg text-white"><Code2 className="w-5 h-5" /></div>
                                    <h3 className="font-bold">Next.js (App Router)</h3>
                                </div>
                                <p className="text-sm text-gray-500 mb-4">Add to your root layout.tsx file.</p>
                                <div className="bg-gray-50 rounded-lg p-3 text-xs font-mono text-gray-800 border border-gray-200 overflow-x-auto">
                                    import Script from 'next/script';<br />
                                    ...<br />
                                    return (<br />
                                    &nbsp;&nbsp;&lt;html&gt;<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;&lt;head&gt;<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&lt;Script<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;src="..."<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;strategy="beforeInteractive"<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;/&gt;<br />
                                    &nbsp;&nbsp;&nbsp;&nbsp;&lt;/head&gt;<br />
                                    ...
                                </div>
                            </div>

                            {/* React */}
                            <div className="border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-2 bg-cyan-500 rounded-lg text-white"><Code2 className="w-5 h-5" /></div>
                                    <h3 className="font-bold">React / Vite</h3>
                                </div>
                                <p className="text-sm text-gray-500 mb-4">Add to index.html in the public folder.</p>
                                <div className="bg-gray-50 rounded-lg p-3 text-xs font-mono text-gray-800 border border-gray-200 overflow-x-auto">
                                    &lt;!-- public/index.html --&gt;<br />
                                    &lt;head&gt;<br />
                                    &nbsp;&nbsp;&lt;script ... &gt;&lt;/script&gt;<br />
                                    &lt;/head&gt;
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Customization */}
                    <section id="customization" className="scroll-mt-24">
                        <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
                            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold">3</div>
                            Advanced Customization
                        </h2>
                        <div className="prose prose-slate max-w-none text-gray-600">
                            <p>
                                Nozris injects a default full-screen lock screen when access is denied.
                                You can customize this behavior by adding special meta tags to your page.
                            </p>

                            <div className="overflow-x-auto mt-4">
                                <table className="w-full text-left text-sm border-collapse">
                                    <thead>
                                        <tr className="border-b border-gray-200">
                                            <th className="py-3 font-semibold text-gray-900">Meta Tag</th>
                                            <th className="py-3 font-semibold text-gray-900">Description</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-100">
                                        <tr>
                                            <td className="py-3 font-mono text-indigo-600">nozris-lock-msg</td>
                                            <td className="py-3">Custom message to display on lock screen.</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 font-mono text-indigo-600">nozris-lock-color</td>
                                            <td className="py-3">Hex code for background color (default: #111).</td>
                                        </tr>
                                        <tr>
                                            <td className="py-3 font-mono text-indigo-600">nozris-redirect</td>
                                            <td className="py-3">URL to redirect users to instead of showing lock screen.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>

                    {/* Support */}
                    <section className="bg-indigo-50 rounded-2xl p-8 text-center border border-indigo-100 mt-12">
                        <h3 className="text-xl font-bold text-indigo-900 mb-2">Need help integrating?</h3>
                        <p className="text-indigo-700 mb-6">Our security engineers are available 24/7 to assist with enterprise setups.</p>
                        <Link
                            href="/admin/support-center"
                            className="inline-flex items-center justify-center -space-x-px rounded-md shadow-sm bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 font-medium transition-colors"
                        >
                            Contact Support
                        </Link>
                    </section>

                </div>
            </div>
        </div>
    );
}
