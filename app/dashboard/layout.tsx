import { getProfile } from '@/app/actions/profile';
import { prisma } from '@/lib/db';
import { DashboardNav } from '@/components/dashboard-nav';
import { SignOutButton } from '@/components/ui/sign-out-button';
import { AdminNotificationListener } from '@/components/admin-notifications-listener';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pendingCount = await prisma.renewalRequest.count({
        where: { status: 'PENDING' }
    });
    const profile = await getProfile();

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {/* Sidebar */}
            <aside className="w-64 fixed inset-y-0 left-0 bg-white border-r border-gray-100 z-10 hidden md:flex flex-col">
                <div className="p-6 border-b border-gray-50">
                    <div className="flex items-center gap-2">
                        {profile?.logo ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={profile.logo} alt="Logo" className="h-8 object-contain" />
                        ) : (
                            <h1 className="font-bold text-xl tracking-tight flex items-center gap-2">
                                Nozris
                            </h1>
                        )}
                    </div>
                </div>

                <div className="flex-1 p-4 overflow-y-auto">
                    <DashboardNav pendingCount={pendingCount} />
                </div>

                <div className="p-4 border-t border-gray-50">
                    <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-400">Administrator</span>
                        <SignOutButton />
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 md:ml-64 p-8">
                <AdminNotificationListener />
                {children}
            </main>
        </div>
    );
}

