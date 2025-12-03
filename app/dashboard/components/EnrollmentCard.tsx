"use client";

import React from 'react';
import { CurrencyDollarIcon, PresentationChartBarIcon, CheckCircleIcon, CubeTransparentIcon } from '@heroicons/react/24/solid';

interface EnrollmentCardProps {
  imageUrl: string;
  priceUSD: number;
  totalModules: number;
  totalDurationHours: number;
  isCertified: boolean;
}

export default function EnrollmentCard({
  imageUrl,
  priceUSD,
  totalModules,
  totalDurationHours,
  isCertified,
}: EnrollmentCardProps) {
  return (
    <div className="bg-[#1F2937] rounded-xl border border-[#2D3748] shadow-lg overflow-hidden sticky top-24">
      
      {/* Course Image */}
      <div className="h-40 w-full overflow-hidden">
        {/* Placeholder for the dynamic image */}
        <div 
          className="w-full h-full bg-cover bg-center" 
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          {/* Fallback/Image Placeholder */}
          <div className="w-full h-full bg-zinc-600/50 flex items-center justify-center text-xl font-bold text-white">
            [Course Image]
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Price and Enrollment Button */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-zinc-700">
          <div className="text-3xl font-bold text-white flex items-center space-x-2">
            <CurrencyDollarIcon className="h-6 w-6 text-green-400" />
            <span>${priceUSD.toLocaleString()}</span>
          </div>
          <button 
            className="px-4 py-2 bg-purple-600 text-white rounded-lg font-medium hover:bg-purple-700 transition"
            onClick={() => console.log('Enrollment clicked')}
          >
            Enroll Now
          </button>
        </div>
        
        {/* Course Includes List */}
        <h3 className="text-lg font-semibold text-white mb-3">Course Includes:</h3>
        
        <ul className="space-y-3 text-sm">
          {/* Total Modules */}
          <li className="flex items-center text-zinc-300 space-x-3">
            <CubeTransparentIcon className="h-5 w-5 text-purple-400" />
            <span>**{totalModules} Modules** of content</span>
          </li>
          {/* Total Duration */}
          <li className="flex items-center text-zinc-300 space-x-3">
            <PresentationChartBarIcon className="h-5 w-5 text-purple-400" />
            <span>**{totalDurationHours} Hours** Total Learning Time</span>
          </li>
          {/* Certification */}
          <li className="flex items-center text-zinc-300 space-x-3">
            <CheckCircleIcon className={`h-5 w-5 ${isCertified ? 'text-green-400' : 'text-zinc-500'}`} />
            <span>{isCertified ? 'Includes Certificate of Completion' : 'No Certificate offered'}</span>
          </li>
        </ul>
        
        {/* Connect Wallet Button */}
        <button 
          className="mt-6 w-full inline-flex items-center justify-center px-4 py-3 border border-purple-500 text-purple-400 rounded-lg font-semibold hover:bg-purple-500 hover:text-white transition"
          onClick={() => console.log('Connect Wallet clicked')}
        >
          Connect Wallet to Enroll
        </button>
      </div>
    </div>
  );
}