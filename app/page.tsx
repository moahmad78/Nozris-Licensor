'use client';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Shield, ShieldCheck, Zap, Lock, Activity, Heart, Key,
  Fingerprint, MessageCircle, Wifi, WifiOff, Eye, EyeOff,
  Terminal, AlertTriangle, CheckCircle, XCircle, ArrowRight,
  Cpu, Globe, Users, RotateCw, Send, Mail, FileCode,
  MonitorX, Laptop2, CameraOff, LayoutDashboard, Siren, Network
} from 'lucide-react';
import FeatureSection from '@/components/FeatureSection';
import SecurityTabs from '@/components/SecurityTabs';
import TrustBar from '@/components/TrustBar';
import PlatformShowcase from '@/components/PlatformShowcase';
import IntelligenceHub from '@/components/IntelligenceHub';
import WatchdogSection from '@/components/WatchdogSection';
import AuthModal from '@/components/AuthModal';

// Animation variants
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i: number = 0) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as any }
  })
};

export default function Home() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authView, setAuthView] = useState<'login' | 'register'>('register');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('login') === 'true') {
      setAuthView('login');
      setIsAuthOpen(true);
      window.history.replaceState({}, '', '/');
    }
    const handleAuthEvent = (e: CustomEvent<{ view: 'login' | 'register' }>) => {
      setAuthView(e.detail.view);
      setIsAuthOpen(true);
    };
    window.addEventListener('open-auth-modal', handleAuthEvent as EventListener);
    return () => window.removeEventListener('open-auth-modal', handleAuthEvent as EventListener);
  }, []);

  return (
    <main className="min-h-screen bg-[#050510] text-white selection:bg-indigo-500/30 font-sans overflow-hidden">

      {/* ═══════════════════════════════════════════════════════ */}
      {/* HERO SECTION — Nozris v2 */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-24 overflow-hidden">
        {/* Animated grid background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:60px_60px]" />
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-indigo-600/10 rounded-full blur-[150px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyan-600/5 rounded-full blur-[120px]" />
          <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-purple-600/5 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Nozris v2 Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-mono mb-8"
          >
            <Shield className="w-4 h-4" />
            NOZRIS v2.0 — MILITARY-GRADE PROTECTION
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={fadeUp} initial="hidden" animate="visible" custom={1}
            className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tight leading-[0.95] mb-6"
          >
            Stop Website Theft
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-indigo-400">
              & Payment Defaulters
            </span>
            <br />
            <span className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-400">
              with Nozris.
            </span>
          </motion.h1>

          {/* Sub-headline */}
          <motion.p
            variants={fadeUp} initial="hidden" animate="visible" custom={2}
            className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Duniya ka pehla <span className="text-indigo-400 font-semibold">Military-Grade Licensing System</span> jo sirf visual lock nahi,
            balki <span className="text-white font-semibold">functional security</span> deta hai. <br className="hidden md:block" />
            HMAC Encryption aur Real-time WhatsApp alerts ke saath.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={3}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button
              onClick={() => { setAuthView('register'); setIsAuthOpen(true); }}
              className="group relative px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-lg transition-all shadow-lg shadow-indigo-600/25 hover:shadow-indigo-500/40 active:scale-95 flex items-center gap-3"
            >
              <Key className="w-5 h-5" />
              Get Your Free License Key
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <Link
              href="/demo"
              className="px-8 py-4 border border-gray-700 hover:border-indigo-500/50 text-gray-300 hover:text-white font-semibold rounded-xl text-lg transition-all flex items-center gap-3 hover:bg-indigo-500/5"
            >
              <Eye className="w-5 h-5" />
              Watch Live Demo
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="visible" custom={4}
            className="mt-16 flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600"
          >
            <div className="flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-green-500" /><span>HMAC-256 Signed</span></div>
            <div className="flex items-center gap-2"><Heart className="w-4 h-4 text-red-500" /><span>Real-time Heartbeat</span></div>
            <div className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-green-500" /><span>WhatsApp Alerts</span></div>
            <div className="flex items-center gap-2"><Wifi className="w-4 h-4 text-cyan-500" /><span>24hr Fail-Safe</span></div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-gray-700 flex justify-center pt-2">
            <div className="w-1.5 h-3 bg-indigo-500 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* COMPARISON TABLE — Nozris vs. Others */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-24 bg-[#080818] border-y border-gray-800/50 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-indigo-600/3 to-transparent" />
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <span className="text-indigo-400 font-mono text-sm uppercase tracking-widest block mb-3">Security Comparison</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Nozris vs. <span className="text-gray-500">Others</span>
            </h2>
            <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">Why basic CSS locks are a joke — and why Nozris is military-grade.</p>
          </motion.div>

          <motion.div
            variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={1}
            className="rounded-2xl border border-gray-800 overflow-hidden bg-gray-900/30 backdrop-blur-sm"
          >
            {/* Table Header */}
            <div className="grid grid-cols-3 bg-gray-900/80 border-b border-gray-800">
              <div className="p-5 text-sm font-mono text-gray-500 uppercase tracking-wider">Feature</div>
              <div className="p-5 text-center">
                <span className="text-sm text-gray-400 font-semibold">Others (CSS Lock)</span>
                <div className="text-[10px] text-red-400 font-mono mt-1">WEAK</div>
              </div>
              <div className="p-5 text-center bg-indigo-600/5 border-l border-indigo-500/10">
                <span className="text-sm text-indigo-400 font-bold">Nozris v2</span>
                <div className="text-[10px] text-green-400 font-mono mt-1">MILITARY-GRADE</div>
              </div>
            </div>

            {/* Rows */}
            {[
              {
                feature: 'Bypass Method',
                bad: '10s CSS Change (opacity: 1)',
                good: 'Impossible without HMAC Key',
                badIcon: <XCircle className="w-4 h-4 text-red-500" />,
                goodIcon: <ShieldCheck className="w-4 h-4 text-green-500" />
              },
              {
                feature: 'Detection',
                bad: 'No Alerts — Silent Theft',
                good: 'Instant WhatsApp Alert 🚨',
                badIcon: <EyeOff className="w-4 h-4 text-red-500" />,
                goodIcon: <MessageCircle className="w-4 h-4 text-green-500" />
              },
              {
                feature: 'Offline Protection',
                bad: 'Site Crashes Immediately',
                good: '24-Hour Fail-Safe Grace',
                badIcon: <WifiOff className="w-4 h-4 text-red-500" />,
                goodIcon: <Wifi className="w-4 h-4 text-green-500" />
              },
              {
                feature: 'Security Logic',
                bad: 'Plain Text JavaScript',
                good: 'Encrypted Obfuscated Code',
                badIcon: <XCircle className="w-4 h-4 text-red-500" />,
                goodIcon: <Lock className="w-4 h-4 text-green-500" />
              },
              {
                feature: 'Tamper Proof',
                bad: 'No — Open to Inspect Element',
                good: 'Auto-Kill on Inspect Element',
                badIcon: <XCircle className="w-4 h-4 text-red-500" />,
                goodIcon: <Siren className="w-4 h-4 text-green-500" />
              },
            ].map((row, i) => (
              <div key={i} className={`grid grid-cols-3 border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors ${i % 2 === 0 ? '' : 'bg-gray-900/20'}`}>
                <div className="p-5 text-sm font-semibold text-gray-300 flex items-center">{row.feature}</div>
                <div className="p-5 text-center text-sm text-red-400/80 flex items-center justify-center gap-2">
                  {row.badIcon} {row.bad}
                </div>
                <div className="p-5 text-center bg-indigo-600/3 border-l border-indigo-500/10 text-sm text-green-400 font-semibold flex items-center justify-center gap-2">
                  {row.goodIcon} {row.good}
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* FEATURE POWER GRID — 4 Cards */}
      {/* ═══════════════════════════════════════════════════════ */}
      <section className="py-24 bg-[#050510] relative">
        <div className="container mx-auto px-4 max-w-6xl">
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="text-center mb-16">
            <span className="text-cyan-400 font-mono text-sm uppercase tracking-widest block mb-3">Core Arsenal</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">
              Feature <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Power Grid</span>
            </h2>
            <p className="text-gray-400 mt-4 text-lg max-w-2xl mx-auto">
              4 layers of defense that make Nozris practically unbreakable.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: Heart,
                color: 'red',
                title: 'Anti-Hacker Heartbeat',
                desc: 'Har 60 seconds mein "Dhadkan" check. Agar dil band hua — toh site bhi band. Script removal = instant death.',
                tag: 'CRITICAL',
                gradient: 'from-red-600/20 to-red-900/5',
                border: 'hover:border-red-500/50',
                glow: 'bg-red-500/10',
                iconColor: 'text-red-500',
              },
              {
                icon: Fingerprint,
                color: 'indigo',
                title: 'HMAC Digital Signature',
                desc: 'Every API response is signed with SHA-256 HMAC. Plain CSS replacement is impossible — forgery requires the secret key.',
                tag: 'ENCRYPTION',
                gradient: 'from-indigo-600/20 to-indigo-900/5',
                border: 'hover:border-indigo-500/50',
                glow: 'bg-indigo-500/10',
                iconColor: 'text-indigo-500',
              },
              {
                icon: MessageCircle,
                color: 'green',
                title: 'WhatsApp Guard',
                desc: 'Instant mobile alerts on theft attempts. Tere phone pe message aayega before the hacker even closes DevTools.',
                tag: 'REAL-TIME',
                gradient: 'from-green-600/20 to-green-900/5',
                border: 'hover:border-green-500/50',
                glow: 'bg-green-500/10',
                iconColor: 'text-green-500',
              },
              {
                icon: Wifi,
                color: 'cyan',
                title: 'Zero-Downtime Cache',
                desc: 'Smart 24-hour localStorage fallback. Server down? Clients sites stay alive. No more "Single Point of Failure".',
                tag: 'FAIL-SAFE',
                gradient: 'from-cyan-600/20 to-cyan-900/5',
                border: 'hover:border-cyan-500/50',
                glow: 'bg-cyan-500/10',
                iconColor: 'text-cyan-500',
              },
            ].map((card, i) => {
              const Icon = card.icon;
              return (
                <motion.div
                  key={i}
                  variants={fadeUp}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true }}
                  custom={i}
                  className={`group relative bg-gray-900/40 border border-gray-800 rounded-2xl p-8 ${card.border} transition-all duration-300 overflow-hidden backdrop-blur-sm`}
                >
                  {/* Background glow */}
                  <div className={`absolute top-0 right-0 w-48 h-48 ${card.glow} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                  <div className="relative z-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${card.gradient} flex items-center justify-center border border-gray-700/50`}>
                        <Icon className={`w-7 h-7 ${card.iconColor}`} />
                      </div>
                      <span className={`text-[10px] font-mono font-bold ${card.iconColor} bg-black/40 px-3 py-1 rounded-full border border-gray-800`}>
                        {card.tag}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed">{card.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════ */}
      {/* EXISTING SECTIONS — Platform Showcase, Intelligence, etc. */}
      {/* ═══════════════════════════════════════════════════════ */}
      <PlatformShowcase />
      <IntelligenceHub />
      <TrustBar />

      {/* Client-Side Defense Section */}
      <section className="py-24 bg-gradient-to-br from-gray-950 to-[#050510] border-y border-gray-900 overflow-hidden relative">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="w-full px-6 md:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2">
              <div className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-mono mb-6">
                <MonitorX size={14} /> CLIENT-SIDE DEFENSE
              </div>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                From Server to User Device:
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">Every Link Protected.</span>
              </h2>
              <p className="text-gray-400 text-lg mb-8 leading-relaxed">
                Security doesn&apos;t stop at your firewall. Nozris extends protection to the end-user&apos;s browser with functional locks, heartbeat monitoring, and DevTools detection.
              </p>
              <ul className="space-y-6">
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400 mt-1"><MonitorX size={20} /></div>
                  <div>
                    <h4 className="font-bold text-white text-lg">Functional Lock (Not CSS)</h4>
                    <p className="text-gray-500 text-sm">Content is physically absent without the signed API payload. No CSS trick can reveal it.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-green-500/10 rounded-lg text-green-400 mt-1"><ShieldCheck size={20} /></div>
                  <div>
                    <h4 className="font-bold text-white text-lg">DevTools Auto-Detection</h4>
                    <p className="text-gray-500 text-sm">getComputedStyle checks detect manual CSS overrides and auto-lock the license within seconds.</p>
                  </div>
                </li>
                <li className="flex items-start gap-4">
                  <div className="p-2 bg-red-500/10 rounded-lg text-red-400 mt-1"><Key size={20} /></div>
                  <div>
                    <h4 className="font-bold text-white text-lg">HMAC-Signed Payloads</h4>
                    <p className="text-gray-500 text-sm">Every unlock response is cryptographically signed. Man-in-the-Middle attacks are meaningless.</p>
                  </div>
                </li>
              </ul>
              <div className="mt-10">
                <Link href="/demo" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all shadow-lg active:scale-95">
                  Try the "Hack Me" Challenge <ArrowRight size={20} />
                </Link>
              </div>
            </div>

            {/* Shield Visual */}
            <div className="lg:w-1/2 flex justify-center w-full">
              <div className="relative w-full max-w-md aspect-square">
                <div className="absolute inset-0 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
                  <div className="w-32 h-32 bg-indigo-600 rounded-full flex items-center justify-center shadow-[0_0_50px_rgba(79,70,229,0.5)] border-4 border-indigo-400 relative">
                    <ShieldCheck size={64} className="text-white" />
                    <div className="absolute inset-0 border border-indigo-400/30 rounded-full w-[150%] h-[150%] -top-[25%] -left-[25%] animate-[spin_10s_linear_infinite]" />
                  </div>
                </div>
                <div className="absolute top-1/2 left-0 transform -translate-y-1/2 -translate-x-4 z-10 flex flex-col items-center gap-2 animate-[bounce_3s_infinite]">
                  <div className="w-16 h-16 bg-red-900/20 border border-red-500/50 rounded-xl flex items-center justify-center"><MonitorX size={32} className="text-red-500" /></div>
                  <span className="text-red-500 font-mono text-xs uppercase bg-red-900/10 px-2 py-1 rounded">Hacker</span>
                  <div className="absolute left-full top-1/2 h-0.5 w-24 bg-gradient-to-r from-red-500 to-transparent" />
                </div>
                <div className="absolute top-1/2 right-0 transform -translate-y-1/2 translate-x-4 z-10 flex flex-col items-center gap-2">
                  <div className="w-16 h-16 bg-green-900/20 border border-green-500/50 rounded-xl flex items-center justify-center"><Laptop2 size={32} className="text-green-500" /></div>
                  <span className="text-green-500 font-mono text-xs uppercase bg-green-900/10 px-2 py-1 rounded">Protected</span>
                </div>
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
                  <line x1="10%" y1="50%" x2="50%" y2="50%" stroke="#ef4444" strokeWidth="2" strokeDasharray="5,5" className="animate-[dash_1s_linear_infinite]" />
                  <line x1="50%" y1="50%" x2="90%" y2="50%" stroke="#22c55e" strokeWidth="2" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Defense Arsenal */}
      <section className="py-24 bg-[#050510] border-b border-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <span className="text-red-500 font-mono text-sm uppercase tracking-widest block mb-2">Total Lockdown Protocol</span>
            <h2 className="text-4xl md:text-5xl font-black tracking-tight">Core Defense Arsenal</h2>
            <div className="w-24 h-1.5 bg-red-600 mx-auto rounded-full mt-6" />
            <p className="text-gray-400 mt-6 text-lg max-w-2xl mx-auto">
              Specific countermeasures deployed against the most common vectors of digital theft and sabotage.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: FileCode, color: 'red', title: 'CPanel File Guard', desc: 'Prevents illegal file replication. Unauthorized copies self-corrupt instantly.' },
              { icon: CameraOff, color: 'blue', title: 'Media Integrity Shield', desc: 'Blocks image dragging, right-click, and source-code media scraping.' },
              { icon: MonitorX, color: 'green', title: 'Anti-Hack Firewall', desc: 'Real-time blocking of SQL injection, XSS attacks, and malicious executions.' },
              { icon: Key, color: 'purple', title: 'License Lock v2', desc: 'HMAC-signed kill switch. Tamper = permanent lockdown + WhatsApp alert.' },
            ].map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={i} className={`bg-[#0a0a1a] border border-gray-800 p-8 rounded-2xl hover:border-${s.color}-500/50 transition-all group`}>
                  <div className={`w-14 h-14 bg-${s.color}-900/10 rounded-xl flex items-center justify-center mb-6 group-hover:bg-${s.color}-900/20 transition-colors`}>
                    <Icon className={`w-7 h-7 text-${s.color}-500`} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{s.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How We Catch Thieves — 3-Step Trap */}
      <section className="py-24 bg-gray-950/50 border-b border-gray-900">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-20">
            <span className="text-yellow-500 font-mono text-sm uppercase tracking-widest block mb-2">The Catching Mechanism</span>
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              How We Catch the <span className="text-yellow-500">Thieves</span>.
            </h2>
            <p className="text-gray-400 text-lg">Our 3-step detection logic ensures no intruder leaves without a trace.</p>
          </div>
          <div className="relative">
            <div className="hidden md:block absolute top-1/2 left-0 w-full h-0.5 bg-gray-800 -z-10 transform -translate-y-1/2" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              {[
                { icon: Eye, color: 'blue', title: '1. Detection', desc: 'Real-time DNA scanning of every file interaction. We watch the code itself breathe.' },
                { icon: Fingerprint, color: 'yellow', title: '2. Neural Logging', desc: 'Capturing IP address, Geolocation, and Device ID instantly. A digital fingerprint stored forever.' },
                { icon: Siren, color: 'red', title: '3. Instant Enforcement', desc: 'Automatic WhatsApp & Email alerts dispatched, followed by a Remote Kill Switch activation.' },
              ].map((step, i) => {
                const Icon = step.icon;
                return (
                  <div key={i} className={`bg-gray-900 border border-gray-800 p-8 rounded-3xl relative overflow-hidden group hover:border-${step.color}-500/50 transition-all`}>
                    <div className={`absolute top-0 right-0 w-32 h-32 bg-${step.color}-500/10 rounded-full blur-2xl group-hover:bg-${step.color}-500/20 transition-all`} />
                    <div className={`w-16 h-16 bg-black border border-gray-700 rounded-2xl flex items-center justify-center mb-6 text-${step.color}-500 mx-auto md:mx-0 shadow-lg relative z-10`}>
                      <Icon size={32} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{step.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{step.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Alert System */}
      <section className="py-20 bg-[#050510] border-b border-gray-900">
        <div className="container mx-auto px-4 max-w-5xl text-center">
          <h2 className="text-3xl md:text-4xl font-black mb-6 flex items-center justify-center gap-3">
            <Send className="text-green-500 w-8 h-8 rotate-[-45deg]" /> Zero-Latency Alert System
          </h2>
          <p className="text-lg text-gray-400 max-w-3xl mx-auto mb-10">
            You don&apos;t need to refresh a dashboard. If an intruder is caught, we notify you instantly with IP, Location, and Device Data.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-8 items-stretch">
            <div className="flex-1 bg-gray-900 border border-gray-800 p-6 rounded-2xl relative overflow-hidden group hover:border-green-500/50 transition-all">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-green-500/10 rounded-full blur-3xl" />
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-green-500/10 rounded-full text-green-500"><MessageCircle size={24} /></div>
                <div className="text-left"><h4 className="font-bold text-white">WhatsApp Alerts</h4><p className="text-xs text-green-400">● Online</p></div>
              </div>
              <div className="bg-black/80 rounded-xl p-3 border border-gray-800 text-left text-sm font-mono backdrop-blur-sm">
                <div className="text-gray-500 text-[10px] mb-2">Today, 2:41 PM</div>
                <div className="bg-gray-800 p-3 rounded-lg rounded-tl-none inline-block max-w-[90%] text-gray-200">
                  🚨 <span className="text-red-400 font-bold">BREACH ALERT</span><br />
                  <strong>Target:</strong> CRM-Main<br />
                  <strong>IP:</strong> 103.21.XX.XX<br />
                  <strong>Status:</strong> BLOCKED 🛡️
                </div>
              </div>
            </div>
            <div className="flex-1 bg-gray-900 border border-gray-800 p-6 rounded-2xl relative overflow-hidden group hover:border-blue-500/50 transition-all">
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl" />
              <div className="flex items-center gap-4 mb-6">
                <div className="p-3 bg-blue-500/10 rounded-full text-blue-500"><Mail size={24} /></div>
                <div className="text-left"><h4 className="font-bold text-white">Email Reports</h4><p className="text-xs text-blue-400">● Delivered</p></div>
              </div>
              <div className="bg-black/80 rounded-xl p-3 border border-gray-800 text-left text-sm backdrop-blur-sm">
                <div className="border-b border-gray-800 pb-2 mb-2 flex justify-between items-center">
                  <span className="font-bold text-white">Security Report</span><span className="text-[10px] text-gray-500">Just now</span>
                </div>
                <div className="text-gray-400 text-xs leading-relaxed">Forensic analysis of incident <span className="text-blue-400">#ID-9281</span>. Legal notice template generated.</div>
                <div className="mt-3 flex items-center gap-2 text-xs bg-gray-800/50 p-2 rounded border border-gray-700"><FileCode size={12} /> forensic_report.pdf</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dashboard Preview */}
      <section className="py-24 bg-gradient-to-b from-gray-950 via-gray-950 to-[#050510] border-y border-gray-800 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-16">
            <div className="lg:w-1/2">
              <span className="text-blue-500 font-mono text-sm uppercase tracking-widest mb-2 block">Command Center</span>
              <h2 className="text-4xl md:text-5xl font-black mb-6 leading-tight">
                Manage Your Kingdom.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Total Visibility.</span>
              </h2>
              <p className="text-gray-400 text-xl mb-8 leading-relaxed font-light">
                A dedicated mission control dashboard to monitor live analytics, manage license keys, and remotely kill or repair any instance globally.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center gap-3 text-gray-300"><div className="w-2 h-2 bg-green-500 rounded-full shadow-[0_0_8px_rgba(34,197,94,0.8)]" /> Live Threat Map & Geo-blocking</li>
                <li className="flex items-center gap-3 text-gray-300"><div className="w-2 h-2 bg-blue-500 rounded-full shadow-[0_0_8px_rgba(59,130,246,0.8)]" /> One-Click License Revocation</li>
                <li className="flex items-center gap-3 text-gray-300"><div className="w-2 h-2 bg-purple-500 rounded-full shadow-[0_0_8px_rgba(168,85,247,0.8)]" /> Automated Legal Notice Generation</li>
              </ul>
              <Link href="/dashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-blue-600/20 text-lg">
                <LayoutDashboard size={20} /> Access Control Panel
              </Link>
            </div>
            <div className="lg:w-1/2 relative w-full group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000" />
              <div className="relative bg-[#0d1117] border border-gray-800 rounded-2xl p-8 shadow-2xl backdrop-blur-sm">
                <div className="flex items-center justify-between mb-6 border-b border-gray-800 pb-6">
                  <div className="flex gap-2"><div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-yellow-500" /><div className="w-3 h-3 rounded-full bg-green-500" /></div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-mono text-gray-500">admin@shield-v2:~</span>
                    <span className="px-3 py-1 bg-green-500/10 text-green-400 text-xs rounded border border-green-500/20 font-bold">SYSTEM SECURE</span>
                  </div>
                </div>
                <div className="space-y-4 font-mono text-sm">
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="bg-gray-900 p-4 rounded border border-gray-800"><div className="text-xs text-gray-500 uppercase">Active Licenses</div><div className="text-2xl text-white font-bold">1,204</div></div>
                    <div className="bg-gray-900 p-4 rounded border border-gray-800"><div className="text-xs text-gray-500 uppercase">Threats Neutralized</div><div className="text-2xl text-green-400 font-bold">842</div></div>
                  </div>
                  <div className="text-gray-500">] Monitoring cluster [asia-south-1]...</div>
                  <div className="text-blue-400">] 3 Intrusion attempts blocked from 192.168.X.X</div>
                  <div className="text-gray-500">] WhatsApp alert dispatched to owner.</div>
                  <div className="text-green-500 font-bold bg-green-900/10 p-2 rounded border border-green-900/20 text-center mt-4">ALL SYSTEMS OPERATIONAL</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Security Tabs */}
      <section className="bg-[#050510] border-b border-gray-900 pb-20 pt-10">
        <div className="container mx-auto px-4 text-center mb-10">
          <span className="text-blue-500 font-mono text-sm uppercase tracking-widest">Defense Mechanisms</span>
          <h2 className="text-3xl md:text-5xl font-black mt-3 mb-6">Layered Security Architecture</h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg">We don&apos;t just hide your code; we wrap it in an intelligent, self-defending exoskeleton.</p>
        </div>
        <SecurityTabs />
      </section>

      {/* Support */}
      <section className="py-24 bg-gray-950">
        <div className="container mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 py-1 px-4 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-mono mb-8">
            <Globe size={14} /> GLOBAL SECURITY OPERATIONS CENTER
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-6">24/7 Elite <span className="text-blue-600">Support</span>.</h2>
          <p className="text-gray-400 text-lg max-w-3xl mx-auto mb-12">Human-Intelligence at work. Our security experts monitor your assets 24/7.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="p-8 bg-[#0a0a1a] border border-gray-800 rounded-2xl hover:border-blue-500 transition-colors"><Users size={32} className="text-blue-500 mx-auto mb-4" /><h3 className="text-xl font-bold text-white mb-2">Dedicated Experts</h3><p className="text-gray-500 text-sm">Direct access to senior security engineers, not chatbots.</p></div>
            <div className="p-8 bg-[#0a0a1a] border border-gray-800 rounded-2xl hover:border-purple-500 transition-colors"><Activity size={32} className="text-purple-500 mx-auto mb-4" /><h3 className="text-xl font-bold text-white mb-2">Proactive Monitoring</h3><p className="text-gray-500 text-sm">We spot anomalies before they become breaches.</p></div>
            <div className="p-8 bg-[#0a0a1a] border border-gray-800 rounded-2xl hover:border-green-500 transition-colors"><RotateCw size={32} className="text-green-500 mx-auto mb-4" /><h3 className="text-xl font-bold text-white mb-2">Rapid Response</h3><p className="text-gray-500 text-sm">Guaranteed 15-minute response time for critical alerts.</p></div>
          </div>
        </div>
      </section>

      <WatchdogSection />

      {/* Technical Workflow */}
      <section className="py-28 bg-[#050510] border-b border-gray-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black mb-6 tracking-tight"><span className="text-blue-600">Technical</span> Workflow</h2>
            <div className="w-24 h-1.5 bg-blue-600 mx-auto rounded-full" />
            <p className="text-gray-400 mt-6 text-lg">How Nozris integrates, protects, and recovers.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: Cpu, color: 'blue', title: '1. DNA Injection', desc: 'Deep-core integration with cryptographic signature binding. Inseparable security.' },
              { icon: Network, color: 'purple', title: '2. Neural Response', desc: 'Instant global sync for malicious IP blacklisting. One attack immunizes the entire network.' },
              { icon: RotateCw, color: 'green', title: '3. Zero-Downtime Recovery', desc: 'Auto-rollback from verified clean snapshots in sub-millisecond time.' },
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className={`p-10 rounded-3xl bg-gray-900/40 border border-gray-800 hover:border-${step.color}-500/50 transition-all duration-300 group hover:bg-gray-900/60`}>
                  <div className={`w-16 h-16 bg-${step.color}-900/20 rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(59,130,246,0.1)]`}>
                    <Icon className={`w-8 h-8 text-${step.color}-500`} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-4">{step.title}</h3>
                  <p className="text-gray-400 leading-relaxed text-lg">{step.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <FeatureSection />

      {/* Auth Modal */}
      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} initialView={authView} />
    </main>
  );
}
