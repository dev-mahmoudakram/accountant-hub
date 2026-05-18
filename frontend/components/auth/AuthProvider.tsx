'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { clearAuth, getToken, getUser, setAuth } from '@/lib/auth';
import { api } from '@/lib/api';
import { User } from '@/types/user';
import { ApiResponse } from '@/types/api';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isReady: boolean;
  login: (token: string, user: User) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setToken(getToken());
    setUser(getUser());
    setIsReady(true);
  }, []);

  useEffect(() => {
    function handleUnauthorized() {
      clearAuth();
      setToken(null);
      setUser(null);
      router.push('/login');
    }
    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => window.removeEventListener('auth:unauthorized', handleUnauthorized);
  }, [router]);

  const login = useCallback((newToken: string, newUser: User) => {
    setAuth(newToken, newUser);
    setToken(newToken);
    setUser(newUser);
  }, []);

  const logout = useCallback(async () => {
    try {
      await api.post<ApiResponse<null>>('/logout');
    } catch {
      // proceed even if API call fails
    } finally {
      clearAuth();
      setToken(null);
      setUser(null);
      router.push('/login');
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, isReady, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
