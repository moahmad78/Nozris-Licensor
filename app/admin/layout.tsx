import React from 'react';
import { Sidebar } from '@/components/Sidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="min-h-screen bg-white flex">

            {/* Sidebar protected by lg:block in the component itself */}
            <Sidebar />

            <main className="flex-1 w-full lg:ml-64 transition-all duration-300 ml-0">
                <div className="p-4 md:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
