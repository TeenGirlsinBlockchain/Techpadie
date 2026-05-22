'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles } from 'lucide-react';

interface MicroCelebrationProps {
  active: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
}

export default function MicroCelebration({
  active,
  title,
  subtitle = 'Milestone Reached!',
  onClose,
}: MicroCelebrationProps) {
  
  useEffect(() => {
    if (active) {
      const timer = setTimeout(() => {
        onClose();
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [active, onClose]);

  return (
    <AnimatePresence>
      {active && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none select-none">
          {/* Transparent full-screen interceptor for particle boundaries */}
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px] pointer-events-auto" onClick={onClose} />
          
          {/* Confetti Particles */}
          <div className="absolute inset-0 overflow-hidden">
            {Array.from({ length: 24 }).map((_, i) => {
              const xStart = Math.random() * 100;
              const xEnd = xStart + (Math.random() * 40 - 20);
              const delay = Math.random() * 0.5;
              const duration = 2 + Math.random() * 2;
              const scale = 0.5 + Math.random() * 0.8;
              
              const colors = ['bg-brand-500', 'bg-amber-400', 'bg-violet-500', 'bg-emerald-400', 'bg-sky-400'];
              const colorClass = colors[Math.floor(Math.random() * colors.length)];

              return (
                <motion.div
                  key={i}
                  initial={{ 
                    opacity: 0, 
                    x: `${xStart}vw`, 
                    y: '110vh', 
                    scale, 
                    rotate: 0 
                  }}
                  animate={{ 
                    opacity: [0, 1, 1, 0], 
                    x: `${xEnd}vw`, 
                    y: '-10vh', 
                    rotate: 360 * (Math.random() > 0.5 ? 1 : -1) 
                  }}
                  transition={{ 
                    duration, 
                    delay, 
                    ease: 'easeOut' 
                  }}
                  className={`absolute w-3.5 h-3.5 rounded-sm ${colorClass}`}
                />
              );
            })}
          </div>

          {/* Celebration Card */}
          <motion.div
            initial={{ scale: 0.8, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 15, stiffness: 200 }}
            className="bg-white border border-gray-100 shadow-2xl rounded-2xl p-6 w-[340px] flex flex-col items-center text-center relative pointer-events-auto"
          >
            {/* Sparkling Ring */}
            <div className="w-16 h-16 rounded-full bg-brand-50 flex items-center justify-center text-brand-600 relative mb-4">
              <Trophy className="w-8 h-8" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 border border-dashed border-brand-300 rounded-full"
              />
              <Star className="absolute -top-1 -right-1 w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
              <Sparkles className="absolute -bottom-1 -left-1 w-4 h-4 text-violet-500 fill-violet-500 animate-pulse" />
            </div>

            <span className="text-[10px] font-bold text-brand-500 uppercase tracking-widest">
              {subtitle}
            </span>
            <h3 className="text-base font-extrabold text-gray-900 mt-1">
              {title}
            </h3>
            
            <button
              onClick={onClose}
              className="mt-5 w-full py-2 bg-brand-500 hover:bg-brand-600 active:scale-98 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-brand-500/25 cursor-pointer"
            >
              Awesome!
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
