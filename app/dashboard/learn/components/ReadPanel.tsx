'use client';

import React from 'react';
import type { Lesson } from '@/app/types';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface ReadPanelProps {
  lesson: Lesson;
  isCompleted: boolean;
  onMarkComplete: () => void;
  isLastLesson: boolean;
}

export default function ReadPanel({
  lesson,
  isCompleted,
  onMarkComplete,
  isLastLesson,
}: ReadPanelProps) {
  return (
    <div className="animate-fade-in">
      {/* Lesson content — chalk styled */}
      <div
        className="chalk-content"
        dangerouslySetInnerHTML={{ __html: lesson.content }}
      />

      {/* Chalk line divider */}
      <div className="chalk-line my-8" />

      {/* Completion Card */}
      <div className="bg-chalk-surface border border-chalk-border rounded-2xl p-6 sm:p-8 text-center">
        <div className={`
          w-14 h-14 mx-auto rounded-full flex items-center justify-center mb-4 transition-colors
          ${isCompleted ? 'bg-chalk-green/20' : 'bg-chalk-surface'}
        `}>
          <CheckCircleIcon className={`w-7 h-7 ${isCompleted ? 'text-chalk-green' : 'text-chalk-white-dim/30'}`} />
        </div>

        <h3 className="font-chalk text-xl text-chalk-white mb-1.5">
          {isCompleted ? 'Lesson Complete! ✓' : 'Finished reading?'}
        </h3>
        <p className="text-chalk-white-dim text-sm mb-6 max-w-sm mx-auto" style={{ fontFamily: 'var(--font-chalk-body)' }}>
          {isCompleted
            ? 'Great work! Move on when you\'re ready.'
            : 'Mark this lesson as done to track your progress.'
          }
        </p>

        <button
          onClick={onMarkComplete}
          disabled={isCompleted && isLastLesson}
          className={`
            px-6 py-3 rounded-xl text-sm font-bold transition-all active:scale-95
            ${isCompleted
              ? 'bg-chalk-surface-hover text-chalk-white-dim border border-chalk-border'
              : 'bg-brand-500 text-white shadow-lg shadow-brand-500/25 hover:bg-brand-600'
            }
            ${isCompleted && isLastLesson ? 'opacity-50 cursor-not-allowed' : ''}
          `}
        >
          {isCompleted
            ? isLastLesson ? 'Course Finished!' : 'Already Complete ✓'
            : 'Mark Complete & Continue →'
          }
        </button>
      </div>
    </div>
  );
}