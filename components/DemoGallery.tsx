'use client';

export function DemoGallery() {
    return (
        <section className="py-24 bg-black overflow-hidden relative">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                    <div>
                        <h2 className="text-4xl font-black text-white uppercase tracking-tighter mb-6">
                            Secure <span className="text-cyan-400">Assets</span>
                        </h2>
                        <p className="text-slate-400 text-lg">
                            Our proprietary asset protection layer prevents right-clicks, drag-and-drop, and unauthorized downloads.
                        </p>
                    </div>
                    <div
                        className="relative rounded-2xl overflow-hidden border border-cyan-500/30 group select-none shadow-[0_0_50px_rgba(0,242,255,0.1)]"
                        onContextMenu={(e) => e.preventDefault()}
                        onDragStart={(e) => e.preventDefault()}
                    >
                        {/* Watermark Overlay */}
                        <div className="absolute inset-0 z-20 flex items-center justify-center pointer-events-none mix-blend-overlay opacity-20">
                            <span className="text-6xl font-black uppercase -rotate-12 text-white">Protected by Licensr</span>
                        </div>

                        {/* Placeholder Content */}
                        <div className="aspect-video bg-slate-900 relative z-10 flex items-center justify-center">
                            <div className="grid grid-cols-3 gap-4 opacity-50">
                                {[...Array(9)].map((_, i) => (
                                    <div key={i} className="w-16 h-16 bg-cyan-500/20 rounded-lg animate-pulse" style={{ animationDelay: `${i * 100}ms` }} />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
