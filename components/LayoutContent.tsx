'use client';

import { usePathname } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function LayoutContent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const isClientPortal = pathname?.startsWith('/client');

    return (
        <>
            {!isClientPortal && <Navbar />}
            {children}
            {!isClientPortal && <Footer />}
        </>
    );
}
