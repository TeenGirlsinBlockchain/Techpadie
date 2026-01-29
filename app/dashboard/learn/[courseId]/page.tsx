"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  CheckCircleIcon, 
  ChevronRightIcon, 
  ArrowLeftIcon,
  BookmarkIcon,
  ClipboardDocumentIcon
} from '@heroicons/react/24/solid';

// --- MOCK DATA ---
const COURSE_CONTENT = {
  id: 1,
  title: 'Introduction to Web development',
  progress: 35, 
  modules: [
    { 
      id: 1, 
      title: 'Module 1: Getting Started', 
      lessons: [
        { 
          id: 101, 
          title: 'How the Internet Works', 
          duration: '10 min read', 
          isCompleted: true,
          type: 'text',
          content: `
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p class="mb-6 text-gray-600 leading-relaxed text-lg">
              The internet is a global network of computers that communicate with each other using standardized protocols.
            </p>
            <div class="bg-blue-50 border-l-4 border-[#227FA1] p-4 my-6 rounded-r-xl">
              <p class="text-[#227FA1] font-bold text-sm">💡 Key Concept</p>
              <p class="text-gray-700 mt-1">
                The web is not the internet. The internet is the infrastructure; the web is a service built on top of that infrastructure.
              </p>
            </div>
          `
        },
        { 
          id: 102, 
          title: 'Setting up VS Code', 
          duration: '15 min read', 
          isCompleted: false,
          type: 'text',
          content: `
             <h2 class="text-2xl font-bold text-gray-900 mb-4">Installation</h2>
             <p class="mb-6 text-gray-600 leading-relaxed text-lg">
               Visual Studio Code is a lightweight but powerful source code editor.
             </p>
             `
        }
      ]
    },
    { 
      id: 2, 
      title: 'Module 2: HTML Basics',
      lessons: [
        { id: 201, title: 'HTML Tags & Elements', duration: '12 min read', isCompleted: false, type: 'text', content: '<p>HTML stands for HyperText Markup Language...</p>' },
        { id: 202, title: 'Forms and Inputs', duration: '20 min read', isCompleted: false, type: 'text', content: '<p>Forms are used to collect user input...</p>' },
      ]
    }
  ]
};

