'use client';

import React from 'react';
import { useAudio } from '@/app/context/AudioContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, Maximize2, X, Music } from 'lucide-react';

export default function AudioMiniPlayer() {
  const { state, pause, resume, stop, toggleMinimize } = useAudio();

  if (!state.isVisible || !state.isMinimized) return null;

  const progressPercent = state.duration > 0 ? (state.currentTime / state.duration) * 100 : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        className="fixed bottom-6 right-6 z-50 w-80 bg-white/95 backdrop-blur-md border border-gray-100 shadow-xl rounded-xl overflow-hidden flex flex-col"
      >
        {/* Progress Bar top indicator */}
        <div className="w-full h-1 bg-gray-50">
          <div 
            className="h-full bg-brand-500 transition-all duration-200" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Content */}
        <div className="px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-brand-500/10 text-brand-600 flex items-center justify-center flex-shrink-0">
              <Music className="w-4 h-4" />
            </div>
            <div className="overflow-hidden">
              <h5 className="text-xs font-bold text-gray-900 truncate">
                {state.lessonTitle || 'Untitled Lesson'}
              </h5>
            </div>
          </div>

          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={state.isPlaying ? pause : resume}
              className="p-1.5 text-brand-600 hover:bg-brand-50 rounded-lg transition-colors cursor-pointer"
            >
              {state.isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={toggleMinimize}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              title="Maximize"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={stop}
              className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
