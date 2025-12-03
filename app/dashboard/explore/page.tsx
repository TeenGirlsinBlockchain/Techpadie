"use client";

import React, { useState, useMemo } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ExploreCourseCard from '../components/ExploreCourseCard';
import { ExploreCourse, CourseCategory } from '@/app/types/dashboard';

// --- MOCK DATA (when backend is ready, this is fetched from the server) ---
const ALL_CATEGORIES: CourseCategory[] = ['all', 'blockchain', 'defi', 'nfts', 'development', 'security'];

const MOCK_COURSES: ExploreCourse[] = [
  { id: 1, title: 'Introduction to Solidity & Smart Contracts', category: 'development', level: 'beginner', duration: '6 hours', rating: 4.8, enrolledCount: 2450, isNew: true },
  { id: 2, title: 'DeFi 101: Understanding Decentralized Finance', category: 'defi', level: 'beginner', duration: '4 hours', rating: 4.5, enrolledCount: 890, isNew: false },
  { id: 3, title: 'Advanced Cryptography for Blockchain Security', category: 'security', level: 'advanced', duration: '8 hours', rating: 4.9, enrolledCount: 120, isNew: false },
  { id: 4, title: 'Creating and Launching Your First NFT Collection', category: 'nfts', level: 'intermediate', duration: '3 hours', rating: 4.6, enrolledCount: 1500, isNew: true },
  { id: 5, title: 'Layer 2 Solutions: Scaling Ethereum', category: 'blockchain', level: 'intermediate', duration: '5 hours', rating: 4.7, enrolledCount: 650, isNew: false },
  { id: 6, title: 'Tokenomics and Governance Design', category: 'blockchain', level: 'advanced', duration: '7 hours', rating: 4.4, enrolledCount: 400, isNew: false },
];

// --- PAGE COMPONENT ---
export default function ExploreCoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<CourseCategory>('all');

  // Filtered courses based on current state (Optimized with useMemo)
  const filteredCourses = useMemo(() => {
    let courses = MOCK_COURSES;

    // 1. Filter by Category
    if (activeCategory !== 'all') {
      courses = courses.filter(course => course.category === activeCategory);
    }

    // 2. Filter by Search Term
    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      courses = courses.filter(course => 
        course.title.toLowerCase().includes(lowerCaseSearch)
      );
    }
    
    return courses;
  }, [activeCategory, searchTerm]);


  const getCategoryDisplayName = (category: CourseCategory) => {
    // Simple helper to convert category code to display name
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-inter font-bold text-white">Explore Our Courses</h1>

      {/* 1. Search Bar */}
      <div className="relative">
        <input 
          type="text" 
          placeholder="Search for Solidity, Layer 2, DeFi protocols..." 
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#1F2937] border border-zinc-700 text-white rounded-xl py-3 pl-12 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
        />
        <MagnifyingGlassIcon className="h-6 w-6 text-zinc-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
      </div>

      {/* 2. Category Filters */}
      <div className="flex space-x-3 overflow-x-auto pb-2">
        {ALL_CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`
              px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition
              ${activeCategory === category
                ? 'bg-purple-600 text-white shadow-md'
                : 'bg-[#1F2937] text-zinc-300 border border-zinc-700 hover:border-purple-500'
              }
            `}
          >
            {getCategoryDisplayName(category)}
          </button>
        ))}
      </div>


      {/* 3. Course Grid */}
      <section>
        <h2 className="text-xl font-semibold text-zinc-300 mb-4">
          {filteredCourses.length} Courses Found
        </h2>
        
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map(course => (
              <ExploreCourseCard key={course.id} course={course} />
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-[#1F2937] rounded-xl border border-zinc-700 text-zinc-400">
            <p>No courses match your search or filter criteria.</p>
          </div>
        )}
      </section>
    </div>
  );
}