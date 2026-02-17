'use client';

import React from 'react';
import Link from 'next/link';
import { useTranslation } from '@/app/lib/i18n/useTranslation';
import CourseCard from '../cards/CourseCard';
import { MOCK_COURSES, MOCK_ENROLLMENTS } from '@/app/lib/mockData';

export default function CoursesForSale() {
  const { t } = useTranslation();

  // Filter out courses the user is already enrolled in
  const enrolledCourseIds = new Set(MOCK_ENROLLMENTS.map((e) => e.courseId));
  const availableCourses = MOCK_COURSES.filter(
    (course) => !enrolledCourseIds.has(course.id)
  ).slice(0, 4); // Show max 4 on dashboard

  if (availableCourses.length === 0) return null;

  return (
    <section>
      <div className="flex items-end justify-between mb-5">
        <div>
          <h2 className="text-xl font-bold text-text-primary">
            {t('dashboard.coursesForYou')}
          </h2>
          <p className="text-sm text-text-tertiary mt-0.5">Expand your blockchain knowledge</p>
        </div>
        <Link
          href="/dashboard/explore"
          className="text-sm font-bold text-brand-500 hover:text-brand-600 transition-colors"
        >
          {t('dashboard.viewAll')}
        </Link>
      </div>

      {/* Mobile: horizontal scroll. Tablet+: grid */}
      <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide md:grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 md:overflow-visible md:pb-0">
        {availableCourses.map((course) => (
          <div key={course.id} className="min-w-[260px] md:min-w-0 flex-shrink-0 md:flex-shrink">
            <CourseCard
              variant="sale"
              courseId={course.id}
              courseTitle={course.title}
              imageUrl={course.imageUrl}
              level={course.level}
              duration={course.duration}
              rating={course.rating}
              studentCount={course.studentCount}
              author={course.author}
              price={course.price}
              currency={course.currency}
              availableLanguages={course.availableLanguages}
            />
          </div>
        ))}
      </div>
    </section>
  );
}