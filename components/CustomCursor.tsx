'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Crosshair, MousePointer2 } from 'lucide-react';

export default function CustomCursor() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [cursorVariant, setCursorVariant] = useState('default');

    useEffect(() => {
        const mouseMove = (e: MouseEvent) => {
            setMousePosition({
                x: e.clientX,
                y: e.clientY
            });

            // Check for data-cursor attribute on the target or its parents
            const target = e.target as HTMLElement;

            // Default state logic
            let newVariant = 'default';

            // Check for specific cursor triggers
            const cursorElement = target.closest('[data-cursor]');
            if (cursorElement) {
                const cursorType = cursorElement.getAttribute('data-cursor');
                if (cursorType) newVariant = cursorType;
            } else {
                // Fallback for general interactive elements if not explicitly tagged
                const isInteractive = target.closest('a, button, input, select, textarea, [role="button"]');
                if (isInteractive) newVariant = 'pointer';
            }

            setCursorVariant(newVariant);
        };

        window.addEventListener('mousemove', mouseMove);
        return () => {
            window.removeEventListener('mousemove', mouseMove);
        };
    }, []);

    const variants = {
        default: {
            x: mousePosition.x - 8,
            y: mousePosition.y - 8,
            height: 16,
            width: 16,
            backgroundColor: 'rgba(59, 130, 246, 1)', // Blue-500
            border: '0px solid transparent',
            transition: {
                type: "spring",
                mass: 0.1, // Lightweight
                stiffness: 1000, // Very snappy
                damping: 50 // No bounce
            }
        },
        pointer: {
            x: mousePosition.x - 32,
            y: mousePosition.y - 32,
            height: 64,
            width: 64,
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.3)',
            transition: {
                type: "spring",
                mass: 0.3,
                stiffness: 800,
                damping: 30
            }
        },
        security: {
            x: mousePosition.x - 24,
            y: mousePosition.y - 24,
            height: 48,
            width: 48,
            backgroundColor: 'rgba(34, 197, 94, 0.1)', // Green
            border: '1px solid rgba(34, 197, 94, 0.5)',
            transition: {
                type: "spring",
                mass: 0.3,
                stiffness: 800,
                damping: 30
            }
        },
        threat: {
            x: mousePosition.x - 24,
            y: mousePosition.y - 24,
            height: 48,
            width: 48,
            backgroundColor: 'rgba(239, 68, 68, 0.1)', // Red
            border: '1px solid rgba(239, 68, 68, 0.5)',
            transition: {
                type: "spring",
                mass: 0.3,
                stiffness: 800,
                damping: 30
            }
        }
    };

    return (
        <>
            <motion.div
                className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] flex items-center justify-center backdrop-blur-[1px]"
                animate={cursorVariant}
                variants={variants as any}
            >
                {cursorVariant === 'security' && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                    >
                        <Shield size={20} className="text-green-500" />
                    </motion.div>
                )}

                {cursorVariant === 'threat' && (
                    <motion.div
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                    >
                        <Crosshair size={24} className="text-red-500 animate-[spin_3s_linear_infinite]" />
                    </motion.div>
                )}

                {/* Optional: Add a small inner dot for precision in pointer mode if desired */}
                {cursorVariant === 'pointer' && (
                    <div className="w-1 h-1 bg-white rounded-full opacity-50" />
                )}
            </motion.div>
        </>
    );
}
