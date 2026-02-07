import { getLeads } from "@/app/actions/leads";
import { LeadsTable } from "./leads-table";
import { Users, Filter } from "lucide-react";

export const dynamic = 'force-dynamic';

export default async function LeadsPage() {
    const leads = await getLeads();

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Lead Verification</h1>
                    <p className="text-gray-500">Review applications and verify documents before activating licenses.</p>
                </div>
                <div className="flex gap-2">
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:bg-gray-50">
                        <Filter className="w-4 h-4" />
                        Filter Status
                    </button>
                    <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium">
                        <Users className="w-4 h-4" />
                        Total Leads: {leads.length}
                    </div>
                </div>
            </div>

            <LeadsTable leads={leads} />
        </div>
    );
}
