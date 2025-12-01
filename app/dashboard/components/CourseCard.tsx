// app/dashboard/components/CourseCard.tsx
import React from 'react';
import { PlayIcon, ClockIcon } from '@heroicons/react/24/solid';

interface CourseCardProps {
  courseTitle: string;
  nextLesson: string;
  progressPercentage: number; // 0 to 100
  timeRemaining: string; // e.g., "0h 30m"
  onContinue: () => void; // Function to handle button click
}

export default function CourseCard({
  courseTitle,
  nextLesson,
  progressPercentage,
  timeRemaining,
  onContinue,
}: CourseCardProps) {
  
  // Dynamic color for the progress bar (using the dashboard's signature purple/blue)
  const progressBarColor = 'bg-purple-500'; 
  const progressText = `${progressPercentage}% complete`;

  return (
    <div className="bg-[#1F2937] p-5 rounded-xl border border-[#2D3748] shadow-lg">
      
      {/* Title and Next Lesson */}
      <h3 className="text-lg font-inter font-semibold text-white">{courseTitle}</h3>
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
  );
}