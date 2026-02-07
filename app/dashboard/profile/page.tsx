'use client';

import { useState, useEffect } from 'react';
import { getProfile, updateProfile } from '@/app/actions/profile';
import { toast, Toaster } from 'sonner';
import { Loader2, User, Mail, Phone, MessageCircle, Save } from 'lucide-react';

export default function ProfilePage() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    // State for form fields
    const [fullName, setFullName] = useState('');
    const [supportEmail, setSupportEmail] = useState('');
    const [whatsappNumber, setWhatsappNumber] = useState('');
    const [contactNumber, setContactNumber] = useState('');
    const [logo, setLogo] = useState('');
    const [logoPreview, setLogoPreview] = useState('');

    useEffect(() => {
        async function fetchProfile() {
            try {
                const data = await getProfile();
                if (data) {
                    setFullName(data.fullName);
                    setSupportEmail(data.supportEmail);
                    setWhatsappNumber(data.whatsappNumber);
                    setContactNumber(data.contactNumber);
                    if (data.logo) {
                        setLogoPreview(data.logo);
                    }
                }
            } catch (error) {
                toast.error("Failed to load profile");
            } finally {
                setIsLoading(false);
            }
        }
        fetchProfile();
    }, []);

    const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB Limit
                toast.error("Logo size must be less than 2MB");
                return;
            }
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64 = reader.result as string;
                setLogo(base64); // Send this to server
                setLogoPreview(base64); // Show preview
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('supportEmail', supportEmail);
        formData.append('whatsappNumber', whatsappNumber);
        formData.append('contactNumber', contactNumber);
        if (logo) {
            formData.append('logo', logo);
        }

        try {
            const result = await updateProfile(formData);
            if (result.success) {
                toast.success("Profile updated successfully!");
                // Force a reload to update sidebar logo if needed, or rely on revalidatePath
                window.location.reload();
            } else {
                toast.error("Failed to update profile");
            }
        } catch (error) {
            toast.error("Something went wrong");
        } finally {
            setIsSaving(false);
        }
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <Toaster position="bottom-right" />

            <header className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-black rounded-xl">
                    <User className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Profile Settings</h1>
                    <p className="text-gray-500">Manage your contact details and support information.</p>
                </div>
            </header>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-lg font-semibold text-gray-900">Branding & Contact</h2>
                    <p className="text-sm text-gray-500">Customize how your dashboard and client pages look.</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {/* Logo Section */}
                    <div className="flex items-center gap-6 pb-6 border-b border-gray-100">
                        <div className="relative w-24 h-24 rounded-xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden bg-gray-50 group hover:border-gray-400 transition-colors">
                            {logoPreview ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={logoPreview} alt="Logo Preview" className="w-full h-full object-contain p-2" />
                            ) : (
                                <span className="text-gray-400 text-xs text-center px-1">No Logo</span>
                            )}
                            <input
                                type="file"
                                accept="image/png, image/jpeg, image/svg+xml"
                                onChange={handleLogoChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                title="Upload Logo"
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-sm font-medium text-gray-900">Company Logo</h3>
                            <p className="text-sm text-gray-500 mb-2">Upload your brand logo. Recommended size: 200x200px. Max 2MB.</p>
                            <label className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 cursor-pointer transition-all shadow-sm">
                                <User className="w-4 h-4" /> {/* Reuse User icon or Upload if available */}
                                Choose File
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleLogoChange}
                                    className="hidden"
                                />
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Full Name */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <User className="w-4 h-4 text-gray-400" />
                                Full Name (Admin)
                            </label>
                            <input
                                type="text"
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                placeholder="Admin Name"
                            />
                        </div>

                        {/* Support Email */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Mail className="w-4 h-4 text-gray-400" />
                                Support Email
                            </label>
                            <input
                                type="email"
                                value={supportEmail}
                                onChange={(e) => setSupportEmail(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                placeholder="support@example.com"
                            />
                        </div>

                        {/* WhatsApp Number */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <MessageCircle className="w-4 h-4 text-green-500" />
                                WhatsApp Number
                            </label>
                            <input
                                type="text"
                                value={whatsappNumber}
                                onChange={(e) => setWhatsappNumber(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                placeholder="+1 (555) 000-0000"
                            />
                            <p className="text-xs text-gray-400">Include country code for direct links.</p>
                        </div>

                        {/* Contact Number */}
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                                <Phone className="w-4 h-4 text-blue-500" />
                                Contact Number
                            </label>
                            <input
                                type="text"
                                value={contactNumber}
                                onChange={(e) => setContactNumber(e.target.value)}
                                className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:ring-2 focus:ring-black focus:border-transparent transition-all"
                                placeholder="+1 (555) 000-0000"
                            />
                        </div>
                    </div>

                    <div className="pt-6 border-t border-gray-100 flex justify-end">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex items-center gap-2 px-6 py-2.5 bg-black text-white rounded-xl hover:bg-gray-800 transition-all font-medium disabled:opacity-50"
                        >
                            {isSaving ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Saving...
                                </>
                            ) : (
                                <>
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
