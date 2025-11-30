"use client";

import React from 'react';
import { ArrowUpCircleIcon, ArrowDownCircleIcon } from '@heroicons/react/24/outline'; 

export default function Step3Crypto() {
  return (
    <div className="relative h-64 flex items-center justify-center rounded-xl overflow-hidden
                    bg-gradient-to-br from-blue-100 to-sky-200 shadow-inner">
      {/* Content for the "Your Crypto" screen */}
      <div className="relative z-10 flex gap-6">
        <button className="flex flex-col items-center gap-2 bg-white/70 backdrop-blur-sm px-6 py-4 rounded-xl text-blue-800 font-medium hover:bg-white/80 transition">
          <ArrowUpCircleIcon className="h-8 w-8 text-blue-600" />
          <span className="text-sm">Send</span>
        </button>
        <button className="flex flex-col items-center gap-2 bg-white/70 backdrop-blur-sm px-6 py-4 rounded-xl text-blue-800 font-medium hover:bg-white/80 transition">
          <ArrowDownCircleIcon className="h-8 w-8 text-blue-600" />
          <span className="text-sm">Receive</span>
        </button>
      </div>
    </div>
  );
}