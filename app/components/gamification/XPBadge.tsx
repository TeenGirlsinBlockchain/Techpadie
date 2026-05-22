'use client';

import React from 'react';
import { useGamification } from '@/app/context/GamificationContext';
import { Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export default function XPBadge() {
  const { state } = useGamification();
  const { xp, xpToNextLevel } = state;

  return (
    <motion.div 
      whileHover={{ scale: 1.05 }}
      className="flex items-center gap-2 px-3.5 py-2 bg-gradient-to-r from-violet-500 to-indigo-600 text-white rounded-xl shadow-md shadow-indigo-100/50 cursor-pointer"
    >
      <Sparkles className="w-4 h-4 text-violet-200 fill-violet-200/50" />
      <div className="flex flex-col leading-none">
        <span className="text-[10px] font-bold text-violet-200 uppercase tracking-wider">
          Experience Points
        </span>
        <span className="text-sm font-extrabold mt-0.5">
          {xp} <span className="text-xs font-medium text-violet-100">XP</span>
        </span>
      </div>
      <div className="border-l border-white/20 pl-2 ml-1 text-right leading-none">
        <span className="text-[9px] font-bold text-violet-200 block uppercase">Next lvl</span>
        <span className="text-[11px] font-extrabold mt-0.5 block">{xpToNextLevel} XP</span>
      </div>
    </motion.div>
  );
}
