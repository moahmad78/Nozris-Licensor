import { getClientLicenseDetails } from '@/app/actions/client-integration';
import { getPaymentStatus } from '@/app/actions/payment-actions';
import { redirect } from 'next/navigation';

export default async function ClientLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const meta = await getClientLicenseDetails();

    if (meta && meta.key !== 'NO_LICENSE_FOUND') {
        const status = await getPaymentStatus();
        if (status) { // If license found
            // Check for Pending Payment
            if (status.latestPayment?.status === 'PENDING') {
                redirect('/client/pay/waiting');
            }
            // Check for Expiry (Unpaid)
            if (status.isExpired) {
                redirect('/client/pay');
            }
        }
    }

    return (
        <div className="min-h-screen bg-[#F0F2F5]">
            {children}
        </div>
    );
}
