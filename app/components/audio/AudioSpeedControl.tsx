'use client';

import React, { useState } from 'react';
import { useAudio } from '@/app/context/AudioContext';

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export default function AudioSpeedControl() {
  const { state, setSpeed } = useAudio();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-2.5 py-1 text-xs font-bold text-text-secondary hover:text-brand-500 hover:bg-gray-50 rounded-lg border border-gray-200 transition-colors cursor-pointer"
      >
        {state.playbackSpeed}x
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
          <div className="absolute bottom-full left-0 mb-2 z-20 bg-white border border-gray-100 shadow-xl rounded-xl py-1 min-w-[70px] flex flex-col overflow-hidden">
            {SPEEDS.map((speed) => (
              <button
                key={speed}
                onClick={() => {
                  setSpeed(speed);
                  setIsOpen(false);
                }}
                className={`
                  px-3 py-1.5 text-xs text-left font-semibold cursor-pointer
                  ${state.playbackSpeed === speed
                    ? 'bg-brand-50 text-brand-600'
                    : 'text-text-primary hover:bg-gray-50'
                  }
                `}
              >
                {speed}x
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
