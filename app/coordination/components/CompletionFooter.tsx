'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, CheckCircle2, Award } from 'lucide-react';

interface CompletionFooterProps {
  isCompleted: boolean;
  onMarkComplete: () => void;
  onPreviousLesson?: () => void;
  onNextLesson?: () => void;
  hasPrevious: boolean;
  hasNext: boolean;
  xpReward?: number;
}

export default function CompletionFooter({
  isCompleted,
  onMarkComplete,
  onPreviousLesson,
  onNextLesson,
  hasPrevious,
  hasNext,
  xpReward = 50,
}: CompletionFooterProps) {
  return (
    <motion.div
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="sticky bottom-6 left-0 right-0 z-20 w-full px-4 sm:px-6 select-none mt-8"
    >
      <div className="max-w-4xl mx-auto bg-white/90 backdrop-blur-md border border-gray-150/70 p-3 sm:p-4 rounded-2xl shadow-xl flex items-center justify-between gap-4">
        {/* Previous Lesson Action */}
        <button
          onClick={onPreviousLesson}
          disabled={!hasPrevious}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer border ${
            hasPrevious
              ? 'text-gray-600 hover:text-gray-900 bg-white border-gray-150 hover:bg-gray-50'
              : 'text-gray-300 border-gray-100 bg-gray-50/50 cursor-not-allowed'
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev Lesson</span>
        </button>

        {/* Central Progression Hub */}
        <div className="flex items-center gap-3">
          {/* Mark Complete CTA */}
          <button
            onClick={onMarkComplete}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 flex items-center gap-2 cursor-pointer ${
              isCompleted
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-100 hover:bg-emerald-100/50'
                : 'bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/20'
            }`}
          >
            {isCompleted ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-50" />
                <span>Completed ✓</span>
              </>
            ) : (
              <>
                <Award className="w-4 h-4 text-white" />
                <span>Complete (+{xpReward} XP)</span>
              </>
            )}
          </button>
        </div>

        {/* Next Lesson Action */}
        <button
          onClick={onNextLesson}
          disabled={!hasNext}
          className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all active:scale-95 cursor-pointer border ${
            hasNext
              ? 'text-gray-600 hover:text-gray-900 bg-white border-gray-150 hover:bg-gray-50'
              : 'text-gray-300 border-gray-100 bg-gray-50/50 cursor-not-allowed'
          }`}
        >
          <span className="hidden sm:inline">Next Lesson</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </motion.div>
  );
}
