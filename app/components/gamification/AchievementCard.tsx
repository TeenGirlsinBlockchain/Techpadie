'use client';

import React from 'react';
import type { Achievement } from '@/app/types';
import { 
  BookOpen, 
  Flame, 
  Star, 
  Trophy, 
  Headphones, 
  Lock, 
  CheckCircle2, 
  Award 
} from 'lucide-react';
import { motion } from 'framer-motion';

interface AchievementCardProps {
  achievement: Achievement;
}

const ICON_MAP: Record<string, React.ComponentType<any>> = {
  BookOpen: BookOpen,
  Fire: Flame,
  Star: Star,
  Trophy: Trophy,
  Headphones: Headphones,
};

export default function AchievementCard({ achievement }: AchievementCardProps) {
  const IconComponent = ICON_MAP[achievement.icon] || Award;
  const { title, description, isUnlocked, xpReward, unlockedAt } = achievement;

  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', damping: 20, stiffness: 300 }}
      className={`
        relative overflow-hidden rounded-2xl border p-4.5 flex gap-4 transition-all duration-300 select-none
        ${isUnlocked 
          ? 'bg-white border-brand-100 shadow-sm' 
          : 'bg-gray-50/50 border-gray-100 opacity-70'
        }
      `}
    >
      {/* Icon frame */}
      <div 
        className={`
          w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 relative
          ${isUnlocked 
            ? 'bg-brand-500/10 text-brand-600' 
            : 'bg-gray-100 text-gray-400'
          }
        `}
      >
        <IconComponent className="w-6 h-6" />
        
        {/* Lock overlay for locked achievements */}
        {!isUnlocked && (
          <div className="absolute -bottom-1 -right-1 bg-white border border-gray-100 rounded-full p-0.5 text-gray-400 shadow-sm">
            <Lock className="w-3 h-3" />
          </div>
        )}
      </div>

      {/* Text Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-bold text-gray-900 truncate">{title}</h4>
          {isUnlocked ? (
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Earned
            </span>
          ) : (
            <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              +{xpReward} XP
            </span>
          )}
        </div>
        <p className="text-xs text-gray-500 font-medium mt-1 leading-normal">
          {description}
        </p>

        {isUnlocked && unlockedAt && (
          <div className="text-[10px] font-semibold text-gray-400 mt-2">
            Unlocked: {new Date(unlockedAt).toLocaleDateString()}
          </div>
        )}
      </div>
    </motion.div>
  );
}
