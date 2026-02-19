'use client';

import { useState, useEffect, useRef } from 'react';
import {
    LifeBuoy, Send, Paperclip, Video, User, Mail,
    Calendar, History, ShieldCheck, CheckCircle, Clock,
    Search, Loader2, Minimize2, PhoneOff, FileText, Download,
    Plus, ChevronRight, Activity, AlertCircle, ExternalLink, X
} from 'lucide-react';
import {
    createSupportTicket, sendMessage, getClientTickets, uploadToBlob
} from '@/app/actions/support-actions';
import { toast } from 'sonner';
import { pusherClient } from '@/lib/pusher-client';
import VideoCallModal from '@/components/video-call-modal';
import FeedbackModal from '@/components/feedback-modal';

export default function ClientUnifiedCenter({ clientEmail }: { clientEmail: string }) {
    const [tickets, setTickets] = useState<any[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [subject, setSubject] = useState('');
    const [message, setMessage] = useState('');
    const [priority, setPriority] = useState('MEDIUM');
    const [replyMsg, setReplyMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [isCallActive, setIsCallActive] = useState(false);
    const [callUrl, setCallUrl] = useState('');
    const [showFeedback, setShowFeedback] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadTickets();
    }, [clientEmail]);

    useEffect(() => {
        if (selectedTicket) {
            const channel = pusherClient.subscribe(`ticket-${selectedTicket.id}`);

            channel.bind('new-message', (newMessage: any) => {
                setSelectedTicket((prev: any) => {
                    if (prev?.id === selectedTicket.id) {
                        if (prev.messages.some((m: any) => m.id === newMessage.id)) return prev;
                        return { ...prev, messages: [...prev.messages, newMessage] };
                    }
                    return prev;
                });
            });

            channel.bind('status-updated', ({ status }: { status: string }) => {
                setSelectedTicket((prev: any) => {
                    if (prev?.id === selectedTicket.id) {
                        if (status === 'RESOLVED' || status === 'CLOSED') {
                            setShowFeedback(true);
                        }
                        return { ...prev, status };
                    }
                    return prev;
                });
            });

            channel.bind('video-call-ended', () => {
                setIsCallActive(false);
                setCallUrl('');
                setShowFeedback(true);
                toast.info("Live support session ended.");
            });

            return () => {
                pusherClient.unsubscribe(`ticket-${selectedTicket.id}`);
            };
        }
    }, [selectedTicket?.id]);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [selectedTicket?.messages]);

    const loadTickets = async () => {
        setFetching(true);
        const data = await getClientTickets(clientEmail);
        setTickets(data);
        setFetching(false);
    };

    const handleCreateTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('clientEmail', clientEmail);
        formData.append('subject', subject);
        formData.append('message', message);
        formData.append('priority', priority);

        const res = await createSupportTicket(formData);
        if (res.success) {
            toast.success("Support request transmission successful.");
            setSubject('');
            setMessage('');
            loadTickets();
        }
        setLoading(false);
    };

    const handleJoinCall = (url: string, password?: string) => {
        const clientSettings = `#config.password="${password}"&config.prejoinPageEnabled=false&interfaceConfigOverwrite.TOOLBAR_BUTTONS=["microphone","camera","chat","desktop","hangup","raisehand","videobackgroundblur","tileview"]`;
        setCallUrl(url + clientSettings);
        setIsCallActive(true);
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyMsg.trim()) return;
        setLoading(true);
        const res = await sendMessage(selectedTicket.id, replyMsg, 'Client');
        if (res.success) {
            setReplyMsg('');
        }
        setLoading(false);
    };

    return (
        <div className="h-screen bg-[#fcfcfc] flex flex-col animate-in fade-in duration-500 overflow-hidden relative">
            {selectedTicket && <VideoCallModal ticketId={selectedTicket.id} onJoin={handleJoinCall} />}
            {selectedTicket && <FeedbackModal ticketId={selectedTicket.id} isOpen={showFeedback} onClose={() => { setShowFeedback(false); loadTickets(); }} />}

            {/* Main Header */}
            <header className="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="bg-blue-600 p-2 rounded-xl text-white">
                        <LifeBuoy className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-tighter uppercase">Client Resolution Center</h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Linked: {clientEmail}</p>
                    </div>
                </div>
            </header>

            {/* Dash Content */}
            <div className="flex-1 flex overflow-hidden">

                {/* Column 1: My Issues (25%) */}
                <div className="w-[25%] border-r border-gray-50 flex flex-col shrink-0 bg-[#fafafa]">
                    <div className="p-6 border-b border-gray-50 bg-white/50">
                        <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Communication Channels</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                        {fetching ? (
                            <div className="p-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-blue-200" /></div>
                        ) : tickets.length === 0 ? (
                            <div className="p-8 text-center">
                                <p className="text-[10px] font-black text-gray-300 uppercase">No active cases</p>
                            </div>
                        ) : tickets.map(ticket => (
                            <button
                                key={ticket.id}
                                onClick={() => setSelectedTicket(ticket)}
                                className={`w-full text-left p-4 rounded-3xl transition-all border ${selectedTicket?.id === ticket.id ? 'bg-white border-black/5 shadow-xl scale-[1.02] ring-1 ring-black/5' : 'bg-transparent border-transparent hover:bg-white/60 hover:border-gray-100 opacity-60'}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className={`text-[9px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest ${ticket.status === 'OPEN' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>{ticket.status}</span>
                                </div>
                                <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{ticket.subject}</h4>
                            </button>
                        ))}
                    </div>

                    <div className="p-6 border-t border-gray-100 bg-white">
                        <button
                            onClick={() => setSelectedTicket(null)}
                            className="w-full py-4 bg-black text-white rounded-3xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all flex items-center justify-center gap-2 shadow-xl"
                        >
                            <Plus className="w-4 h-4" />
                            Open New Case
                        </button>
                    </div>
                </div>

                {/* Column 2: Live Middle Panel (50%) */}
                <div className="flex-1 flex flex-col bg-white relative">
                    {selectedTicket ? (
                        <>
                            {/* Middle Header */}
                            <div className="h-16 border-b border-gray-50 flex items-center justify-between px-6 bg-white/80 backdrop-blur-md z-10 shrink-0">
                                <div className="flex items-center gap-3">
                                    <h3 className="font-bold text-gray-900 text-sm">{selectedTicket.subject}</h3>
                                    {isCallActive && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>}
                                </div>
                                <div className="flex items-center gap-2">
                                    <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-tighter ${selectedTicket.status === 'OPEN' ? 'text-green-600 bg-green-50' : 'text-blue-600 bg-blue-50'}`}>{selectedTicket.status}</span>
                                </div>
                            </div>

                            {/* Middle Body */}
                            <div className="flex-1 overflow-hidden relative flex flex-col">
                                {isCallActive ? (
                                    <div className="absolute inset-0 z-20 bg-black animate-in zoom-in duration-500">
                                        <iframe src={callUrl} allow="camera; microphone; display-capture; autoplay; clipboard-write; speaker-selection" className="w-full h-full border-none" />
                                        <button onClick={() => setIsCallActive(false)} className="absolute top-6 right-6 bg-white/10 backdrop-blur-md text-white p-3 rounded-full hover:bg-red-600 transition-all">
                                            <Minimize2 className="w-5 h-5" />
                                        </button>
                                    </div>
                                ) : (
                                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#fafafa]/50">
                                        <div className="max-w-xl mx-auto space-y-6">
                                            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                                                <h4 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-2">Original Ticket Submission</h4>
                                                <p className="text-sm text-gray-800 leading-relaxed font-medium">{selectedTicket.message}</p>
                                            </div>
                                            {selectedTicket.messages.map((msg: any) => (
                                                <div key={msg.id} className={`flex ${msg.senderRole === 'ADMIN' ? 'justify-start' : 'justify-end'}`}>
                                                    <div className={`p-5 rounded-[2rem] max-w-[85%] text-sm font-medium shadow-sm ${msg.senderRole === 'ADMIN' ? 'bg-white text-gray-800 border border-gray-100 rounded-tl-none' : 'bg-blue-600 text-white rounded-tr-none'}`}>
                                                        <p className="whitespace-pre-wrap">{msg.message}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {!isCallActive && (
                                <div className="p-6 bg-white border-t border-gray-100">
                                    <form onSubmit={handleSend} className="flex items-end gap-3 bg-gray-50 p-3 rounded-[2rem] border border-transparent focus-within:border-blue-600 transition-all">
                                        <button type="button" className="p-3 text-gray-400 hover:text-blue-600 transition-colors bg-white rounded-full"><Paperclip className="w-4 h-4" /></button>
                                        <textarea
                                            value={replyMsg}
                                            onChange={(e) => setReplyMsg(e.target.value)}
                                            placeholder="Reply securely..."
                                            rows={1}
                                            className="flex-1 bg-transparent p-3 outline-none text-sm font-medium resize-none"
                                        />
                                        <button type="submit" className="p-3 bg-blue-600 text-white rounded-full hover:bg-black transition-all shadow-xl">
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </form>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center bg-white rounded-3xl m-8 border border-gray-100 shadow-xl overflow-y-auto max-w-2xl mx-auto">
                            <h2 className="text-2xl font-black mb-2 tracking-tight">Open Support Protocol</h2>
                            <p className="text-gray-400 text-sm mb-8 font-medium">Describe your issue for immediate high-security resolution.</p>

                            <form onSubmit={handleCreateTicket} className="w-full space-y-4">
                                <input type="text" placeholder="Issue Subject" value={subject} onChange={e => setSubject(e.target.value)} required className="w-full p-4 rounded-2xl bg-gray-50 border-none outline-none focus:ring-1 focus:ring-blue-600 transition-all font-bold text-sm" />
                                <div className="grid grid-cols-2 gap-4">
                                    <select value={priority} onChange={e => setPriority(e.target.value)} className="p-4 rounded-2xl bg-gray-50 border-none outline-none font-bold text-xs uppercase tracking-widest text-blue-600">
                                        <option value="LOW">Low Risk</option>
                                        <option value="MEDIUM">Standard</option>
                                        <option value="HIGH">Critical</option>
                                    </select>
                                    <button type="button" className="p-4 bg-gray-100 rounded-2xl text-[10px] font-black uppercase text-gray-400">Add Log/PDF</button>
                                </div>
                                <textarea placeholder="Describe the technical anomaly..." value={message} onChange={e => setMessage(e.target.value)} required rows={6} className="w-full p-5 rounded-3xl bg-gray-50 border-none outline-none focus:ring-1 focus:ring-blue-600 transition-all text-sm font-medium resize-none" />
                                <button className="w-full py-5 bg-blue-600 text-white rounded-3xl font-black uppercase tracking-[0.2em] shadow-2xl hover:bg-black transition-all">Submit Support Vector</button>
                            </form>
                        </div>
                    )}
                </div>

                {/* Column 3: Security & Profile (25%) */}
                <div className="w-[25%] border-l border-gray-50 flex flex-col shrink-0 bg-white p-8 space-y-10">
                    <div className="text-center">
                        <div className="w-20 h-20 rounded-[2rem] bg-gray-50 mx-auto flex items-center justify-center border border-gray-100 mb-4">
                            <User className="w-8 h-8 text-gray-300" />
                        </div>
                        <h4 className="text-sm font-black text-gray-900 uppercase tracking-tighter">Verified Client</h4>
                        <p className="text-[10px] font-bold text-gray-400 mt-1">{clientEmail}</p>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                            <ShieldCheck className="w-5 h-5 text-green-500 shrink-0" />
                            <div>
                                <h6 className="text-[10px] font-black uppercase text-gray-400">Security Shield</h6>
                                <p className="text-[10px] font-bold text-gray-900">End-to-End Encrypted</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                            <Clock className="w-5 h-5 text-blue-500 shrink-0" />
                            <div>
                                <h6 className="text-[10px] font-black uppercase text-gray-400">Resolution SLA</h6>
                                <p className="text-[10px] font-bold text-gray-900">Within 24 Hours</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10">
                        <div className="text-center p-6 border-2 border-dashed border-gray-100 rounded-[2.5rem]">
                            <Activity className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                            <p className="text-[9px] font-black text-gray-300 uppercase tracking-[0.2em]">Encrypted Channel Stable</p>
                        </div>
                    </div>
                </div>

            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #eee; border-radius: 10px; }
            `}</style>
        </div>
    );
}
