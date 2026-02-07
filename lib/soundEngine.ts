export class SoundEngine {
    private static instance: SoundEngine;
    private audioContext: AudioContext | null = null;
    private isMuted: boolean = false;

    private sounds: Record<string, string> = {
        'payment': '/sounds/cash-register.mp3', // Need to ensure these files exist or use base64/CDN
        'ticket': '/sounds/pop.mp3',
        'security': '/sounds/alert.mp3',
        'success': '/sounds/success.mp3',
        'check': '/sounds/click.mp3'
    };

    private constructor() {
        if (typeof window !== 'undefined') {
            // Load mute state
            const savedState = localStorage.getItem('sound_muted');
            this.isMuted = savedState === 'true';

            // Init AudioContext on interaction
            window.addEventListener('click', () => this.resumeContext(), { once: true });
        }
    }

    public static getInstance(): SoundEngine {
        if (!SoundEngine.instance) {
            SoundEngine.instance = new SoundEngine();
        }
        return SoundEngine.instance;
    }

    private getContext(): AudioContext {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        }
        return this.audioContext;
    }

    public async resumeContext() {
        const ctx = this.getContext();
        if (ctx.state === 'suspended') {
            await ctx.resume();
        }
    }

    public toggleMute(state?: boolean) {
        this.isMuted = state !== undefined ? state : !this.isMuted;
        if (typeof window !== 'undefined') {
            localStorage.setItem('sound_muted', String(this.isMuted));
        }
        return this.isMuted;
    }

    public getMuteState() {
        return this.isMuted;
    }

    public async play(type: string) {
        if (this.isMuted) return;

        try {
            await this.resumeContext();

            // For robustness, prefer HTML5 Audio for simple effects if WebAudio is overkill or blocked complexity
            // But user asked for "new Audio()" logic specifically.
            const url = this.sounds[type];
            if (!url) return;

            const audio = new Audio(url);

            // Check visibility to handle background tab throttling
            if (document.hidden) {
                // Background play might be restricted
                console.log('Playing sound in background');
            }

            audio.volume = 1.0;

            const playPromise = audio.play();
            if (playPromise !== undefined) {
                playPromise.catch(error => {
                    console.error("Playback prevented:", error);
                    // Add interaction listener if blocked
                    if (error.name === 'NotAllowedError') {
                        // Queue or ignore?
                    }
                });
            }
        } catch (error) {
            console.error("Sound Engine Error:", error);
        }
    }
}
