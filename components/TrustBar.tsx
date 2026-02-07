'use client';
import React from 'react';

export default function TrustBar() {
    const techs = [
        { name: 'WORDPRESS', opacity: 'opacity-50' },
        { name: 'NEXT.JS', opacity: 'opacity-50' },
        { name: 'PHP', opacity: 'opacity-50' },
        { name: 'REACT', opacity: 'opacity-50' },
        { name: 'LARAVEL', opacity: 'opacity-50' },
        // Duplicate for seamless scroll
        { name: 'WORDPRESS', opacity: 'opacity-50' },
        { name: 'NEXT.JS', opacity: 'opacity-50' },
        { name: 'PHP', opacity: 'opacity-50' },
        { name: 'REACT', opacity: 'opacity-50' },
        { name: 'LARAVEL', opacity: 'opacity-50' },
    ];

    return (
        <div className="w-full bg-black border-y border-gray-900 py-6 overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-black to-transparent z-10" />
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-black to-transparent z-10" />

            <div className="flex animate-scroll whitespace-nowrap">
                <div className="flex items-center gap-16 px-8 animate-infinite-scroll">
                    {techs.map((tech, index) => (
                        <span
                            key={index}
                            className={`text-xl font-bold tracking-widest text-gray-600 ${tech.opacity} hover:opacity-100 hover:text-white transition-all duration-300 cursor-default`}
                        >
                            {tech.name}
                        </span>
                    ))}
                </div>
                <div className="flex items-center gap-16 px-8 animate-infinite-scroll" aria-hidden="true">
                    {techs.map((tech, index) => (
                        <span
                            key={`dup-${index}`}
                            className={`text-xl font-bold tracking-widest text-gray-600 ${tech.opacity} hover:opacity-100 hover:text-white transition-all duration-300 cursor-default`}
                        >
                            {tech.name}
                        </span>
                    ))}
                </div>
            </div>

            <style jsx>{`
        .animate-infinite-scroll {
          animation: scroll 20s linear infinite;
        }
        @keyframes scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-100%); }
        }
      `}</style>
        </div>
    );
}
