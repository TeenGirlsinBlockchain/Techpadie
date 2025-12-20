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
  VideoCameraIcon,
  LockClosedIcon,
  ChevronDownIcon,
  FolderOpenIcon
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';

// --- 1. DYNAMIC DATA STRUCTURE (Backend Ready) ---
const COURSE_DATA = {
  id: 1,
  title: 'Introduction to Web development : HTML , CSS and Javascript',
  description: 'Web development is the process of creating and maintaining websites or web applications. This course covers everything from the basics of HTML to advanced JavaScript interactive features.',
  price: 5.00,
  originalPrice: 20.00,
  currency: 'USDT',
  discount: '75% off',
  rating: 4.8,
  students: 100,
  totalHours: 72,
  totalSections: 10,
  totalExams: 3,
  imageUrl: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&q=80&w=1000',
  features: [
    { icon: <PlayCircleIcon className="w-5 h-5"/>, text: "Audio Resources" },
    { icon: <DocumentTextIcon className="w-5 h-5"/>, text: "12 modules" },
    { icon: <DevicePhoneMobileIcon className="w-5 h-5"/>, text: "Mobile and desktop responsive" },
    { icon: <CheckBadgeIcon className="w-5 h-5"/>, text: "Certification" },
  ],
  // UPDATED: Syllabus now contains nested 'lessons'
  syllabus: [
    { 
      id: 1, 
      title: 'WEEK 1 - Introduction to web development', 
      lessons: [
        { id: 101, title: 'How the Internet Works', duration: '15 min', isFree: true },
        { id: 102, title: 'Setting up VS Code', duration: '10 min', isFree: true },
        { id: 103, title: 'Your First HTML Page', duration: '25 min', isFree: false }
      ]
    },
    { 
      id: 2, 
      title: 'WEEK 2 - HTML Basics & Structure',
      lessons: [
        { id: 201, title: 'HTML Tags & Elements', duration: '20 min', isFree: false },
        { id: 202, title: 'Forms and Inputs', duration: '30 min', isFree: false }
      ]
    },
    { 
      id: 3, 
      title: 'WEEK 3 - CSS Styling & Layouts',
      lessons: [
        { id: 301, title: 'CSS Selectors', duration: '20 min', isFree: false },
        { id: 302, title: 'Flexbox vs Grid', duration: '45 min', isFree: false }
      ]
    },
    { id: 4, title: 'WEEK 4 - JavaScript Fundamentals', lessons: [] }, // Example empty module
    { id: 5, title: 'WEEK 5 - Building Your First Project', lessons: [] },
  ]
};

