import { useContext } from 'react';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import type { Roles } from '../types/auth';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: Roles[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const auth = useContext(AuthContext);

  const isAuthenticated = !!auth?.user;
  const userRole = auth?.user?.role;

  // 檢查是否登入：未登入者回首頁
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  // 檢查角色權限：如果該路由有指定角色限制，且當前使用者角色不符合
  if (allowedRoles && (!userRole || !allowedRoles.includes(userRole))) {
    const fallbackRedirect = userRole === 'professor' ? "/admin/dashboard" : "/menu";
    return <Navigate to={fallbackRedirect} replace />;
  }

  return <>{children}</>;
}