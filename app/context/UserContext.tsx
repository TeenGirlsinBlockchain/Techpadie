'use client';

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import type { User, UserPreferences } from '@/app/types';
import { useAuth } from '@/app/hooks/useAuth';
import { useLanguage } from './LanguageContext';

interface UserContextValue {
  user: User;
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const { user: authUser, isLoading } = useAuth();
  const { setLocale } = useLanguage();

  const [preferences, setPreferences] = useState<UserPreferences>({
    preferredLanguage: 'en',
    dailyGoalMinutes: 30,
    emailNotifications: true,
    audioAutoplay: false,
    playbackSpeed: 1,
  });

  // Sync preferredLanguage from authUser when it changes
  useEffect(() => {
    if (authUser?.preferredLanguage) {
      const code = authUser.preferredLanguage.toLowerCase() as any;
      setPreferences((prev) => ({
        ...prev,
        preferredLanguage: code,
      }));
    }
  }, [authUser]);

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
    if (updates.preferredLanguage) {
      setLocale(updates.preferredLanguage);
    }
  }, [setLocale]);

  // Construct client User object from authUser, falling back to empty if not authenticated
  const clientUser: User = authUser ? {
    id: authUser.id,
    name: authUser.displayName,
    email: authUser.email,
    avatar: undefined,
    preferredLanguage: (authUser.preferredLanguage?.toLowerCase() as any) || 'en',
    role: authUser.role === 'ADMIN' ? 'admin' : authUser.role === 'CREATOR' ? 'instructor' : 'student',
    createdAt: authUser.createdAt,
  } : {
    id: '',
    name: '',
    email: '',
    avatar: undefined,
    preferredLanguage: 'en',
    role: 'student',
    createdAt: '',
  };

  return (
    <UserContext.Provider
      value={{
        user: clientUser,
        preferences,
        updatePreferences,
        isAuthenticated: !!authUser && !isLoading,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}