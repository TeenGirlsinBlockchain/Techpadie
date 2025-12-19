"use client"
import DashboardClientWrapper from './components/DashboardClientWrapper';
import { FireIcon, ChartBarIcon } from '@heroicons/react/24/solid';

// Mock Data (remains the same)
const statData = [
  { metricKey: 'courses' as const, title: 'Courses Enrolled', value: 5, change: '+2 from last month', changeType: 'positive' as const },
  { metricKey: 'hours' as const, title: 'Hours Learned', value: 24, change: '+32% from last week', changeType: 'positive' as const },
  { metricKey: 'streak' as const, title: 'Learning Streak', value: 7, unit: 'days', change: 'Keep it up! 💪', changeType: 'positive' as const },
  { metricKey: 'quizzes' as const, title: 'Quizzes Completed', value: 12, change: '±0 this week', changeType: 'neutral' as const },
];

const courseData = [
  { courseTitle: 'Python for Data Science', nextLesson: 'Data Visualization with Matplotlib', progressPercentage: 65, timeRemaining: '2h 30m', id: 1 },
  { courseTitle: 'Blockchain Fundamentals', nextLesson: 'Module 3: Consensus Mechanisms', progressPercentage: 30, timeRemaining: '4h 15m', id: 2 },
];

export default function DashboardHome() {
  const userName = "Daniel";
  const weeklyProgress = 75; // This would be dynamic

  return (
    <div className="space-y-10 relative">
       {/* Custom Animation Styles */}
      <style jsx>{`
        /* 1. Background Blob Animation (Keep existing) */
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }

        /* 2. NEW: Dancing Wave Animation */
        @keyframes wave-shift {
          0% { transform: translateX(0) translateZ(0) scaleY(1); }
          50% { transform: translateX(-25%) translateZ(0) scaleY(0.8); }
          100% { transform: translateX(-50%) translateZ(0) scaleY(1); }
        }
        .animate-wave-slow { animation: wave-shift 20s linear infinite; }
        .animate-wave-fast { animation: wave-shift 15s linear infinite; }
      `}</style>

      {/* RE-DESIGNED HERO SECTION */}
      <section className="relative w-full">
        
        {/* --- THE MOVING BACKGROUND BLOBS (Behind the glass) --- */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-[#227FA1] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob -z-10"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000 -z-10"></div>
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000 -z-10"></div>

        {/* --- THE MAIN GLASS CARD --- */}
        <div className="relative overflow-hidden bg-white/30 backdrop-blur-xl rounded-3xl border border-white/40 shadow-xl p-8 md:p-10 z-10">
          
          {/* === NEW: DANCING INTERNAL WAVES === */}
          {/* We use two layered SVGs moving at different speeds for a parallax liquid effect */}
          <div className="absolute inset-0 pointer-events-none z-0 opacity-30 mix-blend-overlay">
             <svg className="absolute bottom-0 left-0 w-[200%] h-full animate-wave-slow" viewBox="0 0 1440 320" preserveAspectRatio="none">
                <path fill="#227FA1" d="M0,192L48,186.7C96,181,192,171,288,176C384,181,480,203,576,208C672,213,768,203,864,186.7C960,171,1056,149,1152,154.7C1248,160,1344,192,1392,208L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
            <svg className="absolute bottom-0 left-0 w-[200%] h-full animate-wave-fast opacity-70" viewBox="0 0 1440 320" preserveAspectRatio="none" style={{animationDirection: 'reverse'}}>
                <path fill="#227FA1" d="M0,224L48,213.3C96,203,192,181,288,181.3C384,181,480,203,576,224C672,245,768,267,864,261.3C960,256,1056,224,1152,213.3C1248,203,1344,213,1392,218.7L1440,224L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
            </svg>
          </div>

          <div className="relative z-20 flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Left text section remains the same */}
            <div className="max-w-xl">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3" style={{ color: '#000000B2' }}>
                Welcome Back, <span style={{ color: '#227FA1' }}>{userName}</span> 👋
              </h1>
              <p className="text-lg md:text-xl font-medium leading-relaxed" style={{ color: '#000000B2' }}>
                You&apos;ve completed <span className="font-bold text-gray-900">{weeklyProgress}%</span> of your weekly goal. 
                Keep that momentum going—the blockchain awaits!
              </p>
              
              <div className="mt-8 flex flex-wrap gap-4">
                <button 
                  className="px-8 py-3 rounded-xl font-bold text-white shadow-lg shadow-blue-200 transition-all hover:scale-105 active:scale-95"
                  style={{ backgroundColor: '#227FA1' }}
                >
                  Continue Learning
                </button>
              </div>
            </div>

            {/* === NEW: INNOVATIVE PROGRESS HUD === */}
            {/* Replaces the rocket. A functional data visualization designed in glassmorphism. */}
            <div className="flex-shrink-0 relative w-full lg:w-auto">
               {/* Glow effect behind the HUD */}
               <div className="absolute inset-0 bg-[#227FA1] rounded-3xl blur-2xl opacity-20 animate-pulse"></div>
               
               {/* The Glass HUD Container */}
               <div className="relative p-6 bg-white/40 backdrop-blur-md rounded-3xl border border-white/60 shadow-2xl flex flex-col items-center">
                  
                  {/* Circular Progress Indicator */}
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    {/* SVG for circular progress bar */}
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      {/* Background circle (track) */}
                      <circle className="text-white/30 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
                      {/* Progress circle (filled) - Using stroke-dasharray for percentage */}
                      <circle 
                        className="text-[#227FA1] stroke-current transition-all duration-1000 ease-out" 
                        strokeWidth="8" 
                        strokeLinecap="round" 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="transparent"
                        // Calculating circumference (2 * pi * r = ~251). 75% of 251 is ~188.
                        strokeDasharray={`${(weeklyProgress / 100) * 251.2} 251.2`}
                        strokeDashoffset="0"
                        transform="rotate(-90 50 50)" // Start from top
                      ></circle>
                    </svg>
                    {/* Center Text */}
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold" style={{ color: '#227FA1' }}>{weeklyProgress}%</span>
                      <span className="text-xs font-semibold uppercase tracking-wider text-gray-600">Weekly Goal</span>
                    </div>
                  </div>

                  {/* HUD Stats Footer */}
                  <div className="mt-6 w-full grid grid-cols-2 gap-4 pt-4 border-t border-white/30 text-sm">
                    <div className="flex items-center space-x-2 text-gray-700">
                      <FireIcon className="h-5 w-5 text-orange-500" />
                      <span className="font-semibold">3 Days Left</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-700">
                      <ChartBarIcon className="h-5 w-5 text-[#227FA1]" />
                      <span className="font-semibold text-right">+450 XP Earned</span>
                    </div>
                  </div>

               </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2 & 3. Main Dashboard Content */}
      <DashboardClientWrapper statData={statData} courseData={courseData} />
    </div>
  );
}