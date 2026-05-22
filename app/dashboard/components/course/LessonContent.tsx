'use client';

import React from 'react';
import type { Lesson } from '@/app/types';
import { CheckCircle2, ChevronRight, Check } from 'lucide-react';

interface LessonContentProps {
  lesson: Lesson;
  isCompleted: boolean;
  onMarkComplete: () => void;
  isLastLesson: boolean;
}

export default function LessonContent({
  lesson,
  isCompleted,
  onMarkComplete,
  isLastLesson,
}: LessonContentProps) {
  return (
    <div className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm">
      {/* Meta info */}
      <div className="flex items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">
        <span>Lesson {lesson.order !== undefined ? lesson.order + 1 : ''}</span>
        <span>•</span>
        <span>{lesson.duration || '15 min'}</span>
      </div>

      {/* Lesson Title */}
      <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight mb-6">
        {lesson.title}
      </h2>

      {/* Content body */}
      <div className="prose prose-brand max-w-none text-gray-600 font-medium text-sm md:text-base leading-relaxed space-y-4 mb-8">
        {lesson.content.split('\n\n').map((paragraph, idx) => (
          <p key={idx}>{paragraph}</p>
        ))}
      </div>

      {/* Bottom Actions */}
      <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          {isCompleted ? (
            <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm bg-emerald-50 px-3 py-1.5 rounded-xl">
              <Check className="w-4.5 h-4.5" />
              Lesson Completed
            </div>
          ) : (
            <p className="text-xs font-semibold text-gray-400">
              Complete this lesson to earn experience points (XP)
            </p>
          )}
        </div>

        <button
          onClick={onMarkComplete}
          className={`w-full sm:w-auto px-5 py-3 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98
            ${isCompleted 
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-600' 
              : 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-500/20'
            }
          `}
        >
          {isCompleted ? (
            <>
              {isLastLesson ? 'Finish Course' : 'Next Lesson'}
              <ChevronRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4.5 h-4.5" />
              Mark as Completed
            </>
          )}
        </button>
      </div>
    </div>
  );
}
