"use client"
import DashboardClientWrapper from './components/DashboardClientWrapper';
import { FireIcon, ChartBarIcon } from '@heroicons/react/24/solid';

// Mock Data
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
  const weeklyProgress = 75;

  return (
    <div className="space-y-10 relative">
      <style jsx>{`
        @keyframes waveMove {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .wave-container {
          position: absolute;
          width: 200%; /* Double width to allow seamless loop */
          height: 100%;
          bottom: -5px;
          left: 0;
          pointer-events: none;
        }
        .animate-wave-1 { animation: waveMove 12s linear infinite; }
        .animate-wave-2 { animation: waveMove 8s linear infinite; }
        .animate-wave-3 { animation: waveMove 4s linear infinite; }
      `}</style>

      {/* RE-DESIGNED HERO SECTION (Clean, No Distracting Blobs) */}
      <section className="relative w-full">
        
        {/* THE MAIN GLASS CARD */}
        <div className="relative overflow-hidden bg-white/60 backdrop-blur-xl rounded-3xl border border-gray-200 shadow-xl p-8 md:p-10 z-10">
          
          {/* === DANCING LIQUID WAVES (Internal Texture) === */}
          <div className="absolute inset-0 z-0 opacity-20">
            {/* Layer 1: Slow & Subtle */}
            <div className="wave-container animate-wave-1 opacity-40">
              <svg viewBox="0 0 1440 320" className="w-full h-full preserve-3d">
                <path fill="#227FA1" d="M0,160 C320,300,420,50,720,160 C1020,270,1120,50,1440,160 L1440,320 L0,320 Z"></path>
                <path fill="#227FA1" d="M1440,160 C1760,300,1860,50,2160,160 C2460,270,2560,50,2880,160 L2880,320 L1440,320 Z"></path>
              </svg>
            </div>
            {/* Layer 2: Faster & Opposite */}
            <div className="wave-container animate-wave-2 opacity-30" style={{ animationDirection: 'reverse' }}>
              <svg viewBox="0 0 1440 320" className="w-full h-full">
                <path fill="#227FA1" d="M0,100 C320,150,420,0,720,100 C1020,200,1120,0,1440,100 L1440,320 L0,320 Z"></path>
                <path fill="#227FA1" d="M1440,100 C1760,150,1860,0,2160,100 C2460,200,2560,0,2880,100 L2880,320 L1440,320 Z"></path>
              </svg>
            </div>
          </div>

          <div className="relative z-20 flex flex-col lg:flex-row items-center justify-between gap-10">
            {/* Left Content */}
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
                  className="px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all hover:translate-y-[-2px] active:translate-y-[0px]"
                  style={{ backgroundColor: '#227FA1' }}
                >
                  Continue Learning
                </button>
              </div>
            </div>

            {/* PROGRESS HUD (Useful & Innovative) */}
            <div className="flex-shrink-0 w-full lg:w-auto">
               <div className="relative p-6 bg-white/50 backdrop-blur-md rounded-3xl border border-white shadow-lg flex flex-col items-center">
                  
                  {/* Circular Progress */}
                  <div className="relative w-40 h-40 flex items-center justify-center">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle className="text-gray-200 stroke-current" strokeWidth="8" cx="50" cy="50" r="40" fill="transparent"></circle>
                      <circle 
                        className="transition-all duration-1000 ease-out" 
                        strokeWidth="8" 
                        strokeLinecap="round" 
                        cx="50" 
                        cy="50" 
                        r="40" 
                        fill="transparent"
                        stroke="#227FA1"
                        strokeDasharray={`${(weeklyProgress / 100) * 251.2} 251.2`}
                        transform="rotate(-90 50 50)"
                      ></circle>
                    </svg>
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className="text-4xl font-bold" style={{ color: '#227FA1' }}>{weeklyProgress}%</span>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">Goal</span>
                    </div>
                  </div>

                  {/* HUD Stats */}
                  <div className="mt-6 w-full grid grid-cols-2 gap-6 pt-4 border-t border-gray-100 text-sm">
                    <div className="flex items-center space-x-2">
                      <FireIcon className="h-5 w-5 text-orange-500" />
                      <span className="font-bold text-gray-700">3 Day Streak</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <ChartBarIcon className="h-5 w-5" style={{ color: '#227FA1' }} />
                      <span className="font-bold text-gray-700">Level 12</span>
                    </div>
                  </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      <DashboardClientWrapper statData={statData} courseData={courseData} />
    </div>
  );
}