import React from 'react';

export default function SecurityBadges() {
    const badges = [
        { label: "SSL Secure", color: "text-green-400", border: "border-green-500/30" },
        { label: "Proxy Shield", color: "text-blue-400", border: "border-blue-500/30" },
        { label: "Identity Verified", color: "text-purple-400", border: "border-purple-500/30" }
    ];

    return (
        <div className="flex flex-wrapjustify-center gap-4 py-8 bg-gray-950 border-t border-gray-900">
            {badges.map((badge, index) => (
                <div
                    key={index}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full border ${badge.border} bg-gray-900/50 backdrop-blur-sm`}
                >
                    <div className={`w-2 h-2 rounded-full ${badge.color.replace('text-', 'bg-')} animate-pulse`} />
                    <span className={`text-sm font-medium ${badge.color}`}>
                        {badge.label}
                    </span>
                </div>
            ))}
        </div>
    );
}
