import { cookies } from 'next/headers';
import { verifyToken } from '@/lib/client-auth-token';
import { redirect } from 'next/navigation';
import { getUnifiedHistory } from '@/app/actions/history';
import HistoryTimeline from '@/components/HistoryTimeline';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export default async function ClientHistoryPage() {
    const cookieStore = await cookies();
    const token = cookieStore.get('client_session')?.value;

    if (!token) {
        redirect('/client/login');
    }

    const payload = verifyToken(token);
    if (!payload || !payload.email) {
        redirect('/client/login');
    }

    const history = await getUnifiedHistory(payload.email);

    return (
        <div className="max-w-5xl mx-auto p-6 md:p-12 animate-in fade-in duration-700">
            <div className="mb-8">
                <Link href="/client/dashboard" className="inline-flex items-center text-sm text-gray-500 hover:text-black mb-6 transition-colors font-medium">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Link>
                <div className="space-y-2">
                    <h1 className="text-4xl font-[900] tracking-tighter uppercase leading-none">Your <span className="text-gray-300">History</span></h1>
                    <p className="text-xs font-black text-gray-400 uppercase tracking-widest">Full Record of all Interactions</p>
                </div>
            </div>

            <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 p-8">
                <HistoryTimeline events={history} title="Communication Vault" />
            </div>
        </div>
    );
}
