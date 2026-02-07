'use client';

import { useSound } from '@/context/SoundProvider';
import { Volume2, VolumeX } from 'lucide-react';

export function SoundToggle() {
    const { isMuted, toggleMute } = useSound();

    return (
        <button
            onClick={toggleMute}
            className={`p-2 rounded-full transition-all group ${isMuted ? 'text-gray-400 hover:text-gray-600' : 'text-blue-600 hover:text-blue-700 bg-blue-50'}`}
            title={isMuted ? "Unmute Alerts" : "Mute Alerts"}
        >
            {isMuted ? (
                <VolumeX className="w-5 h-5" />
            ) : (
                <Volume2 className="w-5 h-5" />
            )}
        </button>
    );
}
