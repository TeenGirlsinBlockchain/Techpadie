"use client";

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import LandingNavbar from './dashboard/components/landing/LandingNavbar';
import { 
  RocketLaunchIcon, 
  GlobeAmericasIcon, 
  BookOpenIcon, 
  CheckBadgeIcon, 
  UserGroupIcon, 
  ArrowRightIcon 
} from '@heroicons/react/24/solid';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white font-sans selection:bg-[#227FA1]/20">
      
      <LandingNavbar />

      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        {/* Background Blobs */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-100 rounded-full blur-3xl opacity-30 translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-100 rounded-full blur-3xl opacity-30 -translate-x-1/2 translate-y-1/2"></div>

        <div className="max-w-7xl mx-auto px-6 relative z-10 grid lg:grid-cols-2 gap-12 items-center">
          
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-50 border border-orange-100 text-orange-600 text-xs font-bold uppercase tracking-wider mb-6">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse"></span>
              New: Hausa & Swahili Support
            </div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-gray-900 leading-[1.1] mb-6">
              Learn Tech in your <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-[#227FA1] to-purple-600">
                Native Language
              </span>
            </h1>
            
            <p className="text-xl text-gray-500 mb-8 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Master Web3, Coding, and Design with gamified lessons translated into Arabic, French, Swahili, and Hausa. Start your streak today.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
              <Link href="/dashboard" className="w-full sm:w-auto px-8 py-4 bg-[#227FA1] hover:bg-[#1a637e] text-white text-lg font-bold rounded-2xl shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2">
                Start Learning Free
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
              <Link href="#courses" className="w-full sm:w-auto px-8 py-4 bg-white border border-gray-200 text-gray-700 text-lg font-bold rounded-2xl hover:bg-gray-50 transition-all active:scale-95">
                Explore Courses
              </Link>
            </div>

            <div className="mt-10 flex items-center justify-center lg:justify-start gap-4 text-sm font-bold text-gray-400">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200"></div>
                ))}
              </div>
              <p>Join 1,200+ Students today</p>
            </div>
          </div>

          {/* Hero Visual (Floating Cards Mockup) */}
          <div className="relative hidden lg:block">
            {/* Main Card */}
            <div className="relative z-20 bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 transform -rotate-2 hover:rotate-0 transition-transform duration-500">
               <div className="flex items-center gap-4 mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                    <CheckBadgeIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">HTML Basics Completed!</h3>
                    <p className="text-sm text-gray-500">+50 XP Earned</p>
                  </div>
               </div>
               <div className="w-full bg-gray-100 rounded-full h-3 mb-2">
                  <div className="bg-green-500 w-full h-full rounded-full"></div>
               </div>
               <p className="text-xs font-bold text-gray-400 text-right">100%</p>
            </div>

            {/* Floating Language Card */}
            <div className="absolute -top-12 -right-8 z-10 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 animate-bounce-slow">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#227FA1]">
                    <GlobeAmericasIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-gray-400 uppercase">Current Language</p>
                    <p className="font-bold text-gray-900">Swahili (Kiswahili)</p>
                  </div>
               </div>
            </div>

            {/* Floating Streak Card */}
            <div className="absolute -bottom-8 -left-8 z-30 bg-white rounded-2xl shadow-xl border border-gray-100 p-4">
               <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-50 rounded-full flex items-center justify-center text-orange-500">
                    <RocketLaunchIcon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-3xl font-black text-gray-900">12</p>
                    <p className="text-xs font-bold text-gray-400 uppercase">Day Streak</p>
                  </div>
               </div>
            </div>
          </div>

        </div>
      </section>

      {/* --- FEATURES GRID (Bento Style) --- */}
      <section id="features" className="py-24 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-black text-gray-900 mb-4">Why learn with Techpadie?</h2>
            <p className="text-gray-500 max-w-2xl mx-auto">We do not just dump videos on you. We provide a structured, gamified, and localized learning experience designed for retention.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
               <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-[#227FA1] mb-6">
                 <GlobeAmericasIcon className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-3">Localized Content</h3>
               <p className="text-gray-500 leading-relaxed">
                 Do not let language be a barrier. Switch instantly between English, French, Arabic, and local dialects like Hausa.
               </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
               <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center text-orange-500 mb-6">
                 <RocketLaunchIcon className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-3">Gamified Streaks</h3>
               <p className="text-gray-500 leading-relaxed">
                 Stay motivated with daily goals, XP rewards, and streak tracking. Learning feels like a game, not a chore.
               </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300">
               <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-purple-600 mb-6">
                 <BookOpenIcon className="w-8 h-8" />
               </div>
               <h3 className="text-xl font-bold text-gray-900 mb-3">Text-Based & Data Lite</h3>
               <p className="text-gray-500 leading-relaxed">
                 Our documentation-style courses use 90% less data than video courses, making it easy to learn even on slow connections.
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- CTA SECTION --- */}
      <section className="py-24">
        <div className="max-w-5xl mx-auto px-6">
           <div className="bg-[#227FA1] rounded-[40px] p-12 lg:p-20 text-center relative overflow-hidden">
              {/* Decorative Circles */}
              <div className="absolute top-0 left-0 w-64 h-64 bg-white opacity-10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
              <div className="absolute bottom-0 right-0 w-64 h-64 bg-white opacity-10 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl"></div>

              <h2 className="text-3xl lg:text-5xl font-black text-white mb-6 relative z-10">
                Ready to launch your tech career?
              </h2>
              <p className="text-blue-100 text-lg mb-10 max-w-xl mx-auto relative z-10">
                Join the community of developers learning in a way that actually makes sense. Free to start, easy to stick with.
              </p>
              
              <Link href="/dashboard" className="inline-flex items-center gap-2 px-10 py-5 bg-white text-[#227FA1] text-lg font-bold rounded-2xl shadow-2xl hover:bg-gray-50 transition-all active:scale-95 relative z-10">
                Create Free Account
                <ArrowRightIcon className="w-5 h-5" />
              </Link>
           </div>
        </div>
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-gray-50 py-12 border-t border-gray-200">
         <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
               <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500 font-bold">T</div>
               <span className="font-bold text-gray-700">Techpadie © 2024</span>
            </div>
            <div className="flex gap-8 text-sm font-bold text-gray-500">
               <Link href="#" className="hover:text-[#227FA1]">Courses</Link>
               <Link href="#" className="hover:text-[#227FA1]">About Us</Link>
               <Link href="#" className="hover:text-[#227FA1]">Twitter</Link>
               <Link href="#" className="hover:text-[#227FA1]">Instagram</Link>
            </div>
         </div>
      </footer>
    </div>
  );
}