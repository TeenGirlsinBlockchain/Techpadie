"use client";

import React from 'react';
import { CheckCircleIcon, PlayCircleIcon } from '@heroicons/react/24/solid'; 

export default function Step2Knowledge() {
  return (
    <div className="relative h-64 flex items-center justify-center rounded-xl overflow-hidden
                    bg-gradient-to-br from-blue-100 to-sky-200 shadow-inner">
      {/* Content for the "More Knowledge" screen */}
      <div className="relative z-10 space-y-4">
        {/* Example items, replace with actual course cards/progress indicators */}
        <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-blue-800 font-medium">
          <CheckCircleIcon className="h-5 w-5 text-green-600" />
          <span>Introduction to blockchain technology</span>
        </div>
        <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-gray-800 font-medium">
          <PlayCircleIcon className="h-5 w-5 text-blue-500" />
          <span>Elijah chinedu&apos;s learning</span> {/* Example, use dynamic name */}
        </div>
        <div className="flex items-center gap-2 bg-white/70 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-green-800 font-medium">
          <CheckCircleIcon className="h-5 w-5 text-green-600" />
          <span>Completed</span>
        </div>
      </div>
    </div>
  );
}