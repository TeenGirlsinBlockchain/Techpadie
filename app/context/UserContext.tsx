'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import type { User, UserPreferences } from '@/app/types';

interface UserContextValue {
  user: User;
  preferences: UserPreferences;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  isAuthenticated: boolean;
}

const UserContext = createContext<UserContextValue | undefined>(undefined);

// Mock user — replaced by auth fetch when backend arrives
const MOCK_USER: User = {
  id: 'usr_001',
  name: 'Daniel',
  email: 'daniel@example.com',
  avatar: undefined,
  preferredLanguage: 'en',
  role: 'student',
  createdAt: '2025-01-15T00:00:00Z',
};

const MOCK_PREFERENCES: UserPreferences = {
  preferredLanguage: 'en',
  dailyGoalMinutes: 30,
  emailNotifications: true,
  audioAutoplay: false,
  playbackSpeed: 1,
};

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user] = useState<User>(MOCK_USER);
  const [preferences, setPreferences] = useState<UserPreferences>(MOCK_PREFERENCES);

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences((prev) => ({ ...prev, ...updates }));
    // When backend arrives: PATCH /api/user/preferences { ...updates }
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        preferences,
        updatePreferences,
        isAuthenticated: true, // Mock — will be dynamic
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