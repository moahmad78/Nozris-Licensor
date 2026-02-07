import { getPolicy } from '@/app/actions/legal-actions';
import { Banknote } from 'lucide-react';

export default async function RefundPolicy() {
    const policy = await getPolicy('REFUND');

    return (
        <div className="max-w-4xl mx-auto p-12 space-y-12 min-h-screen">
            <header className="space-y-4 border-b border-gray-100 pb-8">
                <h1 className="text-5xl font-black text-black tracking-tighter uppercase italic">Refund Policy</h1>
                <p className="text-gray-500 font-medium text-lg flex items-center gap-2">
                    <Banknote className="w-5 h-5 text-black" />
                    Last Updated: {policy?.updatedAt ? new Date(policy.updatedAt).toLocaleDateString() : 'February 2026'}
                </p>
            </header>

            <section className="prose prose-lg prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight max-w-none text-gray-700 whitespace-pre-wrap">
                {policy?.content || (
                    <div className="p-8 bg-gray-50 rounded-2xl border border-gray-100 text-center space-y-2">
                        <p className="text-xl font-black text-gray-400 uppercase">Policy Under Maintenance</p>
                        <p className="text-sm text-gray-500">Please check back shortly.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
