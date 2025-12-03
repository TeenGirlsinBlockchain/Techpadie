"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronRightIcon, PlayCircleIcon, ClockIcon, FolderOpenIcon } from '@heroicons/react/24/solid';
import EnrollmentCard from '../../components/EnrollmentCard';

// Mock Data (Replace with server fetch)
const MOCK_COURSE_DETAILS = {
  id: 1,
  title: 'Introduction to Solidity & Smart Contracts',
  description: 'This foundational course is designed for beginners entering the Web3 development space. You will learn the core concepts of the Ethereum Virtual Machine (EVM), Solidity syntax, and practice deploying your first smart contract. By the end, you will be prepared to tackle intermediate development topics.',
  priceUSD: 99,
  imageUrl: '/images/solidity_course_banner.jpg', // Placeholder image path
  totalModules: 5,
  totalDurationHours: 6,
  isCertified: true,
  modules: [
    {
      id: 101,
      title: 'Module 1: Blockchain & EVM Fundamentals',
      lessons: [
        { id: 1, title: 'What is a Blockchain?', durationMinutes: 15 },
        { id: 2, title: 'Understanding the Ethereum Virtual Machine (EVM)', durationMinutes: 20 },
        { id: 3, title: 'Setting up Your Development Environment', durationMinutes: 30 },
      ],
    },
    {
      id: 102,
      title: 'Module 2: Solidity Syntax and Data Types',
      lessons: [
        { id: 4, title: 'Variables, State, and Storage', durationMinutes: 25 },
        { id: 5, title: 'Functions, Modifiers, and Events', durationMinutes: 35 },
      ],
    },
    {
      id: 103,
      title: 'Module 3: Security and Testing',
      lessons: [
        { id: 6, title: 'Common Solidity Vulnerabilities (Reentrancy)', durationMinutes: 40 },
        { id: 7, title: 'Writing Simple Unit Tests (Hardhat)', durationMinutes: 50 },
      ],
    },
    {
      id: 104,
      title: 'Module 4: Deployment and Interaction',
      lessons: [
        { id: 8, title: 'Deploying to a Testnet', durationMinutes: 45 },
        { id: 9, title: 'Interacting via Ethers.js', durationMinutes: 30 },
      ],
    },
  ],
};


// Accordion Component (defined outside to avoid rendering errors)
interface ModuleAccordionProps {
    module: typeof MOCK_COURSE_DETAILS.modules[0];
    isOpen: boolean;
    setOpen: (id: number) => void;
}

const ModuleAccordion: React.FC<ModuleAccordionProps> = ({ module, isOpen, setOpen }) => (
    <div className="border border-zinc-700 rounded-lg overflow-hidden">
        <button
            className="flex justify-between items-center w-full p-4 text-left font-semibold text-white hover:bg-zinc-800 transition"
            onClick={() => setOpen(module.id)}
        >
            <span className="flex items-center space-x-3">
                <FolderOpenIcon className="h-5 w-5 text-purple-400" />
                <span>{module.title} ({module.lessons.length} Lessons)</span>
            </span>
            <ChevronRightIcon className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-90 text-purple-400' : 'text-zinc-500'}`} />
        </button>

        {isOpen && (
            <div className="bg-zinc-800 p-4 border-t border-zinc-700">
                <ul className="space-y-3">
                    {module.lessons.map((lesson, index) => (
                        <li key={lesson.id} className="flex justify-between items-center text-zinc-400 text-sm pl-4 pr-2 hover:text-purple-400 transition">
                            <span className="flex items-center space-x-2">
                                <PlayCircleIcon className="h-4 w-4" />
                                <span>{index + 1}. {lesson.title}</span>
                            </span>
                            <span className="flex items-center space-x-1">
                                <ClockIcon className="h-4 w-4" />
                                <span>{lesson.durationMinutes} min</span>
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        )}
    </div>
);


// Main Page Component
export default function CourseViewPage({ params }: { params: { courseId: string } }) {
  const [openModuleId, setOpenModuleId] = useState<number | null>(MOCK_COURSE_DETAILS.modules[0]?.id || null);
  
  const course = MOCK_COURSE_DETAILS;

  const toggleAccordion = (moduleId: number) => {
    setOpenModuleId(openModuleId === moduleId ? null : moduleId);
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Breadcrumb */}
      <nav className="text-sm text-zinc-400 flex items-center space-x-1">
        <Link href="/dashboard" className="hover:text-white transition">Dashboard</Link>
        <ChevronRightIcon className="h-3 w-3" />
        <Link href="/dashboard/explore" className="hover:text-white transition">Explore Courses</Link>
        <ChevronRightIcon className="h-3 w-3" />
        <span className="text-white font-medium truncate max-w-sm">{course.title}</span>
      </nav>

      <h1 className="text-3xl font-inter font-bold text-white">{course.title}</h1>

      {/* 2. Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column (70%) - Content */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Course Description */}
          <section className="bg-[#1F2937] p-6 rounded-xl border border-[#2D3748]">
            <h2 className="text-2xl font-semibold mb-3">Course Description</h2>
            <p className="text-zinc-300 leading-relaxed">{course.description}</p>
          </section>

          {/* Course Overview (Accordion) */}
          <section className="bg-[#1F2937] p-6 rounded-xl border border-[#2D3748]">
            <h2 className="text-2xl font-semibold mb-5">Course Overview ({course.totalModules} Modules)</h2>
            <div className="space-y-3">
              {course.modules.map(module => (
                <ModuleAccordion 
                  key={module.id} 
                  module={module} 
                  isOpen={openModuleId === module.id}
                  setOpen={toggleAccordion}
                />
              ))}
            </div>
          </section>

        </div>

        {/* Right Column (30%) - Enrollment Card */}
        <aside className="lg:col-span-1">
          <EnrollmentCard 
            imageUrl={course.imageUrl}
            priceUSD={course.priceUSD}
            totalModules={course.totalModules}
            totalDurationHours={course.totalDurationHours}
            isCertified={course.isCertified}
          />
        </aside>
      </div>
    </div>
  );
}