'use client';

import React from 'react';
import type { LessonTab } from '@/app/types';
import {
  BookOpenIcon,
  SpeakerWaveIcon,
  RectangleStackIcon,
  ClipboardDocumentCheckIcon,
} from '@heroicons/react/24/solid';

const TABS: { key: LessonTab; icon: React.ElementType; label: string }[] = [
  { key: 'read', icon: BookOpenIcon, label: 'Read' },
  { key: 'listen', icon: SpeakerWaveIcon, label: 'Listen' },
  { key: 'flashcards', icon: RectangleStackIcon, label: 'Flashcards' },
  { key: 'quiz', icon: ClipboardDocumentCheckIcon, label: 'Quiz' },
];

interface LessonTabsProps {
  activeTab: LessonTab;
  onTabChange: (tab: LessonTab) => void;
  flashcardCount?: number;
  quizCount?: number;
}

export default function LessonTabs({
  activeTab,
  onTabChange,
  flashcardCount,
  quizCount,
}: LessonTabsProps) {
  return (
    <div className="flex gap-1 p-1 bg-chalk-surface rounded-xl border border-chalk-border">
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        const count = tab.key === 'flashcards' ? flashcardCount : tab.key === 'quiz' ? quizCount : undefined;

        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`
              flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-bold
              transition-all duration-200 flex-1 justify-center whitespace-nowrap
              ${isActive
                ? 'bg-brand-500 text-white shadow-lg shadow-brand-500/20'
                : 'text-chalk-white-dim hover:text-chalk-white hover:bg-chalk-surface-hover'
              }
            `}
          >
            <tab.icon className="h-4 w-4 flex-shrink-0" />
            <span className="hidden sm:inline">{tab.label}</span>
            {count !== undefined && count > 0 && (
              <span className={`
                text-[10px] px-1.5 py-0.5 rounded-full font-bold
                ${isActive ? 'bg-white/20' : 'bg-chalk-surface text-chalk-white-dim'}
              `}>
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}