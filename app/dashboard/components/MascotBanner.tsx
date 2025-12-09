"use client";

import React from 'react';
import { SparklesIcon, FireIcon } from '@heroicons/react/24/outline';

// Mock Mascot (since we removed emojis)
const MascotPlaceholder = ({ status }: { status: 'happy' | 'sad' }) => (
  <div className={`p-4 rounded-full ${status === 'happy' ? 'bg-green-100' : 'bg-red-100'}`}>
    {/* Placeholder for a small mascot image/icon */}
    <span className={`text-xl font-bold ${status === 'happy' ? 'text-green-600' : 'text-red-600'}`}>
      {status === 'happy' ? '^_^' : ':('} 
    </span>
  </div>
);

interface MascotBannerProps {
  currentStreak: number;
  dailyGoalMet: boolean;
}

export default function MascotBanner({ currentStreak, dailyGoalMet }: MascotBannerProps) {
  let themeClass = '';
  let message = '';
  let mascotStatus: 'happy' | 'sad' = 'sad';

  // Logic based on state
  if (currentStreak > 0 && dailyGoalMet) {
    // Consistent Streak (Good Status - Light Green/Accent Theme)
    mascotStatus = 'happy';
    themeClass = 'bg-green-500/10 border-green-400 text-green-800';
    if (currentStreak >= 7) {
      message = `You've maintained a ${currentStreak}-day streak! Keep up this incredible pace.`;
    } else {
      message = `Your learning streak is at ${currentStreak} days. Great start!`;
    }
  } else if (currentStreak > 0 && !dailyGoalMet) {
    // Streak in Danger (Warning Status - Light Yellow/Accent Theme)
    mascotStatus = 'sad';
    themeClass = 'bg-yellow-500/10 border-yellow-400 text-yellow-800';
    message = `Warning! Your ${currentStreak}-day streak is in danger. Finish today's goal is incomplete!`;
  } else {
    // No Streak (Danger Status - Light Red/Accent Theme)
    mascotStatus = 'sad';
    themeClass = 'bg-red-500/10 border-red-400 text-red-800';
    message = "Uh oh! You haven't started your learning today. Let's get back on track!";
  }


  return (
    <div className={`
      flex items-center p-5 rounded-xl border-l-4 shadow-md transition-all
      ${themeClass}
    `}>
      <MascotPlaceholder status={mascotStatus} />
      
      <div className="flex-grow mx-4">
        <p className="text-xs font-semibold uppercase">Techpadie Mascot says:</p>
        <p className="text-base font-medium">{message}</p>
      </div>

      <button
        onClick={() => console.log('Gamification link clicked')}
        className="flex items-center px-4 py-2 rounded-lg font-semibold text-white transition-colors duration-200"
        style={{ backgroundColor: '#227FA1', hover: { backgroundColor: '#1A6B8A' } }}
      >
        <FireIcon className="h-5 w-5 mr-2" />
        View Rewards
      </button>
    </div>
  );
}