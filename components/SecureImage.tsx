"use client";

import React from 'react';
import Image, { ImageProps } from 'next/image';

interface SecureImageProps extends Omit<ImageProps, 'src'> {
    src: string;
    containerClassName?: string;
}

export default function SecureImage({ src, alt, className, containerClassName, ...props }: SecureImageProps) {
    return (
        <div
            className={`relative inline-block overflow-hidden select-none group ${containerClassName || ''}`}
            onContextMenu={(e) => e.preventDefault()}
        >
            {/* The Image */}
            <div className="relative select-none pointer-events-none">
                <Image
                    src={src}
                    alt={alt}
                    className={`select-none drag-none ${className || ''}`}
                    onDragStart={(e) => e.preventDefault()}
                    {...props}
                />
            </div>

            {/* Transparent Overlay to Intercept Clicks/Saves */}
            <div
                className="absolute inset-0 bg-transparent z-10"
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
            />

            {/* Visual Dynamic Watermark (Client Side Backup) */}
            <div className="absolute bottom-2 right-2 z-20 opacity-30 pointer-events-none select-none">
                <span className="text-[10px] font-black text-white/50 bg-black/50 px-1 rounded uppercase tracking-widest backdrop-blur-[1px]">
                    Protected by Licensr
                </span>
            </div>
        </div>
    );
}
