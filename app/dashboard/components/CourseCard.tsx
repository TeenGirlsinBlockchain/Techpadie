"use client";

import React from 'react';
import { PlayIcon, ClockIcon, CurrencyDollarIcon } from '@heroicons/react/24/solid';
import { CourseCardProps } from '@/app/types/dashboard'; 

export default function CourseCard({
  courseTitle,
  nextLesson,
  progressPercentage,
  timeRemaining,
  onContinue,
  imageUrl, 
  priceUSD, 
}: CourseCardProps & { imageUrl: string; priceUSD: number }) { // Temporary prop extension for mock
  
  const progressBarColor = 'bg-purple-500'; 
  const progressText = `${progressPercentage}% complete`;
  const isFree = priceUSD === 0;

  return (
    <div className="bg-[#1F2937] rounded-xl border border-[#2D3748] shadow-lg flex space-x-4">
      
      {/* Left Section: Image and Status */}
      <div className="w-48 shrink-0 relative overflow-hidden rounded-l-xl">
         {/* Placeholder for the dynamic image */}
         <div 
          className="w-full h-full bg-cover bg-center" 
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          {/* Fallback/Image Placeholder */}
          <div className="w-full h-full bg-zinc-600/50 flex items-center justify-center text-sm font-bold text-white/50">
            [Course Art]
          </div>
        </div>
        {/* Price/Status Tag */}
        <span className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-bold ${isFree ? 'bg-green-500 text-white' : 'bg-yellow-500 text-black'}`}>
          {isFree ? 'FREE' : `$${priceUSD}`}
        </span>
      </div>

      {/* Right Section: Content and Action */}
      <div className="grow p-5">
        {/* Title and Next Lesson */}
        <h3 className="text-xl font-inter font-semibold text-white">{courseTitle}</h3>
        <p className="text-sm font-lexend text-zinc-400 mt-1">
          <span className="text-purple-400 font-medium mr-1">Next:</span> {nextLesson}
        </p>

        {/* Progress Bar and Time */}
        <div className="mt-4 flex items-center justify-between">
          <div className="w-2/3">
            {/* Progress Bar */}
            <div className="h-2 bg-zinc-700 rounded-full overflow-hidden">
              <div
                className={`h-full ${progressBarColor}`}
                style={{ width: `${progressPercentage}%` }}
              ></div>
            </div>
            <p className="text-xs text-zinc-400 mt-1">{progressText}</p>
          </div>
          
          {/* Time Remaining */}
          <div className="flex items-center text-sm font-medium text-zinc-400">
            <ClockIcon className="h-4 w-4 mr-1 text-zinc-500" />
            {timeRemaining}
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-5 text-right">
          <button
            onClick={onContinue}
            className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition space-x-2"
          >
            <PlayIcon className="h-4 w-4" />
            <span>Continue Learning</span>
          </button>
        </div>
      </div>
    </div>
  );
}