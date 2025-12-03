"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import LanguageSwitcher from '../../../components/LanguageSwitcher'; 
import { ChevronLeftIcon, ChevronRightIcon, ClipboardDocumentListIcon, QuestionMarkCircleIcon, TrophyIcon, AdjustmentsHorizontalIcon, SpeakerWaveIcon } from '@heroicons/react/24/solid';

// Mock Content Data
const MOCK_LESSON_CONTENT = {
    id: 5,
    lessonId: 101, // Example ID for the lesson being viewed
    title: 'Understanding the Ethereum Virtual Machine (EVM)',
    content: "The Ethereum Virtual Machine (EVM) is the decentralized computer that processes all transactions and executes all smart contracts on the Ethereum blockchain. It is an isolated environment, meaning code running inside the EVM has no access to network, filesystem, or other processes. This determinism is key to blockchain security. The EVM is Turing-complete, allowing it to perform any computation that can be described algorithmically...",
    isCompleted: false,
};

// Mock Course Structure for Navigation and Tracking
const MOCK_COURSE_NAV = [
    { id: 100, title: 'What is a Blockchain?' },
    { id: 101, title: 'Understanding the Ethereum Virtual Machine (EVM)' }, // Current
    { id: 102, title: 'Solidity Syntax and Data Types' },
    { id: 103, title: 'Functions, Modifiers, and Events' },
    { id: 104, title: 'Deployment and Interaction' },
];

// --- Sub-Components (Defined outside the main function) ---

const ProgressTracker = ({ currentLessonId }: { currentLessonId: number }) => {
    const totalLessons = MOCK_COURSE_NAV.length;
    const currentIndex = MOCK_COURSE_NAV.findIndex(l => l.id === currentLessonId);
    const progressPercent = Math.round(((currentIndex + 1) / totalLessons) * 100);

    return (
        <div className="p-4 bg-zinc-800 rounded-lg space-y-2">
            <h3 className="font-semibold text-white">Course Progress: {progressPercent}%</h3>
            <div className="h-2 bg-zinc-700 rounded-full">
                <div className="h-full bg-purple-500 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }}></div>
            </div>
            <p className="text-sm text-zinc-400">{currentIndex + 1} of {totalLessons} lessons completed</p>
        </div>
    );
};

const AccessibilitySettings = () => {
    // State to manage text size (e.g., base, large, extra-large)
    const [textSize, setTextSize] = useState<'base' | 'lg' | 'xl'>('base');
    const [highContrast, setHighContrast] = useState(false);

    const textSizeClasses = {
        'base': 'text-sm',
        'lg': 'text-base',
        'xl': 'text-lg',
    };

    return (
        <div className="space-y-4">
            <h3 className="font-semibold text-white">Accessibility</h3>
            
            {/* Text Size Control */}
            <div className="space-y-2">
                <label className="block text-zinc-400 text-sm">Text Size:</label>
                <div className="flex space-x-2">
                    {Object.keys(textSizeClasses).map((size) => (
                        <button
                            key={size}
                            onClick={() => setTextSize(size as 'base' | 'lg' | 'xl')}
                            className={`px-3 py-1 border rounded-lg text-xs transition ${
                                textSize === size ? 'bg-purple-600 border-purple-600 text-white' : 'border-zinc-700 text-zinc-400 hover:border-purple-500'
                            }`}
                        >
                            {size === 'base' ? 'Default' : size.toUpperCase()}
                        </button>
                    ))}
                </div>
            </div>

            {/* High Contrast Toggle */}
            <div className="flex items-center justify-between text-sm">
                <span className="text-zinc-400">High Contrast Mode</span>
                <button 
                    onClick={() => setHighContrast(!highContrast)} 
                    className={`p-2 rounded-full transition ${highContrast ? 'bg-green-600' : 'bg-zinc-700'}`}
                >
                    {highContrast ? 'ON' : 'OFF'}
                </button>
            </div>
            
            <p className={`text-zinc-500 italic ${textSizeClasses[textSize]}`}>
                Preview text size.
            </p>
        </div>
    );
};

