'use client';

import { AttackMap } from '@/components/AttackMap';
import { UptimeMonitor } from '@/components/UptimeMonitor';
import { TamperHistory } from '@/components/TamperHistory';
import { ShieldCheck, Zap } from 'lucide-react';

export default function AnalyticsPage() {
    const now = new Date();

    // Mock Data for Demo
    const blockedRequests = [
        { id: '1', ip: '45.33.22.11', country: 'CN', timestamp: now.toISOString(), reason: 'Rate Limit Exceeded' },
        { id: '2', ip: '192.168.1.50', country: 'RU', timestamp: new Date(now.getTime() - 1000 * 60 * 5).toISOString(), reason: 'Backlisted Region (Geofence)' },
        { id: '3', ip: '10.0.0.55', country: 'US', timestamp: new Date(now.getTime() - 1000 * 60 * 15).toISOString(), reason: 'SQL Injection Pattern' },
        { id: '4', ip: '185.22.1.1', country: 'BR', timestamp: new Date(now.getTime() - 1000 * 60 * 45).toISOString(), reason: 'Invalid Signature' },
    ];

    const tamperEvents = [
        {
            id: '1',
            domain: 'demo-site.com',
            timestamp: now.toISOString(),
            type: 'CSS_OVERRIDE',
            oldHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
            newHash: 'a591a6d40bf420404a011733cfb7b190d62c65bf0bcda32b57b277d9ad9f146e'
        },
        {
            id: '2',
            domain: 'client-A.com',
            timestamp: new Date(now.getTime() - 1000 * 60 * 60 * 2).toISOString(),
            type: 'DOM_MUTATION',
            oldHash: 'Verified Payload',
            newHash: 'Modified Payload'
        }
    ];

    return (
        <div className="max-w-7xl mx-auto space-y-8 p-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Advanced Analytics</h1>
                    <p className="text-gray-500">Deep dive into Shield v2 threat intelligence and system performance.</p>
                </div>
                <div className="flex items-center gap-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm font-medium border border-indigo-100">
                    <Zap className="w-4 h-4 fill-indigo-500 text-indigo-500" />
                    <span>Live Intelligence Mode</span>
                </div>
            </div>

            {/* Top Row: Uptime & KPI */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                    <UptimeMonitor
                        status="online"
                        uptime={99.99}
                        latency={24}
                        lastCheck="Just now"
                    />
                </div>
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 flex flex-col justify-center relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-16 bg-green-50 rounded-full blur-2xl -mr-8 -mt-8" />
                    <div className="relative z-10">
                        <div className="flex items-center gap-2 text-gray-500 text-sm font-medium mb-1">
                            <ShieldCheck className="w-4 h-4" /> Total Threats Blocked (24h)
                        </div>
                        <div className="text-3xl font-bold text-gray-900">1,284</div>
                        <div className="text-xs text-green-600 mt-2 font-medium flex items-center gap-1">
                            <span className="bg-green-100 px-1.5 py-0.5 rounded text-green-700">↑ 12%</span> vs yesterday
                        </div>
                    </div>
                </div>
            </div>

            {/* Middle Row: Attack Map & Tamper History */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Blocks</h2>
                    <AttackMap data={blockedRequests} />
                </div>
                <div className="space-y-4">
                    <h2 className="text-lg font-semibold text-gray-800">Tamper Audit Log</h2>
                    <TamperHistory events={tamperEvents} />
                </div>
            </div>
        </div>
    );
}
