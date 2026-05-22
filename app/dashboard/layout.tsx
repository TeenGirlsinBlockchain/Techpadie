'use client';

import React, { useEffect } from 'react';
import { UserProvider } from '@/app/context/UserContext';
import { LanguageProvider } from '@/app/context/LanguageContext';
import { GamificationProvider } from '@/app/context/GamificationContext';
import { AudioProvider } from '@/app/context/AudioContext';
import Sidebar from './components/layout/Sidebar';
import MobileNav from './components/layout/MobileNav';
import DashboardHeader from './components/layout/DashboardHeader';
import { useAuth } from '@/app/hooks/useAuth';
import { useRouter } from 'next/navigation';

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !user) {
      router.push('/login');
    }
  }, [user, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-surface-secondary text-text-primary">
        <div className="flex flex-col items-center gap-4">
          <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-sm font-medium text-text-secondary">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in useEffect
  }

  return (
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
  );
}

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
            <DashboardContent>{children}</DashboardContent>
          </AudioProvider>
        </GamificationProvider>
      </UserProvider>
    </LanguageProvider>
  );
}