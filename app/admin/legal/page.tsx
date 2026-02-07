'use client';

import { useState, useEffect } from 'react';
import { getPolicy, updatePolicy } from '@/app/actions/legal-actions';
import { toast } from 'sonner';
import { Loader2, Save, FileText, Globe } from 'lucide-react';
import Link from 'next/link';

const POLICIES = [
    { id: 'TERMS', label: 'Terms of Service', href: '/terms-of-service' },
    { id: 'PRIVACY', label: 'Privacy Policy', href: '/privacy-policy' },
    { id: 'REFUND', label: 'Refund Policy', href: '/refund-policy' }
] as const;

export default function LegalManager() {
    const [selectedPolicy, setSelectedPolicy] = useState<typeof POLICIES[number]['id']>('TERMS');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

    useEffect(() => {
        loadPolicy(selectedPolicy);
    }, [selectedPolicy]);

    const loadPolicy = async (type: typeof POLICIES[number]['id']) => {
        setLoading(true);
        const data = await getPolicy(type);
        if (data) {
            setContent(data.content);
            setLastUpdated(new Date(data.updatedAt));
        } else {
            setContent(''); // Or default template could go here
            setLastUpdated(null);
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);
        const res = await updatePolicy(selectedPolicy, content);
        if (res.success) {
            toast.success(`${selectedPolicy} updated successfully.`);
            setLastUpdated(new Date());
        } else {
            toast.error("Failed to save changes.");
        }
        setSaving(false);
    };

    return (
        <div className="p-8 md:p-12 space-y-8 bg-gray-50 min-h-screen">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-[1000] uppercase italic tracking-tighter text-black">Legal Manager</h1>
                    <p className="text-gray-500 font-medium">Dynamic policy editor. Changes reflect instantly.</p>
                </div>
                {lastUpdated && (
                    <p className="text-xs font-black uppercase tracking-widest text-gray-400">
                        Last Synced: {lastUpdated.toLocaleString()}
                    </p>
                )}
            </header>

            <div className="flex flex-col lg:flex-row gap-8">
                {/* Sidebar Selector */}
                <div className="w-full lg:w-72 space-y-2 shrink-0">
                    {POLICIES.map((p) => (
                        <button
                            key={p.id}
                            onClick={() => setSelectedPolicy(p.id)}
                            className={`w-full text-left px-6 py-4 rounded-2xl font-black uppercase tracking-widest text-xs flex items-center justify-between group transition-all ${selectedPolicy === p.id
                                    ? 'bg-black text-white shadow-xl'
                                    : 'bg-white text-gray-400 hover:bg-gray-100'
                                }`}
                        >
                            <span className="flex items-center gap-3">
                                <FileText className="w-4 h-4" />
                                {p.label}
                            </span>
                            <Link href={p.href} target="_blank" className="p-1 hover:text-blue-500" onClick={(e) => e.stopPropagation()}>
                                <Globe className="w-3 h-3" />
                            </Link>
                        </button>
                    ))}
                </div>

                {/* Editor Area */}
                <div className="flex-1 space-y-4">
                    <div className="bg-white rounded-[2.5rem] p-2 border border-gray-100 shadow-sm">
                        {loading ? (
                            <div className="h-[600px] flex items-center justify-center">
                                <Loader2 className="w-8 h-8 animate-spin text-gray-300" />
                            </div>
                        ) : (
                            <textarea
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                className="w-full h-[600px] p-8 resize-none focus:outline-none text-base font-mono text-gray-800 rounded-[2rem]"
                                placeholder={`Enter ${selectedPolicy} content here... (Supports basic text, handled as pre-wrap)`}
                            />
                        )}
                    </div>

                    <div className="flex justify-end">
                        <button
                            onClick={handleSave}
                            disabled={saving || loading}
                            className="bg-black text-white px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-emerald-500 transition-all flex items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-xl hover:shadow-emerald-500/20"
                        >
                            {saving ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
