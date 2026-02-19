'use client';

import { useState } from 'react';
import { Bell, Info, User, Megaphone } from 'lucide-react';

type Tab = 'update' | 'public' | 'personal';

export function NoticeWidget() {
    const [activeTab, setActiveTab] = useState<Tab>('personal');

    const notices = {
        update: [
            { id: 1, title: 'v2.4.0 Security Patch', date: '2h ago', unread: true },
            { id: 2, title: 'Database Optimization', date: '1d ago', unread: false },
        ],
        public: [
            { id: 3, title: 'Maintenance Scheduled', date: 'Feb 10', unread: true },
            { id: 4, title: 'New Threat Definitions', date: 'Feb 08', unread: false },
        ],
        personal: [
            { id: 5, title: 'License Renewal Warning', date: 'Just now', unread: true },
            { id: 6, title: 'Welcome to Enterprise', date: 'Feb 01', unread: false },
        ]
    };

    return (
        <div className="bg-black/50 border border-white/10 rounded-3xl p-6 h-full flex flex-col backdrop-blur-sm">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Bell className="text-yellow-500" /> Notice Center
                </h3>
                <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full">3 New</span>
            </div>

            {/* Tabs */}
            <div className="flex bg-white/5 rounded-xl p-1 mb-4">
                {[
                    { id: 'update', label: 'Updates', icon: Info },
                    { id: 'public', label: 'News', icon: Megaphone },
                    { id: 'personal', label: 'Direct', icon: User },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as Tab)}
                        className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === tab.id
                                ? 'bg-blue-600 text-white shadow-lg'
                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                    >
                        <tab.icon size={12} />
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 pr-2">
                {notices[activeTab].map((notice) => (
                    <div
                        key={notice.id}
                        className={`p-4 rounded-xl border transition-all hover:translate-x-1 ${notice.unread
                                ? 'bg-blue-900/10 border-blue-500/30'
                                : 'bg-white/5 border-transparent'
                            }`}
                    >
                        <div className="flex justify-between items-start">
                            <h4 className={`text-sm font-bold ${notice.unread ? 'text-white' : 'text-gray-400'}`}>
                                {notice.title}
                            </h4>
                            {notice.unread && <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />}
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1 font-mono">{notice.date}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
