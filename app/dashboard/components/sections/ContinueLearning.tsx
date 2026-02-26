'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/app/lib/i18n/useTranslation';
import CourseCard from '../cards/CourseCard';
import { MOCK_ENROLLMENTS } from '@/app/lib/mockData';

export default function ContinueLearning() {
  const { t } = useTranslation();

  const activeEnrollments = MOCK_ENROLLMENTS.filter(
    (e) => !e.completedAt
  );

  if (activeEnrollments.length === 0) return null;

  return (
    <section>
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-text-primary">
            {t('dashboard.continueLearning')}
          </h2>
          <p className="text-sm text-text-tertiary mt-0.5">Pick up where you left off</p>
        </div>
        <Link
          href="/dashboard/my-courses"
          className="text-sm font-bold text-brand-500 hover:text-brand-600 transition-colors"
        >
          {t('dashboard.viewAll')}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
    </section>
  );
}