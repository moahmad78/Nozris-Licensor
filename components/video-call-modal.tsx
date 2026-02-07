'use client';

import { useState, useEffect } from 'react';
import { pusherClient } from '@/lib/pusher-client';
import { Video, X, PhoneCall, ShieldCheck, Copy } from 'lucide-react';
import { toast } from 'sonner';

interface VideoCallModalProps {
    ticketId: string;
    onJoin: (url: string, password?: string) => void;
}

export default function VideoCallModal({ ticketId, onJoin }: VideoCallModalProps) {
    const [invitation, setInvitation] = useState<{ url: string; adminName: string; password?: string } | null>(null);

    useEffect(() => {
        if (!ticketId) return;
        const channel = pusherClient.subscribe(`ticket-${ticketId}`);

        channel.bind('video-call-started', (data: { url: string; adminName: string; password?: string }) => {
            setInvitation(data);
        });

        return () => {
            pusherClient.unsubscribe(`ticket-${ticketId}`);
        };
    }, [ticketId]);

    const copyPassword = () => {
        if (invitation?.password) {
            navigator.clipboard.writeText(invitation.password);
            toast.success("Password copied to clipboard!");
        }
    };

    if (!invitation) return null;

    return (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-sm rounded-[32px] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
                <div className="bg-gradient-to-br from-indigo-600 to-purple-700 p-8 text-center text-white relative">
                    <button
                        onClick={() => setInvitation(null)}
                        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/30 animate-pulse">
                        <Video className="w-10 h-10" />
                    </div>

                    <h3 className="text-xl font-black mb-1">Secure Support Call</h3>
                    <p className="text-blue-100 text-sm opacity-90">
                        {invitation.adminName} is ready to help you.
                    </p>
                </div>

                <div className="p-8 space-y-6">
                    {invitation.password && (
                        <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl">
                            <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest block mb-2 text-center">Security Access Key</label>
                            <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-gray-100 shadow-sm">
                                <ShieldCheck className="w-4 h-4 text-green-500" />
                                <span className="font-mono font-bold text-lg tracking-widest text-gray-700">{invitation.password}</span>
                                <button onClick={copyPassword} className="p-1.5 hover:bg-gray-50 rounded-lg transition-colors"><Copy className="w-4 h-4 text-gray-400" /></button>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-3">
                        <button
                            onClick={() => {
                                onJoin(invitation.url, invitation.password);
                                setInvitation(null);
                            }}
                            className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-900 transition-all shadow-lg hover:scale-[1.02] active:scale-95"
                        >
                            <PhoneCall className="w-5 h-5" />
                            Accept & Join
                        </button>

                        <button
                            onClick={() => setInvitation(null)}
                            className="w-full bg-gray-50 text-gray-400 py-4 rounded-2xl font-bold hover:bg-gray-100 transition-all"
                        >
                            Decline Session
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
