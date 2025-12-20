"use client";

import React from 'react';
import Image from 'next/image';
import { BookmarkIcon, UserGroupIcon, StarIcon } from '@heroicons/react/24/solid';

interface CourseCardProps {
  courseTitle: string;
  imageUrl: string;
  instructorName: string;
  instructorAvatar: string;
  studentCount: number;
  rating: number;
  level: string;
  isEnrolled?: boolean;
  onAction?: () => void;
}

export default function CourseCard({
  courseTitle,
  imageUrl,
  instructorName,
  instructorAvatar,
  studentCount,
  rating,
  level,
  isEnrolled,
}: CourseCardProps) {
  return (
    <div className="flex flex-col bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden p-3">
      
      {/* 1. Image Container */}
      <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4">
        <Image 
          src={imageUrl} 
          alt={courseTitle}
          fill
          className="object-cover"
        />
        {/* Bookmark Icon */}
        <button className="absolute top-3 right-3 p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors">
          <BookmarkIcon className="h-4 w-4" />
        </button>
      </div>

      {/* 2. Badge & Stats Row */}
      <div className="flex items-center justify-between px-1 mb-3">
        <span className="px-4 py-1.5 bg-[#227FA1]/10 text-[#227FA1] text-xs font-bold rounded-lg uppercase tracking-wider">
          {level}
        </span>
        <div className="flex items-center gap-3 text-gray-500 text-sm font-medium">
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

      {/* 3. Title */}
      <div className="px-1 mb-6 grow">
        <h3 className="text-[17px] font-bold leading-snug text-gray-800 line-clamp-2">
          {courseTitle}
        </h3>
      </div>

      {/* 4. Instructor & Action Footer */}
      <div className="flex items-center justify-between px-1 pt-4 border-t border-gray-50">
        <div className="flex items-center gap-2">
          <div className="relative h-8 w-8 rounded-full overflow-hidden border border-gray-100">
            <Image src={instructorAvatar} alt={instructorName} fill className="object-cover" />
          </div>
          <span className="text-sm font-bold text-[#227FA1]">{instructorName}</span>
        </div>
        
        {/* If you want an enroll button, keep it small or remove for exact Figma look */}
        {isEnrolled && (
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" title="In Progress"></div>
        )}
      </div>
    </div>
  );
}