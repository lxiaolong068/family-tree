"use client";

import React, { createContext, useState, useEffect, useContext } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (googleToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 检查本地存储中的会话信息
    const checkAuth = async () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          // 验证令牌并获取用户信息
          const response = await fetch('/api/auth/verify', {
            headers: { Authorization: `Bearer ${token}` }
          });

          if (response.ok) {
            const userData = await response.json();
            setUser(userData.user);
          } else {
            // 令牌无效，清除本地存储
            localStorage.removeItem('authToken');
            setUser(null);
          }
        } catch (error) {
          console.error('Auth verification error:', error);
          setUser(null);
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (googleToken: string) => {
    setIsLoading(true);
    try {

      const response = await fetch('/api/auth/google', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: googleToken })
      });

      if (response.ok) {
        const data = await response.json();

        localStorage.setItem('authToken', data.token);
        setUser(data.user);
      } else {
        // 处理非200响应
        const errorData = await response.json();
        console.error('Login failed with status:', response.status, errorData);
        throw new Error(errorData.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    localStorage.removeItem('authToken');
    setUser(null);
    // 可选：调用后端注销端点
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
