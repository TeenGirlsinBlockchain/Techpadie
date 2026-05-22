'use client';

import React from 'react';
import { useGamification } from '@/app/context/GamificationContext';
import { Calendar, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WeeklyHeatmap() {
  const { state } = useGamification();
  const { weeklyHistory, weeklyLearningMinutes } = state;

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC' });
  };

  const getDayNumber = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.getUTCDate();
  };

  return (
    <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-5 select-none">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calendar className="w-4.5 h-4.5 text-gray-500" />
          <h4 className="text-sm font-extrabold text-gray-900">Weekly Progress</h4>
        </div>
        <span className="text-[11px] font-bold text-brand-600 bg-brand-50 px-2 py-0.5 rounded-full">
          Total: {weeklyLearningMinutes} mins
        </span>
      </div>

      <div className="grid grid-cols-7 gap-3">
        {weeklyHistory.map((day, idx) => {
          const dayName = getDayName(day.date);
          const dayNum = getDayNumber(day.date);

          return (
            <motion.div 
              key={day.date}
              whileHover={{ scale: 1.08 }}
              className="flex flex-col items-center gap-1.5"
            >
              <span className="text-[10px] font-bold text-gray-400 uppercase">
                {dayName}
              </span>
              
              <div 
                className={`
                  w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs border transition-all duration-300 relative group cursor-pointer
                  ${day.goalMet
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
                    : day.xpEarned > 0
                      ? 'bg-amber-50 border-amber-200 text-amber-600'
                      : 'bg-gray-50 border-gray-100 text-gray-400'
                  }
                `}
              >
                {dayNum}
                {day.goalMet && (
                  <CheckCircle className="absolute -top-1 -right-1 w-3.5 h-3.5 text-emerald-500 fill-white" />
                )}

                {/* Hover Tooltip */}
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-30 bg-gray-900 text-white text-[10px] font-bold rounded-lg py-1 px-2.5 whitespace-nowrap shadow-lg">
                  <p>{day.minutesLearned} mins learned</p>
                  <p className="text-brand-300">+{day.xpEarned} XP</p>
                  <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
