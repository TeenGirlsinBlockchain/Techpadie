'use client';

import React from 'react';
import { ArrowLeft, BookOpen, Clock, Menu, X, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

interface LessonHeaderProps {
  courseTitle: string;
  lessonTitle: string;
  duration?: string;
  progressPercentage?: number;
  onBackClick?: () => void;
  onToggleSyllabus?: () => void;
  isSyllabusOpen?: boolean;
  xpPoints?: number;
}

export default function LessonHeader({
  courseTitle,
  lessonTitle,
  duration,
  progressPercentage = 0,
  onBackClick,
  onToggleSyllabus,
  isSyllabusOpen = false,
  xpPoints,
}: LessonHeaderProps) {
  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 sm:px-6 flex items-center justify-between gap-4 select-none"
    >
      <div className="flex items-center gap-3 min-w-0">
        {onBackClick && (
          <button
            onClick={onBackClick}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-all cursor-pointer flex-shrink-0 active:scale-95"
            title="Back to Courses"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-600 tracking-wide uppercase">
            <BookOpen className="w-3.5 h-3.5" />
            <span className="truncate">{courseTitle}</span>
          </div>
          <h1 className="text-sm sm:text-base font-bold text-gray-900 truncate mt-0.5">
            {lessonTitle}
          </h1>
        </div>
      </div>

      {/* Progress & Info */}
      <div className="flex items-center gap-4 flex-shrink-0">
        {/* Progress Bar (hidden on mobile) */}
        {progressPercentage !== undefined && (
          <div className="hidden md:flex flex-col items-end gap-1 w-32 xl:w-44">
            <span className="text-[10px] font-extrabold text-gray-400">
              COURSE PROGRESS: {Math.round(progressPercentage)}%
            </span>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all duration-300"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          </div>
        )}

        {/* Duration (hidden on tiny screens) */}
        {duration && (
          <div className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-50 px-2.5 py-1.5 rounded-lg border border-gray-100">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>{duration}</span>
          </div>
        )}

        {/* XP Points */}
        {xpPoints !== undefined && xpPoints > 0 && (
          <div className="flex items-center gap-1 text-xs font-bold text-gamification-xp bg-purple-50 px-2.5 py-1.5 rounded-lg border border-purple-100">
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>{xpPoints} XP</span>
          </div>
        )}

        {/* Syllabus Toggle button for sidebar */}
        {onToggleSyllabus && (
          <button
            onClick={onToggleSyllabus}
            className="p-2 rounded-xl text-gray-500 hover:text-gray-950 hover:bg-gray-50 transition-all cursor-pointer active:scale-95 border border-gray-100"
            title={isSyllabusOpen ? 'Hide Index' : 'Show Index'}
          >
            {isSyllabusOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        )}
      </div>
    </motion.header>
  );
}
