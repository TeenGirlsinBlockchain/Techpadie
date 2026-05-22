'use client';

import React, { useState } from 'react';
import type { CourseModule, Lesson } from '@/app/types';
import SyllabusAccordion from './SyllabusAccordion';
import { BookOpen } from 'lucide-react';

interface CourseProgressSidebarProps {
  modules: CourseModule[];
  activeLesson: Lesson;
  completedLessonIds: Set<string>;
  totalLessons: number;
  onSelectLesson: (lesson: Lesson) => void;
}

export default function CourseProgressSidebar({
  modules,
  activeLesson,
  completedLessonIds,
  totalLessons,
  onSelectLesson,
}: CourseProgressSidebarProps) {
  const completedCount = completedLessonIds.size;
  const progressPercent = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;
  
  // Find which module contains the active lesson, and default it to open
  const activeModule = modules.find((m: CourseModule) =>
    m.lessons.some((l: Lesson) => l.id === activeLesson?.id)
  );

  const [openModuleId, setOpenModuleId] = useState<string | null>(
    activeModule ? activeModule.id : (modules[0]?.id || null)
  );

  const toggleModule = (moduleId: string) => {
    setOpenModuleId(openModuleId === moduleId ? null : moduleId);
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-100 w-full select-none">
      {/* Progress Header */}
      <div className="p-6 border-b border-gray-50 flex-shrink-0">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-brand-500" />
          <h3 className="text-base font-extrabold text-gray-900">Course Index</h3>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center justify-between text-xs font-bold text-gray-500 mb-1.5">
          <span>{progressPercent}% Complete</span>
          <span>{completedCount}/{totalLessons} Lessons</span>
        </div>
        <div className="w-full h-2 bg-gray-50 rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-500 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Modules List Accordion container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        {modules.map((module) => (
          <SyllabusAccordion
            key={module.id}
            module={module}
            isOpen={openModuleId === module.id}
            onToggle={() => toggleModule(module.id)}
            activeLessonId={activeLesson?.id}
            completedLessonIds={completedLessonIds}
            onSelectLesson={onSelectLesson}
          />
        ))}
      </div>
    </div>
  );
}
