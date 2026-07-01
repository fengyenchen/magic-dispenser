import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';
import ProtectedRoute from './components/ProtectedRoute';

import Home from './pages/Home';
import Login from './pages/Login';
import Menu from './pages/Menu';
import Brewing from './pages/Brewing';
import Dashboard from './pages/admin/Dashboard';
import Inventory from './pages/admin/Inventory';

function AppRoutes() {
  const auth = useContext(AuthContext);

  if (auth?.loading) {
    return (
      <div className="h-screen bg-background-dark flex items-center justify-center">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isAuthenticated = !!auth?.user;
  const userRole = auth?.user?.role;

  // 用於萬用路由的分流邏輯
  const getFallbackRedirect = () => {
    if (!isAuthenticated) return "/";
    return userRole === 'professor' ? "/admin/dashboard" : "/menu";
  };

  return (
    <Routes>
      {/* 首頁：不需登入 */}
      <Route
        path="/"
        element={<Home />}
      />

      {/* 登入頁 (已登入者自動分流，不重複登入) */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to={getFallbackRedirect()} replace /> : <Login />}
      />

      {/* 菜單頁 (學生、教授皆可訪問) */}
      <Route
        path="/menu"
        element={
          <ProtectedRoute allowedRoles={['student', 'professor']}>
            <Menu />
          </ProtectedRoute>
        }
      />

      {/* 釀造追蹤頁 (學生、教授皆可訪問) */}
      <Route
        path="/brewing/:orderId"
        element={
          <ProtectedRoute allowedRoles={['student', 'professor']}>
            <Brewing />
          </ProtectedRoute>
        }
      />

      {/* 管理員儀表板 (僅限教授) */}
      <Route
        path="/admin/dashboard"
        element={
          <ProtectedRoute allowedRoles={['professor']}>
            <Dashboard />
          </ProtectedRoute>
        }
      />

      {/* 管理員管制庫存頁 (僅限教授) */}
      <Route
        path="/admin/inventory"
        element={
          <ProtectedRoute allowedRoles={['professor']}>
            <Inventory />
          </ProtectedRoute>
        }
      />

      {/* 萬用未知路由防禦 */}
      <Route path="*" element={<Navigate to={getFallbackRedirect()} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;