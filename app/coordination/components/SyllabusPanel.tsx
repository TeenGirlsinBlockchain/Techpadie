'use client';

import React, { useState } from 'react';
import type { CourseModule, Lesson } from '@/app/types';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, CheckCircle2, Circle, Play, HelpCircle, FileText } from 'lucide-react';

interface SyllabusPanelProps {
  modules: CourseModule[];
  activeLessonId?: string;
  completedLessonIds?: Set<string>;
  onSelectLesson: (lesson: Lesson) => void;
  className?: string;
}

export default function SyllabusPanel({
  modules,
  activeLessonId,
  completedLessonIds = new Set(),
  onSelectLesson,
  className = '',
}: SyllabusPanelProps) {
  // Store expanded state of modules (defaulting to expanding the first module, or whichever module has the active lesson)
  const [expandedModules, setExpandedModules] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    modules.forEach((mod, index) => {
      // Expand if it is the first module OR it contains the active lesson
      const containsActive = activeLessonId
        ? mod.lessons.some((l) => l.id === activeLessonId)
        : false;
      initial[mod.id] = index === 0 || containsActive;
    });
    return initial;
  });

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  const getLessonIcon = (type: Lesson['type']) => {
    switch (type) {
      case 'quiz':
        return <HelpCircle className="w-4 h-4" />;
      case 'video':
        return <Play className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  return (
    <div className={`flex flex-col h-full bg-white border-r border-gray-100 select-none overflow-y-auto scrollbar-thin ${className}`}>
      <div className="p-4 border-b border-gray-50 flex-shrink-0">
        <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">
          Syllabus & Curriculum
        </h3>
      </div>

      <div className="flex-1 p-2 space-y-2">
        {modules.map((mod, modIdx) => {
          const isExpanded = !!expandedModules[mod.id];
          const completedCount = mod.lessons.filter((l) => completedLessonIds.has(l.id)).length;
          const isAllCompleted = mod.lessons.length > 0 && completedCount === mod.lessons.length;

          return (
            <div key={mod.id} className="border border-gray-50 rounded-xl overflow-hidden bg-gray-50/30">
              {/* Module Header */}
              <button
                onClick={() => toggleModule(mod.id)}
                className="w-full flex items-center justify-between p-3.5 hover:bg-gray-50/80 transition-colors text-left font-bold cursor-pointer"
              >
                <div className="min-w-0 pr-2">
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-wide">
                    Module {modIdx + 1} • {completedCount}/{mod.lessons.length} Done
                  </span>
                  <h4 className="text-xs sm:text-sm font-extrabold text-gray-800 truncate mt-0.5">
                    {mod.title}
                  </h4>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 text-gray-400">
                  {isAllCompleted && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" />
                  )}
                  {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </div>
              </button>

              {/* Lessons List */}
              <AnimatePresence initial={false}>
                {isExpanded && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden bg-white border-t border-gray-50/50"
                  >
                    <div className="p-1 space-y-1">
                      {mod.lessons.map((lesson) => {
                        const isActive = lesson.id === activeLessonId;
                        const isCompleted = completedLessonIds.has(lesson.id);

                        return (
                          <button
                            key={lesson.id}
                            onClick={() => onSelectLesson(lesson)}
                            className={`w-full flex items-center justify-between gap-3 p-3 rounded-lg text-left transition-all cursor-pointer group relative ${
                              isActive
                                ? 'bg-brand-50 text-brand-900 font-extrabold shadow-sm'
                                : 'hover:bg-gray-50 text-gray-600 hover:text-gray-900'
                            }`}
                          >
                            {/* Active border pill */}
                            {isActive && (
                              <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-brand-500 rounded-r-md" />
                            )}

                            <div className="flex items-center gap-2.5 min-w-0">
                              {/* Completion/Type Indicator */}
                              <div className="flex-shrink-0">
                                {isCompleted ? (
                                  <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 fill-emerald-50" />
                                ) : isActive ? (
                                  <Circle className="w-4.5 h-4.5 text-brand-500 fill-brand-100/30 animate-pulse" />
                                ) : (
                                  <div className="text-gray-400 group-hover:text-gray-600 transition-colors">
                                    {getLessonIcon(lesson.type)}
                                  </div>
                                )}
                              </div>

                              <div className="min-w-0">
                                <span className={`text-[10px] uppercase font-bold tracking-wide ${isActive ? 'text-brand-600/80' : 'text-gray-400'}`}>
                                  {lesson.type} • {lesson.duration}
                                </span>
                                <h5 className={`text-xs truncate ${isActive ? 'font-bold' : 'font-medium'}`}>
                                  {lesson.title}
                                </h5>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
