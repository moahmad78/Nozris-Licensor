import React from 'react';
import { UserPlus, Key, Code2, ShieldCheck } from 'lucide-react';

const steps = [
    {
        icon: UserPlus,
        title: "1. Sign Up",
        description: "Create your Licensr account in seconds."
    },
    {
        icon: Key,
        title: "2. Get Key",
        description: "Generate a unique license key for your project."
    },
    {
        icon: Code2,
        title: "3. Paste Script",
        description: "Add the one-line protection script to your code."
    },
    {
        icon: ShieldCheck,
        title: "4. Shield Active",
        description: "24/7 autonomous protection is now live."
    }
];

export default function Steps() {
    return (
        <section className="py-20 bg-black text-white border-t border-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Deployment in <span className="text-blue-500">4 Simple Steps</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        From vulnerable to invincible in less than 2 minutes.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <div key={index} className="relative group">
                                <div className="absolute inset-0 bg-blue-600/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                <div className="relative p-6 bg-gray-900/50 border border-gray-800 rounded-xl hover:border-blue-500/50 transition-colors duration-300 h-full flex flex-col items-center text-center">
                                    <div className="w-16 h-16 bg-blue-900/20 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                        <Icon className="w-8 h-8 text-blue-500" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                    <p className="text-gray-400">{step.description}</p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[2px] bg-gray-800 -translate-y-1/2" />
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
