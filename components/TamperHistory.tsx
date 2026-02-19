'use client';

import { FileWarning, Search, ArrowRight, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

export interface TamperEvent {
    id: string;
    domain: string;
    timestamp: string;
    type: string;
    oldHash?: string;
    newHash?: string;
}

export function TamperHistory({ events }: { events: TamperEvent[] }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <FileWarning className="w-4 h-4 text-red-500" />
                    Tamper Incident Log
                </h3>
                <Link href="/dashboard?status=TAMPERED" className="text-xs text-indigo-600 font-medium hover:underline flex items-center gap-1">
                    View All <ArrowRight className="w-3 h-3" />
                </Link>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wider">
                        <tr>
                            <th className="px-6 py-3 font-medium">Domain</th>
                            <th className="px-6 py-3 font-medium">Event Type</th>
                            <th className="px-6 py-3 font-medium font-mono">Hash Discrepancy (Old → New)</th>
                            <th className="px-6 py-3 font-medium text-right">Detected At</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-700">
                        {events.length === 0 ? (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-400 opacity-60 flex flex-col items-center justify-center gap-2">
                                    <ShieldAlert className="w-8 h-8 text-gray-300" />
                                    <span>No tamper incidents recorded. System secure.</span>
                                </td>
                            </tr>
                        ) : (
                            events.map(event => (
                                <tr key={event.id} className="hover:bg-red-50/20 transition-colors border-b border-gray-50 last:border-0">
                                    <td className="px-6 py-4 font-medium text-gray-900">{event.domain}</td>
                                    <td className="px-6 py-4">
                                        <span className="bg-red-100 text-red-700 text-[10px] uppercase font-bold px-2 py-1 rounded-sm border border-red-200 tracking-wide">
                                            {event.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono text-xs text-gray-500">
                                        {event.oldHash ? (
                                            <div className="flex items-center gap-2 bg-gray-50 px-2 py-1 rounded w-fit">
                                                <div className="flex flex-col">
                                                    <span className="text-gray-400 text-[10px] uppercase">Expected</span>
                                                    <span className="text-gray-600 font-bold max-w-[80px] truncate" title={event.oldHash}>{event.oldHash.substring(0, 8)}</span>
                                                </div>
                                                <span className="text-gray-300">→</span>
                                                <div className="flex flex-col">
                                                    <span className="text-red-400 text-[10px] uppercase">Actual</span>
                                                    <span className="text-red-600 font-bold max-w-[80px] truncate" title={event.newHash}>{event.newHash?.substring(0, 8)}</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <span className="text-gray-400 italic text-xs">Signature Mismatch</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right text-gray-400 text-xs tabular-nums">
                                        {new Date(event.timestamp).toLocaleString()}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
