"use client";

import React from "react";
import {
  FireIcon,
  TrophyIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/solid";

interface MascotBannerProps {
  currentStreak: number;
  dailyGoalMet: boolean;
}

export default function MascotBanner({
  currentStreak,
  dailyGoalMet,
}: MascotBannerProps) {
  // Mocking the last 7 days history for the "GitHub Style" contribution view
  // In a real app, this would be passed as a prop array: [true, true, false, true...]
  const weekHistory = [true, true, true, true, true, false, dailyGoalMet];

  return (
    <div className="relative overflow-hidden bg-white rounded-3xl border border-gray-100 shadow-lg group">
      {/* 1. BACKGROUND DECORATION (Subtle Tech Pattern) */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#227FA1 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      ></div>

      <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-6 gap-6">
        {/* LEFT: The "Duolingo" Hero Number */}
        <div className="flex items-center gap-5">
          {/* The Streak Flame Badge */}
          <div className="relative w-20 h-20 flex items-center justify-center bg-orange-50 rounded-full border-4 border-white shadow-md">
            <FireIcon
              className={`h-10 w-10 ${
                dailyGoalMet ? "text-orange-500 animate-pulse" : "text-gray-300"
              }`}
            />
            {/* Absolute Badge for count */}
            <div className="absolute -bottom-2 bg-[#227FA1] text-white text-xs font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm">
              Lvl 2
            </div>
          </div>

          <div>
            <h2 className="text-4xl font-black text-gray-800 tracking-tight">
              {currentStreak}{" "}
              <span className="text-lg font-bold text-gray-400 uppercase tracking-wider">
                Day Streak
              </span>
            </h2>
            <p className="text-sm font-medium text-gray-500 mt-1">
              {dailyGoalMet
                ? "You're on fire! Keep the momentum going."
                : "Complete today's lesson to extend your streak!"}
            </p>
          </div>
        </div>

        {/* MIDDLE: The "GitHub" Contribution Graph (Proof of Work) */}
        <div className="hidden lg:flex flex-col items-center">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">
            Last 7 Days
          </span>
          <div className="flex gap-2">
            {weekHistory.map((isActive, index) => (
              <div
                key={index}
                className={`
          w-8 h-10 rounded-md transition-all duration-300 border flex items-center justify-center
          ${
            isActive
              ? "bg-[#227FA1] border-[#227FA1] shadow-sm shadow-blue-200" // Active Day
              : "bg-gray-50 border-gray-200" // Missed Day
          }
        `}
                title={isActive ? "Goal Met" : "Missed"}
              >
                {/* Day Label inside the block */}
                {index === 6 && (
                  // Changed inactive text from text-gray-300 to text-gray-500 for visibility
                  <span
                    className={`text-[10px] font-bold ${
                      isActive ? "text-white" : "text-gray-500"
                    }`}
                  >
                    Today
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Action Area (Khan Calm) */}
        <div className="flex flex-col items-end gap-3 w-full md:w-auto">
          {/* Reward Teaser */}
          <div className="flex items-center gap-2 px-3 py-1 bg-yellow-50 rounded-lg border border-yellow-100">
            <TrophyIcon className="h-4 w-4 text-yellow-600" />
            <span className="text-xs font-bold text-yellow-700">
              +50 Coins pending
            </span>
          </div>

          <button className="w-full md:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-[#227FA1] hover:bg-[#1a637e] text-white rounded-xl font-bold transition-all shadow-md shadow-blue-100 active:scale-95">
            Continue Learning
            <ArrowRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* BOTTOM PROGRESS BAR (Subtle Wrapper) */}
      <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100">
        <div
          className="h-full bg-orange-500 transition-all duration-1000"
          style={{ width: `${(currentStreak / 30) * 100}%` }} // Example: Progress towards 30 days
        ></div>
      </div>
    </div>
  );
}
