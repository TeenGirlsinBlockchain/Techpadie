
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from '@/app/lib/i18n/useTranslation';
import { COURSE_CATEGORIES } from '@/app/lib/constants';
import CourseCard from '../components/cards/CourseCard';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import { fetchApi } from '@/app/lib/api-client';

type CategoryFilter = string | 'all';

interface ApiCourse {
  id: string;
  defaultLanguage: string;
  level: string;
  category: string;
  thumbnailUrl: string | null;
  estimatedHours: number | null;
  translations: { language: string; title: string; description: string }[];
  creator: { id: string; displayName: string };
  _count: { enrollments: number; modules: number };
}

function mapLevel(level: string): 'beginner' | 'intermediate' | 'advanced' {
  const map: Record<string, 'beginner' | 'intermediate' | 'advanced'> = {
    BEGINNER: 'beginner', INTERMEDIATE: 'intermediate', ADVANCED: 'advanced',
  };
  return map[level] || 'beginner';
}

function formatDuration(hours: number | null, modules: number): string {
  if (hours) return hours === 1 ? '1 hr' : `${hours} hrs`;
  return modules === 1 ? '1 module' : `${modules} modules`;
}

export default function ExploreCoursesPage() {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('all');
  const [courses, setCourses] = useState<ApiCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [total, setTotal] = useState(0);

  const loadCourses = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({ page: '1', limit: '50' });
      if (activeCategory !== 'all') {
        const cat = COURSE_CATEGORIES.find(c => c.key === activeCategory);
        if (cat) params.set('category', cat.apiKey);
      }
      if (searchTerm.trim()) params.set('q', searchTerm.trim());

      const res = await fetchApi<{ data: { items: ApiCourse[]; total: number } }>(
        `/api/courses?${params.toString()}`
      );
      setCourses(res.data?.items || []);
      setTotal(res.data?.total || 0);
    } catch {
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  }, [activeCategory, searchTerm]);

  useEffect(() => {
    const id = setTimeout(loadCourses, searchTerm ? 400 : 0);
    return () => clearTimeout(id);
  }, [loadCourses, searchTerm]);

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

      {/* Category Filters */}
      <div className="-mx-3 px-3 sm:mx-0 sm:px-0">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide sm:flex-wrap sm:overflow-visible sm:pb-0">
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
          {isLoading ? 'Loading...' : `${total} ${total === 1 ? 'Result' : 'Results'}`}
        </p>
      </div>

      {/* Course Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-72 rounded-2xl bg-gray-100 animate-pulse" />
          ))}
        </div>
      ) : courses.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
          {courses.map((course) => {
            const title =
              course.translations.find(tr => tr.language === course.defaultLanguage)?.title
              ?? course.translations[0]?.title
              ?? 'Untitled Course';

            return (
              <CourseCard
                key={course.id}
                variant="explore"
                courseId={course.id}
                courseTitle={title}
                imageUrl={course.thumbnailUrl}
                level={mapLevel(course.level)}
                duration={formatDuration(course.estimatedHours, course._count.modules)}
                rating={0}
                studentCount={course._count.enrollments}
                author={{ id: course.creator.id, name: course.creator.displayName }}
                href={`/dashboard/explore/${course.id}`}
              />
            );
          })}
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
