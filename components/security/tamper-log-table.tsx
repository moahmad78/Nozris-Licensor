'use client';

import { useState, useEffect } from 'react';
import { getTamperLogs } from '@/app/actions/log-actions';
import { AlertCircle, FileText, ShieldAlert, Activity } from 'lucide-react';
import { format } from 'date-fns';

export function TamperLogTable({ licenseId }: { licenseId?: string }) {
    const [stats, setStats] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getTamperLogs(licenseId).then(data => {
            setStats(data);
            setLoading(false);
        });
    }, [licenseId]);

    if (loading) return <div className="text-xs text-gray-400 font-bold loading-dots">Loading Forensics...</div>;
    if (stats.length === 0) return (
        <div className="flex flex-col items-center justify-center p-8 text-gray-400 border border-dashed border-gray-200 rounded-xl bg-gray-50/50">
            <ShieldAlert className="w-6 h-6 mb-2 opacity-50" />
            <span className="text-[10px] uppercase font-black tracking-widest">No Integrity Violations Detected</span>
        </div>
    );

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-2 text-red-600 border-b border-red-100 pb-2 mb-4">
                <ShieldAlert className="w-4 h-4" />
                <span className="text-[10px] font-black uppercase tracking-widest">Security Incident Log</span>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-red-50 text-red-900">
                        <tr>
                            <th className="p-3 rounded-l-lg text-[9px] font-black uppercase tracking-widest">Detected At</th>
                            <th className="p-3 text-[9px] font-black uppercase tracking-widest">Component</th>
                            <th className="p-3 text-[9px] font-black uppercase tracking-widest">Attacker IP</th>
                            <th className="p-3 rounded-r-lg text-[9px] font-black uppercase tracking-widest text-right">Fingerprint Analysis</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {stats.map((log: any) => (
                            <tr key={log.id} className="group hover:bg-red-50/10 transition-colors">
                                <td className="p-3 text-xs font-bold text-gray-500">
                                    {format(new Date(log.detectedAt), 'MMM dd, HH:mm:ss')}
                                </td>
                                <td className="p-3">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-3 h-3 text-gray-400" />
                                        <span className="text-xs font-bold text-gray-700">{log.fileName}</span>
                                    </div>
                                </td>
                                <td className="p-3 text-xs font-mono text-gray-500">
                                    {log.ipAddress}
                                </td>
                                <td className="p-3 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <div className="flex flex-col items-end">
                                            <span className="text-[9px] font-bold text-gray-400 uppercase">Old: {log.oldHash?.slice(0, 6)}...</span>
                                            <span className="text-[9px] font-bold text-red-500 uppercase">New: {log.newHash?.slice(0, 6)}...</span>
                                        </div>
                                        <div className="bg-red-100 p-1.5 rounded-lg text-red-600" title="Hash Mismatch">
                                            <Activity className="w-4 h-4" />
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
