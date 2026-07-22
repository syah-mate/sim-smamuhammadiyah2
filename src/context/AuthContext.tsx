'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { User, UserRole } from '@/types';
import { dummyUsers } from '@/data/users';

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = useCallback((username: string, password: string): boolean => {
    const found = dummyUsers.find(
      (u) => u.username === username && u.password === password
    );
    if (found) {
      setUser({ ...found });
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const switchRole = useCallback((role: UserRole) => {
    setUser((prev) => {
      if (!prev || !prev.roles.includes(role)) return prev;
      return { ...prev };
    });
  }, []);

  const hasRole = useCallback(
    (role: UserRole): boolean => {
      return user?.roles.includes(role) ?? false;
    },
    [user]
  );

  const hasAnyRole = useCallback(
    (roles: UserRole[]): boolean => {
      if (roles.length === 0) return true;
      return user?.roles.some((r) => roles.includes(r)) ?? false;
    },
    [user]
  );

  return (
    <AuthContext.Provider value={{ user, login, logout, switchRole, hasRole, hasAnyRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
