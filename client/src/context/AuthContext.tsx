import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: number;
  name: string;
  phone: string;
  village: string;
  taluk?: string;
  district: string;
  address?: string;
  latitude?: number;
  longitude?: number;
  preferred_language?: string;
  profile_image?: string;
  business_name?: string;
  role: 'FARMER' | 'OWNER';
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (phone: string, password: string) => Promise<{ success: boolean; error?: string; role?: string }>;
  register: (data: any) => Promise<{ success: boolean; error?: string; role?: string }>;
  demoLogin: (role: 'FARMER' | 'OWNER') => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  loading: true,
  login: async () => ({ success: false }),
  register: async () => ({ success: false }),
  demoLogin: async () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('rmb_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('rmb_token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifySession();
  }, []);

  const verifySession = async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await fetch('/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUser(data);
        localStorage.setItem('rmb_user', JSON.stringify(data));
      } else {
        logout();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const login = async (phone: string, password: string) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Login failed.' };
      }
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('rmb_token', data.token);
      localStorage.setItem('rmb_user', JSON.stringify(data.user));
      return { success: true, role: data.user.role };
    } catch (e) {
      return { success: false, error: 'Network connection failed.' };
    }
  };

  const register = async (payload: any) => {
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.error || 'Registration failed.' };
      }
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem('rmb_token', data.token);
      localStorage.setItem('rmb_user', JSON.stringify(data.user));
      return { success: true, role: data.user.role };
    } catch (e) {
      return { success: false, error: 'Network error during registration.' };
    }
  };

  const demoLogin = async (role: 'FARMER' | 'OWNER') => {
    const demoPhones = {
      FARMER: '9876543210',
      OWNER: '9876543211'
    };
    await login(demoPhones[role], 'password123');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('rmb_token');
    localStorage.removeItem('rmb_user');
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, demoLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
