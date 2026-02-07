'use client';
import React from 'react';
import FeatureSection from '@/components/FeatureSection';
import SecurityTabs from '@/components/SecurityTabs';
import TrustBar from '@/components/TrustBar';
import Link from 'next/link';
import { Cpu, Network, RotateCw, Lock, Terminal, Activity, FileCode, CameraOff, MonitorX, Key, Eye, Fingerprint, Siren, Send, LayoutDashboard, MessageCircle, Mail, Globe, Users, CheckCircle, Smartphone, Gamepad2, Monitor, Code2, ShoppingBag, ShieldCheck, UserCheck, Laptop2, ArrowRight, ShieldAlert } from 'lucide-react';
import Hero from '@/components/Hero';
import AutopsyScanner from '@/components/AutopsyScanner';
import GlobalThreatMap from '@/components/GlobalThreatMap';
import WatchdogSection from '@/components/WatchdogSection';

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-green-500/30 font-sans">
      <Hero />
      <AutopsyScanner />


      {/* Trust Bar (Compatibility) */}
      <TrustBar />

      {/* Global Threat Monitor Section */}
      <section className="py-12 bg-black border-b border-gray-900" data-cursor="security">
        <div className="container mx-auto px-4">
          <div className="mb-10 text-center relative">
            {/* 24/7 Badge */}
            <div className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-mono mb-6 animate-pulse shadow-[0_0_20px_rgba(34,197,94,0.15)]">
              <ShieldAlert size={14} className="animate-spin-slow" />
              24/7 HUMAN SECURITY TEAM: <span className="font-bold underline">ACTIVE</span>
            </div>

            <span className="text-blue-500 font-mono text-sm uppercase tracking-widest block mb-2">Live Intelligence</span>
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              Global Threat <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-red-500">Monitor</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Licensr is more than an AI tool; we are a <span className="text-white font-bold italic">Managed Security Powerhouse</span>.
              Our elite team monitors <span className="text-white font-bold">15,000+</span> assets worldwide in real-time.
            </p>
          </div>

          {/* The Map Component */}
          <div className="w-full max-w-6xl mx-auto shadow-[0_0_50px_rgba(59,130,246,0.1)] rounded-3xl relative">
            <GlobalThreatMap />

            {/* Context Tooltip for the Badge */}
            <div className="absolute -top-4 -right-4 md:right-10 hidden md:block z-20">
              <div className="bg-gray-900 border border-gray-800 p-3 rounded-xl shadow-2xl flex items-center gap-3">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
                <span className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">Human Intelligence: ON</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center mt-8">
            <Link href="/dashboard" className="text-sm font-mono text-gray-500 hover:text-white transition-colors flex items-center gap-2 group">
              <Activity size={14} className="group-hover:text-green-500 transition-colors" /> View Full Network Status in Dashboard
            </Link>
          </div>
        </div>
      </section>

      {/* End-to-End User Device Protection Section */}
      <section className="py-24 bg-gradient-to-br from-gray-950 to-black border-y border-gray-900 overflow-hidden relative" data-cursor="security">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-mono mb-6">
                <MonitorX size={14} /> CLIENT-SIDE DEFENSE
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                Protecting Every Link in the Chain: <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">From Server to User Device.</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Security doesn't stop at your firewall. Attackers target your users through compromised front-end scripts and session hijacking.
                Licensr extends the perimeter to the end-user's device, ensuring a verified, tamper-proof experience.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 mt-1">
                    <MonitorX size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Prevents Malware Injection</h4>
                    <p className="text-gray-500 text-sm">Blocks malicious scripts from executing on the client-side browser or app runtime.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-green-500/10 rounded-lg text-green-400 mt-1">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Local Data Integrity</h4>
                    <p className="text-gray-500 text-sm">Ensures that data stored or processed on the user's machine hasn't been tampered with.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-red-500/10 rounded-lg text-red-400 mt-1">
                    <Key size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Anti-Hijacking Protocol</h4>
                    <p className="text-gray-500 text-sm">Guards session tokens and prevents credential theft via Man-in-the-Middle attacks.</p>
                  </div>
                </li>
              </ul>
              <div className="mt-10">
                <Link href="/docs/watchdog" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all shadow-lg active:scale-95">
                  Extend Your Perimeter <Lock size={20} />
                </Link>
              </div>
            </div>

            {/* Visual Metaphor Animation */}
            <div className="lg:w-1/2 flex justify-center w-full" data-cursor="default">
              <div className="relative w-full max-w-md aspect-square">
                {/* Background Glow */}
                <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-3xl animate-pulse"></div>

                {/* Central Shield */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.5)] border-4 border-indigo-400 relative">
                    <ShieldCheck size={64} className="text-white" />
                    {/* Orbiting Particles */}
                    <div className="absolute inset-0 border border-indigo-400/30 rounded-full w-[150%] h-[150%] -top-[25%] -left-[25%] animate-[spin_10s_linear_infinite]"></div>
                  </div>
                </div>

                {/* Hacker Node (Left) */}
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-4 z-10 flex flex-col items-center gap-2 animate-[bounce_3s_infinite]">
                  <div className="w-16 h-16 bg-red-900/20 border border-red-500/50 rounded-xl flex items-center justify-center">
                    <MonitorX size={32} className="text-red-500" />
                  </div>
                  <span className="text-red-500 font-mono text-xs uppercase bg-red-900/10 px-2 py-1 rounded">Malware</span>
                  {/* Attack Line */}
                  <div className="absolute left-full top-1/2 h-0.5 w-24 bg-gradient-to-r from-red-500 to-transparent"></div>
                </div>

                {/* User Node (Right) */}
                <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-4 z-10 flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-green-900/20 border border-green-500/50 rounded-xl flex items-center justify-center">
                    <Laptop2 size={32} className="text-green-500" />
                  </div>
                  <span className="text-green-500 font-mono text-xs uppercase bg-green-900/10 px-2 py-1 rounded">User Device</span>
                </div>

                {/* Connection Line (Server -> Shield -> User) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  <line x1="10%" y1="50%" x2="50%" y2="50%" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_1s_linear_infinite]" />
                  <line x1="50%" y1="50%" x2="90%" y2="50%" stroke="#22c55e" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Cross-Platform Grid */}
      <section className="bg-gray-950 border-b border-gray-900 py-20" data-cursor="security">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-center">

            <Link href="/docs/platforms/web" className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="p-4 bg-gray-900 rounded-2xl group-hover:bg-blue-600/20 transition-colors border border-transparent group-hover:border-blue-500/50">
                <Globe size={32} className="text-blue-500" />
              </div>
              <span className="text-gray-400 text-sm font-bold uppercase tracking-wider group-hover:text-blue-400 transition-colors">Web Apps</span>
            </Link>

            <Link href="/docs/platforms/mobile" className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="p-4 bg-gray-900 rounded-2xl group-hover:bg-green-600/20 transition-colors border border-transparent group-hover:border-green-500/50">
                <Smartphone size={32} className="text-green-500" />
              </div>
              <span className="text-gray-400 text-sm font-bold uppercase tracking-wider group-hover:text-green-400 transition-colors">Mobile (iOS/Android)</span>
            </Link>

            <Link href="/docs/platforms/games" className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="p-4 bg-gray-900 rounded-2xl group-hover:bg-purple-600/20 transition-colors border border-transparent group-hover:border-purple-500/50">
                <Gamepad2 size={32} className="text-purple-500" />
              </div>
              <span className="text-gray-400 text-sm font-bold uppercase tracking-wider group-hover:text-purple-400 transition-colors">Games (Unity/Unreal)</span>
            </Link>

            {/* CMS & E-Commerce */}
            <Link href="/docs/cms-protection" className="flex flex-col items-center gap-2 group cursor-pointer">
              <div className="p-4 bg-gray-900 rounded-2xl group-hover:bg-orange-600/20 transition-colors border border-transparent group-hover:border-orange-500/50">
                <ShoppingBag size={32} className="text-orange-500" />
              </div>
              <span className="text-gray-400 text-sm font-bold uppercase tracking-wider group-hover:text-orange-400 transition-colors">CMS & E-Commerce</span>
            </Link>

          </div>
          <div className="text-center mt-8 pt-8 border-t border-gray-900">
            <p className="text-gray-500 text-sm font-mono">
              <Code2 className="inline-block w-4 h-4 mr-2 text-yellow-500" />
              Protecting .exe, .apk, .js, .php, and CMS themes with decentralized DNA monitoring.
            </p>
          </div>
        </div>
      </section>

      {/* Core Defense Arsenal Section */}
      <section className="py-24 bg-black border-b border-gray-900" data-cursor="security">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-red-500 font-mono text-sm uppercase tracking-widest block mb-2">Total Lockdown Protocol</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Core Defense Arsenal
            </h2>
            <div className="w-24 h-1.5 bg-red-600 mx-auto rounded-full mt-6" />
            <p className="text-gray-400 mt-6 text-lg max-w-2xl mx-auto">
              Specific countermeasures deployed against the most common vectors of digital theft and sabotage.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Service 1: CPanel File Protection */}
            <div className="bg-black border border-gray-800 p-8 rounded-2xl hover:border-red-500/50 transition-all group" data-cursor="threat">
              <div className="w-14 h-14 bg-red-900/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-red-900/20 transition-colors">
                <FileCode className="w-7 h-7 text-red-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">CPanel File Guard</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Prevents illegal file replication even with direct server access. If a file is copied to an unauthorized domain, it self-corrupts instantly.
              </p>
            </div>

            {/* Service 2: Media Shield */}
            <div className="bg-black border border-gray-800 p-8 rounded-2xl hover:border-blue-500/50 transition-all group">
              <div className="w-14 h-14 bg-blue-900/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-blue-900/20 transition-colors">
                <CameraOff className="w-7 h-7 text-blue-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Media Integrity Shield</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Blocks image dragging, right-click context menus, and source-code media scraping. Your assets stay on your site, nowhere else.
              </p>
            </div>

            {/* Service 3: Anti-Hack Firewall */}
            <div className="bg-black border border-gray-800 p-8 rounded-2xl hover:border-green-500/50 transition-all group" data-cursor="threat">
              <div className="w-14 h-14 bg-green-900/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-green-900/20 transition-colors">
                <MonitorX className="w-7 h-7 text-green-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Anti-Hack Firewall</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Real-time blocking of SQL injections, XSS attacks, and malicious script executions. We drop packets from known attacker IPs before they hit your app.
              </p>
            </div>

            {/* Service 4: License Lock */}
            <div className="bg-black border border-gray-800 p-8 rounded-2xl hover:border-purple-500/50 transition-all group" data-cursor="security">
              <div className="w-14 h-14 bg-purple-900/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-purple-900/20 transition-colors">
                <Key className="w-7 h-7 text-purple-500" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">License Lock</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Decentralized key validation that acts as a kill switch. If license tampering is detected, the site enters a permanent lockdown state.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How We Catch Thieves (3-Step Trap) - UPDATED TO 3-STEP GRID */}
      <section className="py-24 bg-gray-950/50 border-b border-gray-900" data-cursor="threat">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-20">
            <span className="text-yellow-500 font-mono text-sm uppercase tracking-widest block mb-2">The Catching Mechanism</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              How We Catch the <span className="text-yellow-500">Thieves</span>.
            </h2>
            <p className="text-gray-400 text-lg">
              Our 3-step detection logic ensures that no intruder leaves without a trace.
            </p>
          </div>

          <div className="relative">
            {/* Connector Line */}
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 -z-10 transform -translate-y-1/2"></div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {/* Step 1: Detection */}
              <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl relative overflow-hidden group hover:border-blue-500/50 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
                <div className="w-16 h-16 bg-black border border-gray-700 rounded-2xl flex items-center justify-center mb-6 text-blue-500 mx-auto md:mx-0 shadow-lg relative z-10">
                  <Eye size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">1. Detection</h3>
                <p className="text-gray-400 leading-relaxed">
                  <strong>Real-time DNA scanning</strong> of every file interaction. We don't wait for a report; we watch the code itself breathe.
                </p>
              </div>

              {/* Step 2: Neural Logging */}
              <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl relative overflow-hidden group hover:border-yellow-500/50 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-full blur-2xl group-hover:bg-yellow-500/20 transition-all" />
                <div className="w-16 h-16 bg-black border border-gray-700 rounded-2xl flex items-center justify-center mb-6 text-yellow-500 mx-auto md:mx-0 shadow-lg relative z-10">
                  <Fingerprint size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">2. Neural Logging</h3>
                <p className="text-gray-400 leading-relaxed">
                  Capturing <strong>IP address, Geolocation, and Device ID</strong> of the intruder instantly. A digital fingerprint is stored in our immutable ledger.
                </p>
              </div>

              {/* Step 3: Instant Enforcement */}
              <div className="bg-gray-900 border border-gray-800 p-8 rounded-3xl relative overflow-hidden group hover:border-red-500/50 transition-all">
                <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl group-hover:bg-red-500/20 transition-all" />
                <div className="w-16 h-16 bg-black border border-gray-700 rounded-2xl flex items-center justify-center mb-6 text-red-500 mx-auto md:mx-0 shadow-lg relative z-10">
                  <Siren size={32} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">3. Instant Enforcement</h3>
                <p className="text-gray-400 leading-relaxed">
                  Automatic <strong>WhatsApp & Email alerts</strong> dispatched to the owner, followed by a <strong>Remote Kill Switch</strong> activation.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Instant Alert System (Visual Polish) */}
      <section className="py-20 bg-black border-b border-gray-900" data-cursor="security">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-6 flex items-center justify-center gap-3">
            <Send className="text-green-500 w-8 h-8 rotate-[-45deg]" /> Zero-Latency Alert System
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-10">
            You don't need to refresh a dashboard to know you're safe. If an intruder is caught, we notify you instantly
            with their IP, Location, and Device Data.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-8 items-stretch">
            {/* WhatsApp Visual */}
            <div className="flex-1 bg-gray-900 border border-gray-800 p-6 rounded-2xl relative overflow-hidden group hover:border-green-500/50 transition-all">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl"></div>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-green-500/10 rounded-full text-green-500">
                  <MessageCircle size={24} />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-white">WhatsApp Alerts</h4>
                  <p className="text-xs text-green-400">● Online</p>
                </div>
              </div>
              {/* Simulated Phone UI */}
              <div className="bg-black/80 rounded-xl p-3 border border-gray-800 text-left text-sm font-mono relative backdrop-blur-sm">
                <div className="text-gray-500 text-[10px] mb-2">Today, 2:41 PM</div>
                <div className="bg-gray-800 p-3 rounded-lg rounded-tl-none inline-block max-w-[90%] text-gray-200">
                  🚨 <span className="text-red-400 font-bold">BREACH ALERT</span><br />
                  <strong>Target:</strong> CRM-Main<br />
                  <strong>IP:</strong> 103.21.XX.XX<br />
                  <strong>Status:</strong> BLOCKED 🛡️
                </div>
              </div>
            </div>

            {/* Email Visual */}
            <div className="flex-1 bg-gray-900 border border-gray-800 p-6 rounded-2xl relative overflow-hidden group hover:border-blue-500/50 transition-all">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl"></div>
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-500/10 rounded-full text-blue-500">
                  <Mail size={24} />
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-white">Email Reports</h4>
                  <p className="text-xs text-blue-400">● Delivered</p>
                </div>
              </div>
              {/* Simulated Email UI */}
              <div className="bg-black/80 rounded-xl p-3 border border-gray-800 text-left text-sm relative backdrop-blur-sm">
                <div className="border-b border-gray-800 pb-2 mb-2 flex justify-between items-center">
                  <span className="font-bold text-white">Security Report</span>
                  <span className="text-[10px] text-gray-500">Just now</span>
                </div>
                <div className="text-gray-400 text-xs leading-relaxed">
                  Attached is the forensic analysis of incident <span className="text-blue-400">#ID-9281</span>.
                  Legal notice template generated automatically.
                </div>
                <div className="mt-3 flex items-center gap-2 text-xs bg-gray-800/50 p-2 rounded border border-gray-700">
                  <FileCode size={12} /> <span>forensic_report.pdf</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* NEW: Command & Control Dashboard */}
      <section className="py-24 bg-gradient-to-b from-gray-950 via-gray-950 to-black border-y border-gray-800 relative overflow-hidden" data-cursor="security">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="lg:w-1/2">
              <span className="text-blue-500 font-mono text-sm uppercase tracking-widest mb-2 block">Command Center</span>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                Manage Your Kingdom. <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Total Visibility.</span>
              </h2>
              <p className="text-gray-400 text-xl mb-8 leading-relaxed font-light">
                A dedicated mission control dashboard to monitor live analytics, manage license keys, and remotely kill or repair any instance of your software globally.
              </p>

              {/* Dashboard Features List */}
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                  Live Threat Map & Geo-blocking
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" />
                  One-Click License Revocation
                </li>
                <li className="flex items-center gap-3 text-gray-300">
                  <div className="w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                  Automated Legal Notice Generation
                </li>
              </ul>

              <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-600/20 text-lg">
                <LayoutDashboard size={20} /> Access Control Panel
              </Link>
            </div>

            {/* Terminal / System Status UI */}
            <div className="lg:w-1/2 relative w-full group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
              <div className="relative bg-[#0d1117] border border-gray-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-6">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500" />
                    <div className="w-3 h-3 rounded-full bg-yellow-500" />
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-gray-500">admin@licensr-cmd:~</span>
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs rounded border border-green-500/20 font-bold">SYSTEM SECURE</span>
                  </div>
                </div>
                <div className="space-y-4 font-mono text-sm">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-900 p-4 rounded border border-gray-800">
                      <div className="text-xs text-gray-500 uppercase">Active Licenses</div>
                      <div className="text-2xl text-white font-bold">1,204</div>
                    </div>
                    <div className="bg-gray-900 p-4 rounded border border-gray-800">
                      <div className="text-xs text-gray-500 uppercase">Threats Neutralized</div>
                      <div className="text-2xl text-green-400 font-bold">842</div>
                    </div>
                  </div>
                  <div className="text-gray-500">] Monitoring node cluster [asia-south-1]...</div>
                  <div className="text-blue-400">] 3 Intrusion attempts blocked from IP 192.168.X.X</div>
                  <div className="text-gray-500">] WhatsApp alert dispatched to owner.</div>
                  <div className="text-green-500 font-bold bg-green-900/10 p-2 rounded border border-green-900/20 text-center mt-4">ALL SYSTEMS OPERATIONAL</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Tabs */}
      <section className="bg-black border-b border-gray-900 pb-20 pt-10" data-cursor="security">
        <div className="container mx-auto px-4 text-center mb-10">
          <span className="text-blue-500 font-mono text-sm uppercase tracking-widest">Defense Mechanisms</span>
          <h2 className="text-3xl md:text-5xl font-black mt-3 mb-6">Layered Security Architecture</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">
            We don't just hide your code; we wrap it in an intelligent, self-defending exoskeleton.
          </p>
        </div>
        <SecurityTabs />
      </section>

      {/* NEW: 24/7 Elite Support Section */}
      <section className="py-24 bg-gray-950">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-mono mb-8">
            <Globe size={14} /> GLOBAL SECURITY OPERATIONS CENTER
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
            24/7 Elite <span className="text-blue-600">Support</span>.
          </h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-12">
            Human-Intelligence at work. Our security experts monitor your assets 24/7, providing real-time analysis of every threat
            and instant response to critical incidents.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-8 bg-black border border-gray-800 rounded-2xl hover:border-blue-500 transition-colors">
              <Users size={32} className="text-blue-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Dedicated Experts</h3>
              <p className="text-gray-500 text-sm">Direct access to senior security engineers, not chatbots.</p>
            </div>
            <div className="p-8 bg-black border border-gray-800 rounded-2xl hover:border-purple-500 transition-colors">
              <Activity size={32} className="text-purple-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Proactive Monitoring</h3>
              <p className="text-gray-500 text-sm">We spot anomalies before they become breaches.</p>
            </div>
            <div className="p-8 bg-black border border-gray-800 rounded-2xl hover:border-green-500 transition-colors">
              <RotateCw size={32} className="text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Rapid Response</h3>
              <p className="text-gray-500 text-sm">Guaranteed 15-minute response time for critical alerts.</p>
            </div>
          </div>
        </div>
      </section>

      <WatchdogSection />

      {/* Technical Workflow Section */}
      <section className="py-28 bg-black border-b border-gray-900" data-cursor="security">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight">
              <span className="text-blue-600">Technical</span> Workflow
            </h2>
            <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full" />
            <p className="text-gray-400 mt-6 text-lg">How Licensr integrates, protects, and recovers.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {/* Step 1: DNA Injection */}
            <div className="p-10 rounded-3xl bg-gray-900/40 border border-gray-800 hover:border-blue-500/50 transition-all duration-300 group hover:bg-gray-900/60">
              <div className="w-16 h-16 bg-blue-900/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(59,130,246,0.1)]">
                <Cpu className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">1. DNA Injection</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                Deep-core integration into application logic. We bind to your source code at the compilation level, creating a unique cryptographic signature that ensures
                <span className="text-blue-400 font-medium"> inseparable security</span>.
              </p>
            </div>

            {/* Step 2: Neural Response */}
            <div className="p-10 rounded-3xl bg-gray-900/40 border border-gray-800 hover:border-purple-500/50 transition-all duration-300 group hover:bg-gray-900/60">
              <div className="w-16 h-16 bg-purple-900/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(168,85,247,0.1)]">
                <Network className="w-8 h-8 text-purple-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">2. Neural Response</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                Instant global sync for malicious IP blacklisting. When one client is attacked, the entire Licensr network is
                <span className="text-purple-400 font-medium"> immunized instantly</span> against that threat vector.
              </p>
            </div>

            {/* Step 3: Zero-Downtime Recovery */}
            <div className="p-10 rounded-3xl bg-gray-900/40 border border-gray-800 hover:border-green-500/50 transition-all duration-300 group hover:bg-gray-900/60">
              <div className="w-16 h-16 bg-green-900/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                <RotateCw className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">3. Zero-Downtime Recovery</h3>
              <p className="text-gray-400 leading-relaxed text-lg">
                Instant restoration from secure clean snapshots. If corruption is detected, we automatically roll back to a verified safe state in
                <span className="text-green-400 font-medium"> sub-millisecond time</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      <FeatureSection />
    </main>
  );
}
