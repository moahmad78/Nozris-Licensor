import { Search, Shield, Server, FileCode, Smartphone, Globe, Lock, Code, AlertTriangle, MonitorX, Laptop2, Fingerprint, EyeOff } from "lucide-react";
import Link from 'next/link';

export default function DNAWatchdogDocs() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-red-900/30">

            {/* Header */}
            <header className="border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="p-2 bg-red-600 rounded-lg group-hover:bg-red-500 transition-colors">
                            <Shield size={24} className="text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Licensr<span className="text-red-500">.docs</span></span>
                    </Link>
                    <nav className="flex gap-6 text-sm font-medium text-gray-400">
                        <Link href="/docs/command-dashboard" className="hover:text-white transition-colors">Command Center</Link>
                        <Link href="/docs/watchdog" className="hover:text-white transition-colors">Watchdog</Link>
                        <Link href="/docs/proxy-shield" className="hover:text-white transition-colors">Proxy Shield</Link>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto px-6 py-16 max-w-4xl">

                <div className="mb-16">
                    <span className="text-red-500 font-mono text-sm uppercase tracking-widest mb-4 block">Core Security Engine</span>
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
                        DNA Watchdog<span className="text-red-600">.</span>
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed">
                        The central nervous system of Licensr. It ensures that the code running on your server is the exact code you deployed, down to the last byte. No modifications, no nulled scripts, no unauthorized forks.
                    </p>
                </div>

                {/* Section 1: The Trap */}
                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                        <Fingerprint className="text-red-500" /> The 3-Step Trap
                    </h2>
                    <div className="grid gap-8">
                        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl"></div>
                            <h3 className="text-xl font-bold text-white mb-2">1. Detection</h3>
                            <p className="text-gray-400 mb-4">
                                Every 30 seconds, the Watchdog calculates a SHA-256 hash of your core application files (e.g., `index.php`, `app.js`). This hash is compared against the immutable "Golden Record" stored on our decentralized blockchain nodes.
                            </p>
                            <div className="p-4 bg-black rounded-lg border border-gray-800 font-mono text-xs text-gray-500">
                                &gt; Calculating Hash for /var/www/html/core.js... <br />
                                &gt; CURRENT: <span className="text-green-500">d2ad...8a12</span> <br />
                                &gt; RECORD:  <span className="text-green-500">d2ad...8a12</span> <br />
                                &gt; STATUS:  <span className="text-green-500 font-bold">MATCH</span>
                            </div>
                        </div>

                        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl relative overflow-hidden">
                            <h3 className="text-xl font-bold text-white mb-2">2. Identification</h3>
                            <p className="text-gray-400 mb-4">
                                When a mismatch is found (e.g., someone removed the license check), the system silently captures the intruder's environment data: IP Address, Server Hostname, and Admin Email.
                            </p>
                        </div>

                        <div className="bg-gray-900 border border-gray-800 p-8 rounded-2xl relative overflow-hidden border-red-900/30">
                            <h3 className="text-xl font-bold text-red-400 mb-2">3. Enforcement</h3>
                            <p className="text-gray-400 mb-4">
                                The Watchdog triggers the "Kill Switch". The application enters a read-only locked state, displaying a legal seizure notice. The admin is notified instantly via WhatsApp.
                            </p>
                        </div>
                    </div>
                </section>

                {/* Section 2: Anti-Tamper Details */}
                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                        <Lock className="text-blue-500" /> Tamper Mitigation
                    </h2>
                    <div className="space-y-6">
                        <div className="flex gap-6 items-start">
                            <div className="p-3 bg-blue-500/10 text-blue-500 rounded-lg">
                                <FileCode size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">CPanel / FTP Lock</h3>
                                <p className="text-gray-400 text-sm">
                                    Even if a thief has FTP access, they cannot simply delete the Licensr folder. Our script injects a `chattr +i` immutable attribute (on Linux) or uses file-stream locking (on Windows) to prevent deletion while the process is running.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-6 items-start">
                            <div className="p-3 bg-purple-500/10 text-purple-500 rounded-lg">
                                <EyeOff size={24} />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-white mb-1">Media Scraping Prevention</h3>
                                <p className="text-gray-400 text-sm">
                                    Images and assets are served via a temporary signed URL. If a bot tries to scrape your portfolio images, the links expire instantly, returning a 403 Forbidden.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* NEW SECTION: Client-Side Integrity */}
                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                        <Laptop2 className="text-indigo-500" /> Client-Side Integrity Monitoring
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                        Licensr's protection extends beyond the server. We ensure that the experience delivered to the end-user (browser or mobile app) is exactly what you intended, free from client-side injections or malware.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-br from-indigo-900/20 to-black p-8 rounded-3xl border border-indigo-500/30 hover:border-indigo-500 transition-colors">
                            <MonitorX size={32} className="text-indigo-400 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-3">DOM Tamper Check</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                Our lightweight JS agent scans the DOM for unauthorized script tags or modified elements. If a user has a malicious browser extension injecting ads or stealing data, we detect and block it.
                            </p>
                            <div className="bg-black/50 p-3 rounded border border-gray-700 font-mono text-[10px] text-gray-500">
                                if (document.scripts.length  verifiedCount) <span className="text-red-400">blockAndReport()</span>;
                            </div>
                        </div>

                        <div className="bg-gradient-to-br from-indigo-900/20 to-black p-8 rounded-3xl border border-indigo-500/30 hover:border-indigo-500 transition-colors">
                            <AlertTriangle size={32} className="text-indigo-400 mb-4" />
                            <h3 className="text-xl font-bold text-white mb-3">Anti-Debugging</h3>
                            <p className="text-gray-400 text-sm leading-relaxed mb-4">
                                Prevents users from opening Developer Tools (F12) to inspect your API calls or modify local variables. The application pauses execution or redirects if a debugger is attached.
                            </p>
                            <div className="bg-black/50 p-3 rounded border border-gray-700 font-mono text-[10px] text-gray-500">
                                debugger; // Trigger breakpoint <br />
                                const t0 = performance.now(); // Detect pause latency
                            </div>
                        </div>
                    </div>
                </section>

                {/* Configuration Guide */}
                <section>
                    <h2 className="text-3xl font-bold text-white mb-6">Setup & Alerts</h2>
                    <p className="text-gray-400 mb-6">
                        By default, DNA Watchdog is active in <span className="text-white font-bold">Silent Mode</span> (logging only). To enable active enforcement:
                    </p>
                    <div className="bg-gray-900 rounded-xl overflow-hidden border border-gray-800">
                        <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-b border-gray-700">
                            <div className="w-3 h-3 rounded-full bg-red-500"></div>
                            <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            <span className="ml-2 text-xs font-mono text-gray-400">licensr.config.js</span>
                        </div>
                        <div className="p-6 overflow-x-auto">
                            <pre className="text-sm font-mono text-gray-300">
                                <span className="text-blue-400">module</span>.<span className="text-yellow-400">exports</span> = {'{'}<br />
                                &nbsp;&nbsp;watchdog: {'{'}<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;mode: <span className="text-green-400">'strict'</span>, <span className="text-gray-500">// Options: 'monitor', 'strict'</span><br />
                                &nbsp;&nbsp;&nbsp;&nbsp;interval: <span className="text-purple-400">30000</span>, <span className="text-gray-500">// Check every 30s</span><br />
                                &nbsp;&nbsp;&nbsp;&nbsp;notifications: {'{'}<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;whatsapp: <span className="text-green-400">true</span>,<br />
                                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;syslog: <span className="text-green-400">true</span><br />
                                &nbsp;&nbsp;&nbsp;&nbsp;{'}'}<br />
                                &nbsp;&nbsp;{'}'}<br />
                                {'}'};
                            </pre>
                        </div>
                    </div>
                </section>

            </main>

        </div>
    );
}
