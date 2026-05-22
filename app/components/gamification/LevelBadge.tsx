'use client';

import React from 'react';
import { useGamification } from '@/app/context/GamificationContext';
import { getLevelProgress } from '@/app/lib/utils';
import { Award } from 'lucide-react';
import { motion } from 'framer-motion';

export default function LevelBadge() {
  const { state } = useGamification();
  const { level, rank, xp } = state;
  const progressPercent = getLevelProgress(xp);

  const strokeDashoffset = 100 - progressPercent;

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-3 bg-white border border-gray-100 shadow-sm rounded-2xl p-2.5 transition-all duration-300"
    >
      <div className="relative w-12 h-12 flex items-center justify-center">
        {/* SVG Progress Circle */}
        <svg className="absolute w-full h-full -rotate-90">
          {/* Background circle */}
          <circle 
            cx="24" 
            cy="24" 
            r="20" 
            className="stroke-gray-100 fill-none" 
            strokeWidth="3.5"
          />
          {/* Progress circle */}
          <circle 
            cx="24" 
            cy="24" 
            r="20" 
            className="stroke-brand-500 fill-none transition-all duration-500 ease-out" 
            strokeWidth="3.5"
            strokeDasharray="125.6"
            strokeDashoffset={125.6 - (125.6 * progressPercent) / 100}
            strokeLinecap="round"
          />
        </svg>
        <span className="text-sm font-extrabold text-brand-600 z-10">{level}</span>
      </div>

      <div className="flex flex-col select-none">
        <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wide">
          Level Up Progress
        </span>
        <span className="text-sm font-extrabold text-gray-900 leading-tight">
          {rank}
        </span>
        <span className="text-xs font-semibold text-gray-500 leading-none mt-0.5">
          {progressPercent}% Complete
        </span>
      </div>
    </motion.div>
  );
}
