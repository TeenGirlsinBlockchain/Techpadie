"use client";

import React, { useState, useMemo } from 'react';
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline';
import CourseCard from '../components/cards/CourseCard'; // Using the Master Card
import { ExploreCourse, CourseCategory } from '@/app/types/dashboard';

// --- MOCK DATA (Enhanced with Images & Instructors) ---
const ALL_CATEGORIES: CourseCategory[] = ['all', 'blockchain', 'defi', 'nfts', 'development', 'security'];

const MOCK_COURSES: any[] = [
  { 
    id: 1, 
    title: 'Introduction to Solidity & Smart Contracts', 
    category: 'development', 
    level: 'Beginner', 
    duration: '6h 30m', 
    rating: 4.8, 
    studentCount: 2450, 
    instructorName: "Sarah Jenkins",
    instructorAvatar: "https://i.pravatar.cc/150?u=sarah",
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1000",
  },
  { 
    id: 2, 
    title: 'DeFi 101: Understanding Decentralized Finance', 
    category: 'defi', 
    level: 'Beginner', 
    duration: '4h 15m', 
    rating: 4.5, 
    studentCount: 890, 
    instructorName: "Michael Chen",
    instructorAvatar: "https://i.pravatar.cc/150?u=michael",
    imageUrl: "https://images.unsplash.com/photo-1620321023374-d1a68fddadb3?auto=format&fit=crop&q=80&w=1000",
  },
  { 
    id: 3, 
    title: 'Advanced Cryptography for Blockchain Security', 
    category: 'security', 
    level: 'Advanced', 
    duration: '8h 00m', 
    rating: 4.9, 
    studentCount: 120, 
    instructorName: "Dr. Alex Rivest",
    instructorAvatar: "https://i.pravatar.cc/150?u=alex",
    imageUrl: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1000",
  },
  { 
    id: 4, 
    title: 'Creating and Launching Your First NFT Collection', 
    category: 'nfts', 
    level: 'Intermediate', 
    duration: '3h 45m', 
    rating: 4.6, 
    studentCount: 1500, 
    instructorName: "Jessica Lee",
    instructorAvatar: "https://i.pravatar.cc/150?u=jessica",
    imageUrl: "https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&q=80&w=1000",
  },
  { 
    id: 5, 
    title: 'Layer 2 Solutions: Scaling Ethereum', 
    category: 'blockchain', 
    level: 'Intermediate', 
    duration: '5h 20m', 
    rating: 4.7, 
    studentCount: 650, 
    instructorName: "David Kim",
    instructorAvatar: "https://i.pravatar.cc/150?u=david",
    imageUrl: "https://images.unsplash.com/photo-1639322537228-ad7117a7a640?auto=format&fit=crop&q=80&w=1000",
  },
  { 
    id: 6, 
    title: 'Tokenomics and Governance Design', 
    category: 'blockchain', 
    level: 'Advanced', 
    duration: '7h 10m', 
    rating: 4.4, 
    studentCount: 400, 
    instructorName: "Elena Vostok",
    instructorAvatar: "https://i.pravatar.cc/150?u=elena",
    imageUrl: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?auto=format&fit=crop&q=80&w=1000",
  },
];

// --- PAGE COMPONENT ---
export default function ExploreCoursesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<CourseCategory>('all');

  // Filter Logic
  const filteredCourses = useMemo(() => {
    let courses = MOCK_COURSES;

    if (activeCategory !== 'all') {
      courses = courses.filter(course => course.category === activeCategory);
    }

    if (searchTerm) {
      const lowerCaseSearch = searchTerm.toLowerCase();
      courses = courses.filter(course => 
        course.title.toLowerCase().includes(lowerCaseSearch)
      );
    }
    
    return courses;
  }, [activeCategory, searchTerm]);


  const getCategoryDisplayName = (category: CourseCategory) => {
    return category.charAt(0).toUpperCase() + category.slice(1);
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
           <h1 className="text-3xl font-bold text-gray-800">Explore Courses</h1>
           <p className="text-gray-500 mt-2">Discover new skills in Web3, DeFi, and Blockchain development.</p>
        </div>
        
        {/* Search Bar - Styled for Light Theme */}
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="Search courses..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl py-3 pl-12 pr-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#227FA1] focus:border-transparent transition-all"
          />
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
        </div>
      </div>

      {/* 2. Category Filters */}
      <div className="flex space-x-3 overflow-x-auto pb-4 scrollbar-hide">
        {ALL_CATEGORIES.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`
              px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap transition-all duration-200 border
              ${activeCategory === category
                ? 'bg-[#227FA1] text-white border-[#227FA1] shadow-md shadow-blue-100' // Active State
                : 'bg-white text-gray-500 border-gray-200 hover:border-[#227FA1] hover:text-[#227FA1]' // Inactive State
              }
            `}
          >
            {getCategoryDisplayName(category)}
          </button>
        ))}
      </div>


      {/* 3. Course Grid (Using Master Card) */}
      <section>
        <div className="flex items-center gap-2 mb-6">
           <FunnelIcon className="h-5 w-5 text-gray-400" />
           <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider">
             {filteredCourses.length} {filteredCourses.length === 1 ? 'Result' : 'Results'}
           </h2>
        </div>
        
        {filteredCourses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredCourses.map(course => (
        <CourseCard 
          key={course.id} 
          type="explore" 
          
          // JUST PASS THE PATH HERE
          href={`/dashboard/explore/${course.id}`} 
          
          courseTitle={course.title}
          imageUrl={course.imageUrl}
          level={course.level}
          duration={course.duration}
          rating={course.rating}
          studentCount={course.studentCount}
          instructorName={course.instructorName}
          instructorAvatar={course.instructorAvatar}
        />
      ))}
    </div>
        ) : (
          // Empty State - Glassmorphism Style
          <div className="flex flex-col items-center justify-center py-20 bg-white/50 backdrop-blur-sm rounded-3xl border border-dashed border-gray-300 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
               <MagnifyingGlassIcon className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-bold text-gray-800">No courses found</h3>
            <p className="text-gray-500 mt-1 max-w-md">
              We could not find any courses matching "{searchTerm}". Try adjusting your filters or search terms.
            </p>
            <button 
              onClick={() => {setSearchTerm(''); setActiveCategory('all');}}
              className="mt-6 text-[#227FA1] font-bold hover:underline"
            >
              Clear all filters
            </button>
          </div>
        )}
      </section>
    </div>
  );
}