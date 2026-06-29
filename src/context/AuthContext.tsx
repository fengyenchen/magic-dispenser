import { createContext, useState } from 'react';
import type { Users } from '../types/auth';

interface AuthContextType {
  user: Users | null;
  login: (userData: Users, token: string) => void;
  logout: () => void;
}

// 紀錄使用者登入狀態的 Context，初始值為 null（未登入）
export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: any }) => {
  const [user, setUser] = useState<Users | null>(null);

  const login = (userData: Users, token: string) => {
    setUser(userData);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};