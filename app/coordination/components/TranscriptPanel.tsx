'use client';

import React, { useState, useMemo } from 'react';
import type { Lesson } from '@/app/types';
import { useAudio } from '@/app/context/AudioContext';
import { motion } from 'framer-motion';
import { Search, Copy, Check, Headphones, Play, Pause } from 'lucide-react';

interface TranscriptPanelProps {
  lesson: Lesson;
}

interface Segment {
  text: string;
  start: number;
  end: number;
}

export default function TranscriptPanel({ lesson }: TranscriptPanelProps) {
  const { state, seek, pause, resume } = useAudio();
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  // Split transcript into sentences with mock timestamps relative to duration
  const segments = useMemo((): Segment[] => {
    if (!lesson.transcript) return [];
    
    // Split by sentence delimiters but keep them
    const sentences = lesson.transcript
      .split(/(?<=[.!?])\s+/)
      .filter((s) => s.trim().length > 0);

    const totalSeconds = state.duration || 120; // Default to 120s if duration not loaded yet
    const secPerSentence = totalSeconds / sentences.length;

    return sentences.map((sentence, idx) => ({
      text: sentence,
      start: idx * secPerSentence,
      end: (idx + 1) * secPerSentence,
    }));
  }, [lesson.transcript, state.duration]);

  const copyToClipboard = () => {
    if (!lesson.transcript) return;
    navigator.clipboard.writeText(lesson.transcript);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSentenceClick = (start: number) => {
    seek(start);
    // If not playing, start playing
    if (!state.isPlaying) {
      resume();
    }
  };

  // Filtered segments based on search query
  const filteredSegments = segments.filter((seg) =>
    seg.text.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!lesson.transcript) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center bg-gray-50 border border-gray-100 rounded-3xl min-h-[300px] select-none">
        <Headphones className="w-10 h-10 text-gray-300 mb-3" />
        <h3 className="text-sm font-bold text-gray-700">No Audio Transcript</h3>
        <p className="text-xs text-gray-400 mt-1 max-w-xs">
          This lesson doesn&apos;t have a synchronized audio recording or text transcript available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col bg-white border border-gray-100 rounded-3xl shadow-sm p-4 sm:p-6 gap-4 select-none">
      {/* Header with Search & Copy Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-gray-50 pb-4">
        <div>
          <h3 className="text-xs font-black text-gray-400 uppercase tracking-wider">
            Audio Read-Along
          </h3>
          <p className="text-[10px] text-gray-400 font-medium mt-0.5">
            Click any sentence to seek audio playback
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* Search bar */}
          <div className="relative flex-1 sm:w-48 xl:w-60">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search transcript..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-gray-150 rounded-xl bg-gray-50/50 focus:bg-white transition-all text-gray-700 outline-none"
            />
          </div>

          {/* Copy button */}
          <button
            onClick={copyToClipboard}
            className="p-2 border border-gray-150 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all cursor-pointer flex-shrink-0"
            title="Copy full text"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Transcript Text Body */}
      <div className="max-h-[350px] overflow-y-auto pr-1 scrollbar-thin space-y-4">
        {filteredSegments.length === 0 ? (
          <div className="text-center text-xs font-semibold text-gray-400 py-10">
            No matches found for &quot;{searchQuery}&quot;
          </div>
        ) : (
          <div className="text-gray-700 font-medium text-sm sm:text-base leading-relaxed space-y-3">
            {filteredSegments.map((seg, idx) => {
              // Check if audio's current time is within this segment's window
              const isActive =
                state.currentLessonId === lesson.id &&
                state.currentTime >= seg.start &&
                state.currentTime < seg.end;

              return (
                <span
                  key={idx}
                  onClick={() => handleSentenceClick(seg.start)}
                  className={`inline-block mr-1.5 p-1 rounded-md cursor-pointer transition-all duration-300 ${
                    isActive
                      ? 'bg-brand-500 text-white font-bold shadow-md shadow-brand-500/20 scale-[1.01]'
                      : 'hover:bg-brand-50 hover:text-brand-900'
                  }`}
                >
                  {seg.text}
                </span>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
