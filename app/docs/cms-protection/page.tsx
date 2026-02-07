import { Search, Shield, Server, FileCode, ShoppingBag, Globe, Lock, Code, AlertTriangle, MonitorX, Laptop2, ShoppingCart, Database } from "lucide-react";
import Link from 'next/link';

export default function CMSProtectionDocs() {
    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-orange-500/30">

            {/* Header */}
            <header className="border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="p-2 bg-orange-600 rounded-lg group-hover:bg-orange-500 transition-colors">
                            <Shield size={24} className="text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Licensr<span className="text-orange-500">.cms</span></span>
                    </Link>
                    <nav className="flex gap-6 text-sm font-medium text-gray-400">
                        <Link href="/docs/command-dashboard" className="hover:text-white transition-colors">Command Center</Link>
                        <Link href="/docs/watchdog" className="hover:text-white transition-colors">Watchdog</Link>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto px-6 py-16 max-w-4xl">

                <div className="mb-16">
                    <span className="text-orange-500 font-mono text-sm uppercase tracking-widest mb-4 block">E-Commerce & Plugins</span>
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
                        CMS <span className="text-orange-600">Protection</span>.
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed max-w-3xl">
                        Specialized security for WordPress plugins, Shopify themes, and custom PHP applications. We prevent nulled versions, theme cloning, and unauthorized redistribution of your digital products.
                    </p>
                </div>

                {/* PHP / WordPress Protection */}
                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                        <Database className="text-orange-500" /> PHP & WordPress Security
                    </h2>
                    <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl relative overflow-hidden group hover:border-orange-500/50 transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/10 rounded-full blur-2xl group-hover:bg-orange-500/20 transition-all" />

                        <h3 className="text-2xl font-bold text-white mb-4">Plugin & Theme Locking</h3>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Licensr injects a persistent license check into the `functions.php` or main plugin file using obfuscated bytecode. This check validates against our central server on every activation or cron cycle.
                        </p>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div className="bg-black/50 p-6 rounded-xl border border-gray-800">
                                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                    <Lock size={16} className="text-orange-500" /> Anti-Nulling Logic
                                </h4>
                                <p className="text-xs text-gray-500">
                                    If the license check is removed or bypassed, the code executes a "silent fail" or displays a copyright notice, rendering the plugin useless without crashing the user's site entirely (preserving their data, breaking your feature).
                                </p>
                            </div>
                            <div className="bg-black/50 p-6 rounded-xl border border-gray-800">
                                <h4 className="font-bold text-white mb-2 flex items-center gap-2">
                                    <FileCode size={16} className="text-orange-500" /> CPanel Guard
                                </h4>
                                <p className="text-xs text-gray-500">
                                    Prevents users from simply zipping your plugin folder from CPanel File Manager. Our script detects file system read operations that scan the entire directory and blocks them.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Shopify / Liquid Protection */}
                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                        <ShoppingBag className="text-green-500" /> Shopify Theme Security
                    </h2>

                    <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl relative overflow-hidden group hover:border-green-500/50 transition-all">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-2xl group-hover:bg-green-500/20 transition-all" />

                        <h3 className="text-2xl font-bold text-white mb-4">Liquid Template verification</h3>
                        <p className="text-gray-400 mb-6 leading-relaxed">
                            Since Shopify code is client-visible, we use a hybrid approach. Critical logic is moved to Licensr's hosted API, and the Liquid theme fetches it dynamically. If the store URL is not authorized, the assets simply fail to load.
                        </p>

                        <div className="bg-black border border-gray-800 p-4 rounded-xl font-mono text-xs text-gray-400 overflow-x-auto">
                            <span className="text-gray-500">{'<!-- theme.liquid -->'}</span> <br />
                            &lt;script src="https://api.licensr.com/verify?store={'{{ shop.url }}'}&theme_id=1029" async&gt;&lt;/script&gt; <br />
                            <span className="text-green-500">{'{{ content_for_header }}'}</span>
                        </div>
                    </div>
                </section>

                {/* Magento & Custom PHP */}
                <section>
                    <h2 className="text-3xl font-bold text-white mb-8 flex items-center gap-3">
                        <Server className="text-blue-500" /> Preventing Code Theft
                    </h2>
                    <p className="text-gray-400 text-lg mb-6">
                        The biggest risk for CMS developers is customers buying one license and installing it on 50 client sites. Licensr solves this with <strong>Domain Locking</strong>.
                    </p>
                    <ul className="space-y-4">
                        <li className="flex items-center gap-4 bg-gray-900 p-4 rounded-xl border border-gray-800">
                            <div className="p-2 bg-blue-500/20 rounded-lg text-blue-500"><Lock size={20} /></div>
                            <div>
                                <h4 className="font-bold text-white">1-Click Domain Binding</h4>
                                <p className="text-sm text-gray-500">The license key permanently binds to the first domain it is activated on.</p>
                            </div>
                        </li>
                        <li className="flex items-center gap-4 bg-gray-900 p-4 rounded-xl border border-gray-800">
                            <div className="p-2 bg-red-500/20 rounded-lg text-red-500"><AlertTriangle size={20} /></div>
                            <div>
                                <h4 className="font-bold text-white">Hostname Mismatch Detection</h4>
                                <p className="text-sm text-gray-500">If the plugin detects a different hostname (e.g., dev.site vs prod.site), it enters trial mode automatically.</p>
                            </div>
                        </li>
                    </ul>
                </section>

            </main>

        </div>
    );
}