// Placeholder for Note Taking Component
const NoteTaker = () => (
    <div className="space-y-4">
        <h3 className="font-semibold text-white">My Notes for this Lesson</h3>
        <textarea
            className="w-full h-40 p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-purple-500 focus:border-purple-500"
            placeholder="Write your thoughts, summaries, and key takeaways here..."
        />
        <button className="w-full py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition">Save Note</button>
    </div>
);

// Placeholder for Q&A Component
const QandA = () => (
    <div className="space-y-4">
        <h3 className="font-semibold text-white">Ask a Question</h3>
        <textarea
            className="w-full h-24 p-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white focus:ring-purple-500 focus:border-purple-500"
            placeholder="Ask a question about the EVM..."
        />
        <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">Submit Question</button>
        <div className="pt-4 border-t border-zinc-700">
            <p className="text-sm text-zinc-400">No community questions yet. Be the first!</p>
        </div>
    </div>
);


// Simple Tool Selector Tab
const ToolTab = ({ icon: Icon, label, active, onClick }: { icon: any, label: string, active: boolean, onClick: () => void }) => (
    <button 
        onClick={onClick}
        className={`flex-1 flex items-center justify-center p-3 rounded-lg text-sm font-medium transition space-x-2 ${active ? 'bg-purple-600 text-white shadow-lg' : 'text-zinc-400 hover:text-white'}`}
    >
        <Icon className="h-5 w-5" />
        <span>{label}</span>
    </button>
);


// --- Main Page Component ---

