"use client";

import React from 'react';
import { PlayIcon, ClockIcon } from '@heroicons/react/24/solid';
import { CourseCardProps } from '@/app/types/dashboard'; 

export default function CourseCard({
  courseTitle,
  nextLesson,
  progressPercentage,
  timeRemaining,
  onContinue,
  imageUrl, 
  priceUSD, 
}: CourseCardProps) { 
  
  // Use accent color for progress bar
  const progressBarColor = '#227FA1'; 
  const progressText = `${progressPercentage}% complete`;
  const isFree = priceUSD === 0;

  return (
    // CHANGES: Light Glassmorphism effect applied
    <div className="bg-white/50 backdrop-blur-md rounded-xl border border-gray-200 shadow-lg flex space-x-4">
      
      {/* Left Section: Image and Status */}
      <div className="w-48 flex-shrink-0 relative overflow-hidden rounded-l-xl">
         {/* Placeholder for the dynamic image */}
         <div 
          className="w-full h-full bg-cover bg-center" 
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          {/* Fallback/Image Placeholder */}
          <div className="w-full h-full bg-gray-300/50 flex items-center justify-center text-sm font-bold text-gray-700">
            [Course Art]
          </div>
        </div>
        {/* Price/Status Tag - High contrast colors maintained */}
        <span className={`absolute top-2 left-2 px-3 py-1 rounded-full text-xs font-bold ${isFree ? 'bg-green-600 text-white' : 'bg-yellow-500 text-black'}`}>
          {isFree ? 'FREE' : `$${priceUSD}`}
        </span>
      </div>

      {/* Right Section: Content and Action */}
      <div className="flex-grow p-5">
        {/* Title and Next Lesson - Using dark dashboard text */}
        <h3 className="text-xl font-inter font-semibold" style={{ color: '#000000B2' }}>{courseTitle}</h3>
        <p className="text-sm font-lexend text-gray-600 mt-1">
          <span style={{ color: '#227FA1' }} className="font-medium mr-1">Next:</span> {nextLesson}
        </p>

        {/* Progress Bar and Time */}
        <div className="mt-4 flex items-center justify-between">
          <div className="w-2/3">
            {/* Progress Bar */}
            <div className="h-2 bg-gray-300 rounded-full overflow-hidden">
              <div
                className="h-full"
                style={{ width: `${progressPercentage}%`, backgroundColor: progressBarColor }}
              ></div>
            </div>
            <p className="text-xs text-gray-500 mt-1">{progressText}</p>
          </div>
          
          {/* Time Remaining */}
          <div className="flex items-center text-sm font-medium text-gray-600">
            <ClockIcon className="h-4 w-4 mr-1 text-gray-400" />
            {timeRemaining}
          </div>
        </div>

        {/* Continue Button */}
        <div className="mt-5 text-right">
          <button
            onClick={onContinue}
            className="inline-flex items-center px-4 py-2 text-white rounded-lg text-sm font-medium transition space-x-2"
            style={{ backgroundColor: '#227FA1' }}
          >
            <PlayIcon className="h-4 w-4" />
            <span>Continue Learning</span>
          </button>
        </div>
      </div>
    </div>
  );
}