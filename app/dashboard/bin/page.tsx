import { prisma } from '@/lib/prisma';
import { restoreLicense, forceDeleteLicense } from '@/lib/actions';
import { Trash2, RefreshCw, AlertTriangle } from 'lucide-react';
import { Toaster } from 'sonner';

export default async function RecycleBinPage() {
    const deletedLicenses = await prisma.license.findMany({
        where: {
            deletedAt: { not: null }
        },
        orderBy: { deletedAt: 'desc' }
    });

    return (
        <div className="space-y-8">
            <Toaster />

            <header>
                <div className="flex items-center gap-3">
                    <Trash2 className="w-8 h-8 text-red-500" />
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Recycle Bin</h1>
                        <p className="text-gray-500">Restore accidentally deleted licenses or remove them forever.</p>
                    </div>
                </div>
            </header>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-50 text-gray-500">
                            <tr>
                                <th className="px-6 py-3 font-medium">Domain & Key</th>
                                <th className="px-6 py-3 font-medium">Plan Details</th>
                                <th className="px-6 py-3 font-medium">Deleted Date</th>
                                <th className="px-6 py-3 font-medium text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {deletedLicenses.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="px-6 py-12 text-center text-gray-400 flex flex-col items-center">
                                        <div className="p-4 bg-gray-50 rounded-full mb-3">
                                            <Trash2 className="w-6 h-6 text-gray-300" />
                                        </div>
                                        <span>Recycle Bin is empty</span>
                                    </td>
                                </tr>
                            )}
                            {deletedLicenses.map((license) => (
                                <tr key={license.id} className="hover:bg-red-50/10 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{license.domain}</div>
                                        <code className="text-xs text-gray-400 font-mono" title={license.licenseKey}>
                                            {license.licenseKey}
                                        </code>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-gray-900">{license.planName}</div>
                                        <div className="text-xs text-gray-500">{license.clientEmail}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {license.deletedAt ? new Date(license.deletedAt).toLocaleDateString() : 'N/A'}
                                        <div className="text-xs">
                                            {license.deletedAt ? new Date(license.deletedAt).toLocaleTimeString() : ''}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            <form action={restoreLicense.bind(null, license.id)}>
                                                <button
                                                    title="Restore License"
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition-colors text-xs font-medium"
                                                >
                                                    <RefreshCw className="w-3.5 h-3.5" />
                                                    Restore
                                                </button>
                                            </form>

                                            <form action={forceDeleteLicense.bind(null, license.id)}>
                                                <button
                                                    title="Permanently Delete"
                                                    className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors text-xs font-medium"
                                                >
                                                    <AlertTriangle className="w-3.5 h-3.5" />
                                                    Delete Forever
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 flex items-start gap-3 text-sm text-blue-800">
                <AlertTriangle className="w-5 h-5 flex-shrink-0" />
                <p>
                    <strong>Note:</strong> Items in the Recycle Bin are hidden from the dashboard but still exist in the database.
                    "Delete Forever" will permanently remove them and cannot be undone.
                </p>
            </div>
        </div>
    );
}
