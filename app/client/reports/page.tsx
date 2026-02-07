'use client';

import { useState, useEffect, useRef } from 'react';
import { getMonthlyReport } from '@/app/actions/report-actions';
import { Loader2, ShieldCheck, Download, BarChart3, Lock, Activity, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export default function ReportsPage() {
    const [loading, setLoading] = useState(true);
    const [report, setReport] = useState<any>(null);
    const reportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        getMonthlyReport().then((data) => {
            setReport(data);
            setLoading(false);
        });
    }, []);

    const handleDownload = async () => {
        if (!reportRef.current) return;
        const element = reportRef.current;

        try {
            toast.loading("Generating Secure Certificate...");
            const canvas = await html2canvas(element, { scale: 2 });
            const dataP = canvas.toDataURL('image/png');

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(dataP, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`Voomit-Security-Report-${report?.month}.pdf`);
            toast.dismiss();
            toast.success("Certificate Downloaded");
        } catch (e) {
            toast.dismiss();
            toast.error("Generation Failed");
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
        </div>
    );

    if (!report) return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 space-y-4">
            <ShieldCheck className="w-16 h-16 text-gray-300" />
            <h2 className="text-xl font-black uppercase text-gray-400">No Report Data Available</h2>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 p-6 md:p-12 space-y-12">
            <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-indigo-600">
                        <BarChart3 className="w-5 h-5" />
                        <span className="text-[10px] font-[1000] uppercase tracking-[0.4em]">Intelligence Report</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-[1000] tracking-tight uppercase italic leading-none text-gray-900">
                        Security <span className="text-indigo-600">Audit</span>
                    </h1>
                </div>
                <button
                    onClick={handleDownload}
                    className="bg-black text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center gap-3 hover:bg-gray-800 transition-all shadow-xl"
                >
                    <Download className="w-4 h-4" />
                    Download Certificate
                </button>
            </header>

            {/* REPORT CANVAS */}
            <div ref={reportRef} className="bg-white p-12 rounded-[3rem] shadow-sm space-y-12 border border-gray-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2" />

                <div className="relative z-10 flex justify-between items-center border-b border-gray-100 pb-8">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-black rounded-xl flex items-center justify-center text-white">
                            <ShieldCheck className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-[1000] italic uppercase">Voomit LicenseGuard</h2>
                            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Monthly Protection Statement</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="flex items-center justify-end gap-2 text-gray-500">
                            <Calendar className="w-4 h-4" />
                            <span className="text-xs font-bold font-mono">{report.month}</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    <div className="bg-gray-50 p-8 rounded-3xl space-y-2 border border-gray-100">
                        <div className="flex items-center gap-2 text-red-500 mb-4">
                            <Lock className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Threats Blocked</span>
                        </div>
                        <p className="text-5xl font-[1000] text-gray-900">{report.blockedIPs}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Unique IP Addresses</p>
                    </div>

                    <div className="bg-gray-50 p-8 rounded-3xl space-y-2 border border-gray-100">
                        <div className="flex items-center gap-2 text-amber-500 mb-4">
                            <Activity className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">Tamper Attempts</span>
                        </div>
                        <p className="text-5xl font-[1000] text-gray-900">{report.tamperAttempts}</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Signature Mismatches</p>
                    </div>

                    <div className="bg-gray-50 p-8 rounded-3xl space-y-2 border border-gray-100">
                        <div className="flex items-center gap-2 text-emerald-500 mb-4">
                            <ShieldCheck className="w-5 h-5" />
                            <span className="text-[10px] font-black uppercase tracking-widest">System Uptime</span>
                        </div>
                        <p className="text-5xl font-[1000] text-gray-900">{report.uptime}%</p>
                        <p className="text-[10px] text-gray-400 font-bold uppercase">Continuous Protection</p>
                    </div>
                </div>

                <div className="relative z-10 pt-8 border-t border-gray-100">
                    <div className="bg-black text-white p-8 rounded-2xl flex items-center justify-between">
                        <div className="space-y-1">
                            <p className="text-sm font-black uppercase italic">Security Status: OPTIMAL</p>
                            <p className="text-[10px] text-gray-400 font-medium">Your license integrity is verified and active.</p>
                        </div>
                        <div className="h-10 w-10 border-4 border-white border-t-transparent rounded-full opacity-20" /> {/* Abstract verified seal */}
                    </div>
                </div>
            </div>
        </div>
    );
}
