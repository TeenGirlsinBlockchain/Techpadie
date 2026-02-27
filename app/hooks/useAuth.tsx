"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fetchApi } from "@/app/lib/api-client";
import type { UserRole, CreatorStatus } from "@prisma/client";

interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  creatorProfile?: {
    status: CreatorStatus;
  } | null;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  isApprovedCreator: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApi<{ user: User }>('/api/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  const logout = async () => {
    await fetchApi('/api/auth/logout', { method: 'POST' });
    setUser(null);
    window.location.href = '/login';
  };

  const isAdmin = user?.role === "ADMIN";
  const isApprovedCreator = user?.role === "CREATOR" && user?.creatorProfile?.status === "APPROVED";

  return (
    <AuthContext.Provider value={{ user, isLoading, isAdmin, isApprovedCreator, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}