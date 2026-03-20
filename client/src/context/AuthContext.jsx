import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, try to restore session from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('sc_user');
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem('sc_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (phone, password) => {
    const res = await authService.login({ phone, password });
    const userData = res.data.data;
    setUser(userData);
    localStorage.setItem('sc_user', JSON.stringify(userData));
    return userData;
  };

  const register = async (name, phone, password, role, adminKey) => {
    const payload = { name, phone, password, role };
    if (role === 'admin' && adminKey) payload.adminKey = adminKey;
    const res = await authService.register(payload);
    const userData = res.data.data;
    setUser(userData);
    localStorage.setItem('sc_user', JSON.stringify(userData));
    return userData;
  };

  const logout = async () => {
    try {
      await authService.logout();
    } finally {
      setUser(null);
      localStorage.removeItem('sc_user');
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
