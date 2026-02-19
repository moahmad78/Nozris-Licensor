'use client';

import { useState } from 'react';
import { Globe, Shield, Lock } from 'lucide-react';
import { toast } from 'sonner';

export default function GeofenceControl() {
    const [blockedCountries, setBlockedCountries] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const toggleCountry = (country: string) => {
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setBlockedCountries(prev =>
                prev.includes(country)
                    ? prev.filter(c => c !== country)
                    : [...prev, country]
            );
            toast.success(`${country} ${blockedCountries.includes(country) ? 'Unblocked' : 'BLOCKED'} Successfully`);
            setLoading(false);
        }, 800);
    };

    return (
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
                <Globe className="text-blue-500" size={20} />
                Global Geofencing
            </h3>
            <p className="text-xs text-slate-500 mb-4">Block entire regions from accessing your application.</p>

            <div className="space-y-2">
                {['Russia', 'China', 'North Korea', 'Brazil'].map(country => (
                    <div key={country} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                        <span className="text-sm font-bold text-slate-700">{country}</span>
                        <button
                            onClick={() => toggleCountry(country)}
                            disabled={loading}
                            className={`w-12 h-6 rounded-full p-1 transition-colors relative ${blockedCountries.includes(country) ? 'bg-red-500' : 'bg-slate-300'}`}
                        >
                            <div className={`w-4 h-4 bg-white rounded-full transition-transform ${blockedCountries.includes(country) ? 'translate-x-6' : 'translate-x-0'}`}></div>
                        </button>
                    </div>
                ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-100">
                    <Lock className="text-amber-500" size={16} />
                    <p className="text-[10px] text-amber-700 font-bold">Premium Shield: IP Database Auto-Updated</p>
                </div>
            </div>
        </div>
    );
}
