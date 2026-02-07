'use client';

import { useState, useEffect } from 'react';
import { Shield, Clock, User, AlertTriangle, FileText, Lock } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';

// Mock data fetcher or real one if we had server action for logs.
// For "Standard Table", I will setup the UI. 
// Ideally this fetches from /api/logs or server action.
// I will create a mock data set and valid structure.

export default function ReportsPage() {
    return (
        <div className="max-w-7xl mx-auto p-6 md:p-12 space-y-12 animate-in fade-in duration-700">
            <header className="space-y-4">
                <div className="flex items-center gap-2 text-indigo-600">
                    <FileText className="w-5 h-5" />
                    <span className="text-[10px] font-[1000] uppercase tracking-[0.4em]">Audit Logs</span>
                </div>
                <h1 className="text-4xl font-[1000] tracking-tight uppercase italic text-gray-900">
                    Security <span className="text-gray-400">Reports</span>
                </h1>
            </header>

            {/* Session History Table */}
            <div className="bg-white p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8">
                <div className="flex items-center justify-between border-b border-gray-100 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <Clock className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-black uppercase">Session History</h2>
                            <p className="text-xs text-gray-400 font-bold uppercase tracking-wide">Edit Mode Access Logs</p>
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b-2 border-gray-100">
                                <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Date & Time</th>
                                <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Client / Context</th>
                                <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Triggered By</th>
                                <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Duration</th>
                                <th className="py-4 text-[10px] font-black uppercase tracking-widest text-gray-400">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {/* Placeholder Data - In real app, map over fetched logs */}
                            <tr className="group hover:bg-gray-50 transition-colors">
                                <td className="py-6 font-mono text-sm font-bold text-gray-500">
                                    {format(new Date(), 'MMM dd, HH:mm')}
                                </td>
                                <td className="py-6">
                                    <div className="flex items-center gap-2">
                                        <span className="font-bold text-gray-900">Global License</span>
                                    </div>
                                </td>
                                <td className="py-6">
                                    <div className="flex items-center gap-2">
                                        <div className="w-6 h-6 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold text-[10px]">AD</div>
                                        <span className="text-xs font-bold text-gray-700">System Admin</span>
                                    </div>
                                </td>
                                <td className="py-6">
                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-black uppercase tracking-wider">
                                        Manual: 60m
                                    </span>
                                </td>
                                <td className="py-6">
                                    <span className="flex items-center gap-1 text-xs font-bold text-green-600">
                                        <Lock className="w-3 h-3" /> Auto-Locked
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
