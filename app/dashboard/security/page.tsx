import { getBlockedIPs } from "@/app/actions/security";
import { SecurityTable } from "./security-table";
import { Shield, ShieldAlert, Activity } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function SecurityPage() {
    const rawIps = await getBlockedIPs();

    // Ensure plain objects
    const ips = JSON.parse(JSON.stringify(rawIps));
    const blockedCount = ips.filter((ip: any) => ip.isBlocked).length;

    return (
        <div className="max-w-7xl mx-auto space-y-8">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-3">
                        <ShieldAlert className="w-8 h-8 text-red-600" />
                        Security Center
                    </h1>
                    <p className="text-gray-500 mt-2">Monitor and manage access control lists.</p>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-red-50 rounded-xl">
                        <ShieldAlert className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Active Blocks</p>
                        <h3 className="text-2xl font-bold text-gray-900">{blockedCount}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-yellow-50 rounded-xl">
                        <Activity className="w-6 h-6 text-yellow-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">Suspicious Events</p>
                        <h3 className="text-2xl font-bold text-gray-900">{ips.reduce((acc: number, curr: any) => acc + curr.attempts, 0)}</h3>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-green-50 rounded-xl">
                        <Shield className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-gray-500">System Status</p>
                        <h3 className="text-2xl font-bold text-gray-900">Active</h3>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Blocked IP Registry</h2>
                <SecurityTable ips={ips} />
            </div>
        </div>
    );
}
