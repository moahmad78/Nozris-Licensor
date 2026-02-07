'use client';

import { useState } from 'react';
import { Star, X, MessageSquare, Heart, ShieldCheck, Send } from 'lucide-react';
import { submitFeedback } from '@/app/actions/support-actions';
import { toast } from 'sonner';

interface FeedbackModalProps {
    ticketId: string;
    isOpen: boolean;
    onClose: () => void;
}

export default function FeedbackModal({ ticketId, isOpen, onClose }: FeedbackModalProps) {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [feedback, setFeedback] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (rating === 0) {
            toast.error("Please provide a rating");
            return;
        }
        setSubmitting(true);
        const res = await submitFeedback(ticketId, rating, feedback);
        if (res.success) {
            toast.success("Thank you for your feedback!");
            onClose();
        } else {
            toast.error("Failed to submit feedback");
        }
        setSubmitting(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md animate-in fade-in duration-300">
            <div className="bg-white w-full max-w-md rounded-[32px] shadow-2xl overflow-hidden border border-white/20 animate-in zoom-in-95 duration-300">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 text-center text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>

                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 border-4 border-white/30">
                        <Heart className="w-10 h-10 fill-white" />
                    </div>

                    <h3 className="text-xl font-black mb-1">Session Complete</h3>
                    <p className="text-blue-100 text-sm opacity-90">
                        How was your experience with Mohd Ahmad?
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-8">
                    <div className="flex justify-center gap-2">
                        {[1, 2, 3, 4, 5].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onClick={() => setRating(star)}
                                onMouseEnter={() => setHover(star)}
                                onMouseLeave={() => setHover(0)}
                                className="transition-all hover:scale-125 focus:outline-none"
                            >
                                <Star
                                    className={`w-10 h-10 ${(hover || rating) >= star
                                        ? 'fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                                        : 'text-gray-200'
                                        } transition-all duration-200`}
                                />
                            </button>
                        ))}
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-1">Your Detailed Feedback</label>
                        <textarea
                            value={feedback}
                            onChange={(e) => setFeedback(e.target.value)}
                            placeholder="Tell us what you liked or what we can improve..."
                            className="w-full p-4 bg-gray-50 border border-transparent rounded-2xl outline-none focus:border-blue-500 focus:bg-white resize-none text-sm min-h-[120px] transition-all"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={submitting || rating === 0}
                        className="w-full bg-black text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-lg shadow-gray-200 disabled:bg-gray-200 disabled:shadow-none"
                    >
                        {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Send className="w-5 h-5" />}
                        Submit Satisfaction Score
                    </button>
                </form>

                <div className="p-4 bg-gray-50 border-t border-gray-100 text-center flex items-center justify-center gap-2">
                    <ShieldCheck className="w-3 h-3 text-green-500" />
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Encrypted Feedback Protocol</p>
                </div>
            </div>
        </div>
    );
}

function Loader2({ className }: { className?: string }) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`lucide lucide-loader-2 ${className}`}
        >
            <path d="M21 12a9 9 0 1 1-6.219-8.56" />
        </svg>
    );
}
