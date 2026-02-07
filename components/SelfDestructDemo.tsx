'use client';

import React, { useState, useEffect } from 'react';
import { RefreshCw, ShieldAlert, Skull } from 'lucide-react';

export default function SelfDestructDemo() {
    const [isSecure, setIsSecure] = useState(true);
    const [glitchText, setGlitchText] = useState('');

    const handleTamper = () => {
        setIsSecure(false);
    };

    const handleReset = () => {
        setIsSecure(true);
    };

    // Glitch effect logic
    useEffect(() => {
        if (!isSecure) {
            const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~`';
            const interval = setInterval(() => {
                let text = '';
                for (let i = 0; i < 50; i++) {
                    text += chars[Math.floor(Math.random() * chars.length)];
                }
                setGlitchText(text);
            }, 50);

            const body = document.querySelector('.demo-preview-area') as HTMLElement;
            if (body) {
                body.style.filter = "invert(1) hue-rotate(90deg) blur(1px)";
                body.style.transform = "skewX(5deg)";
            }

            return () => {
                clearInterval(interval);
                if (body) {
                    body.style.filter = "none";
                    body.style.transform = "none";
                }
            };
        }
    }, [isSecure]);

    return (
        <div className="w-full max-w-4xl mx-auto bg-gray-900 rounded-3xl overflow-hidden border border-gray-800 shadow-2xl mt-12">
            <div className="bg-gray-800 p-4 flex items-center justify-between border-b border-gray-700">
                <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="text-gray-400 text-xs font-mono uppercase tracking-widest">
                    {isSecure ? 'SYSTEM SECURE' : 'CRITICAL FAILURE'}
                </div>
            </div>

            <div className="relative p-8 min-h-[400px] demo-preview-area transition-all duration-200" style={isSecure ? {} : { filter: "invert(1) hue-rotate(90deg) blur(1px)", transform: "skewX(5deg)" }}>

                {isSecure ? (
                    <div className="space-y-6">
                        <nav className="flex justify-between items-center text-white">
                            <span className="font-bold text-xl">MyPortfolio</span>
                            <div className="flex gap-4 text-sm text-gray-400">
                                <span>Work</span>
                                <span>About</span>
                                <span>Contact</span>
                            </div>
                        </nav>
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-48 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                            Premium Content
                        </div>
                        <div className="grid grid-cols-3 gap-4">
                            <div className="h-24 bg-gray-800 rounded-xl"></div>
                            <div className="h-24 bg-gray-800 rounded-xl"></div>
                            <div className="h-24 bg-gray-800 rounded-xl"></div>
                        </div>
                    </div>
                ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                        <Skull className="w-24 h-24 text-red-600 animate-pulse mb-4" />
                        <h2 className="text-4xl font-black text-red-600 uppercase tracking-widest mb-2">THEFT DETECTED</h2>
                        <p className="text-red-500 font-mono text-sm break-all">{glitchText}</p>
                        <p className="text-red-500 font-mono text-sm break-all mt-2">{glitchText}</p>
                    </div>
                )}

            </div>

            <div className="bg-black p-6 border-t border-gray-800 flex justify-center gap-6">
                <button
                    onClick={handleTamper}
                    disabled={!isSecure}
                    className={`px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center gap-2 transition-all ${!isSecure ? 'opacity-50 cursor-not-allowed bg-gray-800 text-gray-500' : 'bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-900/20'}`}
                >
                    <ShieldAlert className="w-4 h-4" /> Simulate Code Theft
                </button>

                <button
                    onClick={handleReset}
                    disabled={isSecure}
                    className={`px-6 py-3 rounded-xl font-bold uppercase text-xs tracking-widest flex items-center gap-2 transition-all ${isSecure ? 'opacity-50 cursor-not-allowed bg-gray-800 text-gray-500' : 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20'}`}
                >
                    <RefreshCw className="w-4 h-4" /> Restore License
                </button>
            </div>
        </div>
    );
}
