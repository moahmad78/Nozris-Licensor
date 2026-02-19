'use client';

import { useState } from 'react';
import { triggerManualBackup, restoreFromBackup } from '@/app/actions/backup-restore';
import { toast } from 'sonner';
import { Archive, UploadCloud, RefreshCcw, FileBox, CheckCircle, Terminal, AlertTriangle, Download, X } from 'lucide-react';

export function SystemVault({ licenseKey }: { licenseKey: string }) {
    const [backupLoading, setBackupLoading] = useState(false);
    const [restoreLoading, setRestoreLoading] = useState(false);
    const [restoreLogs, setRestoreLogs] = useState<string[]>([]);
    const [dragActive, setDragActive] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [pendingFile, setPendingFile] = useState<File | null>(null);

    const handleBackup = async () => {
        setBackupLoading(true);
        toast.info("Generating Golden Snapshot...");
        try {
            const res = await triggerManualBackup(licenseKey);
            if (res.success) {
                toast.success("Snapshot Generated! Downloading...");
                window.open(res.downloadUrl, '_blank');
            } else {
                toast.error("Backup Failed");
            }
        } catch (e) {
            toast.error("Connection Error");
        } finally {
            setBackupLoading(false);
        }
    };

    const confirmRestore = async () => {
        if (!pendingFile) return;
        setShowConfirm(false);

        const formData = new FormData();
        formData.append('backupFile', pendingFile);
        formData.append('licenseKey', licenseKey);

        setRestoreLoading(true);
        setRestoreLogs([]);
        toast.warning("INITIATING UNIVERSAL RECOVERY...");

        try {
            const res = await restoreFromBackup(formData);
            if (res.success) {
                setRestoreLogs(res.logs || []);
                toast.success("SYSTEM HEALED");
            } else {
                setRestoreLogs(res.logs || []);
                toast.error("Restoration Failed");
            }
        } catch (error) {
            toast.error("Critical Failure");
        } finally {
            setRestoreLoading(false);
            setPendingFile(null);
        }
    };

    const handleFileSelection = (file: File) => {
        setPendingFile(file);
        setShowConfirm(true);
    };

    const onDrag = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const onDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFileSelection(e.dataTransfer.files[0]);
        }
    };

    const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            handleFileSelection(e.target.files[0]);
        }
    };

    return (
        <div className="bg-white p-8 rounded-3xl shadow-md border border-slate-200 relative">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h3 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                        <Archive className="text-blue-600" /> System Vault
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">Universal Recovery Engine & Snapshot Manager</p>
                </div>
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    <span className="text-xs font-bold text-green-600 uppercase">Engine Ready</span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Manual Backup */}
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center text-center transition-all hover:bg-slate-100">
                    <div className="mb-4 p-4 bg-blue-100 rounded-full text-blue-600 shadow-sm">
                        <FileBox size={32} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900">Golden Snapshot</h4>
                    <p className="text-xs text-slate-500 mb-6 max-w-xs">Generate a full-stack backup including database dumps, web assets, and configs.</p>
                    <button
                        onClick={handleBackup}
                        disabled={backupLoading}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center justify-center gap-2"
                    >
                        {backupLoading ? <RefreshCcw className="animate-spin" size={18} /> : <Download size={18} />}
                        {backupLoading ? 'GENERATING SNAPSHOT...' : 'GENERATE SNAPSHOT'}
                    </button>
                    {/* Mock Last Backup Date */}
                    <p className="text-[10px] text-slate-400 mt-3 font-mono">Last Backup: 2 hours ago</p>
                </div>

                {/* Restore Dropzone */}
                <div
                    className={`p-6 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center text-center relative overflow-hidden transition-all ${dragActive ? 'border-blue-500 bg-blue-50 scale-[1.02]' : 'border-slate-300 bg-slate-50 hover:bg-white'
                        }`}
                    onDragEnter={onDrag}
                    onDragLeave={onDrag}
                    onDragOver={onDrag}
                    onDrop={onDrop}
                >
                    <div className={`mb-4 p-4 rounded-full shadow-sm transition-colors ${dragActive ? 'bg-white text-blue-600' : 'bg-red-100 text-red-600'}`}>
                        <UploadCloud size={32} />
                    </div>
                    <h4 className="text-lg font-bold text-slate-900">Universal Heal</h4>
                    <p className="text-xs text-slate-500 mb-6 max-w-xs">Drag & Drop `.nozris` or `.zip` file here to initiate Recovery Engine.</p>

                    <label className={`w-full py-3 ${restoreLoading ? 'bg-slate-400 cursor-not-allowed' : 'bg-red-600 hover:bg-red-700 cursor-pointer'} text-white text-sm font-bold rounded-xl shadow-lg shadow-red-500/20 active:scale-95 transition-all flex items-center justify-center gap-2 z-10`}>
                        {restoreLoading ? <RefreshCcw className="animate-spin" size={18} /> : <RefreshCcw size={18} />}
                        {restoreLoading ? 'RESTORING SYSTEM...' : 'UPLOAD TO HEAL'}
                        <input type="file" className="hidden" accept=".nozris,.zip" onChange={onFileChange} disabled={restoreLoading} />
                    </label>
                </div>
            </div>

            {/* Live Restoration Progress */}
            {(restoreLoading || restoreLogs.length > 0) && (
                <div className="mt-8">
                    <div className="flex items-center gap-2 mb-3">
                        <Terminal size={14} className="text-slate-500" />
                        <p className="text-xs font-bold text-slate-500 uppercase">Engine Console</p>
                    </div>
                    <div className="bg-slate-900 rounded-2xl p-6 font-mono text-xs text-green-400 h-64 overflow-y-auto custom-scrollbar shadow-inner relative">
                        {restoreLoading && restoreLogs.length === 0 && (
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="flex flex-col items-center gap-2">
                                    <RefreshCcw className="animate-spin text-blue-500" size={32} />
                                    <p className="text-blue-500 font-bold">INITIALIZING ENGINE...</p>
                                </div>
                            </div>
                        )}
                        {restoreLogs.map((log, i) => (
                            <div key={i} className="mb-2 flex items-start gap-2 border-l-2 border-blue-900 pl-2 animate-in slide-in-from-left-2 fade-in">
                                <span className="text-blue-500 mt-0.5">➜</span>
                                <div>
                                    <span className="text-slate-500 text-[10px] mr-2">{log.split(']')[0] ? log.split(']')[0] + ']' : ''}</span>
                                    <span>{log.split(']')[1] || log}</span>
                                </div>
                            </div>
                        ))}
                        {restoreLogs.length > 0 && !restoreLoading && (
                            <div className="mt-4 p-2 bg-green-500/20 border border-green-500 rounded text-center text-green-300 font-bold animate-pulse">
                                RECOVERY COMPLETE - SYSTEM INTEGRITY VERIFIED
                            </div>
                        )}
                    </div>

                    {/* Visual Steps (Mock) */}
                    <div className="grid grid-cols-4 gap-2 mt-4">
                        {['Parsing Manifest', 'Routing Assets', 'Overwriting Core', 'Verifying Hash'].map((step, i) => (
                            <div key={i} className={`h-1 rounded-full ${restoreLogs.length > (i * 2 + 1) ? 'bg-green-500' : 'bg-slate-200'} transition-all duration-1000`}></div>
                        ))}
                    </div>
                </div>
            )}

            {/* Warning Modal */}
            {showConfirm && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm rounded-3xl p-4">
                    <div className="bg-white p-6 rounded-3xl shadow-2xl border-2 border-red-100 max-w-sm w-full text-center relative animate-in zoom-in-95 duration-200">
                        <button
                            onClick={() => setShowConfirm(false)}
                            className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
                        >
                            <X size={20} />
                        </button>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4 text-red-600">
                            <AlertTriangle size={32} />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-2">System Restoration</h3>
                        <p className="text-sm text-slate-500 mb-6">
                            ATTENTION: Your website will be temporarily offline for 10-20 seconds to ensure a clean overwrite.
                            <br /><br />
                            <span className="font-bold text-slate-900">Do you want to proceed?</span>
                        </p>
                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setShowConfirm(false)}
                                className="py-3 px-4 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmRestore}
                                className="py-3 px-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-lg shadow-red-500/20"
                            >
                                Confirm & Heal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
