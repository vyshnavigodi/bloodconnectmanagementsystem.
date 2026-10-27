import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: 'DONOR' | 'PATIENT' | 'HOSPITAL' | 'STAFF' | 'ADMIN';
  preferredLanguage?: string;
  bloodGroup?: string;
  phoneNumber?: string;
  city?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  register: (data: RegisterData) => Promise<User>;
  logout: () => void;
  isAuthenticated: boolean;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  role: string;
  bloodGroup?: string;
  city?: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('bc_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      axios.get(`${API_BASE}/auth/me`)
        .then(res => {
          const fetchedUser = res.data?.data?.user || res.data?.user;
          setUser(fetchedUser);
        })
        .catch(() => {
          setToken(null);
          setUser(null);
          localStorage.removeItem('bc_token');
          delete axios.defaults.headers.common['Authorization'];
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [token]);

  const login = async (email: string, password: string): Promise<User> => {
    const res = await axios.post(`${API_BASE}/auth/login`, { email, password });
    const payload = res.data?.data || res.data;
    const newToken = payload.token;
    const newUser = payload.user;
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('bc_token', newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    return newUser;
  };

  const register = async (data: RegisterData): Promise<User> => {
    const res = await axios.post(`${API_BASE}/auth/register`, data);
    const payload = res.data?.data || res.data;
    const newToken = payload.token;
    const newUser = payload.user;
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('bc_token', newToken);
    axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
    return newUser;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('bc_token');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
