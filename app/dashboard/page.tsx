
import StatCard from './components/StatCard';
import CourseCard from './components/CourseCard';
import Link from 'next/link';

// Mock Data structure for easy connection to backend API response
const statData = [
  { 
    metricKey: 'courses' as const, 
    title: 'Courses Enrolled', 
    value: 5, 
    change: '+2 from last month', 
    changeType: 'positive' as const 
  },
  { 
    metricKey: 'hours' as const, 
    title: 'Hours Learned', 
    value: 24, 
    change: '+32% from last week', 
    changeType: 'positive' as const 
  },
  { 
    metricKey: 'streak' as const, 
    title: 'Learning Streak', 
    value: 7, 
    unit: 'days', 
    change: 'Keep it up! 💪', 
    changeType: 'positive' as const 
  },
  { 
    metricKey: 'quizzes' as const, 
    title: 'Quizzes Completed', 
    value: 12, 
    change: '±0 this week', 
    changeType: 'neutral' as const 
  },
];

const courseData = [
  {
    courseTitle: 'Python for Data Science',
    nextLesson: 'Data Visualization with Matplotlib',
    progressPercentage: 65,
    timeRemaining: '2h 30m',
    id: 1,
  },
  {
    courseTitle: 'Blockchain Fundamentals',
    nextLesson: 'Module 3: Consensus Mechanisms',
    progressPercentage: 30,
    timeRemaining: '4h 15m',
    id: 2,
  },
];

export default function DashboardHome() {
  
  const handleContinueLearning = (courseId: number) => {
    console.log(`Navigating to course with ID: ${courseId}`);
    // when we go live and update the backend, router.push(`/course/${courseId}/continue`);
  };

  return (
    <div className="space-y-8">
      
      {/* 1. Top Banner / Welcome Section */}
      <section className="bg-[#1F2937] p-6 rounded-xl shadow-xl border border-[#2D3748]">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Welcome Back, Daniel 👋
            </h1>
            <p className="text-zinc-400 mt-1">
              Ready to continue your learning journey? You&apos;re doing amazing!
            </p>
            <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition">
              Continue Learning
            </button>
          </div>
          {/* Placeholder for the abstract illustration shown in the design */}
          <div className="w-24 h-16 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg opacity-70"></div>
        </div>
      </section>

      {/* 2. Key Statistics/Metrics Section (Using StatCard) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statData.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      {/* 3. Main Content Grid (Learning Cards and Right Column) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
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
                onContinue={() => handleContinueLearning(course.id)}
              />
            ))}
          </div>
        </div>

        {/* Right Column: Timer, Motivation (Takes 1/3 width on large screens) */}
        <div className="lg:col-span-1 space-y-6">
          {/* Today's Learning Timer Card */}
          <div className="bg-[#1F2937] p-5 rounded-xl border border-[#2D3748] shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Today&apos;s Learning Timer</h3>
            <p className="text-4xl font-bold text-green-400">45 mins</p>
            <p className="text-xs text-zinc-400 mt-2">Goal 60 minutes daily</p>
            <p className="text-xs text-yellow-400 mt-1">⭐ 7 day streak</p>
          </div>
          
          {/* Daily Motivation Card */}
          <div className="bg-[#1F2937] p-5 rounded-xl border border-[#2D3748] shadow-lg">
            <h3 className="text-lg font-semibold text-white mb-2">Daily Motivation</h3>
            <blockquote className="text-sm italic text-zinc-300 border-l-2 border-purple-500 pl-3">
              &apos;Learners who spend **15 minutes** a day finish **2x faster**&apos;
            </blockquote>
            <p className="text-xs text-zinc-400 mt-3">
              You&apos;re ahead of 78% of learners with your consistency!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}