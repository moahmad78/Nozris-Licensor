'use client';

import { ShieldAlert, Globe, MapPin } from 'lucide-react';

interface BlockedRequest {
    id: string;
    ip: string;
    country: string;
    timestamp: string;
    reason: string;
}

export function AttackMap({ data }: { data: BlockedRequest[] }) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-500" />
                    Global Threat Map
                </h3>
                <span className="text-xs font-mono text-gray-400">LIVE FEED</span>
            </div>

            <div className="p-0">
                <div className="max-h-[300px] overflow-y-auto">
                    {data.length === 0 ? (
                        <div className="p-8 text-center text-gray-400 text-sm">No threats detected recently.</div>
                    ) : (
                        <table className="w-full text-left text-sm">
                            <thead className="bg-gray-50 text-gray-500 sticky top-0">
                                <tr>
                                    <th className="px-4 py-2 font-medium">Source</th>
                                    <th className="px-4 py-2 font-medium">IP Address</th>
                                    <th className="px-4 py-2 font-medium">Reason</th>
                                    <th className="px-4 py-2 font-medium text-right">Time</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {data.map((item) => (
                                    <tr key={item.id} className="hover:bg-red-50/30 transition-colors">
                                        <td className="px-4 py-3 flex items-center gap-2 font-medium text-gray-700">
                                            <span className="text-lg">{config[item.country]?.flag || '🌍'}</span>
                                            {config[item.country]?.name || item.country || 'Unknown'}
                                        </td>
                                        <td className="px-4 py-3 font-mono text-gray-500 text-xs">{item.ip}</td>
                                        <td className="px-4 py-3">
                                            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                                                {item.reason}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-right text-gray-400 text-xs">
                                            {new Date(item.timestamp).toLocaleTimeString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    );
}

const config: Record<string, { name: string; flag: string }> = {
    'US': { name: 'United States', flag: '🇺🇸' },
    'CN': { name: 'China', flag: '🇨🇳' },
    'RU': { name: 'Russia', flag: '🇷🇺' },
    'IN': { name: 'India', flag: '🇮🇳' },
    'BR': { name: 'Brazil', flag: '🇧🇷' },
    'DE': { name: 'Germany', flag: '🇩🇪' },
    'UK': { name: 'United Kingdom', flag: '🇬🇧' },
    // Add more as needed
};
