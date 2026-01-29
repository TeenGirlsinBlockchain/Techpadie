"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import LanguageSwitcher from '../LanguageSwitcher';

export default function LandingNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Add shadow on scroll
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        
        {/* LOGO */}
        <Link href="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-[#227FA1] rounded-xl flex items-center justify-center text-white font-black text-xl">
            T
          </div>
          <span className="text-xl font-bold text-gray-900 tracking-tight">Techpadie</span>
        </Link>

        {/* DESKTOP LINKS */}
        <div className="hidden md:flex items-center gap-8">
          <Link href="#features" className="text-sm font-bold text-gray-500 hover:text-[#227FA1] transition">Features</Link>
          <Link href="#courses" className="text-sm font-bold text-gray-500 hover:text-[#227FA1] transition">Courses</Link>
          <Link href="#pricing" className="text-sm font-bold text-gray-500 hover:text-[#227FA1] transition">Pricing</Link>
        </div>

        {/* ACTIONS */}
        <div className="hidden md:flex items-center gap-4">
          <LanguageSwitcher />
          
          <Link href="/login" className="px-6 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-xl transition">
            Log in
          </Link>
          <Link href="/signup" className="px-6 py-2.5 bg-[#227FA1] hover:bg-[#1a637e] text-white text-sm font-bold rounded-xl shadow-lg shadow-blue-200 transition active:scale-95">
            Get Started
          </Link>
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button className="md:hidden p-2 text-gray-600" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <XMarkIcon className="w-6 h-6" /> : <Bars3Icon className="w-6 h-6" />}
        </button>
      </div>

      {/* MOBILE MENU */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b border-gray-100 p-6 flex flex-col gap-4 shadow-xl">
           <Link href="#features" className="text-lg font-bold text-gray-700">Features</Link>
           <Link href="#courses" className="text-lg font-bold text-gray-700">Courses</Link>
           <hr />
           <Link href="/login" className="text-lg font-bold text-gray-700">Log in</Link>
           <Link href="/signup" className="w-full py-3 bg-[#227FA1] text-white text-center font-bold rounded-xl">Get Started Free</Link>
        </div>
      )}
    </nav>
  );
}