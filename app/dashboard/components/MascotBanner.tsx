"use client";

import React from 'react';
import { SparklesIcon, XCircleIcon } from '@heroicons/react/24/solid';


interface MascotPlaceholderProps {
    isConsistent: boolean;
}

const MascotPlaceholder: React.FC<MascotPlaceholderProps> = ({ isConsistent }) => (
    <div className="w-16 h-16 bg-white/30 rounded-full flex items-center justify-center text-4xl shadow-inner">
        {isConsistent ? '😀' : '😞'}
    </div>
);

interface MascotBannerProps {
  currentStreak: number; // Number of consecutive learning days
  dailyGoalMet: boolean; // Did the user complete today's goal?
}

export default function MascotBanner({ currentStreak, dailyGoalMet }: MascotBannerProps) {
  // Now, isConsistent is a simple boolean variable
  const isConsistent = currentStreak > 0 && dailyGoalMet; 

  // --- Dynamic Content Logic ---
  let mascotMessage: string;
  let mascotTheme: string;
  let IconComponent;
  
  if (isConsistent) {
    mascotTheme = 'bg-green-700/80 border-green-500';
    IconComponent = SparklesIcon;
    if (currentStreak >= 7) {
      mascotMessage = `Awesome! You've maintained a ${currentStreak}-day streak! Keep up the momentum!`;
    } else {
      mascotMessage = `Great start! Your learning streak is at ${currentStreak} days.`;
    }
  } else if (currentStreak === 0 && dailyGoalMet === false) {
    mascotTheme = 'bg-red-700/80 border-red-500';
    IconComponent = XCircleIcon;
    mascotMessage = "Uh oh! You haven't started your learning today. Don't break the chain!";
  } else { // Current streak > 0 but today's goal is not met yet
     mascotTheme = 'bg-yellow-700/80 border-yellow-500';
    IconComponent = XCircleIcon;
    mascotMessage = `Your streak is at ${currentStreak} days, but today's goal is incomplete! Finish strong!`;
  }
  
  return (
    <div className={`p-6 rounded-xl border-2 text-white shadow-2xl flex items-center justify-between transition-colors duration-500 ${mascotTheme}`}>
      
      {/* Mascot and Message */}
      <div className="flex items-center space-x-4">
        {/* Call the stable component and pass the necessary prop */}
        <MascotPlaceholder isConsistent={isConsistent} /> 
        <div>
          <h2 className="text-xl font-inter font-bold">Techpadie Mascot says:</h2>
          <p className="text-sm font-lexend mt-1">{mascotMessage}</p>
        </div>
      </div>
      
      {/* Call to Action / Icon */}
      <button 
        className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition flex items-center space-x-2"
        onClick={() => console.log('Gamification link clicked')}
      >
        <IconComponent className="h-5 w-5" />
        <span>View Rewards</span>
      </button>
    </div>
  );
}