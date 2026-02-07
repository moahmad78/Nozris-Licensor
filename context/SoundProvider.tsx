'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { SoundEngine } from '@/lib/soundEngine';
import { pusherClient } from '@/lib/pusher';

interface SoundContextType {
    playAlert: (type: string) => void;
    toggleMute: () => void;
    isMuted: boolean;
}

const SoundContext = createContext<SoundContextType>({
    playAlert: () => { },
    toggleMute: () => { },
    isMuted: false
});

export const useSound = () => useContext(SoundContext);

export function SoundProvider({ children }: { children: React.ReactNode }) {
    const [isMuted, setIsMuted] = useState(false);

    useEffect(() => {
        const engine = SoundEngine.getInstance();
        setIsMuted(engine.getMuteState());

        if (pusherClient) {
            const channel = pusherClient.subscribe('admin-notifications');

            channel.bind('new-payment', () => {
                engine.play('payment');
            });

            channel.bind('new-ticket', () => {
                engine.play('ticket');
            });

            channel.bind('security-alert', () => {
                engine.play('security');
            });

            return () => {
                pusherClient.unsubscribe('admin-notifications');
            };
        }
    }, []);

    const playAlert = (type: string) => {
        SoundEngine.getInstance().play(type);
    };

    const toggleMute = () => {
        const engine = SoundEngine.getInstance();
        const newState = engine.toggleMute();
        setIsMuted(newState);
    };

    return (
        <SoundContext.Provider value={{ playAlert, toggleMute, isMuted }}>
            {children}
            <div style={{ display: 'none' }}>
                <audio id="global-hidden-audio" x-ref="sound" />
            </div>
        </SoundContext.Provider>
    );
}
