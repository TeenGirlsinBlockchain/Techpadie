'use client';

import React, { useState, useCallback } from 'react';
import type { Flashcard } from '@/app/types';
import Badge from '@/app/components/ui/Badge';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/solid';

interface FlashcardsPanelProps {
  flashcards: Flashcard[];
  onReviewComplete?: (count: number) => void;
}

const DIFFICULTY_COLORS: Record<string, string> = {
  easy: 'text-chalk-green',
  medium: 'text-chalk-yellow',
  hard: 'text-chalk-red',
};

export default function FlashcardsPanel({ flashcards, onReviewComplete }: FlashcardsPanelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [reviewed, setReviewed] = useState<Set<string>>(new Set());

  const card = flashcards[currentIndex];
  const total = flashcards.length;
  const reviewedCount = reviewed.size;

  const flip = useCallback(() => setIsFlipped((f) => !f), []);

  const goNext = useCallback(() => {
    // Mark current as reviewed
    setReviewed((prev) => {
      const next = new Set(prev);
      next.add(card.id);
      if (next.size === total) onReviewComplete?.(total);
      return next;
    });
    setIsFlipped(false);
    setCurrentIndex((i) => Math.min(i + 1, total - 1));
  }, [card, total, onReviewComplete]);

  const goPrev = useCallback(() => {
    setIsFlipped(false);
    setCurrentIndex((i) => Math.max(i - 1, 0));
  }, []);

  const restart = useCallback(() => {
    setCurrentIndex(0);
    setIsFlipped(false);
    setReviewed(new Set());
  }, []);

  if (flashcards.length === 0) {
    return (
      <div className="animate-fade-in bg-chalk-surface border border-chalk-border rounded-2xl p-8 text-center">
        <p className="font-chalk text-xl text-chalk-white-dim">No flashcards available for this lesson.</p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in space-y-5">
      {/* Progress bar */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-1.5 bg-chalk-surface rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-500 rounded-full transition-all duration-500"
            style={{ width: `${(reviewedCount / total) * 100}%` }}
          />
        </div>
        <span className="text-xs font-bold text-chalk-white-dim">
          {reviewedCount}/{total}
        </span>
      </div>

      {/* Flashcard */}
      <div className="flashcard-perspective" onClick={flip}>
        <div className={`flashcard-flip cursor-pointer ${isFlipped ? 'flipped' : ''}`}>
          {/* Front */}
          <div className="flashcard-face absolute inset-0 w-full">
            <div className="bg-chalk-board-deep border-2 border-chalk-border rounded-2xl p-6 sm:p-8 min-h-[260px] sm:min-h-[300px] flex flex-col items-center justify-center text-center relative">
              {/* Difficulty */}
              <span className={`absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wider ${DIFFICULTY_COLORS[card.difficulty]}`}>
                {card.difficulty}
              </span>
              <span className="text-[10px] font-bold text-chalk-white-dim/40 uppercase tracking-widest mb-4">Question</span>
              <p className="font-chalk text-xl sm:text-2xl text-chalk-white leading-snug chalk-glow max-w-md">
                {card.front}
              </p>
              <p className="text-[11px] text-chalk-white-dim/40 mt-6">Tap to reveal answer</p>
            </div>
          </div>

          {/* Back */}
          <div className="flashcard-face flashcard-back absolute inset-0 w-full">
            <div className="bg-chalk-board-light border-2 border-brand-500/30 rounded-2xl p-6 sm:p-8 min-h-[260px] sm:min-h-[300px] flex flex-col items-center justify-center text-center relative">
              <span className="text-[10px] font-bold text-brand-400 uppercase tracking-widest mb-4">Answer</span>
              <p className="text-base sm:text-lg text-chalk-white leading-relaxed max-w-md" style={{ fontFamily: 'var(--font-chalk-body)' }}>
                {card.back}
              </p>
              <p className="text-[11px] text-chalk-white-dim/40 mt-6">Tap to flip back</p>
            </div>
          </div>
        </div>

        {/* Invisible height holder so container doesn't collapse */}
        <div className="invisible">
          <div className="bg-transparent rounded-2xl p-6 sm:p-8 min-h-[260px] sm:min-h-[300px]" />
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={(e) => { e.stopPropagation(); goPrev(); }}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-chalk-white-dim hover:text-chalk-white hover:bg-chalk-surface-hover border border-chalk-border transition-all disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
        </button>

        <div className="flex items-center gap-2">
          <span className="font-chalk text-lg text-chalk-white">
            {currentIndex + 1} <span className="text-chalk-white-dim/50">/ {total}</span>
          </span>
          <button
            onClick={(e) => { e.stopPropagation(); restart(); }}
            className="p-2 rounded-lg text-chalk-white-dim hover:text-chalk-white hover:bg-chalk-surface-hover transition-all"
            title="Restart"
          >
            <ArrowPathIcon className="h-4 w-4" />
          </button>
        </div>

        <button
          onClick={(e) => { e.stopPropagation(); goNext(); }}
          disabled={currentIndex === total - 1}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-brand-500 text-white hover:bg-brand-600 shadow-lg shadow-brand-500/20 transition-all active:scale-95 disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <span className="hidden sm:inline">Next</span>
          <ArrowRightIcon className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}