"use client";

import React from 'react';

interface OptionSelectorProps {
  label: string;
  options: { value: string; label: string }[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
}

export default function OptionSelector({ label, options, selectedValue, onSelect }: OptionSelectorProps) {
  return (
    <div className="mb-6">
      <h3 className="text-base font-inter font-medium text-gray-800 mb-2">
        {label}
      </h3>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => onSelect(option.value)}
            className={`
              px-4 py-2 rounded-full text-sm font-lexend transition
              ${selectedValue === option.value
                ? 'bg-blue-600 text-white shadow-md' // Active state
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200' // Inactive state
              }
            `}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}