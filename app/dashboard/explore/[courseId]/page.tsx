"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  ChevronRightIcon, 
  PlayCircleIcon, 
  ClockIcon, 
  CheckBadgeIcon, 
  DocumentTextIcon, 
  DevicePhoneMobileIcon,
  ChatBubbleLeftRightIcon,
  FolderOpenIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

// --- MOCK DATA (Matches the "Introduction to Web Development" theme) ---
const COURSE_DATA = {
  id: 1,
  title: 'Introduction to Web development : HTML , CSS and Javascript',
  description: 'Web development is the process of creating and maintaining websites or web applications, encompassing a variety of tasks such as designing user interfaces, coding functionality, and ensuring optimal performance. It involves front-end development, which focuses on the visual and interactive aspects users see, and back-end development.',
  price: 5.00,
  originalPrice: 20.00,
  currency: 'USDT',
  discount: '75% off',
  rating: 4.8,
  students: 100,
  totalHours: 72,
  totalSections: 10,
  totalExams: 3,
  imageUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=1000', // Coding image
  features: [
    { icon: <PlayCircleIcon className="w-5 h-5"/>, text: "Audio Resources" },
    { icon: <DocumentTextIcon className="w-5 h-5"/>, text: "12 modules" },
    { icon: <DevicePhoneMobileIcon className="w-5 h-5"/>, text: "Mobile and desktop responsive" },
    { icon: <CheckBadgeIcon className="w-5 h-5"/>, text: "Certification" },
  ],
  syllabus: [
    { id: 1, title: 'WEEK 1 - Introduction to web development' },
    { id: 2, title: 'WEEK 2 - HTML Basics & Structure' },
    { id: 3, title: 'WEEK 3 - CSS Styling & Layouts' },
    { id: 4, title: 'WEEK 4 - JavaScript Fundamentals' },
    { id: 5, title: 'WEEK 5 - Building Your First Project' },
  ]
};

// --- COMPONENT: STICKY ENROLLMENT CARD ---
const EnrollmentCard = ({ course }: { course: typeof COURSE_DATA }) => (
  <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sticky top-8">
    
    {/* 1. Image Thumbnail */}
    <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-6 group">
      <Image src={course.imageUrl} alt={course.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
      {/* Play Overlay */}
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
           <PlayCircleIcon className="w-8 h-8 text-[#227FA1]" />
        </div>
      </div>
    </div>

    {/* 2. Price Section */}
    <div className="flex items-center gap-3 mb-6">
      <span className="text-3xl font-black text-gray-900">
        {course.currency} {course.price.toFixed(2)}
      </span>
      <span className="text-lg text-gray-400 line-through decoration-gray-400">
        {course.currency} {course.originalPrice.toFixed(2)}
      </span>
      <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-bold rounded-lg uppercase">
        {course.discount}
      </span>
    </div>

    {/* 3. "This course includes" List */}
    <div className="mb-8">
      <h3 className="text-sm font-bold text-gray-900 mb-4">This course includes</h3>
      <ul className="space-y-3">
        {course.features.map((feature, idx) => (
          <li key={idx} className="flex items-center gap-3 text-sm text-gray-600 font-medium">
             <span className="text-gray-400">{feature.icon}</span>
             {feature.text}
          </li>
        ))}
      </ul>
    </div>

    {/* 4. Action Buttons */}
    <div className="space-y-3">
      <button className="w-full py-4 bg-[#227FA1] hover:bg-[#1a637e] text-white font-bold rounded-xl shadow-lg shadow-blue-200 transition-all active:scale-95">
        Proceed to course
      </button>
      <button className="w-full py-4 bg-[#F59E0B] hover:bg-[#d97706] text-white font-bold rounded-xl shadow-lg shadow-orange-100 flex items-center justify-center gap-2 transition-all active:scale-95">
        Send a message
        <ChatBubbleLeftRightIcon className="w-5 h-5" />
      </button>
    </div>
  </div>
);

// --- MAIN PAGE ---
export default function CourseViewPage() {
  const course = COURSE_DATA;

  return (
    <div className="min-h-screen pb-20">
      
      {/* 1. Breadcrumb & Search (Simplified for Context) */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
         <Link href="/dashboard" className="hover:text-[#227FA1]">Courses</Link>
         <ChevronRightIcon className="w-3 h-3" />
         <span>Recommended courses</span>
         <ChevronRightIcon className="w-3 h-3" />
         <span className="text-gray-800 font-medium truncate">{course.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT COLUMN: Content (66%) */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Header Card */}
          <section className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm relative overflow-hidden">
             <div className="relative z-10">
                <h1 className="text-3xl font-black text-gray-900 leading-tight mb-6">
                  {course.title}
                </h1>
                
                <p className="text-gray-500 leading-relaxed text-lg mb-8">
                  {course.description}
                </p>

                <div className="flex items-center gap-6 text-sm font-bold text-gray-500">
                   <div className="flex items-center gap-2">
                      <div className="flex -space-x-2">
                        {/* Fake user avatars for social proof */}
                        {[1,2,3].map(i => (
                          <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gray-200"></div>
                        ))}
                      </div>
                      <span>{course.students}+ bought this course</span>
                   </div>
                   
                   <div className="flex items-center gap-1 text-orange-400">
                      <StarIcon className="w-5 h-5" />
                      <span className="text-gray-900">{course.rating}</span>
                   </div>

                   <button className="text-[#227FA1] underline hover:text-[#1a637e]">
                      Based on popular reviews
                   </button>
                </div>
             </div>
          </section>

          {/* Syllabus Section */}
          <section className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Course content Overview</h2>
                <button className="text-[#227FA1] text-sm font-bold hover:underline">Collapse all sections</button>
             </div>

             {/* Stats Row */}
             <div className="flex gap-6 text-xs font-bold text-gray-500 uppercase tracking-wide mb-8">
                <span className="flex items-center gap-1"><FolderOpenIcon className="w-4 h-4"/> {course.totalSections} Sections</span>
                <span className="flex items-center gap-1"><DocumentTextIcon className="w-4 h-4"/> {course.totalExams} Modul-exams</span>
                <span className="flex items-center gap-1"><ClockIcon className="w-4 h-4"/> {course.totalHours} Total hours</span>
             </div>

             {/* The List */}
             <div className="space-y-4">
                {course.syllabus.map((item) => (
                  <div key={item.id} className="group flex items-center justify-between p-4 rounded-2xl border border-gray-100 hover:border-[#227FA1]/30 hover:shadow-md transition-all cursor-pointer bg-white">
                      <div className="flex items-center gap-4">
                         <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-[#227FA1] group-hover:text-white transition-colors">
                            <ChevronRightIcon className="w-4 h-4" />
                         </div>
                         <span className="font-bold text-gray-700 group-hover:text-[#227FA1] transition-colors">
                            {item.title}
                         </span>
                      </div>
                      
                      <button className="px-6 py-2 rounded-full bg-[#227FA1] text-white text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity shadow-lg shadow-blue-200">
                         Start now
                      </button>
                  </div>
                ))}
             </div>
          </section>

        </div>

        {/* RIGHT COLUMN: Sticky Sidebar (33%) */}
        <aside className="lg:col-span-1">
           <EnrollmentCard course={course} />
        </aside>

      </div>
    </div>
  );
}