// --- 2. SUB-COMPONENT: ACCORDION ITEM ---
// This component handles the opening/closing logic individually
const SyllabusAccordion = ({ module, isOpen, onToggle }: { module: any, isOpen: boolean, onToggle: () => void }) => {
  return (
    <div className="border border-gray-100 rounded-2xl overflow-hidden bg-white mb-4 transition-all duration-300 hover:shadow-md">
      
      {/* HEADER (Click to Toggle) */}
      <div 
        onClick={onToggle}
        className={`flex items-center justify-between p-5 cursor-pointer transition-colors ${isOpen ? 'bg-blue-50/50' : 'bg-white hover:bg-gray-50'}`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${isOpen ? 'bg-[#227FA1] text-white' : 'bg-gray-100 text-gray-400'}`}>
            {isOpen ? <ChevronDownIcon className="w-4 h-4" /> : <ChevronRightIcon className="w-4 h-4" />}
          </div>
          <span className={`font-bold text-sm md:text-base ${isOpen ? 'text-[#227FA1]' : 'text-gray-700'}`}>
            {module.title}
          </span>
        </div>
        
        {/* Helper text showing lesson count */}
        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:block">
          {module.lessons.length} Lessons
        </span>
      </div>

      {/* DROPDOWN BODY (Lessons) */}
      <div 
        className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="p-2 bg-gray-50/30 border-t border-gray-100">
          {module.lessons.length > 0 ? (
            <div className="space-y-1">
              {module.lessons.map((lesson: any) => (
                <div key={lesson.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-white hover:shadow-sm transition-all cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-blue-50 text-[#227FA1]">
                      <VideoCameraIcon className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium text-gray-600 group-hover:text-gray-900">
                      {lesson.title}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-gray-400">{lesson.duration}</span>
                    {lesson.isFree ? (
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded uppercase">Free</span>
                    ) : (
                      <LockClosedIcon className="w-4 h-4 text-gray-300" />
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4 text-center text-sm text-gray-400 italic">
              No lessons available in this module yet.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// --- 3. COMPONENT: STICKY ENROLLMENT CARD ---
const EnrollmentCard = ({ course }: { course: typeof COURSE_DATA }) => (
  <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sticky top-8">
    <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-6 group">
      <Image src={course.imageUrl} alt={course.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-lg">
           <PlayCircleIcon className="w-8 h-8 text-[#227FA1]" />
        </div>
      </div>
    </div>

    <div className="flex items-center gap-3 mb-6">
      <span className="text-3xl font-black text-gray-900">{course.currency} {course.price.toFixed(2)}</span>
      <span className="text-lg text-gray-400 line-through decoration-gray-400">{course.currency} {course.originalPrice.toFixed(2)}</span>
      <span className="px-2 py-1 bg-orange-100 text-orange-600 text-xs font-bold rounded-lg uppercase">{course.discount}</span>
    </div>

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

// --- 4. MAIN PAGE ---
export default function CourseViewPage() {
  const course = COURSE_DATA;
  
  // State to track which module is open. Default to the first one (id: 1)
  const [openSectionId, setOpenSectionId] = useState<number | null>(1);

  const toggleSection = (id: number) => {
    setOpenSectionId(prev => (prev === id ? null : id));
  };

  return (
    <div className="min-h-screen pb-20">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-400 mb-8">
         <Link href="/dashboard" className="hover:text-[#227FA1]">Courses</Link>
         <ChevronRightIcon className="w-3 h-3" />
         <Link href="/dashboard/explore" className="hover:text-[#227FA1]">Explore</Link>
         <ChevronRightIcon className="w-3 h-3" />
         <span className="text-gray-800 font-medium truncate">{course.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        
        {/* LEFT COLUMN: Content */}
        <div className="lg:col-span-2 space-y-10">
          
          {/* Header Card */}
          <section className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm">
             <h1 className="text-3xl font-black text-gray-900 leading-tight mb-6">{course.title}</h1>
             <p className="text-gray-500 leading-relaxed text-lg mb-8">{course.description}</p>
             <div className="flex items-center gap-6 text-sm font-bold text-gray-500">
                <div className="flex items-center gap-1 text-orange-400">
                   <StarIcon className="w-5 h-5" />
                   <span className="text-gray-900">{course.rating}</span>
                </div>
                <span>{course.students}+ students enrolled</span>
             </div>
          </section>

          {/* Syllabus Section */}
          <section className="bg-white p-8 rounded-4xl border border-gray-100 shadow-sm">
             <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Course Content</h2>
                <button 
                  onClick={() => setOpenSectionId(null)} 
                  className="text-[#227FA1] text-sm font-bold hover:underline"
                >
                  Collapse all
                </button>
             </div>

             {/* Stats Row */}
             <div className="flex gap-6 text-xs font-bold text-gray-500 uppercase tracking-wide mb-8">
                <span className="flex items-center gap-1"><FolderOpenIcon className="w-4 h-4"/> {course.totalSections} Sections</span>
                <span className="flex items-center gap-1"><ClockIcon className="w-4 h-4"/> {course.totalHours} Total hours</span>
             </div>

             {/* The Dynamic Accordion List */}
             <div>
                {course.syllabus.map((module) => (
                  <SyllabusAccordion 
                    key={module.id} 
                    module={module} 
                    isOpen={openSectionId === module.id}
                    onToggle={() => toggleSection(module.id)}
                  />
                ))}
             </div>
          </section>

        </div>

        {/* RIGHT COLUMN: Sidebar */}
        <aside className="lg:col-span-1">
           <EnrollmentCard course={course} />
        </aside>

      </div>
    </div>
  );
}