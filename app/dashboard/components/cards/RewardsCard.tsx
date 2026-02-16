"use client";

import React from 'react';
import { GiftIcon, CircleStackIcon, SparklesIcon, ArrowRightIcon } from '@heroicons/react/24/solid';

export default function RewardsCard({ balance = 250 }) {
  return (
    <div className="relative bg-white/50 backdrop-blur-md p-6 rounded-2xl border border-gray-200 shadow-xl overflow-hidden">
      
      {/* Wave Decoration */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(circle at 20% 150%, rgba(34, 127, 161, 0.4) 0%, transparent 50%), 
                            radial-gradient(circle at 80% -50%, rgba(34, 127, 161, 0.4) 0%, transparent 50%)`,
        }}
      ></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Left: Balance Info */}
        <div className="flex items-center space-x-4">
          <div className="p-4 rounded-2xl bg-[#227FA1] text-white shadow-lg shadow-blue-200">
            <CircleStackIcon className="h-8 w-8" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Your Balance</h3>
            <div className="flex items-baseline space-x-2">
              <span className="text-4xl font-bold" style={{ color: '#000000B2' }}>{balance}</span>
              <span className="text-lg font-medium text-[#227FA1]">TPC</span>
            </div>
            <p className="text-xs text-gray-400 mt-1">Techpadie Coins</p>
          </div>
        </div>

        {/* Center: Progress / Milestone */}
        <div className="hidden lg:block grow max-w-xs px-8">
          <div className="flex justify-between text-xs font-bold mb-2 text-gray-500">
            <span>Next Reward: 500 TPC</span>
            <span className="text-[#227FA1]">50%</span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-1000" 
              style={{ width: '50%', backgroundColor: '#227FA1' }}
            ></div>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex space-x-3 w-full md:w-auto">
          <button className="flex-1 md:flex-none flex items-center justify-center px-6 py-3 bg-white border border-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-50 transition shadow-sm">
            <GiftIcon className="h-5 w-5 mr-2 text-pink-500" />
            Redeem
          </button>
          <button 
            className="flex-1 md:flex-none flex items-center justify-center px-6 py-3 text-white rounded-xl font-bold hover:opacity-90 transition shadow-lg shadow-blue-200"
            style={{ backgroundColor: '#227FA1' }}
          >
            Earn More
            <ArrowRightIcon className="h-4 w-4 ml-2" />
          </button>
        </div>
      </div>

      {/* Subtle bottom badge */}
      <div className="mt-6 pt-4 border-t border-gray-100 flex items-center text-xs text-gray-400 italic">
        <SparklesIcon className="h-4 w-4 mr-1 text-yellow-500" />
        Keep learning to unlock exclusive Web3 developer grants!
      </div>
    </div>
  );
}