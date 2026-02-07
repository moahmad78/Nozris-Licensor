'use client';

import { redirect } from 'next/navigation';

export default function AdminTicketsPage() {
    redirect('/admin/support-center');
    return null;
}
