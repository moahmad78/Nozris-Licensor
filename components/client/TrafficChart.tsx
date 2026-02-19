'use client';

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useState, useEffect } from 'react';

const data = [
    { name: '00:00', normal: 400, threats: 24 },
    { name: '04:00', normal: 300, threats: 13 },
    { name: '08:00', normal: 200, threats: 98 },
    { name: '12:00', normal: 278, threats: 39 },
    { name: '16:00', normal: 189, threats: 48 },
    { name: '20:00', normal: 239, threats: 38 },
    { name: '24:00', normal: 349, threats: 43 },
];

export default function TrafficChart() {
    const [chartData, setChartData] = useState(data); // Initial mock data as fallback

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { getTrafficStats } = await import('@/app/actions/analytics');
                const result = await getTrafficStats();
                if (result.success && result.data.length > 0) {
                    setChartData(result.data);
                }
            } catch (e) {
                console.error("Failed to fetch traffic stats", e);
            }
        };
        fetchData();
        const interval = setInterval(fetchData, 30000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="w-full h-[300px] bg-white p-4 rounded-3xl border border-slate-200">
            <h3 className="text-slate-800 font-bold text-sm mb-4">24h Traffic vs Threats</h3>
            <ResponsiveContainer width="100%" height="90%">
                <AreaChart data={data}>
                    <defs>
                        <linearGradient id="colorNormal" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                        </linearGradient>
                        <linearGradient id="colorThreats" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#ff0000" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#ff0000" stopOpacity={0} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94A3B8' }} />
                    <Tooltip />
                    <Area type="monotone" dataKey="normal" stroke="#8884d8" fillOpacity={1} fill="url(#colorNormal)" />
                    <Area type="monotone" dataKey="threats" stroke="#ff0000" fillOpacity={1} fill="url(#colorThreats)" />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
}
