import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, AuthContext } from './context/AuthContext';
import { useContext } from 'react';

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
      <div className="h-screen flex items-center justify-center">
        <div className="h-6 w-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const isAuthenticated = !!auth?.user;
  const userRole = auth?.user?.role;

  const getFallbackRedirect = () => {
    if (!isAuthenticated) return "/login";
    return userRole === 'professor' ? "/admin/dashboard" : "/menu";
  };

  return (
    <Routes>
      {/* 首頁，一開始進去的頁面 */}
      <Route
        path="/"
        element={<Home />}
      />

      {/* 登入頁：如果已經登入，直接去 /menu，不用重複登入 */}
      <Route
        path="/login"
        element={isAuthenticated ? <Navigate to="/menu" replace /> : <Login />}
      />

      {/* 菜單頁：如果沒登入，強制回 /login */}
      <Route
        path="/menu"
        element={isAuthenticated ? <Menu /> : <Navigate to="/login" replace />}
      />

      {/* 釀造頁：如果沒登入，一樣強制回 /login */}
      <Route
        path="/brewing/:orderId"
        element={isAuthenticated ? <Brewing /> : <Navigate to="/login" replace />}
      />

      {/* 管理員儀表板：如果沒登入，或不是 professor，強制回 /login */}
      <Route
        path="/admin/dashboard"
        element={isAuthenticated && userRole === 'professor' ? <Dashboard /> : <Navigate to="/login" replace />}
      />
      
      {/* 管理員庫存頁：如果沒登入，或不是 professor，強制回 /login */}
      <Route
        path="/admin/inventory"
        element={isAuthenticated && userRole === 'professor' ? <Inventory /> : <Navigate to="/login" replace />}
      />

      {/* 萬用路由：根據登入狀態決定去哪 */}
      <Route
        path="*"
        element={<Navigate to={getFallbackRedirect()} replace />}
      />
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