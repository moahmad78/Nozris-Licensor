import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import ClientUnifiedCenter from "./unified-view";
import { verifyToken } from "@/lib/client-auth-token";

export const dynamic = 'force-dynamic';

export default async function Page() {
    const cookieStore = await cookies();
    const token = cookieStore.get('client_session')?.value;

    if (!token) {
        redirect('/client/login');
    }

    const payload = verifyToken(token);
    if (!payload || payload.expiresAt < Date.now()) {
        redirect('/client/login');
    }

    const userEmail = payload.email;

    return <ClientUnifiedCenter clientEmail={userEmail} />;
}