export default function CourseLearnPage({ params }: { params: { courseId: string } }) {
  // 1. Initialize State
  // We default to the very first lesson of the first module
  const [activeLesson, setActiveLesson] = useState(COURSE_CONTENT.modules[0].lessons[0]); 
  const [completedLessonIds, setCompletedLessonIds] = useState<number[]>([101]); // Mocking completed IDs

  // 2. Flatten Lessons for Easy Navigation
  // This turns the nested structure into a simple list: [Lesson1, Lesson2, Lesson3, Lesson4...]
  const flatLessons = useMemo(() => {
    return COURSE_CONTENT.modules.flatMap(module => module.lessons);
  }, []);

  // 3. Calculate Current Position
  const currentIndex = flatLessons.findIndex(l => l.id === activeLesson.id);
  const isFirstLesson = currentIndex === 0;
  const isLastLesson = currentIndex === flatLessons.length - 1;

  // 4. Navigation Handlers
  const handleNext = () => {
    if (!isLastLesson) {
      const nextLesson = flatLessons[currentIndex + 1];
      setActiveLesson(nextLesson);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrevious = () => {
    if (!isFirstLesson) {
      const prevLesson = flatLessons[currentIndex - 1];
      setActiveLesson(prevLesson);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleMarkComplete = () => {
    // Add current lesson ID to completed list if not already there
    if (!completedLessonIds.includes(activeLesson.id)) {
        setCompletedLessonIds([...completedLessonIds, activeLesson.id]);
    }
    // Auto-advance to next lesson
    handleNext();
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white gap-8 lg:gap-12 pb-20">
      
      {/* --- LEFT COLUMN: READING AREA --- */}
      <div className="flex-1 flex flex-col pl-4 lg:pl-0 pr-4 lg:pr-0">
        
        {/* Navigation Header */}
        <div className="sticky top-0 bg-white/90 backdrop-blur-md z-20 py-4 border-b border-gray-100 mb-8">
          <div className="flex items-center justify-between">
            <Link href="/dashboard/my-courses" className="flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-[#227FA1] transition">
              <ArrowLeftIcon className="w-4 h-4" />
              Dashboard
            </Link>
            <div className="flex gap-2">
              <span className="text-xs font-bold text-gray-300 uppercase tracking-widest pt-2 mr-2">
                {activeLesson.duration}
              </span>
              <button className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-[#227FA1]">
                <BookmarkIcon className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Article Header */}
        <div className="mb-8">
           <span className="text-[#227FA1] font-bold text-sm bg-blue-50 px-3 py-1 rounded-full">
             {COURSE_CONTENT.modules.find(m => m.lessons.some(l => l.id === activeLesson.id))?.title}
           </span>
           <h1 className="text-3xl md:text-4xl font-black text-gray-900 mt-4 leading-tight">
             {activeLesson.title}
           </h1>
        </div>

        {/* MAIN CONTENT */}
        <div className="w-full max-w-3xl">
           <div 
             className="rich-text-content"
             dangerouslySetInnerHTML={{ __html: activeLesson.content }} 
           />

           {/* Manual Code Block Injection for Demo */}
           {activeLesson.id === 102 && (
             <div className="bg-gray-900 rounded-xl p-6 my-8 shadow-2xl overflow-x-auto relative group">
                <button className="absolute top-4 right-4 text-gray-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity">
                   <ClipboardDocumentIcon className="w-5 h-5" />
                </button>
                <pre className="text-sm font-mono text-gray-300">
                  <code>
<span className="text-purple-400">const</span> <span className="text-blue-400">welcome</span> = <span className="text-green-400">"Hello Techpadie!"</span>;{'\n'}
console.<span className="text-yellow-400">log</span>(welcome);
                  </code>
                </pre>
             </div>
           )}
        </div>

        {/* COMPLETION ACTION CARD */}
        <div className="mt-12 mb-20 p-8 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col items-center text-center">
           <div className={`w-16 h-16 rounded-full flex items-center justify-center shadow-sm mb-4 transition-colors ${completedLessonIds.includes(activeLesson.id) ? 'bg-green-100' : 'bg-white'}`}>
              <CheckCircleIcon className={`w-8 h-8 ${completedLessonIds.includes(activeLesson.id) ? 'text-green-500' : 'text-gray-200'}`} />
           </div>
           
           <h3 className="text-lg font-bold text-gray-900">
               {completedLessonIds.includes(activeLesson.id) ? 'Lesson Completed!' : 'Finished reading?'}
           </h3>
           <p className="text-gray-500 text-sm mb-6 max-w-sm">
             {completedLessonIds.includes(activeLesson.id) 
                ? "Great job! You can move on to the next topic whenever you're ready." 
                : "Mark this lesson as complete to update your progress and move to the next topic."}
           </p>
           
           <div className="flex gap-4 w-full md:w-auto">
              {/* PREVIOUS BUTTON */}
              <button 
                onClick={handlePrevious}
                disabled={isFirstLesson}
                className={`flex-1 md:flex-none px-6 py-3 border border-gray-200 bg-white font-bold rounded-xl transition
                    ${isFirstLesson 
                        ? 'text-gray-300 cursor-not-allowed' 
                        : 'text-gray-600 hover:bg-gray-50'}`}
              >
                 Previous
              </button>

              {/* MARK COMPLETE & NEXT BUTTON */}
              <button 
                onClick={handleMarkComplete}
                disabled={isLastLesson}
                className={`flex-1 md:flex-none px-8 py-3 font-bold rounded-xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2
                    ${isLastLesson
                        ? 'bg-gray-300 text-white cursor-not-allowed shadow-none'
                        : 'bg-[#227FA1] text-white shadow-blue-200 hover:bg-[#1a637e]'}`}
              >
                 {isLastLesson ? 'Course Completed' : 'Mark Complete & Next'}
                 {!isLastLesson && <ChevronRightIcon className="w-4 h-4" />}
              </button>
           </div>
        </div>
      </div>

      {/* --- RIGHT COLUMN: SYLLABUS --- */}
      <div className="hidden lg:block w-96 relative">
         <div className="sticky top-8 bg-white border border-gray-100 rounded-[24px] shadow-xl flex flex-col overflow-hidden max-h-[85vh]">
             <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-800">Course Index</h2>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-4">
                    {/* Dynamic Progress Bar based on mock state */}
                    <div 
                        className="bg-[#227FA1] h-full rounded-full transition-all duration-500" 
                        style={{ width: `${(completedLessonIds.length / flatLessons.length) * 100}%` }}
                    ></div>
                </div>
                <p className="text-xs font-bold text-gray-400 mt-2 text-right">
                    {Math.round((completedLessonIds.length / flatLessons.length) * 100)}% Complete
                </p>
             </div>

             <div className="flex-1 overflow-y-auto scrollbar-thin">
                {COURSE_CONTENT.modules.map((module) => (
                   <div key={module.id} className="border-b border-gray-50 last:border-0">
                      <div className="px-6 py-3 bg-gray-50/30">
                         <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{module.title}</h3>
                      </div>
                      <div>
                         {module.lessons.map((lesson) => {
                            const isActive = activeLesson.id === lesson.id;
                            const isDone = completedLessonIds.includes(lesson.id);
                            
                            return (
                               <div 
                                  key={lesson.id} 
                                  onClick={() => {
                                      setActiveLesson(lesson);
                                      window.scrollTo({ top: 0, behavior: 'smooth' });
                                  }}
                                  className={`flex items-center gap-3 p-4 px-6 cursor-pointer transition-all border-l-4 
                                    ${isActive 
                                       ? 'bg-blue-50/50 border-[#227FA1]' 
                                       : 'bg-white border-transparent hover:bg-gray-50'
                                    }`}
                               >
                                  <div>
                                     {isDone ? (
                                        <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                     ) : (
                                        <div className={`w-5 h-5 rounded-full border-2 ${isActive ? 'border-[#227FA1]' : 'border-gray-300'}`} />
                                     )}
                                  </div>
                                  
                                  <div className="flex-1">
                                     <p className={`text-sm font-bold ${isActive ? 'text-[#227FA1]' : 'text-gray-700'}`}>
                                        {lesson.title}
                                     </p>
                                     <p className="text-[10px] font-medium text-gray-400 mt-0.5">
                                        {lesson.duration}
                                     </p>
                                  </div>
                               </div>
                            );
                         })}
                      </div>
                   </div>
                ))}
             </div>
         </div>
      </div>
    </div>
  );
}