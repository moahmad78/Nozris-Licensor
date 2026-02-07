'use client';

import { useState, useEffect } from 'react';
import { Megaphone, Send, History, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function AnnouncementsPage() {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [history, setHistory] = useState<any[]>([]);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = async () => {
        const res = await fetch('/api/admin/broadcast');
        const data = await res.json();
        if (data.history) setHistory(data.history);
    };

    const handleBroadcast = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !message) return toast.error("Please fill all fields");

        setLoading(true);
        try {
            const res = await fetch('/api/admin/broadcast', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, message })
            });

            const data = await res.json();
            if (data.success) {
                toast.success("Broadcast sent successfully to all clients!");
                setTitle('');
                setMessage('');
                fetchHistory();
            } else {
                toast.error(data.error || "Failed to broadcast");
            }
        } catch (err) {
            toast.error("An error occurred");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in duration-500">
            <header>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                    <Megaphone className="w-6 h-6 text-blue-600" />
                    Global Announcements
                </h1>
                <p className="text-gray-500 mt-1">Broadcast important news to every registered client simultaneously.</p>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Broadcast Form */}
                <div className="md:col-span-2 space-y-6">
                    <form onSubmit={handleBroadcast} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Announcement Title</label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="e.g., System Maintenance Update"
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-gray-700">Message Context</label>
                            <textarea
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Write your detailed message here..."
                                rows={5}
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-gray-800 disabled:bg-gray-400 transition-all shadow-lg shadow-black/10"
                        >
                            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                            {loading ? "Broadcasting..." : "Broadcast to All Clients"}
                        </button>
                    </form>
                </div>

                {/* Info Card */}
                <div className="space-y-4">
                    <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl">
                        <h3 className="font-bold text-blue-900 flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4" />
                            Multi-Channel Blast
                        </h3>
                        <p className="text-xs text-blue-700 mt-2 leading-relaxed">
                            Sending an announcement will instantly trigger:
                        </p>
                        <ul className="text-xs text-blue-800 mt-3 space-y-2">
                            <li className="flex items-center gap-2">✅ Dashboard Notifications</li>
                            <li className="flex items-center gap-2">✅ WhatsApp Blast</li>
                            <li className="flex items-center gap-2">✅ Direct Email Alerts</li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Past Broadcasts */}
            <div className="space-y-4">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                    <History className="w-5 h-5 text-gray-500" />
                    Past Broadcasts
                </h2>

                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Announcement</th>
                                <th className="px-6 py-4">Date Sent</th>
                                <th className="px-6 py-4">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {history.length === 0 ? (
                                <tr>
                                    <td colSpan={3} className="px-6 py-12 text-center text-gray-400 text-sm">
                                        No announcements sent yet.
                                    </td>
                                </tr>
                            ) : (
                                history.map((item) => (
                                    <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-gray-900">{item.title}</div>
                                            <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">{item.message}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">
                                            {new Date(item.sentAt).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-green-50 text-green-700 border border-green-100">
                                                <CheckCircle2 className="w-3 h-3" />
                                                DELIVERED
                                            </span>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
