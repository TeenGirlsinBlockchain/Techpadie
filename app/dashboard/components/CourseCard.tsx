"use client";

import React from 'react';
import Image from 'next/image';
import Link from 'next/link'; 
import { BookmarkIcon, UserGroupIcon, StarIcon, ClockIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

interface CourseCardProps {
  type?: 'default' | 'enrolled' | 'explore';
  courseTitle: string;
  imageUrl: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  studentCount: number;
  rating: number;
  instructorName: string;
  instructorAvatar: string;
  progressPercentage?: number;
  href?: string; 
}

export default function CourseCard({
  type = 'default',
  courseTitle,
  imageUrl,
  level,
  duration,
  studentCount,
  rating,
  instructorName,
  instructorAvatar,
  progressPercentage = 0,
  href = '#', 
}: CourseCardProps) {
  return (
    <div className="flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden p-3 h-full group">
      
      {/* 1. IMAGE SECTION */}
      <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-4">
        <Image 
          src={imageUrl} 
          alt={courseTitle}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <button className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-[#227FA1] transition-colors z-10">
          <BookmarkIcon className="h-4 w-4" />
        </button>
      </div>

      {/* 2. METADATA */}
      <div className="flex items-center justify-between px-1 mb-3">
        <span className="px-3 py-1 bg-[#227FA1]/10 text-[#227FA1] text-[11px] font-bold rounded-lg uppercase tracking-wider">
          {level}
        </span>
        <div className="flex items-center gap-3 text-gray-500 text-[12px] font-bold">
          <div className="flex items-center gap-1">
            <UserGroupIcon className="h-4 w-4 text-gray-400" />
            {studentCount}
          </div>
          <div className="flex items-center gap-1">
            <StarIcon className="h-4 w-4 text-yellow-400" />
            {rating.toFixed(1)}
          </div>
        </div>
      </div>

      {/* 3. TITLE */}
      <div className="px-1 mb-4 grow">
        <h3 className="text-[16px] font-bold leading-snug text-gray-800 line-clamp-2">
          {courseTitle}
        </h3>
      </div>

      {/* 4. DYNAMIC MIDDLE SECTION */}
      <div className="px-1 mb-4">
        {type === 'enrolled' ? (
          <div className="space-y-2">
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div 
                className="bg-[#227FA1] h-full rounded-full transition-all duration-500" 
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-[11px] font-bold text-gray-400 uppercase tracking-tighter">
                {progressPercentage}% Completed
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-1 text-[12px] font-bold text-gray-400">
             <ClockIcon className="h-4 w-4" />
             <span>{duration}</span>
          </div>
        )}
      </div>

      {/* 5. FOOTER */}
      <div className="flex items-center justify-between px-1 pt-4 border-t border-gray-50 mt-auto">
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 rounded-full overflow-hidden border border-gray-100">
            <Image src={instructorAvatar} alt={instructorName} fill className="object-cover" />
          </div>
          <span className="text-[13px] font-bold text-gray-600">
            {instructorName}
          </span>
        </div>
        
        {type === 'explore' && (
            <Link 
                href={href} 
                className="flex items-center gap-1 px-4 py-2 bg-[#227FA1] text-white text-xs font-bold rounded-xl shadow-md shadow-blue-100 hover:bg-[#1a637e] transition-all active:scale-95"
            >
                Enroll
                <ArrowRightIcon className="h-3 w-3" />
            </Link>
        )}
      </div>
    </div>
  );
}