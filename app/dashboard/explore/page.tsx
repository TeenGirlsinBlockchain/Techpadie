'use client';

import React, { useState, useMemo } from 'react';
import { useTranslation } from '@/app/lib/i18n/useTranslation';
import { COURSE_CATEGORIES } from '@/app/lib/constants';
import { MOCK_COURSES } from '@/app/lib/mockData';
import CourseCard from '../components/cards/CourseCard';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import type { CourseCategory } from '@/app/types';

export default function ExploreCoursesPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<CourseCategory | 'all'>('all');

  const filteredCourses = useMemo(() => {
    let courses = MOCK_COURSES;
    if (activeCategory !== 'all') {
      courses = courses.filter((c) => c.category === activeCategory);
    }
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      courses = courses.filter(
        (c) => c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
      );
    }
    return courses;
  }, [activeCategory, searchTerm]);

  return (
    <div className="space-y-6 pb-8">
      {/* Header + Search */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-text-primary">{t('explore.title')}</h1>
          <p className="text-text-tertiary text-sm mt-1">{t('explore.subtitle')}</p>
        </div>
        <div className="relative w-full sm:w-72 md:w-80">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-tertiary" />
          <input
            type="text"
            placeholder={t('explore.search')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 text-text-primary rounded-xl py-2.5 pl-10 pr-4 text-sm 
              focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent transition-all placeholder:text-text-tertiary"
          />
        </div>
      </div>

      {/* Category Filters — horizontal scroll on mobile */}
      <div className="-mx-3 px-3 sm:mx-0 sm:px-0">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide sm:flex-wrap sm:overflow-visible sm:pb-0">
          {/* "All" button */}
          <button
            onClick={() => setActiveCategory('all')}
            className={`
              flex-shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border
              ${activeCategory === 'all'
                ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                : 'bg-white text-text-secondary border-gray-200 hover:border-brand-500 hover:text-brand-500'
              }
            `}
          >
            {t('category.all')}
          </button>

          {COURSE_CATEGORIES.map((cat) => (
            <button
              key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={`
                flex-shrink-0 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all border
                ${activeCategory === cat.key
                  ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                  : 'bg-white text-text-secondary border-gray-200 hover:border-brand-500 hover:text-brand-500'
                }
              `}
            >
              {t(cat.labelKey as any)}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      <div className="flex items-center gap-2">
        <FunnelIcon className="h-4 w-4 text-text-tertiary" />
        <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wider">
          {filteredCourses.length} {filteredCourses.length === 1 ? 'Result' : 'Results'}
        </p>
      </div>

      {/* Course Grid */}
      {filteredCourses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              variant="explore"
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
              href={`/dashboard/explore/${course.id}`}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-dashed border-gray-200 text-center px-4">
          <MagnifyingGlassIcon className="h-10 w-10 text-text-tertiary mb-3" />
          <h3 className="text-base font-bold text-text-primary">{t('explore.noResults')}</h3>
          <p className="text-text-tertiary text-sm mt-1 max-w-sm">
            Try adjusting your search or filters.
          </p>
          <button
            onClick={() => { setSearchTerm(''); setActiveCategory('all'); }}
            className="mt-4 text-sm font-bold text-brand-500 hover:text-brand-600 transition-colors"
          >
            {t('explore.clearFilters')}
          </button>
        </div>
      )}
    </div>
  );
}