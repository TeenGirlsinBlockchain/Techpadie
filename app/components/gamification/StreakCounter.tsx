'use client';

import React from 'react';
import { useGamification } from '@/app/context/GamificationContext';
import { Flame } from 'lucide-react';
import { motion } from 'framer-motion';

export default function StreakCounter() {
  const { state } = useGamification();
  const { currentStreak, dailyGoalMet } = state;

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className={`
        flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-bold shadow-sm transition-all duration-300
        ${dailyGoalMet 
          ? 'bg-amber-50 border-amber-200 text-amber-600 shadow-amber-100/50' 
          : 'bg-gray-50 border-gray-200 text-gray-400'
        }
      `}
    >
      <div className="relative">
        <Flame 
          className={`
            w-5 h-5 transition-transform duration-300
            ${dailyGoalMet ? 'text-amber-500 fill-amber-500 animate-bounce' : 'text-gray-300'}
          `} 
        />
        {dailyGoalMet && (
          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-brand-500 rounded-full animate-ping" />
        )}
      </div>
      <div className="flex flex-col leading-none">
        <span className="text-xs font-semibold text-gray-500">Streak</span>
        <span className="text-sm font-extrabold text-gray-900">
          {currentStreak} {currentStreak === 1 ? 'Day' : 'Days'}
        </span>
      </div>
    </motion.div>
  );
}
