"use client";

import React, { useState, useEffect } from 'react';
import { GlobeAltIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { getCookie, setCookie } from 'cookies-next';

const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'ar', name: 'العربية' },
  { code: 'sw', name: 'Kiswahili' },
  { code: 'ha', name: 'Hausa' },
  { code: 'pt', name: 'Português' },
];

export default function LanguageSwitcher() {
  const [activeLang, setActiveLang] = useState('en');
  const [isOpen, setIsOpen] = useState(false);

  // Sync state with the actual Google Cookie on load
  useEffect(() => {
    const langCookie = getCookie('googtrans'); 
    if (langCookie) {
      const code = String(langCookie).split('/').pop();
      setActiveLang(code || 'en');
    }
  }, []);

  const activeLangName = SUPPORTED_LANGUAGES.find(lang => lang.code === activeLang)?.name || 'English';

  const handleSelectLanguage = (code: string) => {
    setActiveLang(code);
    setIsOpen(false);

    // 1. Set the Cookie for Google Translate
    setCookie('googtrans', `/en/${code}`);
    setCookie('googtrans', `/en/${code}`, { domain: window.location.hostname });

    // 2. Persist to LocalStorage (optional backup)
    localStorage.setItem('techpadie_lang', code);

    // 3. Reload to trigger the translation
    window.location.reload();
  };

  return (
    <div className="relative z-50">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-bold text-gray-700 hover:border-[#227FA1] hover:text-[#227FA1] transition-all shadow-sm"
      >
        <GlobeAltIcon className="h-5 w-5 text-gray-400" />
        <span className="hidden md:inline">{activeLangName}</span>
        <ChevronDownIcon className="h-3 w-3 text-gray-400" />
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
          <div className="py-1">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleSelectLanguage(lang.code)}
                className={`
                  block w-full text-left px-4 py-3 text-sm font-medium transition-colors border-l-4
                  ${activeLang === lang.code
                    ? 'bg-blue-50 text-[#227FA1] border-[#227FA1]' // Active styling
                    : 'text-gray-600 border-transparent hover:bg-gray-50'
                  }
                `}
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