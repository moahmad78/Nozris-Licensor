'use client';

import { useState, useRef } from 'react';
import { Send, Paperclip, Video, Loader2, X, FileText, Image as ImageIcon } from 'lucide-react';
import { uploadAttachment } from '@/app/actions/support-actions';
import { toast } from 'sonner';

interface ChatInputProps {
    onSend: (message: string, attachmentUrl?: string) => Promise<void>;
    onGenerateMeeting?: () => void;
    disabled?: boolean;
    placeholder?: string;
}

export default function ChatInput({ onSend, onGenerateMeeting, disabled, placeholder }: ChatInputProps) {
    const [message, setMessage] = useState('');
    const [uploading, setUploading] = useState(false);
    const [attachment, setAttachment] = useState<{ url: string; name: string; type: string } | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        const res = await uploadAttachment(formData);
        if (res.success && res.url) {
            setAttachment({
                url: res.url,
                name: file.name,
                type: file.type
            });
            toast.success("File attached!");
        } else {
            toast.error(res.error || "Upload failed");
        }
        setUploading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if ((!message.trim() && !attachment) || disabled || uploading) return;

        await onSend(message, attachment?.url);
        setMessage('');
        setAttachment(null);
    };

    return (
        <div className="space-y-2">
            {attachment && (
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-100 rounded-xl w-fit animate-in slide-in-from-bottom-2">
                    {attachment.type.startsWith('image/') ? <ImageIcon className="w-4 h-4 text-blue-600" /> : <FileText className="w-4 h-4 text-blue-600" />}
                    <span className="text-xs font-medium text-blue-700 truncate max-w-[200px]">{attachment.name}</span>
                    <button onClick={() => setAttachment(null)} className="p-1 hover:bg-blue-100 rounded-full text-blue-400 hover:text-blue-600">
                        <X className="w-3 h-3" />
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-white p-2 border border-gray-200 rounded-2xl shadow-sm focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all">
                <div className="flex items-center gap-1 pb-1">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={uploading || disabled}
                        className="p-2.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                    >
                        {uploading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Paperclip className="w-5 h-5" />}
                    </button>
                    {onGenerateMeeting && (
                        <button
                            type="button"
                            onClick={onGenerateMeeting}
                            disabled={disabled}
                            className="p-2.5 text-gray-400 hover:text-purple-600 hover:bg-purple-50 rounded-xl transition-all"
                        >
                            <Video className="w-5 h-5" />
                        </button>
                    )}
                </div>

                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx"
                />

                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder={placeholder || "Type your message..."}
                    rows={1}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSubmit(e);
                        }
                    }}
                    className="flex-1 px-2 py-2.5 bg-transparent border-none outline-none text-sm resize-none max-h-32"
                />

                <button
                    type="submit"
                    disabled={(!message.trim() && !attachment) || uploading || disabled}
                    className="p-2.5 bg-black text-white rounded-xl hover:bg-gray-800 disabled:bg-gray-200 disabled:text-gray-400 transition-all"
                >
                    <Send className="w-5 h-5" />
                </button>
            </form>
        </div>
    );
}
