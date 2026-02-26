'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import type { CourseCardProps } from '@/app/types';
import { useTranslation } from '@/app/lib/i18n/useTranslation';
import ProgressBar from '@/app/components/ui/ProgressBar';
import Badge from '@/app/components/ui/Badge';
import {
  StarIcon,
  UserGroupIcon,
  ClockIcon,
  PlayIcon,
  ArrowRightIcon,
  MusicalNoteIcon,
} from '@heroicons/react/24/solid';

const LEVEL_VARIANT: Record<string, 'success' | 'warning' | 'error'> = {
  beginner: 'success',
  intermediate: 'warning',
  advanced: 'error',
};

export default function CourseCard({
  variant = 'default',
  courseId,
  courseTitle,
  imageUrl,
  level,
  duration,
  rating,
  studentCount,
  author,
  availableLanguages,
  progressPercentage = 0,
  price,
  currency,
  href,
  onAction,
}: CourseCardProps) {
  const { t } = useTranslation();

  const cardHref = href || (variant === 'explore' || variant === 'sale'
    ? `/dashboard/explore/${courseId}`
    : `/dashboard/learn/${courseId}`);

  const content = (
    <div className="flex flex-col bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden p-3 h-full group cursor-pointer">
      {/* Image */}
      <div className="relative h-36 md:h-40 w-full rounded-xl overflow-hidden mb-3">
        <Image
          src={imageUrl}
          alt={courseTitle}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Price overlay for sale variant */}
        {(variant === 'sale' || variant === 'explore') && price !== undefined && (
          <div className="absolute top-2.5 left-2.5 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-lg shadow-sm">
            <span className="text-sm font-bold text-text-primary">
              {currency || 'USDT'} {price.toFixed(2)}
            </span>
          </div>
        )}

        {/* Audio available indicator */}
        <div className="absolute bottom-2.5 right-2.5 h-7 w-7 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
          <MusicalNoteIcon className="h-3.5 w-3.5 text-brand-500" />
        </div>
      </div>

      {/* Metadata row */}
      <div className="flex items-center justify-between px-1 mb-2">
        <Badge variant={LEVEL_VARIANT[level] || 'default'} size="sm">
          {t(`course.${level}` as any)}
        </Badge>
        <div className="flex items-center gap-2.5 text-text-tertiary text-[11px] font-semibold">
          <span className="flex items-center gap-0.5">
            <UserGroupIcon className="h-3.5 w-3.5" />
            {studentCount > 999 ? `${(studentCount / 1000).toFixed(1)}k` : studentCount}
          </span>
          <span className="flex items-center gap-0.5">
            <StarIcon className="h-3.5 w-3.5 text-amber-400" />
            {rating.toFixed(1)}
          </span>
        </div>
      </div>

      {/* Title */}
      <div className="px-1 mb-3 flex-1">
        <h3 className="text-[15px] font-bold text-text-primary leading-snug line-clamp-2">
          {courseTitle}
        </h3>
      </div>

      {/* Variant-specific middle section */}
      <div className="px-1 mb-3">
        {variant === 'enrolled' ? (
          <ProgressBar value={progressPercentage} size="sm" showLabel label={t('course.progress', { percent: String(progressPercentage) })} />
        ) : (
          <div className="flex items-center gap-3 text-xs text-text-tertiary font-medium">
            <span className="flex items-center gap-1">
              <ClockIcon className="h-3.5 w-3.5" />
              {duration}
            </span>
            {/* Language badges */}
            {availableLanguages && availableLanguages.length > 0 && (
              <span className="text-[10px] font-bold text-brand-500 bg-brand-50 px-1.5 py-0.5 rounded">
                {availableLanguages.length} lang{availableLanguages.length > 1 ? 's' : ''}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between px-1 pt-3 border-t border-gray-50 mt-auto">
        <div className="flex items-center gap-2 min-w-0">
          <div className="relative h-7 w-7 rounded-full overflow-hidden border border-gray-100 flex-shrink-0">
            <Image src={author.avatar} alt={author.name} fill className="object-cover" sizes="28px" />
          </div>
          <span className="text-xs font-semibold text-text-secondary truncate">{author.name}</span>
        </div>

        {variant === 'enrolled' && (
          <button
            onClick={(e) => { e.preventDefault(); onAction?.(); }}
            className="flex items-center gap-1 px-3 py-1.5 bg-brand-500 text-white text-xs font-bold rounded-lg hover:bg-brand-600 transition-colors active:scale-95"
          >
            <PlayIcon className="h-3 w-3" />
            {t('course.resume')}
          </button>
        )}

        {(variant === 'explore' || variant === 'sale') && (
          <span className="flex items-center gap-1 text-xs font-bold text-brand-500">
            {t('course.enroll')}
            <ArrowRightIcon className="h-3 w-3" />
          </span>
        )}
      </div>
    </div>
  );

  return <Link href={cardHref} className="block h-full">{content}</Link>;
}