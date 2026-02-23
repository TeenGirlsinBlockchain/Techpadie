'use client';

import React, { useState } from 'react';
import { useTTS } from '@/app/lib/hooks/useTTS';
import type { Lesson } from '@/app/types';
import { PLAYBACK_SPEEDS } from '@/app/lib/constants';
import {
  PlayIcon,
  PauseIcon,
  StopIcon,
  SpeakerWaveIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/24/solid';

interface ListenPanelProps {
  lesson: Lesson;
  courseTitle: string;
}

export default function ListenPanel({ lesson, courseTitle }: ListenPanelProps) {
  const tts = useTTS();
  const [showTranscript, setShowTranscript] = useState(false);

  // Strip HTML for transcript display
  const plainText = typeof document !== 'undefined'
    ? (() => { const d = document.createElement('div'); d.innerHTML = lesson.content; return d.textContent || ''; })()
    : lesson.transcript || '';

  const handlePlayPause = () => {
    if (tts.isSpeaking && !tts.isPaused) {
      tts.pause();
    } else if (tts.isPaused) {
      tts.resume();
    } else {
      tts.speak(lesson.content);
    }
  };

  if (!tts.isSupported) {
    return (
      <div className="animate-fade-in bg-chalk-surface border border-chalk-border rounded-2xl p-8 text-center">
        <SpeakerWaveIcon className="h-10 w-10 text-chalk-white-dim/30 mx-auto mb-3" />
        <h3 className="font-chalk text-xl text-chalk-white mb-2">Audio Unavailable</h3>
        <p className="text-chalk-white-dim text-sm" style={{ fontFamily: 'var(--font-chalk-body)' }}>
          Your browser doesn&apos;t support text-to-speech. Try Chrome or Edge for the best experience.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-5">
      {/* Main Player Card */}
      <div className="bg-chalk-surface border border-chalk-border rounded-2xl p-5 sm:p-6">
        {/* Track info */}
        <div className="flex items-start gap-4 mb-6">
          <div className="h-14 w-14 sm:h-16 sm:w-16 rounded-xl bg-brand-500/20 flex items-center justify-center flex-shrink-0">
            <SpeakerWaveIcon className="h-7 w-7 text-brand-400" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-chalk text-xl text-chalk-white leading-tight truncate">
              {lesson.title}
            </h3>
            <p className="text-chalk-white-dim text-sm mt-0.5" style={{ fontFamily: 'var(--font-chalk-body)' }}>
              {courseTitle}
            </p>
            <p className="text-chalk-white-dim/60 text-xs mt-1">
              {lesson.duration} · Powered by browser TTS
            </p>
          </div>
        </div>

        {/* Waveform visualization (decorative) */}
        <div className="flex items-end justify-center gap-[3px] h-12 mb-6 px-4">
          {Array.from({ length: 40 }, (_, i) => {
            const height = tts.isSpeaking && !tts.isPaused
              ? 8 + Math.sin(Date.now() / 200 + i * 0.5) * 20 + Math.random() * 12
              : 4 + Math.sin(i * 0.3) * 6;
            return (
              <div
                key={i}
                className={`w-1 rounded-full transition-all duration-150 ${
                  tts.isSpeaking && !tts.isPaused ? 'bg-brand-400' : 'bg-chalk-white-dim/20'
                }`}
                style={{ height: `${Math.max(3, height)}px` }}
              />
            );
          })}
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4">
          {/* Stop */}
          <button
            onClick={tts.stop}
            disabled={!tts.isSpeaking && !tts.isPaused}
            className="p-2.5 rounded-full text-chalk-white-dim hover:text-chalk-white hover:bg-chalk-surface-hover transition-all disabled:opacity-30"
          >
            <StopIcon className="h-5 w-5" />
          </button>

          {/* Play / Pause */}
          <button
            onClick={handlePlayPause}
            className="h-14 w-14 rounded-full bg-brand-500 text-white flex items-center justify-center shadow-lg shadow-brand-500/30 hover:bg-brand-600 transition-all active:scale-95"
          >
            {tts.isSpeaking && !tts.isPaused ? (
              <PauseIcon className="h-6 w-6" />
            ) : (
              <PlayIcon className="h-6 w-6 ml-0.5" />
            )}
          </button>

          {/* Speed selector */}
          <div className="relative group">
            <button className="px-3 py-1.5 rounded-lg bg-chalk-surface-hover text-chalk-white text-xs font-bold border border-chalk-border hover:border-brand-500 transition-all">
              {tts.rate}×
            </button>
            <div className="absolute bottom-full mb-2 right-0 hidden group-hover:flex flex-col bg-chalk-board-deep border border-chalk-border rounded-lg shadow-xl overflow-hidden z-30">
              {PLAYBACK_SPEEDS.map((speed) => (
                <button
                  key={speed}
                  onClick={() => tts.setRate(speed)}
                  className={`px-4 py-2 text-xs font-bold whitespace-nowrap transition-colors
                    ${tts.rate === speed
                      ? 'bg-brand-500 text-white'
                      : 'text-chalk-white-dim hover:bg-chalk-surface-hover hover:text-chalk-white'
                    }
                  `}
                >
                  {speed}×
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Status */}
        <p className="text-center text-[11px] text-chalk-white-dim/50 mt-4 font-medium uppercase tracking-wider">
          {tts.isSpeaking && !tts.isPaused ? '● Speaking...' : tts.isPaused ? '❚❚ Paused' : 'Ready to play'}
        </p>
      </div>

      {/* Transcript Toggle */}
      <button
        onClick={() => setShowTranscript(!showTranscript)}
        className="w-full flex items-center justify-between px-5 py-3 bg-chalk-surface border border-chalk-border rounded-xl text-chalk-white-dim hover:text-chalk-white transition-colors"
      >
        <span className="text-sm font-bold">Transcript</span>
        {showTranscript ? <ChevronUpIcon className="h-4 w-4" /> : <ChevronDownIcon className="h-4 w-4" />}
      </button>

      {showTranscript && (
        <div className="bg-chalk-surface border border-chalk-border rounded-2xl p-5 animate-fade-in">
          <p className="text-chalk-white-dim text-sm leading-relaxed whitespace-pre-line" style={{ fontFamily: 'var(--font-chalk-body)' }}>
            {plainText || lesson.transcript || 'No transcript available.'}
          </p>
        </div>
      )}
    </div>
  );
}