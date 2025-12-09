"use client";

import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/outline';
import { BoltIcon, ClockIcon, TrophyIcon, QuestionMarkCircleIcon } from '@heroicons/react/24/solid';

// Define a mapping for icons based on the metric key
const iconMap = {
  courses: BoltIcon,
  hours: ClockIcon,
  streak: TrophyIcon,
  quizzes: QuestionMarkCircleIcon,
};

interface StatCardProps {
  // Use a string key for easy identification and icon mapping
  metricKey: 'courses' | 'hours' | 'streak' | 'quizzes';
  title: string;
  value: string | number;
  change: string; // e.g., "+32% from last week"
  changeType: 'positive' | 'negative' | 'neutral'; // For dynamic color coding
  unit?: string; // e.g., "days", "hours"
}

export default function StatCard({
  metricKey,
  title,
  value,
  change,
  changeType,
  unit,
}: StatCardProps) {
  
  const IconComponent = iconMap[metricKey];
  
  // Determine color classes based on changeType
  const changeColor = changeType === 'positive' ? 'text-green-600' : // Darker color for white background
                      changeType === 'negative' ? 'text-red-600' : 
                      'text-gray-500';

  const ChangeIcon = changeType === 'positive' ? ArrowUpIcon : ArrowDownIcon;

  return (
    // Outer Container: Wavy Glassmorphism style applied
    <div className="relative bg-white/50 backdrop-blur-md p-5 rounded-xl border border-gray-200 shadow-lg transition-shadow hover:shadow-xl overflow-hidden">
      
      {/* Wavy Overlay Effect (Accent Blue with low opacity) */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `radial-gradient(circle at 100% 0%, rgba(34, 127, 161, 0.2) 0%, transparent 50%), 
                            radial-gradient(circle at 0% 100%, rgba(34, 127, 161, 0.2) 0%, transparent 50%)`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: '150% 150%'
        }}
      ></div>

      {/* Content (Z-indexed above the wave effect) */}
      <div className="relative z-10 flex flex-col justify-between h-full">
        
        {/* Icon and Title */}
        <div className="flex items-center justify-between mb-2">
          {/* Title: Darker color for white background */}
          <h3 className="text-sm font-lexend text-gray-500 uppercase tracking-wider">{title}</h3>
          {/* Icon: Uses Accent Blue */}
          {IconComponent && <IconComponent className="h-5 w-5" style={{ color: '#227FA1' }} />}
        </div>
        
        {/* Value */}
        <p className="text-3xl font-inter font-bold mb-1" style={{ color: '#000000B2' }}>
          {value} {unit && <span className="text-sm font-medium text-gray-500">{unit}</span>}
        </p>
        
        {/* Change/Delta */}
        <div className={`flex items-center text-xs font-medium ${changeColor}`}>
          <ChangeIcon className="h-3 w-3 mr-1" />
          {change}
        </div>
      </div>
    </div>
  );
}