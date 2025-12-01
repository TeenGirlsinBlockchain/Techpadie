"use client";

import React from 'react';
import Link from 'next/link';
import { PlayIcon, TrophyIcon } from '@heroicons/react/24/solid';

interface EnrolledCourseCardProps {
  courseId: number;
  title: string;
  progressPercentage: number; // 0 to 100
  lessonsCompleted: number;
  totalLessons: number;
  isCompleted: boolean;
}

export default function EnrolledCourseCard({
  courseId,
  title,
  progressPercentage,
  lessonsCompleted,
  totalLessons,
  isCompleted,
}: EnrolledCourseCardProps) {
  
  const progressBarColor = isCompleted ? 'bg-yellow-500' : 'bg-purple-500'; 
  const progressText = isCompleted ? 'Course Completed!' : `${lessonsCompleted}/${totalLessons} lessons`;

  return (
    <Link href={`/dashboard/course/${courseId}`} className="block transition hover:scale-[1.01] duration-300">
      <div className="bg-[#1F2937] p-5 rounded-xl border border-[#2D3748] shadow-lg flex items-center justify-between">
        
        {/* Course Info and Progress */}
        <div className="flex-1 min-w-0 pr-4">
          <h3 className={`text-lg font-inter font-semibold ${isCompleted ? 'text-yellow-400' : 'text-white'}`}>{title}</h3>
          
          <div className="mt-2 flex items-center space-x-3">
             {/* Progress Bar */}
            <div className="flex-1 h-2 bg-zinc-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${progressBarColor}`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-zinc-400 font-medium whitespace-nowrap">{progressText}</p>
          </div>
        </div>

        {/* Action Button / Status */}
        <div className="w-28 text-right">
          {isCompleted ? (
            <div className="inline-flex items-center px-3 py-2 bg-yellow-600/20 text-yellow-400 rounded-lg text-sm font-medium space-x-1">
              <TrophyIcon className="h-4 w-4" />
              <span>Earned</span>
            </div>
          ) : (
            <button
              className="inline-flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition space-x-1"
            >
              <PlayIcon className="h-4 w-4" />
              <span>Continue</span>
            </button>
          )}
        </div>
      </div>
    </Link>
  );
}