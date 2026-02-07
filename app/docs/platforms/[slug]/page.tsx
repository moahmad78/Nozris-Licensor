import { Shield, Lock, FileCode, CheckCircle, Smartphone, Gamepad2, Globe, Server, Code, Layers, FileJson, Coffee } from "lucide-react";
import Link from 'next/link';

export default async function PlatformDocs({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    // Dynamic Content Map
    const platformData: any = {
        web: {
            title: "Securing Web Ecosystem",
            icon: <Globe size={48} className="text-blue-500" />,
            color: "blue",
            description: "Complete integrity protection for modern JavaScript frameworks and traditional server-side rendering. We prevent DOM manipulation, XSS, and unauthorized source usage.",
            languages: [
                { name: "React", icon: <Code size={24} />, desc: "Component-level sealing & anti-tamper hooks." },
                { name: "Node.js", icon: <Server size={24} />, desc: "Runtime integrity checks & process monitoring." },
                { name: "Vue/Angular", icon: <FileCode size={24} />, desc: "Build-time obfuscation & state locking." },
                { name: "Next.js", icon: <Layers size={24} />, desc: "Server Actions protection & middleware guarding." },
            ],
            protectionLogic: "Our Web SDK wraps your main application entry point (e.g., `_app.js` or `index.html`) with a self-validating checksum observer. If the DOM structure is modified by an unauthorized extension or script, the session is terminated instantly."
        },
        mobile: {
            title: "Securing Mobile Ecosystem",
            icon: <Smartphone size={48} className="text-green-500" />,
            color: "green",
            description: "Hardened security for iOS and Android binaries. We prevent reverse engineering, APK decompilation, and runtime hooking (Frida/Xposed).",
            languages: [
                { name: "React Native", icon: <Code size={24} />, desc: "JSI-binding encryption & bundle obfuscation." },
                { name: "Swift/iOS", icon: <Smartphone size={24} />, desc: "Anti-debugger attach & jailbreak detection." },
                { name: "Kotlin", icon: <Coffee size={24} />, desc: "Root detection & signature verification." },
                { name: "Flutter", icon: <Layers size={24} />, desc: "Dart code snapshot integrity checks." },
            ],
            protectionLogic: "For mobile, Licensr injects a native binary layer that runs parallel to the main thread. It monitors system calls for suspicious patterns (like debugger attachment or memory dump attempts) and crashes the app immediately if compromised."
        },
        games: {
            title: "Securing Game Ecosystem",
            icon: <Gamepad2 size={48} className="text-purple-500" />,
            color: "purple",
            description: "Anti-cheat and asset protection for Unity and Unreal Engine. We stop memory editing tools, speed hacks, and asset ripping.",
            languages: [
                { name: "Unity (C#)", icon: <Gamepad2 size={24} />, desc: "IL2CPP memory scrambling & assembly sealing." },
                { name: "Unreal (C++)", icon: <Code size={24} />, desc: "Native executable packing & anti-dumping." },
                { name: "Godot", icon: <Layers size={24} />, desc: "GDScript bytecode encryption." },
            ],
            protectionLogic: "Our game security module implements memory layout randomization (ASLR enhancement) and continuously scans for known cheat engine signatures. Asset bundles are encrypted and only decrypted in memory during rendering."
        }
    };

    const data = platformData[slug] || platformData['web'];
    const isWeb = slug === 'web' || !platformData[slug];

    if (!data) {
        return <div className="min-h-screen bg-black text-white flex items-center justify-center font-mono">Platform not found</div>;
    }

    return (
        <div className="min-h-screen bg-black text-white font-sans selection:bg-blue-500/30">

            {/* Header */}
            <header className="border-b border-gray-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
                <div className="container mx-auto px-6 h-20 flex items-center justify-between">
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="p-2 bg-blue-600 rounded-lg group-hover:bg-blue-500 transition-colors">
                            <Shield size={24} className="text-white" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">Licensr<span className="text-blue-500">.docs</span></span>
                    </Link>
                    <nav className="flex gap-6 text-sm font-medium text-gray-400">
                        <Link href="/docs/command-dashboard" className="hover:text-white transition-colors">Command Center</Link>
                        <Link href="/docs/platforms/web" className="text-white">Platforms</Link>
                        <Link href="/docs/watchdog" className="hover:text-white transition-colors">Watchdog</Link>
                    </nav>
                </div>
            </header>

            <main className="container mx-auto px-6 py-16 max-w-5xl">

                <div className="mb-16 border-b border-gray-800 pb-10">
                    <div className={`inline-flex items-center gap-2 py-1 px-4 rounded-full bg-${data.color}-900/20 border border-${data.color}-500/30 text-${data.color}-400 text-sm font-mono mb-6 uppercase tracking-wider`}>
                        {data.icon} {slug?.toUpperCase() || 'UNKNOWN'} SECURITY
                    </div>
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight capitalize">
                        {data.title}
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed max-w-3xl">
                        {data.description}
                    </p>
                </div>

                {/* Language Grid */}
                <section className="mb-20">
                    <h2 className="text-3xl font-bold text-white mb-8">Supported Technologies</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {data.languages.map((lang: any, idx: number) => (
                            <div key={idx} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl hover:border-gray-700 transition-all group">
                                <div className={`p-3 bg-gray-800 rounded-lg w-fit mb-4 text-${data.color}-400 group-hover:bg-${data.color}-900/20 group-hover:text-${data.color}-300 transition-colors`}>
                                    {lang.icon}
                                </div>
                                <h3 className="font-bold text-white text-lg mb-2">{lang.name}</h3>
                                <p className="text-gray-500 text-sm leading-snug">{lang.desc}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Protection Logic */}
                <section className="bg-gray-900/50 border border-gray-800 rounded-3xl p-10 relative overflow-hidden">
                    <div className={`absolute top-0 right-0 w-64 h-64 bg-${data.color}-500/10 rounded-full blur-[100px] pointer-events-none`}></div>
                    <h2 className="text-3xl font-bold text-white mb-6 relative z-10 flex items-center gap-3">
                        <Lock className={`text-${data.color}-500`} />
                        Protection Methodology
                    </h2>
                    <div className="flex flex-col md:flex-row gap-10 relative z-10">
                        <div className="md:w-2/3">
                            <p className="text-gray-300 text-lg leading-relaxed mb-6">
                                {data.protectionLogic}
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3 text-gray-400">
                                    <CheckCircle size={18} className={`text-${data.color}-500`} />
                                    Real-time Checksum Verification
                                </li>
                                <li className="flex items-center gap-3 text-gray-400">
                                    <CheckCircle size={18} className={`text-${data.color}-500`} />
                                    {isWeb ? 'Obfuscated Networking Layer' : 'Binary Packing & Encryption'}
                                </li>
                                <li className="flex items-center gap-3 text-gray-400">
                                    <CheckCircle size={18} className={`text-${data.color}-500`} />
                                    Automated Incident Reporting
                                </li>
                            </ul>
                        </div>
                        <div className="md:w-1/3 bg-black border border-gray-800 rounded-xl p-4 font-mono text-xs text-gray-500 flex flex-col justify-center">
                            <div className="mb-2 text-gray-400 font-bold">// Security Protocol</div>
                            <span className="text-blue-400">function</span> <span className="text-yellow-400">secure_env</span>() {'{'} <br />
                            &nbsp;&nbsp;<span className="text-purple-400">if</span> (integrity_check_failed) {'{'} <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-red-400">terminate_process</span>(); <br />
                            &nbsp;&nbsp;&nbsp;&nbsp;<span className="text-red-400">report_breach</span>(); <br />
                            &nbsp;&nbsp;{'}'} <br />
                            {'}'}
                        </div>
                    </div>
                </section>

            </main>
        </div>
    );
}
