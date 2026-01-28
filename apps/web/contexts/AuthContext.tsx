'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api, User, AuthResponse } from '@/lib/api';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * Check if user is already logged in on mount
   * Validates token by fetching user data
   */
  useEffect(() => {
    const initAuth = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      
      if (token) {
        // Validate token by fetching protected data
        await refreshUser();
      } else {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  /**
   * Refresh user data from backend
   */
  const refreshUser = async () => {
    setIsLoading(true);
    // Use the /protected/me endpoint to validate token and get user
    const response = await api.get<{ user: User }>('/protected/me');
    
    if (response.data?.user) {
      setUser(response.data.user);
    } else {
      // Token is invalid, clear it
      api.clearToken();
      setUser(null);
    }
    
    setIsLoading(false);
  };

  /**
   * Login user with email and password
   */
  const login = async (email: string, password: string) => {
    const response = await api.post<AuthResponse>('/auth/login', {
      email,
      password,
    });

    if (response.error) {
      return { success: false, error: response.error };
    }

    if (response.data) {
      api.setToken(response.data.token);
      setUser(response.data.user);
      return { success: true };
    }

    return { success: false, error: 'Unknown error occurred' };
  };

  /**
   * Register new user
   */
  const register = async (email: string, password: string, name: string) => {
    const response = await api.post<AuthResponse>('/auth/register', {
      email,
      password,
      name,
    });

    if (response.error) {
      return { success: false, error: response.error };
    }

    if (response.data) {
      api.setToken(response.data.token);
      setUser(response.data.user);
      return { success: true };
    }

    return { success: false, error: 'Unknown error occurred' };
  };

  /**
   * Logout user and clear token
   */
  const logout = () => {
    api.clearToken();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * Custom hook to use auth context
 * Must be used within AuthProvider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}
