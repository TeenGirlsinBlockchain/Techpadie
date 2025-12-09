import React from 'react';
import LanguageSwitcher from './LanguageSwitcher';
import { BellIcon, UserCircleIcon } from '@heroicons/react/24/outline';

export default function DashboardHeader() {
  return (
    <header className="flex justify-between items-center py-4 mb-8">
      {/* Search Bar Placeholder */}
      <div className="relative w-1/3">
        <input 
          type="text" 
          placeholder="Search courses, modules, or rewards..." 
          className="w-full bg-gray-100 border border-gray-300 rounded-lg py-2 px-4 text-sm focus:outline-none focus:ring-2"
          style={{ 
            '--tw-ring-color': '#227FA1', 
            color: '#000000B2' 
          } as React.CSSProperties} // Enforce dark text color for input
        />
      </div>

      {/* Actions and User */}
      <div className="flex items-center space-x-4">
        <LanguageSwitcher />

        {/* Color change: Buttons and Icons */}
        <button className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
          <BellIcon className="h-6 w-6 text-gray-500" />
        </button>
        
        <button className="flex items-center space-x-2">
            {/* User Icon color is now the accent blue for distinction */}
            <UserCircleIcon className="h-8 w-8" style={{ color: '#227FA1' }} /> 
            <span className="text-sm font-medium" style={{ color: '#000000B2' }}>Daniel</span>
        </button>
      </div>
    </header>
  );
}