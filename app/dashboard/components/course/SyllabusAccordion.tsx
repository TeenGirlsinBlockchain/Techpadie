'use client';

import React from 'react';
import { ChevronDown, ChevronRight, Play } from 'lucide-react';
import type { CourseModule, Lesson } from '@/app/types';

interface SyllabusAccordionProps {
  module: CourseModule;
  isOpen: boolean;
  onToggle: () => void;
  activeLessonId?: string | null;
  completedLessonIds?: Set<string>;
  onSelectLesson?: (lesson: Lesson) => void;
}

export default function SyllabusAccordion({
  module,
  isOpen,
  onToggle,
  activeLessonId,
  completedLessonIds = new Set(),
  onSelectLesson,
}: SyllabusAccordionProps) {
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white mb-4 transition-all duration-300 hover:shadow-md">
      {/* Header */}
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-5 cursor-pointer text-left transition-colors outline-none
          ${isOpen ? 'bg-brand-50/50' : 'bg-white hover:bg-gray-50'}
        `}
      >
        <div className="flex items-center gap-4">
          <div 
            className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors 
              ${isOpen ? 'bg-brand-500 text-white' : 'bg-gray-100 text-gray-400'}
            `}
          >
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </div>
          <span className={`font-bold text-sm md:text-base ${isOpen ? 'text-brand-600' : 'text-gray-700'}`}>
            {module.title}
          </span>
        </div>
        
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:block">
          {module.lessons?.length || 0} Lessons
        </span>
      </button>

      {/* Body / Lessons list */}
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden 
          ${isOpen ? 'max-h-[600px] opacity-100 border-t border-gray-50' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="p-2 bg-gray-50/30">
          {module.lessons && module.lessons.length > 0 ? (
            <div className="space-y-1">
              {module.lessons.map((lesson) => {
                const isActive = activeLessonId === lesson.id;
                const isCompleted = completedLessonIds.has(lesson.id);

                return (
                  <button
                    key={lesson.id}
                    onClick={() => onSelectLesson?.(lesson)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all text-left outline-none group
                      ${isActive 
                        ? 'bg-brand-500 text-white shadow-md shadow-brand-500/10' 
                        : 'hover:bg-white hover:shadow-sm text-gray-600 hover:text-gray-900'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div 
                        className={`p-2 rounded-full flex-shrink-0 
                          ${isActive 
                            ? 'bg-white/20 text-white' 
                            : 'bg-brand-50 text-brand-600 group-hover:bg-brand-100'
                          }
                        `}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </div>
                      <span className="text-sm font-semibold truncate">
                        {lesson.title}
                      </span>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      {isCompleted && (
                        <span 
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase
                            ${isActive ? 'bg-white/20 text-white' : 'bg-emerald-50 text-emerald-700'}
                          `}
                        >
                          Completed
                        </span>
                      )}
                      <span 
                        className={`text-xs font-bold 
                          ${isActive ? 'text-white/80' : 'text-gray-400'}
                        `}
                      >
                        {lesson.duration || '15 min'}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-gray-400 italic">
              No lessons available in this module yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
