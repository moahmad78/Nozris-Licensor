'use client';

import { approveLead, rejectLead } from "@/app/actions/leads";
import { uploadKYC } from "@/app/actions/upload-kyc";
import { CheckCircle, XCircle, Clock, Loader2, MessageCircle, FileText, Upload, AlertTriangle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export function LeadsTable({ leads }: { leads: any[] }) {
    const [actionId, setActionId] = useState<string | null>(null);
    const [isUploading, setIsUploading] = useState<string | null>(null);

    const handleApprove = async (id: string) => {
        setActionId(id);
        try {
            const result = await approveLead(id);
            if (result.error) toast.error(result.error);
            else toast.success("Lead Approved & License Created!");
        } catch (e) {
            toast.error("Failed to approve");
        } finally {
            setActionId(null);
        }
    };

    const handleReject = async (id: string) => {
        if (!confirm("Are you sure you want to reject this lead?")) return;
        setActionId(id);
        try {
            await rejectLead(id);
            toast.success("Lead Rejected");
        } catch (e) {
            toast.error("Failed to reject");
        } finally {
            setActionId(null);
        }
    };

    const handleUpload = async (id: string, file: File) => {
        setIsUploading(id);
        const formData = new FormData();
        formData.append('file', file);
        formData.append('leadId', id);

        try {
            const result = await uploadKYC(formData);
            if (result.error) toast.error(result.error);
            else toast.success("KYC Document Uploaded!");
        } catch (e) {
            toast.error("Upload failed");
        } finally {
            setIsUploading(null);
        }
    };

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 border-b border-gray-200">
                        <tr>
                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Applicant</th>
                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Domain</th>
                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Documents</th>
                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="py-4 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {leads.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="py-12 text-center text-gray-500">
                                    No pending leads found.
                                </td>
                            </tr>
                        ) : (
                            leads.map((lead) => (
                                <tr key={lead.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="py-4 px-6 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(lead.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="font-medium text-gray-900">{lead.name}</div>
                                        <div className="text-xs text-gray-500">Document Verification Pending</div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="text-sm text-gray-900">{lead.email}</div>
                                        <div className="flex items-center gap-1 text-xs text-green-600 mt-1">
                                            <MessageCircle className="w-3 h-3" />
                                            {lead.whatsapp}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6">
                                        <code className="text-xs font-mono bg-gray-100 px-2 py-1 rounded text-gray-700">
                                            {lead.domain}
                                        </code>
                                    </td>
                                    {/* Documents Column */}
                                    <td className="py-4 px-6">
                                        {lead.documentUrl ? (
                                            <a
                                                href={lead.documentUrl}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="inline-flex items-center gap-1 text-xs font-medium text-blue-600 hover:underline"
                                            >
                                                <FileText className="w-3 h-3" /> View KYC
                                            </a>
                                        ) : (
                                            <div className="relative">
                                                <input
                                                    type="file"
                                                    accept=".pdf,.jpg,.png"
                                                    disabled={isUploading === lead.id}
                                                    onChange={(e) => {
                                                        const file = e.target.files?.[0];
                                                        if (file) handleUpload(lead.id, file);
                                                    }}
                                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                                />
                                                <button
                                                    disabled={isUploading === lead.id}
                                                    className="inline-flex items-center gap-1 text-xs font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded border border-gray-200"
                                                >
                                                    {isUploading === lead.id ? <Loader2 className="w-3 h-3 animate-spin" /> : <Upload className="w-3 h-3" />}
                                                    {isUploading === lead.id ? 'Uploading...' : 'Upload KYC'}
                                                </button>
                                                <span className="flex items-center gap-1 text-[10px] text-red-500 mt-1">
                                                    <AlertTriangle className="w-3 h-3" /> Pending
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="py-4 px-6">
                                        {lead.status === 'PENDING' && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                <Clock className="w-3 h-3" /> Under Review
                                            </span>
                                        )}
                                        {lead.status === 'APPROVED' && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <CheckCircle className="w-3 h-3" /> Active Client
                                            </span>
                                        )}
                                        {lead.status === 'REJECTED' && (
                                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                                <XCircle className="w-3 h-3" /> Rejected
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4 px-6 text-right">
                                        {lead.status === 'PENDING' && (
                                            <div className="flex justify-end gap-2">
                                                <button
                                                    onClick={() => handleApprove(lead.id)}
                                                    disabled={actionId === lead.id || !lead.documentUrl} // Require Document
                                                    title={!lead.documentUrl ? "Upload KYC Document First" : "Approve Lead"}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    {actionId === lead.id ? <Loader2 className="w-3 h-3 animate-spin" /> : 'Approve & Activate'}
                                                </button>
                                                <button
                                                    onClick={() => handleReject(lead.id)}
                                                    disabled={actionId === lead.id}
                                                    className="inline-flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 text-gray-700 rounded-lg text-xs font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-colors disabled:opacity-50"
                                                >
                                                    Reject
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
