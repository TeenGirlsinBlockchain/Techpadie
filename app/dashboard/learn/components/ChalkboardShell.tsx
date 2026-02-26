'use client';

import React from 'react';

interface ChalkboardShellProps {
  children: React.ReactNode;
  className?: string;
}

export default function ChalkboardShell({ children, className = '' }: ChalkboardShellProps) {
  return (
    <div className={`chalkboard min-h-screen relative ${className}`}>
      {/* Top wooden frame edge */}
      <div className="h-2 bg-gradient-to-b from-[#3D2B1F] to-[#2A1D14] shadow-md" />

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>

      {/* Bottom chalk tray */}
      <div className="chalkboard-tray h-10 sm:h-12 sticky bottom-0 z-20 flex items-center justify-center gap-4 px-6">
        {/* Decorative chalk pieces */}
        <div className="w-8 h-2 rounded-sm bg-chalk-white/20 rotate-[-3deg]" />
        <div className="w-6 h-2 rounded-sm bg-chalk-yellow/20 rotate-[2deg]" />
        <div className="w-10 h-2 rounded-sm bg-chalk-blue/15 rotate-[-1deg]" />
        <div className="w-5 h-2 rounded-sm bg-chalk-pink/15 rotate-[4deg]" />
      </div>
    </div>
  );
}