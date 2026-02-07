'use client';

import React, { useRef } from 'react';
import { format } from 'date-fns';

type HistoryEvent = {
    id: string;
    type: string;
    title: string;
    description: string;
    date: Date;
    status: string;
    direction?: string;
};

interface HistoryTimelineProps {
    events: HistoryEvent[];
    title?: string;
}

export default function HistoryTimeline({ events, title = "Unified Communication Vault" }: HistoryTimelineProps) {
    const printRef = useRef<HTMLDivElement>(null);

    const handlePrint = () => {
        const printContent = printRef.current;
        if (printContent) {
            const originalContents = document.body.innerHTML;
            document.body.innerHTML = printContent.innerHTML;
            window.print();
            document.body.innerHTML = originalContents;
            window.location.reload(); // Reload to restore event listeners
        }
    };

    const getIcon = (type: string) => {
        switch (type) {
            case 'TICKET': return '🎫';
            case 'MESSAGE': return '💬';
            case 'PAYMENT': return '💰';
            case 'SECURITY': return '🚨';
            case 'ALERT': return '🔔';
            case 'COMMUNICATION': return '📡';
            default: return '📝';
        }
    };

    const getColor = (type: string) => {
        switch (type) {
            case 'TICKET': return 'bg-blue-100 text-blue-800';
            case 'MESSAGE': return 'bg-purple-100 text-purple-800';
            case 'PAYMENT': return 'bg-green-100 text-green-800';
            case 'SECURITY': return 'bg-red-100 text-red-800';
            case 'COMMUNICATION': return 'bg-indigo-100 text-indigo-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    return (
        <div className="w-full">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800">{title}</h2>
                <button
                    onClick={handlePrint}
                    className="px-4 py-2 bg-gray-800 text-white text-sm rounded-md hover:bg-gray-900 transition-colors flex items-center gap-2"
                >
                    🖨️ Export to PDF
                </button>
            </div>

            <div ref={printRef} className="bg-white p-6 rounded-lg shadow-sm border border-gray-100">
                {/* Print Header */}
                <div className="hidden print:block mb-6 border-b pb-4">
                    <h1 className="text-2xl font-bold text-gray-900">Voomet LicenseGuard - Official Record</h1>
                    <p className="text-sm text-gray-500">Generated on {format(new Date(), 'PPP p')}</p>
                </div>

                <div className="relative border-l-2 border-gray-200 ml-3 space-y-8">
                    {events.length === 0 ? (
                        <p className="ml-6 text-gray-500 italic">No history records found.</p>
                    ) : (
                        events.map((event) => (
                            <div key={event.id} className="relative ml-6">
                                <span className={`absolute -left-[2.1rem] flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white ${getColor(event.type)}`}>
                                    {getIcon(event.type)}
                                </span>
                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start bg-gray-50 p-4 rounded-md hover:bg-gray-100 transition-colors">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-1">
                                            <h3 className="text-base font-semibold text-gray-900">{event.title}</h3>
                                            <span className={`px-2 py-0.5 rounded text-xs font-medium uppercase ${getColor(event.type)}`}>
                                                {event.status}
                                            </span>
                                            {event.direction && (
                                                <span className="text-xs text-gray-500 uppercase tracking-wider">
                                                    {event.direction}
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 whitespace-pre-wrap">{event.description}</p>
                                    </div>
                                    <time className="text-xs text-gray-400 sm:text-right mt-2 sm:mt-0 min-w-[120px]">
                                        {format(new Date(event.date), 'MMM d, yyyy h:mm a')}
                                    </time>
                                </div>
                            </div>
                        ))
                    )}
                </div>

                {/* Print Footer */}
                <div className="hidden print:block mt-8 text-center text-xs text-gray-400 border-t pt-4">
                    <p>Confidential Record - Property of Voomet LicenseGuard</p>
                </div>
            </div>

            <style jsx global>{`
                @media print {
                    @page { margin: 20px; }
                    body { visibility: hidden; }
                    .print\\:block { display: block !important; }
                    /* Make the print content visible and position it */
                    /* (Handled by simple body replacement in JS, but CSS backup helps) */
                }
            `}</style>
        </div>
    );
}
