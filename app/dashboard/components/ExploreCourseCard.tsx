"use client";

import React from 'react';
import Link from 'next/link';
import { ClockIcon, StarIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { ExploreCourse } from '@/app/types/dashboard';

interface ExploreCourseCardProps {
  course: ExploreCourse;
}

export default function ExploreCourseCard({ course }: ExploreCourseCardProps) {
  
  const levelColor = course.level === 'beginner' ? 'bg-green-500/20 text-green-400' :
                     course.level === 'intermediate' ? 'bg-yellow-500/20 text-yellow-400' :
                     'bg-red-500/20 text-red-400';

  return (
    <Link href={`/dashboard/explore/${course.id}`} className="block h-full">
      <div className="bg-[#1F2937] p-5 rounded-xl border border-[#2D3748] shadow-lg hover:border-purple-500 transition-all duration-200 flex flex-col h-full">
        
        {/* Header and Tags */}
        <div className="flex justify-between items-start mb-3">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase ${levelColor}`}>
            {course.level}
          </span>
          {course.isNew && (
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-500 text-white">
              NEW
            </span>
          )}
        </div>

        {/* Title */}
        <h3 className="text-lg font-inter font-semibold text-white mb-3 flex-grow">
          {course.title}
        </h3>
        
        {/* Metadata */}
        <div className="flex justify-between text-sm text-zinc-400 space-x-4 border-t border-zinc-700 pt-3 mt-auto">
          
          <div className="flex items-center space-x-1">
            <ClockIcon className="h-4 w-4" />
            <span>{course.duration}</span>
          </div>

          <div className="flex items-center space-x-1">
            <StarIcon className="h-4 w-4 text-yellow-400" />
            <span>{course.rating.toFixed(1)}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <BookOpenIcon className="h-4 w-4" />
            <span>{course.enrolledCount.toLocaleString()} Enrolled</span>
          </div>
        </div>
      </div>
    </Link>
  );
}