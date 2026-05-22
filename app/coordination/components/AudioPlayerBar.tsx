'use client';

import React from 'react';
import { useAudio } from '@/app/context/AudioContext';
import { Play, Pause, RotateCcw, RotateCw, Headphones } from 'lucide-react';
import AudioSpeedControl from '@/app/components/audio/AudioSpeedControl';

export default function AudioPlayerBar() {
  const { state, pause, resume, seek } = useAudio();

  if (!state.isVisible) {
    return (
      <div className="flex items-center gap-2 p-4 bg-gray-50 border border-gray-100 rounded-2xl text-gray-400 justify-center text-xs font-bold select-none">
        <Headphones className="w-4 h-4" />
        Select a lesson to start listening
      </div>
    );
  }

  const formatTime = (timeInSecs: number) => {
    if (isNaN(timeInSecs)) return '0:00';
    const mins = Math.floor(timeInSecs / 60);
    const secs = Math.floor(timeInSecs % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const skipForward = () => seek(Math.min(state.currentTime + 10, state.duration));
  const skipBackward = () => seek(Math.max(state.currentTime - 10, 0));

  return (
    <div className="flex items-center justify-between gap-4 p-4 bg-white border border-gray-100 shadow-sm rounded-2xl select-none">
      <div className="flex items-center gap-3">
        <button
          onClick={state.isPlaying ? pause : resume}
          className="w-10 h-10 rounded-full bg-brand-500 hover:bg-brand-600 flex items-center justify-center text-white shadow-sm transition-transform active:scale-95 cursor-pointer"
        >
          {state.isPlaying ? <Pause className="w-4.5 h-4.5 fill-current" /> : <Play className="w-4.5 h-4.5 fill-current translate-x-0.5" />}
        </button>

        <div className="flex items-center gap-2">
          <button onClick={skipBackward} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
            <RotateCcw className="w-4.5 h-4.5" />
          </button>
          <button onClick={skipForward} className="p-1 text-gray-400 hover:text-gray-600 cursor-pointer">
            <RotateCw className="w-4.5 h-4.5" />
          </button>
        </div>
      </div>

      {/* Progress Track */}
      <div className="flex-1 max-w-md hidden sm:flex items-center gap-3">
        <span className="text-[10px] font-bold text-gray-400 min-w-[30px]">{formatTime(state.currentTime)}</span>
        <div className="flex-1 h-1.5 bg-gray-100 rounded-full relative overflow-hidden">
          <div 
            className="h-full bg-brand-500 rounded-full transition-all duration-150"
            style={{ width: `${state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0}%` }}
          />
        </div>
        <span className="text-[10px] font-bold text-gray-400 min-w-[30px]">{formatTime(state.duration)}</span>
      </div>

      <AudioSpeedControl />
    </div>
  );
}
