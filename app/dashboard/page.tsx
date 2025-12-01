
// Import the Client Wrapper
import DashboardClientWrapper from './components/DashboardClientWrapper'; 

// Mock Data structure (remains here, or is fetched from API)
const statData = [
  // ... (Your statData array remains here)
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
  // ... (Your courseData array remains here)
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
  
  // No more handleContinueLearning function here!
  
  return (
    <div className="space-y-8">
      
      {/* 1. Top Banner / Welcome Section (Remains a static Server Component part) */}
      <section className="bg-[#1F2937] p-6 rounded-xl shadow-xl border border-[#2D3748]">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-semibold text-white">
              Welcome Back, Daniel 👋
            </h1>
            <p className="text-zinc-400 mt-1">
              Ready to continue your learning journey? You&apos;re doing amazing!
            </p>
            {/* The button in the header is static here */}
            <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg text-sm font-medium hover:bg-purple-700 transition">
              Continue Learning
            </button>
          </div>
          <div className="w-24 h-16 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg opacity-70"></div>
        </div>
      </section>

      {/* 2 & 3. Main Dashboard Content (Passed to the Client Wrapper) */}
      <DashboardClientWrapper 
        statData={statData} 
        courseData={courseData} 
      />
    </div>
  );
}