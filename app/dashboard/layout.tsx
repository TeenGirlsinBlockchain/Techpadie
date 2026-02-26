import React from 'react';
import { UserProvider } from '@/app/context/UserContext';
import { LanguageProvider } from '@/app/context/LanguageContext';
import { GamificationProvider } from '@/app/context/GamificationContext';
import { AudioProvider } from '@/app/context/AudioContext';
import Sidebar from './components/layout/Sidebar';
import MobileNav from './components/layout/MobileNav';
import DashboardHeader from './components/layout/DashboardHeader';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <LanguageProvider>
      <UserProvider>
        <GamificationProvider>
          <AudioProvider>
            <div className="flex min-h-screen bg-surface-secondary text-text-primary">
              {/* Desktop Sidebar — hidden below lg */}
              <Sidebar />

              {/* Main content area */}
              <main className="relative flex-1 lg:ml-sidebar px-3 sm:px-4 md:px-8 lg:px-10 pb-20 lg:pb-8 pt-1 lg:pt-2 min-w-0">
                <DashboardHeader />
                <div className="max-w-7xl mx-auto">
                  {children}
                </div>
              </main>

              {/* Mobile Bottom Tab Bar — hidden above lg */}
              <MobileNav />
            </div>
          </AudioProvider>
        </GamificationProvider>
      </UserProvider>
    </LanguageProvider>
  );
}