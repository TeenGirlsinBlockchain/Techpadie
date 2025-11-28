// app/email-verification/page.tsx
"use client";

import { useState, useEffect, useCallback } from 'react';

export default function EmailVerificationPage() {
  // State for the countdown timer, starting at 60 seconds (1 minute)
  const [seconds, setSeconds] = useState(60);

  // The timerFinished state is no longer strictly needed if we derive it from 'seconds'
  const timerFinished = seconds === 0;

  useEffect(() => {
    // If the timer is finished (seconds === 0), do not start or continue the interval
    if (seconds === 0) {
      return;
    }

    // Set up the interval to decrement the timer every second
    const interval = setInterval(() => {
      // Use the functional update form of setState for safe state management
      // This is the core fix: update seconds directly in the interval
      setSeconds(prevSeconds => prevSeconds - 1);
    }, 1000);

    // Clean up the interval when the component unmounts or the effect re-runs
    // This is clean and avoids the synchronous setState warning.
    return () => clearInterval(interval);
  }, [seconds]); // Dependency array: Re-run only if 'seconds' changes, though in this case,
                // we mainly rely on the cleanup function. Keeping it simple as [seconds] works fine for this purpose.

  // Function to format seconds into 'XX secs'
  const formatTime = (time: number) => {
    return `${time} sec${time !== 1 ? 's' : ''}`;
  };

  const handleResend = useCallback(() => {
    console.log("Resending verification code...");
    
    // Reset the timer state after resending
    setSeconds(60);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Verifying code...");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 sm:p-6">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-xl shadow-lg border border-gray-100 text-center">
        
        {/* Header Section */}
        <header className="mb-10 text-center">
          <h1 className="text-3xl font-inter font-semibold text-gray-900">
            Email Verification
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            We have sent you a code to confirm your registration
          </p>
        </header>

        {/* Verification Form */}
        <form className="space-y-8" onSubmit={handleSubmit}>
          
          {/* Code Input Fields */}
          <div className="flex justify-center items-center gap-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                placeholder="*"
                className="w-12 h-14 text-center text-xl font-inter font-bold rounded-lg border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
                aria-label={`Digit ${index + 1}`}
              />
            ))}
            
            {/* Timer / Resend Text */}
            <div className="text-sm w-20 text-left font-lexend text-gray-600 ml-2">
              {/* Derive the UI text directly from the 'seconds' state */}
              {timerFinished ? (
                <>
                  Didn&apos;t get it?
                </>
              ) : (
                <span className="font-medium text-gray-800">
                    {formatTime(seconds)}
                </span>
              )}
            </div>
          </div>
          
          {/* Conditional Button */}
          {timerFinished ? (
            <button
              type="button"
              onClick={handleResend}
              className="w-full mt-4 px-6 py-3 rounded-lg bg-teal-600 text-white font-inter font-medium hover:bg-teal-700 transition focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50"
            >
              Resend code
            </button>
          ) : (
            <button
              type="submit"
              className="w-full mt-4 px-6 py-3 rounded-lg bg-teal-600 text-white font-inter font-medium hover:bg-teal-700 transition focus:outline-none focus:ring-4 focus:ring-teal-500 focus:ring-opacity-50"
            >
              Continue
            </button>
          )}
        </form>
      </div>
    </div>
  );
}