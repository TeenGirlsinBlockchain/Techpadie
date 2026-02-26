'use client';

import React from 'react';
import type { CourseModule, Lesson } from '@/app/types';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

interface ChalkSyllabusProps {
  modules: CourseModule[];
  activeLesson: Lesson;
  completedLessonIds: Set<string>;
  totalLessons: number;
  onSelectLesson: (lesson: Lesson) => void;
}

export default function ChalkSyllabus({
  modules,
  activeLesson,
  completedLessonIds,
  totalLessons,
  onSelectLesson,
}: ChalkSyllabusProps) {
  const progressPercent = totalLessons > 0
    ? Math.round((completedLessonIds.size / totalLessons) * 100)
    : 0;

  return (
    <div className="flex flex-col h-full">
      {/* Header + Progress */}
      <div className="p-5 border-b border-chalk-divider">
        <h2 className="font-chalk text-lg text-chalk-white chalk-glow">Course Index</h2>
        <div className="mt-3">
          <div className="w-full h-1.5 bg-chalk-surface rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
          <p className="text-[10px] font-bold text-chalk-white-dim/50 mt-1.5 text-right uppercase tracking-wider">
            {progressPercent}% Complete
          </p>
        </div>
      </div>

      {/* Module List */}
      <div className="flex-1 overflow-y-auto scrollbar-chalk">
        {modules.map((module) => (
          <div key={module.id} className="border-b border-chalk-divider last:border-0">
            {/* Module header */}
            <div className="px-5 py-3 bg-chalk-surface/50">
              <h3 className="text-[10px] font-bold text-chalk-white-dim/40 uppercase tracking-[0.15em]">
                {module.title}
              </h3>
            </div>

            {/* Lessons */}
            {module.lessons.map((lesson) => {
              const isActive = activeLesson.id === lesson.id;
              const isDone = completedLessonIds.has(lesson.id);

              return (
                <button
                  key={lesson.id}
                  onClick={() => onSelectLesson(lesson)}
                  className={`
                    w-full flex items-center gap-3 px-5 py-3.5 text-left transition-all
                    border-l-[3px]
                    ${isActive
                      ? 'border-l-brand-500 bg-brand-500/10'
                      : 'border-l-transparent hover:bg-chalk-surface-hover'
                    }
                  `}
                >
                  {/* Check / Circle */}
                  {isDone ? (
                    <CheckCircleIcon className="h-5 w-5 text-chalk-green flex-shrink-0" />
                  ) : (
                    <div className={`h-5 w-5 rounded-full border-2 flex-shrink-0 ${
                      isActive ? 'border-brand-500' : 'border-chalk-white-dim/20'
                    }`} />
                  )}

                  <div className="min-w-0 flex-1">
                    <p className={`text-sm font-medium leading-snug truncate ${
                      isActive ? 'text-brand-400' : 'text-chalk-white-dim'
                    }`} style={{ fontFamily: 'var(--font-chalk-body)' }}>
                      {lesson.title}
                    </p>
                    <p className="text-[10px] text-chalk-white-dim/40 mt-0.5">
                      {lesson.duration}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}