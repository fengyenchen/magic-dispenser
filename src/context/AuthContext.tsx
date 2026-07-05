import { createContext, useState, useEffect } from 'react';
import type { Users } from '../types/auth';
import { getCurrentUser } from '../services/authService';

interface AuthContextType {
  user: Users | null;
  loading: boolean; // 讓子元件知道是否正在載入使用者資料
  login: (userData: Users, token: string) => void;
  logout: () => void;
}

// 紀錄使用者登入狀態的 Context，初始值為 null（未登入）
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<Users | null>(null);
  const [loading, setLoading] = useState(true);

  // 在元件掛載時，從 localStorage 取得 token，並向後端請求使用者資料
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (err) {
        console.error('Token 可能過期或無效:', err);
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  const login = (userData: Users, token: string) => {
    setUser(userData);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null)
    localStorage.removeItem('token')
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};