'use client';

import React, { useState } from 'react';
import { useAudio } from '@/app/context/AudioContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  RotateCw, 
  Volume2, 
  VolumeX, 
  Minimize2, 
  Maximize2, 
  Music,
  X
} from 'lucide-react';
import AudioSpeedControl from './AudioSpeedControl';

export default function AudioPlayer() {
  const { state, pause, resume, seek, stop, toggleMinimize } = useAudio();
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const { audioRef } = useAudio();

  if (!state.isVisible) return null;

  const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    seek(parseFloat(e.target.value));
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      const nextMute = !isMuted;
      setIsMuted(nextMute);
      audioRef.current.muted = nextMute;
    }
  };

  const skipForward = () => {
    const nextTime = Math.min(state.currentTime + 10, state.duration);
    seek(nextTime);
  };

  const skipBackward = () => {
    const nextTime = Math.max(state.currentTime - 10, 0);
    seek(nextTime);
  };

  const formatTime = (timeInSecs: number) => {
    if (isNaN(timeInSecs)) return '0:00';
    const mins = Math.floor(timeInSecs / 60);
    const secs = Math.floor(timeInSecs % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // If minimized, we render a smaller version, or let AudioMiniPlayer handle it.
  // Actually, we'll keep the maximized main view here and let isMinimized check hide it
  // if another component is handling the mini view, or handle it natively.
  // The layout has AudioMiniPlayer, so if state.isMinimized is true, we hide or render the mini player.
  if (state.isMinimized) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-6 right-6 z-50 w-full max-w-md bg-white/90 backdrop-blur-xl border border-gray-100/80 shadow-2xl rounded-2xl p-5"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center flex-shrink-0 text-brand-600">
              <Music className="w-5 h-5 animate-pulse" />
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-bold text-gray-900 truncate">
                {state.lessonTitle || 'Untitled Lesson'}
              </h4>
              <p className="text-xs text-gray-500 truncate">
                {state.courseTitle || 'Blockchain Course'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleMinimize}
              className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
              title="Minimize"
            >
              <Minimize2 className="w-4 h-4" />
            </button>
            <button
              onClick={stop}
              className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors cursor-pointer"
              title="Close Player"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Timeline Slider */}
        <div className="mb-4">
          <div className="relative group">
            <input
              type="range"
              min="0"
              max={state.duration || 100}
              value={state.currentTime}
              onChange={handleSeekChange}
              className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-500 outline-none"
              style={{
                background: `linear-gradient(to right, var(--color-brand-500, #f43f5e) 0%, var(--color-brand-500, #f43f5e) ${
                  state.duration ? (state.currentTime / state.duration) * 100 : 0
                }%, #f3f4f6 ${
                  state.duration ? (state.currentTime / state.duration) * 100 : 0
                }%, #f3f4f6 100%)`
              }}
            />
          </div>
          <div className="flex justify-between text-[11px] font-semibold text-gray-400 mt-1.5">
            <span>{formatTime(state.currentTime)}</span>
            <span>{formatTime(state.duration)}</span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between">
          {/* Speed Selector */}
          <AudioSpeedControl />

          {/* Core Playback Buttons */}
          <div className="flex items-center gap-4">
            <button
              onClick={skipBackward}
              className="p-2 text-gray-500 hover:text-brand-500 transition-colors cursor-pointer"
              title="Skip backward 10s"
            >
              <RotateCcw className="w-5 h-5" />
            </button>
            
            <button
              onClick={state.isPlaying ? pause : resume}
              className="w-12 h-12 rounded-full bg-brand-500 hover:bg-brand-600 flex items-center justify-center text-white shadow-lg shadow-brand-500/25 transition-transform active:scale-95 hover:scale-105 cursor-pointer"
            >
              {state.isPlaying ? (
                <Pause className="w-5 h-5 fill-current" />
              ) : (
                <Play className="w-5 h-5 fill-current translate-x-0.5" />
              )}
            </button>

            <button
              onClick={skipForward}
              className="p-2 text-gray-500 hover:text-brand-500 transition-colors cursor-pointer"
              title="Skip forward 10s"
            >
              <RotateCw className="w-5 h-5" />
            </button>
          </div>

          {/* Volume Control */}
          <div className="flex items-center gap-2 group/volume w-[100px]">
            <button
              onClick={toggleMute}
              className="p-1.5 text-gray-500 hover:text-brand-500 transition-colors cursor-pointer"
            >
              {isMuted || volume === 0 ? (
                <VolumeX className="w-4 h-4" />
              ) : (
                <Volume2 className="w-4 h-4" />
              )}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={handleVolumeChange}
              className="w-full h-1 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-brand-500 outline-none"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
