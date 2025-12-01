// app/dashboard/components/StatCard.tsx
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
  const changeColor = changeType === 'positive' ? 'text-green-400' : 
                      changeType === 'negative' ? 'text-red-400' : 
                      'text-zinc-400';

  const ChangeIcon = changeType === 'positive' ? ArrowUpIcon : ArrowDownIcon;

  return (
    <div className="bg-[#1F2937] p-5 rounded-xl border border-[#2D3748] shadow-lg flex flex-col justify-between">
      
      {/* Icon and Title */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-lexend text-zinc-400 uppercase tracking-wider">{title}</h3>
        {IconComponent && <IconComponent className="h-5 w-5 text-purple-400" />}
      </div>
      
      {/* Value */}
      <p className="text-3xl font-inter font-bold text-white mb-1">
        {value} {unit && <span className="text-sm font-medium text-zinc-400">{unit}</span>}
      </p>
      
      {/* Change/Delta */}
      <div className={`flex items-center text-xs font-medium ${changeColor}`}>
        <ChangeIcon className="h-3 w-3 mr-1" />
        {change}
      </div>
    </div>
  );
}