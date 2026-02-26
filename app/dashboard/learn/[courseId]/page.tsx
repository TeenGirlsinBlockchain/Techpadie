'use client';

import React, { useState, useMemo, useCallback } from 'react';
import Link from 'next/link';
import ChalkboardShell from '../components/ChalkboardShell';
import LessonTabs from '../components/LessonTabs';
import ReadPanel from '../components/ReadPanel';
import ListenPanel from '../components/ListenPanel';
import FlashcardsPanel from '../components/FlashcardsPanel';
import QuizPanel from '../components/QuizPanel';
import ChalkSyllabus from '../components/ChalkSyllabus';
import Drawer from '@/app/components/ui/Drawer';
import { useGamification } from '@/app/context/GamificationContext';
import { getLessonGeneratedContent } from '@/app/lib/mockLearnData';
import { MOCK_COURSES } from '@/app/lib/mockData';
import { XP_REWARDS } from '@/app/lib/constants';
import type { Lesson, LessonTab } from '@/app/types';
import {
  ArrowLeftIcon,
  ListBulletIcon,
  BoltIcon,
} from '@heroicons/react/24/solid';

export default function CourseLearnPage({ params }: { params: { courseId: string } }) {
  const course = MOCK_COURSES.find((c) => c.id === params.courseId) || MOCK_COURSES[0];

  const flatLessons = useMemo(
    () => course.modules.flatMap((m) => m.lessons),
    [course]
  );

  const [activeLesson, setActiveLesson] = useState<Lesson>(flatLessons[0] || course.modules[0]?.lessons[0]);
  const [activeTab, setActiveTab] = useState<LessonTab>('read');
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set(['les_001']));
  const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);
  const [xpToast, setXpToast] = useState<number | null>(null);

  const { addXP } = useGamification();

  const currentIndex = flatLessons.findIndex((l) => l.id === activeLesson?.id);
  const isLastLesson = currentIndex === flatLessons.length - 1;
  const generatedContent = activeLesson ? getLessonGeneratedContent(activeLesson.id) : null;

  const selectLesson = useCallback((lesson: Lesson) => {
    setActiveLesson(lesson);
    setActiveTab('read');
    setIsSyllabusOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const showXpToast = useCallback((amount: number) => {
    setXpToast(amount);
    setTimeout(() => setXpToast(null), 2500);
  }, []);

  const handleMarkComplete = useCallback(() => {
    if (!activeLesson) return;
    if (!completedIds.has(activeLesson.id)) {
      setCompletedIds((prev) => {
        const next = new Set(prev);
        next.add(activeLesson.id);
        return next;
      });
      addXP(XP_REWARDS.lessonCompleted);
      showXpToast(XP_REWARDS.lessonCompleted);
    }
    if (!isLastLesson) {
      const next = flatLessons[currentIndex + 1];
      selectLesson(next);
    }
  }, [activeLesson, completedIds, isLastLesson, currentIndex, flatLessons, addXP, selectLesson, showXpToast]);

  const currentModule = course.modules.find((m) =>
    m.lessons.some((l) => l.id === activeLesson?.id)
  );

  // Guard: if no lessons in course
  if (!activeLesson || flatLessons.length === 0) {
    return (
      <ChalkboardShell>
        <div className="flex items-center justify-center min-h-screen px-6">
          <div className="text-center">
            <h2 className="font-chalk text-2xl text-chalk-white mb-3">No lessons available</h2>
            <p className="text-chalk-white-dim text-sm mb-6" style={{ fontFamily: 'var(--font-chalk-body)' }}>
              This course doesn&apos;t have any content yet.
            </p>
            <Link href="/dashboard/my-courses" className="text-brand-400 font-bold text-sm hover:text-brand-300">
              ← Back to My Courses
            </Link>
          </div>
        </div>
      </ChalkboardShell>
    );
  }

  return (
    <ChalkboardShell>
      {/* XP Toast */}
      {xpToast && (
        <div className="fixed top-6 right-6 z-50 animate-fade-in">
          <div className="flex items-center gap-2 bg-gamification-xp text-white px-4 py-2.5 rounded-xl shadow-xl text-sm font-bold">
            <BoltIcon className="h-4 w-4" />
            +{xpToast} XP
          </div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row min-h-screen">
        {/* ═══ MAIN CONTENT ═══════════════════════════════════ */}
        <div className="flex-1 min-w-0">
          {/* Top Nav */}
          <div className="sticky top-0 z-20 bg-chalk-board/95 backdrop-blur-md border-b border-chalk-divider">
            <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
              <Link
                href="/dashboard/my-courses"
                className="flex items-center gap-2 text-chalk-white-dim hover:text-chalk-white text-sm font-medium transition-colors"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                <span className="hidden sm:inline">My Courses</span>
              </Link>

              <div className="flex items-center gap-3">
                <span className="text-[10px] font-bold text-chalk-white-dim/40 uppercase tracking-widest">
                  {activeLesson.duration}
                </span>
                <button
                  onClick={() => setIsSyllabusOpen(true)}
                  className="lg:hidden p-2 rounded-lg text-chalk-white-dim hover:text-chalk-white hover:bg-chalk-surface-hover transition-colors"
                  aria-label="Open syllabus"
                >
                  <ListBulletIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Lesson Header */}
          <div className="px-4 sm:px-6 lg:px-8 pt-6 pb-4">
            {currentModule && (
              <span className="inline-block text-brand-400 font-bold text-xs sm:text-sm bg-brand-500/10 px-3 py-1 rounded-full mb-3">
                {currentModule.title}
              </span>
            )}
            <h1 className="font-chalk text-2xl sm:text-3xl md:text-4xl text-chalk-white leading-tight chalk-glow">
              {activeLesson.title}
            </h1>
          </div>

          {/* Tabs */}
          <div className="px-4 sm:px-6 lg:px-8 mb-6">
            <LessonTabs
              activeTab={activeTab}
              onTabChange={setActiveTab}
              flashcardCount={generatedContent?.flashcards.length}
              quizCount={generatedContent?.quiz.length}
            />
          </div>

          {/* Tab Content */}
          <div className="px-4 sm:px-6 lg:px-8 pb-24 lg:pb-16 max-w-3xl">
            {activeTab === 'read' && (
              <ReadPanel
                lesson={activeLesson}
                isCompleted={completedIds.has(activeLesson.id)}
                onMarkComplete={handleMarkComplete}
                isLastLesson={isLastLesson}
              />
            )}
            {activeTab === 'listen' && (
              <ListenPanel lesson={activeLesson} courseTitle={course.title} />
            )}
            {activeTab === 'flashcards' && (
              <FlashcardsPanel
                flashcards={generatedContent?.flashcards || []}
                onReviewComplete={() => { addXP(15); showXpToast(15); }}
              />
            )}
            {activeTab === 'quiz' && (
              <QuizPanel
                questions={generatedContent?.quiz || []}
                lessonTitle={activeLesson.title}
              />
            )}
          </div>
        </div>

        {/* ═══ DESKTOP SYLLABUS ═══════════════════════════════ */}
        <div className="hidden lg:block w-80 xl:w-96 border-l border-chalk-divider bg-chalk-board-deep/50">
          <div className="sticky top-0 h-screen overflow-hidden">
            <ChalkSyllabus
              modules={course.modules}
              activeLesson={activeLesson}
              completedLessonIds={completedIds}
              totalLessons={flatLessons.length}
              onSelectLesson={selectLesson}
            />
          </div>
        </div>
      </div>

      {/* ═══ MOBILE SYLLABUS DRAWER ═══════════════════════════ */}
      <Drawer
        isOpen={isSyllabusOpen}
        onClose={() => setIsSyllabusOpen(false)}
        side="right"
        title="Course Index"
      >
        <div className="bg-chalk-board-deep h-full">
          <ChalkSyllabus
            modules={course.modules}
            activeLesson={activeLesson}
            completedLessonIds={completedIds}
            totalLessons={flatLessons.length}
            onSelectLesson={selectLesson}
          />
        </div>
      </Drawer>
    </ChalkboardShell>
  );
}