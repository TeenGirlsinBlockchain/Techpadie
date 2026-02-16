/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import React from 'react';
import StatCard from './cards/StatCard';
import CourseCard from './cards/CourseCard';
import Link from 'next/link';
import { ClockIcon, FireIcon, SparklesIcon } from '@heroicons/react/24/outline';

interface DataProps {
    statData: any[]; 
    courseData: any[];
}

export default function DashboardClientWrapper({ statData, courseData }: DataProps) {
    
    const handleContinueLearning = (courseId: number) => {
        console.log(`Navigating to course with ID: ${courseId}`);
    };
    
    // Updated to Light Glassmorphism
    const renderTimerCard = () => (
        <div className="bg-white/40 backdrop-blur-xl p-6 rounded-[24px] border border-white/60 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
                <div className="flex items-center gap-2 mb-4">
                    <ClockIcon className="h-5 w-5 text-[#227FA1]" />
                    <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider">Learning Timer</h3>
                </div>
                <p className="text-5xl font-black text-[#227FA1]">45<span className="text-xl ml-1 text-gray-400">mins</span></p>
                
                <div className="mt-6 space-y-3">
                    <div className="flex justify-between text-xs font-bold">
                        <span className="text-gray-400">Daily Goal</span>
                        <span className="text-[#227FA1]">75%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1.5">
                        <div className="bg-[#227FA1] h-full rounded-full w-[75%]" />
                    </div>
                    <p className="flex items-center gap-1 text-xs font-bold text-orange-500 mt-2">
                        <FireIcon className="h-4 w-4" /> 7 Day Streak!
                    </p>
                </div>
            </div>
        </div>
    );

    const renderMotivationCard = () => (
        <div className="bg-gradient-to-br from-[#227FA1] to-[#1a637e] p-6 rounded-[24px] shadow-lg shadow-blue-100 text-white relative overflow-hidden">
             {/* Decorative Sparkle */}
            <SparklesIcon className="absolute -right-4 -top-4 h-24 w-24 opacity-10 rotate-12" />
            
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                Daily Tip
            </h3>
            <blockquote className="text-sm leading-relaxed font-medium opacity-90">
                &ldquo;Learners who spend <span className="underline decoration-2 underline-offset-4">15 minutes</span> a day finish 2x faster.&rdquo;
            </blockquote>
            <div className="mt-4 pt-4 border-t border-white/20">
                <p className="text-xs font-semibold opacity-80">
                    You&apos;re ahead of 78% of learners this week! 🚀
                </p>
            </div>
        </div>
    );

    return (
        <div className="space-y-10">
            
            {/* 1. Statistics Grid */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statData.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </section>

            {/* 2. Main Layout Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                
                {/* Left Side: Course Grid (2/3 width) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-end px-2">
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800">Continue Learning</h2>
                            <p className="text-sm text-gray-500 font-medium">Pick up right where you left off</p>
                        </div>
                        <Link href="/dashboard/my-courses" className="text-sm font-bold text-[#227FA1] hover:underline">
                            View All
                        </Link>
                    </div>

                    {/* THE FIX: Course Cards in a Responsive Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {courseData.map((course) => (
                            <CourseCard 
                                key={course.id}
                                courseTitle={course.courseTitle}
                                level="Beginner" // These will be dynamic later
                                imageUrl="https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80&w=1000"
                                instructorName="Chris Walter"
                                instructorAvatar="https://i.pravatar.cc/150?u=chris"
                                studentCount={120}
                                rating={5.0}
                                isEnrolled={true}
                                onAction={() => handleContinueLearning(course.id)} 
                            />
                        ))}
                    </div>
                </div>

                {/* Right Side: Sidebar Widgets (1/3 width) */}
                <div className="space-y-6">
                    <h2 className="text-xl font-bold text-gray-800 px-2 invisible lg:visible">Activity</h2>
                    {renderTimerCard()}
                    {renderMotivationCard()}
                    
                    {/* Extra placeholder for system consistency */}
                    <div className="p-6 rounded-3xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center text-center py-10">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3">
                            <span className="text-2xl">🏆</span>
                        </div>
                        <p className="text-sm font-bold text-gray-400">Upcoming Challenge</p>
                        <p className="text-xs text-gray-300 mt-1">Unlock at Level 15</p>
                    </div>
                </div>
            </div>
        </div>
    );
}