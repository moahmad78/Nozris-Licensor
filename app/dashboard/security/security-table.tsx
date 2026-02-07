'use client';

import { toast } from "sonner";
import { unblockIP } from "@/app/actions/security";
import { Unlock, ShieldCheck, AlertOctagon } from "lucide-react";
import { useState, useTransition } from "react";

export function BlockedIpRow({ ip }: { ip: any }) {
    const [isPending, startTransition] = useTransition();

    const handleUnblock = () => {
        startTransition(async () => {
            const result = await unblockIP(ip.id);
            if (result.success) {
                toast.success(`Unblocked IP: ${ip.ipAddress}`);
            } else {
                toast.error("Failed to unblock IP");
            }
        });
    };

    return (
        <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
            <td className="py-4 px-6 text-sm font-mono text-gray-900">
                {ip.ipAddress}
            </td>
            <td className="py-4 px-6">
                <div className="flex items-center gap-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${ip.isBlocked ? 'bg-red-50 text-red-700 ring-1 ring-red-600/10' : 'bg-yellow-50 text-yellow-700 ring-1 ring-yellow-600/10'
                        }`}>
                        {ip.isBlocked ? 'BLOCKED' : 'Clean'}
                    </span>
                </div>
            </td>
            <td className="py-4 px-6 text-sm text-gray-600">
                {ip.reason}
            </td>
            <td className="py-4 px-6 text-sm text-center font-semibold text-gray-900">
                {ip.attempts}
            </td>
            <td className="py-4 px-6 text-sm text-gray-500">
                {new Date(ip.updatedAt).toLocaleString()}
            </td>
            <td className="py-4 px-6 text-right">
                {ip.isBlocked && (
                    <button
                        onClick={handleUnblock}
                        disabled={isPending}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-green-50 hover:text-green-700 hover:border-green-200 transition-all disabled:opacity-50 shadow-sm"
                    >
                        {isPending ? (
                            <div className="w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Unlock className="w-3.5 h-3.5" />
                        )}
                        Unblock
                    </button>
                )}
            </td>
        </tr>
    );
}

export function SecurityTable({ ips }: { ips: any[] }) {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <table className="w-full text-left">
                <thead>
                    <tr className="bg-gray-50 border-b border-gray-200">
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">IP Address</th>
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">Attempts</th>
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider">Last Activity</th>
                        <th className="py-3 px-6 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {ips.length === 0 ? (
                        <tr>
                            <td colSpan={6} className="py-12 text-center text-gray-500">
                                <ShieldCheck className="w-12 h-12 mx-auto text-green-500 mb-3 opacity-20" />
                                <p>System is secure. No suspicious activity recorded.</p>
                            </td>
                        </tr>
                    ) : (
                        ips.map((ip) => (
                            <BlockedIpRow key={ip.id} ip={ip} />
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
}
