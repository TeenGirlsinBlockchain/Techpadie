"use client";

import React from 'react';
import MascotBanner from '../components/MascotBanner';
import CourseCard from '../components/cards/CourseCard'; 
import { CheckCircleIcon, BookOpenIcon } from '@heroicons/react/24/outline';

// --- ENHANCED MOCK DATA ---
const userStreakData = {
  currentStreak: 10,
  dailyGoalMet: true,
};

const enrolledCoursesData = [
  {
    courseId: 101,
    title: 'Blockchain Fundamentals: Concepts & Theory',
    level: 'Beginner',
    progressPercentage: 85,
    lessonsCompleted: 8,
    totalLessons: 10,
    isCompleted: false,
    // New visual props
    imageUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&q=80&w=1000",
    instructorName: "Sarah Jenkins",
    instructorAvatar: "https://i.pravatar.cc/150?u=sarah",
    rating: 4.8,
    studentCount: 2450,
    duration: "6h 30m" 
  },
  {
    courseId: 302,
    title: 'Web3 Content Writing',
    level: 'Intermediate',
    progressPercentage: 42,
    lessonsCompleted: 4,
    totalLessons: 9,
    isCompleted: false,
    imageUrl: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1000",
    instructorName: "Jessica Lee",
    instructorAvatar: "https://i.pravatar.cc/150?u=jessica",
    rating: 4.6,
    studentCount: 1500,
    duration: "4h 15m"
  },
  {
    courseId: 205,
    title: 'Solana Ecosystem Development',
    level: 'Advanced',
    progressPercentage: 100,
    lessonsCompleted: 15,
    totalLessons: 15,
    isCompleted: true,
    imageUrl: "https://images.unsplash.com/photo-1642104704074-907c0698cbd9?auto=format&fit=crop&q=80&w=1000",
    instructorName: "Michael Chen",
    instructorAvatar: "https://i.pravatar.cc/150?u=michael",
    rating: 4.9,
    studentCount: 890,
    duration: "8h 00m"
  },
];

export default function MyCoursesPage() {
  
  // Separate Active and Completed courses
  const activeCourses = enrolledCoursesData.filter(c => !c.isCompleted);
  const completedCourses = enrolledCoursesData.filter(c => c.isCompleted);

  return (
    <div className="space-y-8">
      
      {/* 1. Page Header */}
      <div>
         <h1 className="text-3xl font-bold text-gray-800">My Courses</h1>
         <p className="text-gray-500 mt-1">Track your progress and continue learning.</p>
      </div>

      {/* 2. Dynamic Mascot Banner */}
      <MascotBanner 
        currentStreak={userStreakData.currentStreak}
        dailyGoalMet={userStreakData.dailyGoalMet}
      />

      {/* 3. Active Courses Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <BookOpenIcon className="h-5 w-5 text-[#227FA1]" />
            <h2 className="text-lg font-bold text-gray-700">In Progress ({activeCourses.length})</h2>
        </div>
        
        {activeCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeCourses.map((course) => (
                <CourseCard 
                    key={course.courseId} 
                    // Master Card Props
                    type="enrolled"
                    courseTitle={course.title}
                    level={course.level as any}
                    progressPercentage={course.progressPercentage}
                    imageUrl={course.imageUrl}
                    instructorName={course.instructorName}
                    instructorAvatar={course.instructorAvatar}
                    rating={course.rating}
                    studentCount={course.studentCount}
                    duration={course.duration}
                />
            ))}
            </div>
        ) : (
            <div className="text-center py-10 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
                <p className="text-gray-500">You have no active courses.</p>
            </div>
        )}
      </section>

      {/* 4. Completed Courses Section */}
      <section className="space-y-6 pt-6">
        <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
            <CheckCircleIcon className="h-5 w-5 text-green-500" />
            <h2 className="text-lg font-bold text-gray-700">Completed ({completedCourses.length})</h2>
        </div>

        {completedCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {completedCourses.map((course) => (
                    <CourseCard 
                        key={course.courseId} 
                        type="enrolled" // Still using enrolled type to show the 100% bar
                        courseTitle={course.title}
                        level={course.level as any}
                        progressPercentage={100} // Force 100% for completed visual
                        imageUrl={course.imageUrl}
                        instructorName={course.instructorName}
                        instructorAvatar={course.instructorAvatar}
                        rating={course.rating}
                        studentCount={course.studentCount}
                        duration={course.duration}
                    />
                ))}
            </div>
        ) : (
             <div className="text-center py-8 text-gray-400 text-sm italic">
                No courses completed yet. Keep pushing!
             </div>
        )}
      </section>
    </div>
  );
}