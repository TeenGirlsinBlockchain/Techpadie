'use client';

import React from 'react';
import type { Lesson } from '@/app/types';
import { motion } from 'framer-motion';
import { CheckCircle2, ChevronRight, BookOpen, AlertCircle, Award } from 'lucide-react';

interface LessonContentProps {
  lesson: Lesson;
  isCompleted: boolean;
  onMarkComplete: () => void;
  isLastLesson: boolean;
  xpReward?: number;
}

export default function LessonContent({
  lesson,
  isCompleted,
  onMarkComplete,
  isLastLesson,
  xpReward = 50,
}: LessonContentProps) {
  const isHtml = /<[a-z][\s\S]*>/i.test(lesson.content);

  return (
    <motion.div
      key={lesson.id}
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      className="bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col gap-6 select-text"
    >
      {/* Meta Badge strip */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-50 pb-4">
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase font-black text-brand-600 bg-brand-50 border border-brand-100/50 px-2.5 py-1 rounded-md">
            Lesson {lesson.order !== undefined ? lesson.order + 1 : ''}
          </span>
          <span className="text-[10px] uppercase font-black text-gray-400 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-md">
            {lesson.duration || '10 min'}
          </span>
        </div>

        {xpReward && (
          <div className="flex items-center gap-1.5 text-xs font-bold text-gamification-xp bg-purple-50/50 px-3 py-1 rounded-full border border-purple-100/30">
            <Award className="w-3.5 h-3.5 text-gamification-xp" />
            <span>+{xpReward} XP Reward</span>
          </div>
        )}
      </div>

      {/* Lesson Body */}
      <div className="min-h-[250px]">
        {isHtml ? (
          <div
            className="prose prose-brand max-w-none text-gray-600 font-medium text-sm sm:text-base leading-relaxed space-y-4"
            dangerouslySetInnerHTML={{ __html: lesson.content }}
          />
        ) : (
          <div className="prose prose-brand max-w-none text-gray-600 font-medium text-sm sm:text-base leading-relaxed space-y-4">
            {lesson.content.split('\n\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed font-normal">
                {paragraph}
              </p>
            ))}
          </div>
        )}
      </div>

      {/* Action complete prompt */}
      <div className="mt-6 border-t border-gray-50 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-xl ${isCompleted ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
            <AlertCircle className="w-5 h-5" />
          </div>
          <div className="text-left">
            <h4 className="text-xs font-bold text-gray-900">
              {isCompleted ? 'Completed!' : 'Ready to move forward?'}
            </h4>
            <p className="text-[11px] font-medium text-gray-400 mt-0.5">
              {isCompleted ? 'You earned XP for completing this.' : 'Complete the lesson to log your progress.'}
            </p>
          </div>
        </div>

        <button
          onClick={onMarkComplete}
          className={`w-full sm:w-auto px-6 py-3 rounded-xl font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center gap-2 active:scale-95 cursor-pointer ${
            isCompleted
              ? 'bg-gray-100 hover:bg-gray-200 text-gray-600 border border-gray-200/40'
              : 'bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/25'
          }`}
        >
          {isCompleted ? (
            <>
              <span>{isLastLesson ? 'Finish Course' : 'Next Lesson'}</span>
              <ChevronRight className="w-4 h-4" />
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Mark Complete & Continue</span>
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
}
