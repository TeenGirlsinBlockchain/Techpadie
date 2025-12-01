import React from 'react';
import Sidebar from './components/Sidebar';

// We reuse the Metadata from the root layout, but you can define new dashboard-specific metadata here
// import type { Metadata } from "next";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-[#0A0A0A] text-white font-inter">
      
      {/* 1. Sidebar */}
      {/* The Sidebar is fixed and has a width of 64 (w-64) */}
      <Sidebar />

      {/* 2. Main Content Area */}
      {/* We use pl-64 to push the main content to the right, clearing the fixed sidebar */}
      <main className="grow pl-64 p-8">
        {children}
      </main>
    </div>
  );
}