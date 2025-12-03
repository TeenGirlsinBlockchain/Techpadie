"use client";

import React, { useState, useEffect } from 'react';
import { GlobeAltIcon, ChevronDownIcon } from '@heroicons/react/24/outline';

// Define the supported languages
const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
  { code: 'sw', name: 'Kiswahili' },
  { code: 'ha', name: 'Hausa' },
  { code: 'pt', name: 'Português' },
];

export default function LanguageSwitcher() {
  // State to track the currently selected language code
  const [activeLang, setActiveLang] = useState('en');
  const [isOpen, setIsOpen] = useState(false);

  // Find the full name for display
  const activeLangName = SUPPORTED_LANGUAGES.find(lang => lang.code === activeLang)?.name || 'English';

  // Load initial language from localStorage
  useEffect(() => {
    const userLang = localStorage.getItem('techpadie_lang') || 'en';
    setActiveLang(userLang);
  }, []);

  const handleSelectLanguage = (code: string) => {
    setActiveLang(code);
    localStorage.setItem('techpadie_lang', code);
    setIsOpen(false);
    
    // NOTE: In the complete application, this would trigger a state update
    // to refetch content with the new language code.
    console.log(`Language switched to: ${code}`);
  };

  return (
    <div className="relative inline-block text-left z-20">
      <div>
        <button
          type="button"
          className="inline-flex justify-center items-center w-full rounded-lg border border-zinc-700 bg-[#1F2937] px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-zinc-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-zinc-800 transition"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <GlobeAltIcon className="-ml-1 mr-2 h-5 w-5 text-zinc-400" />
          {activeLangName}
          <ChevronDownIcon className="-mr-1 ml-2 h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-[#1F2937] border border-zinc-700 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
          role="menu"
          aria-orientation="vertical"
          aria-labelledby="language-menu-button"
        >
          <div className="py-1" role="none">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelectLanguage(lang.code)}
                className={`
                  block w-full text-left px-4 py-2 text-sm transition
                  ${activeLang === lang.code
                    ? 'bg-purple-600 text-white font-semibold'
                    : 'text-zinc-300 hover:bg-zinc-700 hover:text-white'
                  }
                `}
                role="menuitem"
              >
                {lang.name}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}