import React from 'react';
import { BellIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { UserCircleIcon } from '@heroicons/react/24/solid'; 

export default function DashboardHeader() {
  return (
    <header className="flex flex-col md:flex-row justify-between items-center py-5 mb-8 gap-4 bg-transparent">
      
      {/* 1. Search Bar (Enhanced Design) */}
      <div className="relative w-full md:w-1/3 group">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 group-focus-within:text-[#227FA1] transition-colors" />
        </div>
        <input 
          type="text" 
          placeholder="Search courses..." 
          className="w-full bg-white border border-gray-200 text-gray-800 text-sm rounded-xl pl-10 pr-4 py-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#227FA1] focus:border-transparent transition-all placeholder-gray-400"
        />
      </div>

      {/* 2. Actions Area */}
      <div className="flex items-center space-x-3 md:space-x-6 w-full md:w-auto justify-end">
        
      

        {/* Notifications */}
        <button className="relative p-2.5 rounded-xl bg-white border border-gray-200 text-gray-500 hover:text-[#227FA1] hover:border-[#227FA1] transition-all shadow-sm">
          <BellIcon className="h-6 w-6" />
          {/* Notification Dot */}
          <span className="absolute top-2 right-2.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-white transform translate-x-1/2 -translate-y-1/2"></span>
        </button>
        
        {/* User Profile */}
        <button className="flex items-center space-x-3 pl-2 border-l border-gray-200">
           <div className="w-10 h-10 rounded-full bg-[#227FA1]/10 flex items-center justify-center text-[#227FA1]">
             <UserCircleIcon className="h-10 w-10" />
           </div>
           <div className="hidden md:flex flex-col items-start">
             <span className="text-sm font-bold text-gray-700">Daniel</span>
             <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Student</span>
           </div>
        </button>
      </div>
    </header>
  );
}