export default function LearningPage({ params }: { params: { courseId: string, lessonId: string } }) {
    const currentLessonId = parseInt(params.lessonId);
    const courseId = params.courseId; 
    const [isCourseComplete, setIsCourseComplete] = useState(false);
    const [activeTool, setActiveTool] = useState<'notes' | 'qa' | 'progress' | 'settings'>('progress');
    
    // Find current and next lesson indices for navigation
    const currentIndex = MOCK_COURSE_NAV.findIndex(l => l.id === currentLessonId);
    const nextLesson = MOCK_COURSE_NAV[currentIndex + 1];
    const prevLesson = MOCK_COURSE_NAV[currentIndex - 1];

    // Placeholder for confetti trigger logic
    const handleCompletion = () => {
        // In a real app, this confirms the FINAL lesson is done
        setIsCourseComplete(true);
        console.log("Course completed! Triggering certificate issuance.");
    };

    // Placeholder for Confetti trigger
    useEffect(() => {
        if (isCourseComplete) {
            console.log("Confetti activated!");
        }
    }, [isCourseComplete]);

    const ToolPane = () => {
        if (activeTool === 'notes') return <NoteTaker />;
        if (activeTool === 'qa') return <QandA />;
        if (activeTool === 'settings') return <AccessibilitySettings />;
        return <ProgressTracker currentLessonId={currentLessonId} />;
    };

    return (
        <div className="space-y-4 pt-4">
            
            {/* Confetti Placeholder (Visible only on completion) */}
            {isCourseComplete && (
                <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
                    <div className="text-6xl animate-pulse bg-purple-900/50 p-10 rounded-xl">
                        🎉 COURSE COMPLETE! 🎉
                    </div>
                </div>
            )}
            
            {/* Lesson Header Bar (Multilingual and Accessibility controls) */}
            <div className="flex justify-between items-center pb-4 border-b border-zinc-700">
                <h1 className="text-2xl font-inter font-bold text-white">{MOCK_LESSON_CONTENT.title}</h1>
                
                {/* Multilingual and Utility Controls */}
                <div className="flex items-center space-x-3">
                    <button 
                        className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-700 transition"
                        title="Read Aloud (Text-to-Speech)"
                        onClick={() => console.log('Text-to-Speech activated for content')}
                    >
                        <SpeakerWaveIcon className="h-6 w-6" />
                    </button>
                    
                    {/* LANGUAGE SWITCHER INTEGRATION */}
                    <LanguageSwitcher />
                </div>
            </div>
            
            {/* Main Grid: Content (70%) and Tools (30%) */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 min-h-[70vh]">
                
                {/* Left Column (70%) - Course Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-[#1F2937] p-6 rounded-xl border border-[#2D3748]">
                        
                        <h2 className="text-xl font-semibold mb-4 text-purple-400">Lesson Content:</h2>
                        <div className="text-zinc-300 leading-relaxed space-y-4">
                            <p>{MOCK_LESSON_CONTENT.content}</p>
                            <p>... additional content for the user to read ...</p>
                            <p className="pt-4 border-t border-zinc-700 italic text-sm text-zinc-500">
                                This is the **Text Format** content delivered in the user's selected language.
                            </p>
                        </div>
                    </div>

                    {/* Navigation Bar */}
                    <div className="flex justify-between pt-4 border-t border-zinc-700">
                        {prevLesson ? (
                            <Link 
                                href={`/dashboard/learning/${courseId}/${prevLesson.id}`} 
                                className="inline-flex items-center px-4 py-2 bg-zinc-700 text-white rounded-lg hover:bg-zinc-600 transition"
                            >
                                <ChevronLeftIcon className="h-5 w-5 mr-2" />
                                <span>Previous Lesson</span>
                            </Link>
                        ) : (
                            <div className="w-28"></div> 
                        )}
                        
                         <button 
                            onClick={handleCompletion}
                            className="inline-flex items-center px-4 py-2 bg-yellow-600 text-white rounded-lg font-bold hover:bg-yellow-700 transition"
                        >
                            <TrophyIcon className="h-5 w-5 mr-2" />
                            Complete Course
                        </button>
                        
                        {nextLesson ? (
                            <Link 
                                href={`/dashboard/learning/${courseId}/${nextLesson.id}`} 
                                className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
                            >
                                <span>Next Lesson</span>
                                <ChevronRightIcon className="h-5 w-5 ml-2" />
                            </Link>
                        ) : (
                             <div className="w-28"></div>
                        )}
                    </div>
                </div>

                {/* Right Column (30%) - Interactive Tools */}
                <aside className="lg:col-span-1 space-y-6">
                    
                    {/* Tool Selector Tabs */}
                    <div className="flex justify-around bg-[#1F2937] p-1 rounded-xl border border-[#2D3748]">
                        <ToolTab icon={ClipboardDocumentListIcon} label="Notes" active={activeTool === 'notes'} onClick={() => setActiveTool('notes')} />
                        <ToolTab icon={QuestionMarkCircleIcon} label="Q&A" active={activeTool === 'qa'} onClick={() => setActiveTool('qa')} />
                        <ToolTab icon={TrophyIcon} label="Progress" active={activeTool === 'progress'} onClick={() => setActiveTool('progress')} />
                        <ToolTab icon={AdjustmentsHorizontalIcon} label="Settings" active={activeTool === 'settings'} onClick={() => setActiveTool('settings')} />
                    </div>

                    {/* Tool Pane Content */}
                    <div className="bg-[#1F2937] p-6 rounded-xl border border-[#2D3748] min-h-[400px]">
                        <ToolPane />
                    </div>

                    {/* List of Lessons (Mini Navigation) */}
                    <div className="bg-[#1F2937] p-4 rounded-xl border border-[#2D3748]">
                        <h3 className="font-semibold text-white mb-3 border-b border-zinc-700 pb-2">Course Index</h3>
                        <ul className="space-y-2 text-sm">
                            {MOCK_COURSE_NAV.map(lesson => (
                                <li key={lesson.id}>
                                    <Link href={`/dashboard/learning/${courseId}/${lesson.id}`} className={`block hover:text-purple-400 transition ${lesson.id === currentLessonId ? 'text-purple-400 font-bold' : 'text-zinc-400'}`}>
                                        {lesson.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </aside>
            </div>
        </div>
    );
}