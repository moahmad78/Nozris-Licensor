'use client';

import { useState } from 'react';
import { updateAdminNotes } from '@/app/actions/admin-notes';
import { toast } from 'sonner';
import { Save, Edit2, Loader2 } from 'lucide-react';

export function AdminNotesEditor({ clientId, initialNotes }: { clientId: string, initialNotes: string }) {
    const [notes, setNotes] = useState(initialNotes || '');
    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSave = async () => {
        setLoading(true);
        const res = await updateAdminNotes(clientId, notes);
        if (res.success) {
            toast.success("Internal notes updated successfully.");
            setIsEditing(false);
        } else {
            toast.error("Failed to save notes.");
        }
        setLoading(false);
    };

    return (
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                    <Edit2 className="w-4 h-4 text-gray-400" />
                    Internal Admin Notes
                </h3>
                {!isEditing ? (
                    <button
                        onClick={() => setIsEditing(true)}
                        className="text-xs font-bold text-gray-500 hover:text-black transition-colors"
                    >
                        Edit Notes
                    </button>
                ) : (
                    <div className="flex items-center gap-2">
                        <button
                            disabled={loading}
                            onClick={() => setIsEditing(false)}
                            className="text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            disabled={loading}
                            onClick={handleSave}
                            className="inline-flex items-center gap-2 bg-black text-white px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-gray-800 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
                            Save
                        </button>
                    </div>
                )}
            </div>

            {isEditing ? (
                <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Write private comments about this client..."
                    className="w-full h-32 text-sm p-4 border border-gray-200 rounded-lg focus:border-black outline-none transition-all"
                />
            ) : (
                <div className={`text-sm ${notes ? 'text-gray-700' : 'text-gray-400 italic'}`}>
                    {notes || "No internal notes added yet. Keep track of specific client requirements or discussions here."}
                </div>
            )}
        </div>
    );
}
