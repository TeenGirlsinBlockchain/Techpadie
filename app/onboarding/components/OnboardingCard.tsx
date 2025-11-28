"use client";

import React from 'react';

interface OnboardingCardProps {
  title: string;
  description: string;
  children: React.ReactNode;
  onContinue: () => void;
  isLastStep?: boolean;
}

export default function OnboardingCard({
  title,
  description,
  children,
  onContinue,
  isLastStep = false,
}: OnboardingCardProps) {
  return (
    <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-xl shadow-lg border border-gray-100 text-center">
      <header className="mb-8">
        <h1 className="text-3xl font-inter font-semibold text-gray-900 text-left">
          {title}
        </h1>
        <p className="text-sm text-gray-600 mt-1 text-left font-lexend">
          {description}
        </p>
      </header>

      <div className="space-y-6 text-left"> {/* Content will be passed as children */}
        {children}
      </div>

      <button
        onClick={onContinue}
        className="w-full mt-10 px-6 py-3 rounded-lg bg-teal-600 text-white font-inter font-medium hover:bg-teal-700 transition focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50"
      >
        {isLastStep ? "Finish" : "Continue"}
      </button>
    </div>
  );
}