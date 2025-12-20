"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  CheckCircleIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon, 
  PlayCircleIcon,
  BookOpenIcon,
  ArrowLeftIcon,
  ClipboardDocumentIcon,
  InformationCircleIcon
} from '@heroicons/react/24/solid';
import { ShareIcon, BookmarkIcon } from '@heroicons/react/24/outline';

// --- MOCK DATA: RICH TEXT CONTENT ---
// In a real app, this would be Markdown or HTML from your database
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
          // Simulating HTML content
          content: `
            <h2 class="text-2xl font-bold text-gray-900 mb-4">Introduction</h2>
            <p class="mb-6 text-gray-600 leading-relaxed text-lg">
              The internet is a global network of computers that communicate with each other using standardized protocols. 
              At its core, it is a wire—buried in the ground, fiber optics, or satellite links—that connects devices worldwide.
            </p>
            
            <div class="bg-blue-50 border-l-4 border-[#227FA1] p-4 my-6 rounded-r-xl">
              <p class="text-[#227FA1] font-bold text-sm">💡 Key Concept</p>
              <p class="text-gray-700 mt-1">
                The web is not the internet. The internet is the infrastructure; the web is a service built on top of that infrastructure.
              </p>
            </div>

            <h3 class="text-xl font-bold text-gray-900 mb-3 mt-8">Clients and Servers</h3>
            <p class="mb-4 text-gray-600 leading-relaxed text-lg">
              Computers connected to the web are called <strong>clients</strong> and <strong>servers</strong>.
            </p>
            <ul class="list-disc pl-5 space-y-2 mb-6 text-gray-600 text-lg">
              <li><strong>Clients</strong> are the typical web user's internet-connected devices (for example, your computer connected to your Wi-Fi).</li>
              <li><strong>Servers</strong> are computers that store webpages, sites, or apps. When a client device wants to access a webpage, a copy is downloaded from the server.</li>
            </ul>
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
               Visual Studio Code is a lightweight but powerful source code editor which runs on your desktop and is available for Windows, macOS and Linux.
             </p>

             <h3 class="text-xl font-bold text-gray-900 mb-3">Your First HTML File</h3>
             <p class="mb-4 text-gray-600 leading-relaxed text-lg">Create a new file named <code>index.html</code> and paste the following code:</p>
             
             <div class="mock-code-block"></div>
          `
        }
      ]
    },
    { 
      id: 2, 
      title: 'Module 2: HTML Basics',
      lessons: [
        { id: 201, title: 'HTML Tags & Elements', duration: '12 min read', isCompleted: false, type: 'text', content: '<p>Content pending...</p>' },
        { id: 202, title: 'Forms and Inputs', duration: '20 min read', isCompleted: false, type: 'text', content: '<p>Content pending...</p>' },
      ]
    }
  ]
};

export default function CourseLearnPage({ params }: { params: { courseId: string } }) {
  const [activeLesson, setActiveLesson] = useState(COURSE_CONTENT.modules[0].lessons[0]); 

  const handleLessonChange = (lesson: any) => {
    setActiveLesson(lesson);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white gap-8 lg:gap-12">
      
      {/* --- LEFT COLUMN: READING AREA (Comfortable Width) --- */}
      {/* We use 'lg:w-[65%]' to ensure lines aren't too long to read comfortably */}
      <div className="flex-1 flex flex-col pl-4 lg:pl-0 pr-4 lg:pr-0">
        
        {/* 1. Navigation Header */}
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

        {/* 2. Article Header */}
        <div className="mb-8">
           <span className="text-[#227FA1] font-bold text-sm bg-blue-50 px-3 py-1 rounded-full">
             {COURSE_CONTENT.modules.find(m => m.lessons.includes(activeLesson))?.title}
           </span>
           <h1 className="text-3xl md:text-4xl font-black text-gray-900 mt-4 leading-tight">
             {activeLesson.title}
           </h1>
        </div>

        {/* 3. MAIN CONTENT (Rich Text) */}
        {/* 'prose' class usually handles this, but here we style manually for the demo */}
        <div className="w-full max-w-3xl">
           
           {/* Dynamic HTML Injection (Safe for trusted content) */}
           <div 
             className="rich-text-content"
             dangerouslySetInnerHTML={{ __html: activeLesson.content }} 
           />

           {/* Manual Component Injection (Example of a Code Block) */}
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

        {/* 4. Completion Action */}
        <div className="mt-12 mb-20 p-8 bg-gray-50 rounded-3xl border border-gray-100 flex flex-col items-center text-center">
           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
              <CheckCircleIcon className="w-8 h-8 text-gray-200" />
           </div>
           <h3 className="text-lg font-bold text-gray-900">Finished reading?</h3>
           <p className="text-gray-500 text-sm mb-6 max-w-sm">
             Mark this lesson as complete to update your progress and move to the next topic.
           </p>
           <div className="flex gap-4 w-full md:w-auto">
              <button className="flex-1 md:flex-none px-6 py-3 border border-gray-200 bg-white text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition">
                 Previous
              </button>
              <button className="flex-1 md:flex-none px-8 py-3 bg-[#227FA1] text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-[#1a637e] transition active:scale-95 flex items-center justify-center gap-2">
                 Mark Complete & Next
                 <ChevronRightIcon className="w-4 h-4" />
              </button>
           </div>
        </div>

      </div>

      {/* --- RIGHT COLUMN: SYLLABUS (Sticky Sidebar) --- */}
      <div className="hidden lg:block w-96 relative">
         <div className="sticky top-8 bg-white border border-gray-100 rounded-[24px] shadow-xl flex flex-col overflow-hidden max-h-[85vh]">
             
             {/* Header */}
             <div className="p-6 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-800">Course Index</h2>
                <div className="w-full bg-gray-200 rounded-full h-1.5 mt-4">
                    <div className="bg-[#227FA1] h-full rounded-full" style={{ width: `${COURSE_CONTENT.progress}%` }}></div>
                </div>
                <p className="text-xs font-bold text-gray-400 mt-2 text-right">{COURSE_CONTENT.progress}% Complete</p>
             </div>

             {/* Scrollable List */}
             <div className="flex-1 overflow-y-auto scrollbar-thin">
                {COURSE_CONTENT.modules.map((module) => (
                   <div key={module.id} className="border-b border-gray-50 last:border-0">
                      <div className="px-6 py-3 bg-gray-50/30">
                         <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{module.title}</h3>
                      </div>
                      <div>
                         {module.lessons.map((lesson) => {
                            const isActive = activeLesson.id === lesson.id;
                            return (
                               <div 
                                  key={lesson.id} 
                                  onClick={() => handleLessonChange(lesson)}
                                  className={`flex items-center gap-3 p-4 px-6 cursor-pointer transition-all border-l-4 
                                    ${isActive 
                                       ? 'bg-blue-50/50 border-[#227FA1]' 
                                       : 'bg-white border-transparent hover:bg-gray-50'
                                    }`}
                               >
                                  {/* Icon Status */}
                                  <div>
                                     {lesson.isCompleted ? (
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