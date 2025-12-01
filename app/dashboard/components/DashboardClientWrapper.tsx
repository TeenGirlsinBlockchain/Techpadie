"use client";

import StatCard from './StatCard';
import CourseCard from './CourseCard';
import Link from 'next/link';

// Use the mock data defined in the original page for now
interface DataProps {
    statData: any[]; // Define proper types later
    courseData: any[];
}

export default function DashboardClientWrapper({ statData, courseData }: DataProps) {
    
    // Now this function is defined in a Client Component!
    const handleContinueLearning = (courseId: number) => {
        console.log(`Navigating to course with ID: ${courseId}`);
        // Here you would use useRouter() for navigation
    };
    
    // Timer content is also interactive, so we keep it here
    const renderTimerCard = () => (
        <div className="bg-[#1F2937] p-5 rounded-xl border border-[#2D3748] shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Today's Learning Timer</h3>
            <p className="text-4xl font-bold text-green-400">45 mins</p>
            <p className="text-xs text-zinc-400 mt-2">Goal 60 minutes daily</p>
            <p className="text-xs text-yellow-400 mt-1">⭐ 7 day streak</p>
        </div>
    );

    const renderMotivationCard = () => (
        <div className="bg-[#1F2937] p-5 rounded-xl border border-[#2D3748] shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Daily Motivation</h3>
            <blockquote className="text-sm italic text-zinc-300 border-l-2 border-purple-500 pl-3">
              'Learners who spend **15 minutes** a day finish **2x faster**'
            </blockquote>
            <p className="text-xs text-zinc-400 mt-3">
              You're ahead of 78% of learners with your consistency!
            </p>
        </div>
    );

    return (
        <div className="space-y-8">
            
            {/* 2. Key Statistics/Metrics Section (Using StatCard) */}
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {statData.map((stat) => (
                    <StatCard key={stat.title} {...stat} />
                ))}
            </section>

            {/* 3. Main Content Grid (Learning Cards and Right Column) */}
            <div className="grid grid-cols-1 lg:col-span-3 gap-6">
                
                {/* Left Column: Course Cards (Takes 2/3 width on large screens) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Continue Learning</h2>
                        <Link href="/dashboard/my-courses" className="text-sm font-medium text-purple-400 hover:text-purple-300">
                            View All Courses &gt;
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {courseData.map((course) => (
                            <CourseCard 
                                key={course.id}
                                courseTitle={course.courseTitle}
                                nextLesson={course.nextLesson}
                                progressPercentage={course.progressPercentage}
                                timeRemaining={course.timeRemaining}
                                // NOW WE CAN SAFELY PASS THE FUNCTION!
                                onContinue={() => handleContinueLearning(course.id)} 
                            />
                        ))}
                    </div>
                </div>

                {/* Right Column: Timer, Motivation (Takes 1/3 width on large screens) */}
                <div className="lg:col-span-1 space-y-6">
                    {renderTimerCard()}
                    {renderMotivationCard()}
                </div>
            </div>
        </div>
    );
}