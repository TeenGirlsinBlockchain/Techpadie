'use client';

import React from 'react';
import { useTranslation } from '@/app/lib/i18n/useTranslation';
import { useGamification } from '@/app/context/GamificationContext';
import { MOCK_ENROLLMENTS } from '@/app/lib/mockData';
import CourseCard from '../components/cards/CourseCard';
import ProgressBar from '@/app/components/ui/ProgressBar';
import {
  BookOpenIcon,
  CheckCircleIcon,
  FireIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

export default function MyCoursesPage() {
  const { t } = useTranslation();
  const { state: gamification } = useGamification();

  const activeEnrollments = MOCK_ENROLLMENTS.filter((e) => !e.completedAt);
  const completedEnrollments = MOCK_ENROLLMENTS.filter((e) => e.completedAt);

  return (
    <div className="space-y-6 md:space-y-8 pb-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-text-primary">{t('nav.myCourses')}</h1>
        <p className="text-text-tertiary text-sm mt-1">Track your progress and continue learning.</p>
      </div>

      {/* Streak Banner — compact, responsive */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          {/* Streak info */}
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-orange-50 flex items-center justify-center flex-shrink-0">
              <FireIcon className={`h-6 w-6 sm:h-7 sm:w-7 ${gamification.dailyGoalMet ? 'text-gamification-streak' : 'text-gray-300'}`} />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-text-primary leading-none">
                {gamification.currentStreak} <span className="text-sm font-semibold text-text-tertiary">day streak</span>
              </p>
              <p className="text-xs text-text-tertiary mt-1">
                {gamification.dailyGoalMet ? "You're on fire! Keep going." : "Complete a lesson to extend your streak!"}
              </p>
            </div>
          </div>

          {/* Weekly heatmap — hidden on very small screens */}
          <div className="hidden sm:flex items-center gap-1.5">
            {gamification.weeklyHistory.map((day, i) => (
              <div
                key={i}
                className={`w-7 h-9 rounded-md flex items-center justify-center text-[9px] font-bold
                  ${day.goalMet
                    ? 'bg-brand-500 text-white'
                    : 'bg-gray-100 text-gray-400'
                  }
                `}
                title={day.date}
              >
                {i === gamification.weeklyHistory.length - 1 ? 'T' : ''}
              </div>
            ))}
          </div>

          {/* Quick stats */}
          <div className="flex gap-4 sm:gap-6 text-center flex-shrink-0">
            <div>
              <p className="text-lg font-bold text-text-primary">{gamification.xp}</p>
              <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">XP</p>
            </div>
            <div>
              <p className="text-lg font-bold text-text-primary">{gamification.coursesCompleted}</p>
              <p className="text-[10px] font-semibold text-text-tertiary uppercase tracking-wider">{t('stats.coursesCompleted')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Active Courses */}
      <section className="space-y-4">
        <div className="flex items-center gap-2">
          <BookOpenIcon className="h-5 w-5 text-brand-500" />
          <h2 className="text-base sm:text-lg font-bold text-text-primary">
            In Progress ({activeEnrollments.length})
          </h2>
        </div>

        {activeEnrollments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeEnrollments.map((enrollment) => (
              <CourseCard
                key={enrollment.id}
                variant="enrolled"
                courseId={enrollment.courseId}
                courseTitle={enrollment.course.title}
                imageUrl={enrollment.course.imageUrl}
                level={enrollment.course.level}
                duration={enrollment.course.duration}
                rating={enrollment.course.rating}
                studentCount={enrollment.course.studentCount}
                author={enrollment.course.author}
                progressPercentage={enrollment.progressPercentage}
                availableLanguages={enrollment.course.availableLanguages}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-gray-200">
            <p className="text-sm text-text-tertiary">No active courses. Start learning!</p>
          </div>
        )}
      </section>

      {/* Completed Courses */}
      <section className="space-y-4 pt-2">
        <div className="flex items-center gap-2">
          <CheckCircleIcon className="h-5 w-5 text-feedback-success" />
          <h2 className="text-base sm:text-lg font-bold text-text-primary">
            Completed ({completedEnrollments.length})
          </h2>
        </div>

        {completedEnrollments.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {completedEnrollments.map((enrollment) => (
              <CourseCard
                key={enrollment.id}
                variant="enrolled"
                courseId={enrollment.courseId}
                courseTitle={enrollment.course.title}
                imageUrl={enrollment.course.imageUrl}
                level={enrollment.course.level}
                duration={enrollment.course.duration}
                rating={enrollment.course.rating}
                studentCount={enrollment.course.studentCount}
                author={enrollment.course.author}
                progressPercentage={100}
                availableLanguages={enrollment.course.availableLanguages}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-text-tertiary italic">No courses completed yet. Keep pushing!</p>
          </div>
        )}
      </section>
    </div>
  );
}