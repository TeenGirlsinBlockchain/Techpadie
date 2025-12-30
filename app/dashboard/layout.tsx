import React from 'react';
import Sidebar from './components/Sidebar';
import DashboardHeader from './components/DashboardHeader'; 
import GoogleTranslate from './components/GoogleTranslate';
// NOTE: You would need to configure a custom color for #000000B2 


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    // Base color white, and applying the dark text color to the whole dashboard
    <div className="flex min-h-screen bg-white" style={{ color: '#000000B2' /* Using inline style for exact color */ }}>
      <GoogleTranslate />
      {/* 1. Sidebar (fixed) */}
      <Sidebar />

      {/* 2. Main Content Area: Correct spacing applied */}
      <main className="grow ml-64 px-10 py-8">
        <DashboardHeader /> 
        {children} 
      </main>
    </div>
  );
}