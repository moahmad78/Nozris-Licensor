import { CreateLicenseForm } from '../create-license-form';
import { Toaster } from 'sonner';

export default function CreateLicensePage() {
    return (
        <div className="max-w-xl mx-auto space-y-8">
            <Toaster position="bottom-right" />

            <header>
                <h1 className="text-3xl font-bold tracking-tight text-gray-900">Create New License</h1>
                <p className="text-gray-500">Generate a secure license key for a new client domain.</p>
            </header>

            <CreateLicenseForm />
        </div>
    );
}
