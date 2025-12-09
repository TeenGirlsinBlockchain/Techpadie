"use client";

import React from 'react';
import { CurrencyDollarIcon, PresentationChartBarIcon, CheckCircleIcon, CubeTransparentIcon } from '@heroicons/react/24/solid';


export default function EnrollmentCard({
  imageUrl,
  priceUSD,
  totalModules,
  totalDurationHours,
  isCertified,
}: EnrollmentCardProps) {
  return (
    // CHANGES: Light Glassmorphism style
    <div className="bg-white/70 backdrop-blur-md rounded-xl border border-gray-200 shadow-xl overflow-hidden sticky top-24">
      
      {/* Course Image */}
      <div className="h-40 w-full overflow-hidden">
        {/* ... (Image placeholder remains the same, adjusted for light theme) ... */}
         <div 
          className="w-full h-full bg-cover bg-center" 
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <div className="w-full h-full bg-gray-300/50 flex items-center justify-center text-xl font-bold text-gray-700">
            [Course Image]
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* Price and Enrollment Button */}
        <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-300">
          <div className="text-3xl font-bold flex items-center space-x-2" style={{ color: '#000000B2' }}>
            <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
            <span>${priceUSD.toLocaleString()}</span>
          </div>
          <button 
            className="px-4 py-2 text-white rounded-lg font-medium transition"
            onClick={() => console.log('Enrollment clicked')}
            // Action button uses Accent Blue
            style={{ backgroundColor: '#227FA1', hover: { backgroundColor: '#1A6B8A' } }}
          >
            Enroll Now
          </button>
        </div>
        
        {/* Course Includes List */}
        <h3 className="text-lg font-semibold mb-3" style={{ color: '#000000B2' }}>Course Includes:</h3>
        
        <ul className="space-y-3 text-sm text-gray-700">
          {/* Icons use Accent Blue */}
          <li className="flex items-center space-x-3">
            <CubeTransparentIcon className="h-5 w-5" style={{ color: '#227FA1' }} />
            <span>**{totalModules} Modules** of content</span>
          </li>
          {/* ... (Other list items follow similar styling) ... */}
          <li className="flex items-center space-x-3">
            <PresentationChartBarIcon className="h-5 w-5" style={{ color: '#227FA1' }} />
            <span>**{totalDurationHours} Hours** Total Learning Time</span>
          </li>
          <li className="flex items-center space-x-3">
            <CheckCircleIcon className={`h-5 w-5 ${isCertified ? 'text-green-600' : 'text-gray-500'}`} />
            <span>{isCertified ? 'Includes Certificate of Completion' : 'No Certificate offered'}</span>
          </li>
        </ul>
        
        {/* Connect Wallet Button */}
        <button 
          className="mt-6 w-full inline-flex items-center justify-center px-4 py-3 border rounded-lg font-semibold transition"
          onClick={() => console.log('Connect Wallet clicked')}
          // Outline button uses Accent Blue
          style={{ borderColor: '#227FA1', color: '#227FA1' }}
        >
          Connect Wallet to Enroll
        </button>
      </div>
    </div>
  );
}