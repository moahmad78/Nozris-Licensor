'use client';

import { useState, useEffect, useRef } from 'react';
import {
    LifeBuoy, Send, Paperclip, Video, Monitor, User, Mail,
    Calendar, History, ShieldCheck, CheckCircle, Clock,
    Search, Loader2, Minimize2, PhoneOff, FileText, Download,
    Plus, ChevronRight, Activity, AlertCircle, ExternalLink
} from 'lucide-react';
import {
    getAllTickets, sendMessage, updateTicketStatus, uploadToBlob,
    startVideoSupport, closeVideoSupport, getClientProfileByEmail
} from '@/app/actions/support-actions';
import { toast } from 'sonner';
import { pusherClient } from '@/lib/pusher-client';

export default function AdminSupportCenter() {
    const [tickets, setTickets] = useState<any[]>([]);
    const [selectedTicket, setSelectedTicket] = useState<any>(null);
    const [clientContext, setClientContext] = useState<any>(null);
    const [replyMsg, setReplyMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [fetching, setFetching] = useState(true);
    const [isCallActive, setIsCallActive] = useState(false);
    const [callUrl, setCallUrl] = useState('');
    const [filter, setFilter] = useState('ALL');
    const scrollRef = useRef<HTMLDivElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        loadTickets();

        // Subscribe to global notifications for new tickets
        const channel = pusherClient.subscribe('admin-notifications');
        channel.bind('new-ticket', (data: any) => {
            toast.success(`New Ticket: ${data.subject}`);
            loadTickets();
        });

        return () => {
            pusherClient.unsubscribe('admin-notifications');
        };
    }, []);

    useEffect(() => {
        if (selectedTicket) {
            loadClientContext(selectedTicket.clientEmail);
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
                setSelectedTicket((prev: any) => prev?.id === selectedTicket.id ? { ...prev, status } : prev);
                setTickets(prev => prev.map(t => t.id === selectedTicket.id ? { ...t, status } : t));
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
        const data = await getAllTickets();
        setTickets(data);
        setFetching(false);
    };

    const loadClientContext = async (email: string) => {
        const data = await getClientProfileByEmail(email);
        setClientContext(data);
    };

    const handleStartVideo = async () => {
        setLoading(true);
        const res = await startVideoSupport(selectedTicket.id);
        if (res.success && res.url) {
            const adminSettings = `#config.password="${res.password}"&config.prejoinPageEnabled=false`;
            setCallUrl(res.url + adminSettings);
            setIsCallActive(true);
            toast.success("Encrypted session active.");
        }
        setLoading(false);
    };

    const handleEndVideo = async () => {
        const res = await closeVideoSupport(selectedTicket.id);
        if (res.success) {
            setIsCallActive(false);
            setCallUrl('');
            toast.info("Session closed.");
        }
    };

    const handleStatusChange = async (status: string) => {
        if (!selectedTicket) return;
        const res = await updateTicketStatus(selectedTicket.id, status);
        if (res.success) {
            toast.success(`Ticket marked as ${status}`);
        }
    };

    const handleReply = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!replyMsg.trim()) return;
        setLoading(true);
        const res = await sendMessage(
            selectedTicket.id,
            replyMsg,
            'ADMIN'
        );
        if (res.success) {
            setReplyMsg('');
        }
        setLoading(false);
    };

    const filteredTickets = tickets.filter(t => filter === 'ALL' || t.status === filter);

    return (
        <div className="h-screen bg-[#fcfcfc] flex flex-col animate-in fade-in duration-500 overflow-hidden">
            {/* Main Header */}
            <header className="h-16 border-b border-gray-100 bg-white flex items-center justify-between px-8 shrink-0">
                <div className="flex items-center gap-4">
                    <div className="bg-black p-2 rounded-xl text-white">
                        <LifeBuoy className="w-5 h-5" />
                    </div>
                    <div>
                        <h1 className="text-lg font-black tracking-tighter">SUPPORT COMMAND CENTER</h1>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Operator: Mohd Ahmad</p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1 bg-gray-50 p-1 rounded-xl border border-gray-100">
                        {['ALL', 'OPEN', 'IN_PROGRESS', 'RESOLVED'].map(f => (
                            <button
                                key={f}
                                onClick={() => setFilter(f)}
                                className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${filter === f ? 'bg-black text-white shadow-lg' : 'text-gray-400 hover:text-black'}`}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                    <button onClick={loadTickets} className="p-2.5 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all shadow-sm">
                        <Activity className="w-4 h-4 text-gray-500" />
                    </button>
                </div>
            </header>

            {/* Dash Content */}
            <div className="flex-1 flex overflow-hidden">

                {/* Column 1: Ticket Stream (25%) */}
                <div className="w-[25%] border-r border-gray-50 flex flex-col shrink-0 bg-[#fafafa]">
                    <div className="p-4 border-b border-gray-50 bg-white">
                        <div className="relative">
                            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-300" />
                            <input
                                type="text"
                                placeholder="Search sessions..."
                                className="w-full pl-10 pr-4 py-2 bg-gray-50 border-none rounded-xl text-xs font-medium focus:ring-1 focus:ring-black transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-2">
                        {fetching ? (
                            <div className="p-12 flex justify-center"><Loader2 className="w-6 h-6 animate-spin text-gray-200" /></div>
                        ) : filteredTickets.map(ticket => (
                            <button
                                key={ticket.id}
                                onClick={() => setSelectedTicket(ticket)}
                                className={`w-full text-left p-4 rounded-3xl transition-all border ${selectedTicket?.id === ticket.id ? 'bg-white border-black/5 shadow-xl scale-[1.02] ring-1 ring-black/5' : 'bg-transparent border-transparent hover:bg-white/60 hover:border-gray-100 opacity-70 hover:opacity-100'}`}
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-[9px] font-black text-blue-600 uppercase tracking-widest bg-blue-50 px-2 py-0.5 rounded-full">{ticket.status}</span>
                                    <span className="text-[9px] text-gray-400 font-bold">{new Date(ticket.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                </div>
                                <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{ticket.subject}</h4>
                                <p className="text-[10px] text-gray-400 font-medium truncate mt-1">{ticket.clientEmail}</p>
                            </button>
                        ))}
                    </div>

                    <div className="p-4 border-t border-gray-100 bg-white">
                        <button className="w-full py-3 bg-gray-50 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-black hover:text-white transition-all flex items-center justify-center gap-2">
                            <Plus className="w-4 h-4" />
                            Force New Ticket
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
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center overflow-hidden border border-blue-100">
                                        <User className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 text-sm line-clamp-1">{selectedTicket.subject}</h3>
                                        <p className="text-[10px] text-gray-400 font-bold">Session ID: #{selectedTicket.id.split('-')[0].toUpperCase()}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    {!isCallActive && (
                                        <>
                                            <button
                                                onClick={handleStartVideo}
                                                className="p-2.5 bg-black text-white rounded-xl hover:bg-blue-600 transition-all shadow-lg hover:scale-110 active:scale-95 flex items-center gap-2 px-4"
                                            >
                                                <Video className="w-4 h-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Video Call</span>
                                            </button>
                                            <button
                                                className="p-2.5 bg-gray-50 text-gray-400 border border-gray-100 rounded-xl hover:bg-white hover:text-indigo-600 transition-all flex items-center gap-2 px-4"
                                            >
                                                <Monitor className="w-4 h-4" />
                                                <span className="text-[10px] font-black uppercase tracking-widest">Screen Share</span>
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>

                            {/* Middle Body: Dynamic Window */}
                            <div className="flex-1 overflow-hidden relative flex flex-col">
                                {isCallActive ? (
                                    <div className="absolute inset-0 z-20 bg-black animate-in zoom-in duration-500">
                                        <iframe
                                            src={callUrl}
                                            allow="camera; microphone; display-capture; autoplay; clipboard-write; speaker-selection"
                                            className="w-full h-full border-none"
                                        />
                                        <div className="absolute top-6 right-6 flex gap-3">
                                            <button onClick={() => setIsCallActive(false)} className="bg-white/10 backdrop-blur-md text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/20">
                                                Minimize Panel
                                            </button>
                                            <button onClick={handleEndVideo} className="bg-red-600 text-white p-3 rounded-full shadow-2xl hover:bg-red-700 transition-all hover:scale-110">
                                                <PhoneOff className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 bg-[#fafafa]/50">
                                        <div className="max-w-xl mx-auto space-y-6">
                                            <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm">
                                                <div className="flex items-center gap-2 mb-3">
                                                    <AlertCircle className="w-4 h-4 text-blue-500" />
                                                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Original complaint</span>
                                                </div>
                                                <p className="text-sm text-gray-800 leading-relaxed font-medium">{selectedTicket.message}</p>
                                                {selectedTicket.attachmentUrl && (
                                                    <div className="mt-4 pt-4 border-t border-gray-50">
                                                        <a href={selectedTicket.attachmentUrl} target="_blank" className="flex items-center gap-2 text-blue-600 hover:underline">
                                                            <FileText className="w-4 h-4" />
                                                            <span className="text-xs font-bold">View Document Attachment</span>
                                                        </a>
                                                    </div>
                                                )}
                                            </div>

                                            {selectedTicket.messages.map((msg: any) => (
                                                <div key={msg.id} className={`flex ${msg.senderRole === 'ADMIN' ? 'justify-end' : 'justify-start'}`}>
                                                    <div className={`p-5 rounded-[2rem] max-w-[85%] text-sm font-medium shadow-sm transition-all ${msg.senderRole === 'ADMIN' ? 'bg-black text-white rounded-tr-none' : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}`}>
                                                        <p className="whitespace-pre-wrap">{msg.message}</p>
                                                        {msg.fileUrl && (
                                                            <div className={`mt-3 p-3 rounded-xl flex items-center gap-3 ${msg.senderRole === 'ADMIN' ? 'bg-white/10' : 'bg-gray-50'}`}>
                                                                <Download className={`w-4 h-4 ${msg.senderRole === 'ADMIN' ? 'text-white' : 'text-blue-600'}`} />
                                                                <a href={msg.fileUrl} target="_blank" className="text-[10px] font-black uppercase tracking-widest truncate hover:underline">Attachment Secure</a>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Middle Footer */}
                            {!isCallActive && (
                                <div className="p-6 bg-white border-t border-gray-100">
                                    {/* Smart Quick Replies */}
                                    <div className="flex items-center gap-2 mb-4 overflow-x-auto pb-2 scrollbar-hide">
                                        {selectedTicket.subject.toLowerCase().includes('license') ? (
                                            <>
                                                <button type="button" onClick={() => setReplyMsg("I've reset your license key security. Please try again.")} className="shrink-0 px-4 py-2 bg-blue-50 text-blue-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all border border-blue-100">Reset Key</button>
                                                <button type="button" onClick={() => setReplyMsg("Your trial has been extended by 7 days. Check your dashboard.")} className="shrink-0 px-4 py-2 bg-purple-50 text-purple-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-purple-600 hover:text-white transition-all border border-purple-100">Extend Trial</button>
                                            </>
                                        ) : selectedTicket.subject.toLowerCase().includes('kyc') ? (
                                            <>
                                                <button type="button" onClick={() => handleStatusChange('RESOLVED')} className="shrink-0 px-4 py-2 bg-green-50 text-green-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-green-600 hover:text-white transition-all border border-green-100">Approve KYC</button>
                                                <button type="button" onClick={() => setReplyMsg("Please re-upload your Aadhar card with a clearer photo.")} className="shrink-0 px-4 py-2 bg-amber-50 text-amber-600 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-amber-600 hover:text-white transition-all border border-amber-100">Request Re-upload</button>
                                            </>
                                        ) : (
                                            <>
                                                <button type="button" onClick={() => setReplyMsg("Hello, how can I assist you today?")} className="shrink-0 px-4 py-2 bg-gray-50 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all border border-gray-100">General Help</button>
                                                <button type="button" onClick={() => handleStatusChange('RESOLVED')} className="shrink-0 px-4 py-2 bg-gray-50 text-gray-500 rounded-full text-[10px] font-black uppercase tracking-widest hover:bg-black hover:text-white transition-all border border-gray-100">Mark Resolved</button>
                                            </>
                                        )}
                                    </div>

                                    <form onSubmit={handleReply} className="flex items-end gap-3 bg-gray-50 p-3 rounded-[2rem] border border-transparent focus-within:border-black transition-all">
                                        <button type="button" onClick={() => fileInputRef.current?.click()} className="p-3 text-gray-400 hover:text-black transition-colors bg-white rounded-full shadow-sm">
                                            <Paperclip className="w-4 h-4" />
                                        </button>
                                        <input type="file" ref={fileInputRef} className="hidden" />
                                        <textarea
                                            value={replyMsg}
                                            onChange={(e) => setReplyMsg(e.target.value)}
                                            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleReply(e as any); } }}
                                            placeholder="Secure transmission..."
                                            rows={1}
                                            className="flex-1 bg-transparent p-3 outline-none text-sm font-medium min-h-[44px] max-h-[120px] resize-none"
                                        />
                                        <button type="submit" disabled={loading} className="p-3 bg-black text-white rounded-full hover:bg-blue-600 transition-all shadow-xl disabled:bg-gray-300">
                                            <Send className="w-5 h-5" />
                                        </button>
                                    </form>
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center text-gray-100 bg-[#f9f9f9]/50">
                            <LifeBuoy className="w-24 h-24 mb-4 opacity-10 animate-pulse" />
                            <h3 className="text-sm font-black uppercase tracking-[0.4em] opacity-30">Select Active Protocol</h3>
                        </div>
                    )}
                </div>

                {/* Column 3: Intelligence Panel (25%) */}
                <div className="w-[25%] border-l border-gray-50 flex flex-col shrink-0 bg-white">
                    {selectedTicket && clientContext ? (
                        <div className="flex-1 overflow-y-auto p-8 space-y-10 custom-scrollbar">

                            {/* Profile Information */}
                            <section className="space-y-6">
                                <div className="text-center">
                                    <div className="w-24 h-24 rounded-[2.5rem] bg-gradient-to-br from-indigo-500 to-purple-600 mx-auto flex items-center justify-center text-white text-3xl font-black shadow-2xl shadow-indigo-100 mb-4 border-4 border-white">
                                        {clientContext.client?.name?.charAt(0) || <User />}
                                    </div>
                                    <h4 className="text-lg font-black text-gray-900">{clientContext.client?.name || 'Loading Name...'}</h4>
                                    <p className="text-xs font-bold text-gray-400">{selectedTicket.clientEmail}</p>
                                </div>

                                <div className="grid grid-cols-1 gap-2">
                                    <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <ShieldCheck className="w-4 h-4 text-green-500" />
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">KYC Status</span>
                                        </div>
                                        <span className={`text-[10px] font-black px-2 py-1 rounded-full uppercase ${clientContext.client?.kycStatus === 'VERIFIED' ? 'bg-green-100 text-green-600' : 'bg-yellow-100 text-yellow-600'}`}>
                                            {clientContext.client?.kycStatus || 'PENDING'}
                                        </span>
                                    </div>
                                    <div className="p-4 bg-gray-50 rounded-2xl flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-blue-500" />
                                            <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Onboarded</span>
                                        </div>
                                        <span className="text-[10px] font-black text-gray-900">{new Date(clientContext.client?.createdAt || Date.now()).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            </section>

                            {/* Complaint History */}
                            <section className="space-y-4">
                                <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                                    <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <History className="w-3 h-3" />
                                        Case History ({clientContext.tickets.length})
                                    </h5>
                                </div>
                                <div className="space-y-3">
                                    {clientContext.tickets.map((t: any) => (
                                        <div key={t.id} className="p-4 hover:bg-gray-50 rounded-2xl transition-colors border border-transparent hover:border-gray-100 group">
                                            <div className="flex justify-between items-start mb-1">
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-full ${t.status === 'RESOLVED' ? 'bg-green-50 text-green-500' : 'bg-gray-100 text-gray-500'}`}>{t.status}</span>
                                                <span className="text-[9px] text-gray-400 font-bold">{new Date(t.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <h6 className="text-[11px] font-bold text-gray-700 line-clamp-1">{t.subject}</h6>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Protocol Management */}
                            <section className="space-y-4">
                                <h5 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Clock className="w-3 h-3" />
                                    Change Ticket Status
                                </h5>
                                <div className="grid grid-cols-2 gap-2">
                                    {['IN_PROGRESS', 'RESOLVED', 'CLOSED'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => handleStatusChange(status)}
                                            className={`p-3 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all ${selectedTicket.status === status ? 'bg-black text-white' : 'bg-gray-50 text-gray-400 hover:bg-white hover:text-black border border-transparent hover:border-gray-200'}`}
                                        >
                                            {status.replace('_', ' ')}
                                        </button>
                                    ))}
                                </div>
                            </section>

                        </div>
                    ) : (
                        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center opacity-20">
                            <Activity className="w-12 h-12 mb-4" />
                            <p className="text-[10px] font-black uppercase tracking-widest">Context Loading...</p>
                        </div>
                    )}

                    <div className="p-6 border-t border-gray-50">
                        <button className="w-full py-4 bg-red-50 text-red-600 rounded-3xl text-[10px] font-black uppercase tracking-[0.3em] hover:bg-red-600 hover:text-white transition-all shadow-sm">
                            Flag Fraud Potential
                        </button>
                    </div>
                </div>

            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #eee;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #ddd;
                }
            `}</style>
        </div>
    );
}
