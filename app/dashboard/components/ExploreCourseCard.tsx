
"use client";

import React from 'react';
import Link from 'next/link';
import { ClockIcon, StarIcon, BookOpenIcon } from '@heroicons/react/24/outline';
import { ExploreCourse } from '@/app/types/dashboard'; 

interface ExploreCourseCardProps {
  course: ExploreCourse;
}

export default function ExploreCourseCard({ course }: ExploreCourseCardProps) {
  
  const levelColor = course.level === 'beginner' ? 'bg-green-100 text-green-700' :
                     course.level === 'intermediate' ? 'bg-yellow-100 text-yellow-700' :
                     'bg-red-100 text-red-700';

  return (
    <Link href={`/dashboard/explore/${course.id}`} className="block h-full">
      {/* CHANGES: Glassmorphism style (bg-white/50, blur, light border) */}
      <div className="bg-white/50 backdrop-blur-md p-5 rounded-xl border border-gray-200 shadow-lg hover:shadow-xl transition-all duration-200 flex flex-col h-full">
        
        {/* Header and Tags */}
        <div className="flex justify-between items-start mb-3">
          <span className={`px-2 py-0.5 rounded-full text-xs font-medium uppercase ${levelColor}`}>
            {course.level}
          </span>
          {course.isNew && (
            // Using the Accent Blue for the NEW tag for prominence
            <span className="px-2 py-0.5 rounded-full text-xs font-bold text-white" style={{ backgroundColor: '#227FA1' }}>
              NEW
            </span>
          )}
        </div>

        {/* Title (Dark Text) */}
        <h3 className="text-lg font-inter font-semibold mb-3 flex-grow" style={{ color: '#000000B2' }}>
          {course.title}
        </h3>
        
        {/* Metadata */}
        <div className="flex justify-between text-sm text-gray-600 space-x-4 border-t border-gray-300 pt-3 mt-auto">
          
          <div className="flex items-center space-x-1">
            <ClockIcon className="h-4 w-4 text-gray-500" />
            <span>{course.duration}</span>
          </div>

          <div className="flex items-center space-x-1">
            <StarIcon className="h-4 w-4 text-yellow-500" />
            <span>{course.rating.toFixed(1)}</span>
          </div>
          
          <div className="flex items-center space-x-1">
            <BookOpenIcon className="h-4 w-4 text-gray-500" />
            <span>{course.enrolledCount.toLocaleString()} Enrolled</span>
          </div>
        </div>
      </div>
    </Link>
  );
}