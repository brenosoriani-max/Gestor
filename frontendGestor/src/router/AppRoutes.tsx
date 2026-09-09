import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { PrivateRoute, AdminRoute } from './ProtectedRoutes';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { Dashboard } from '@/pages/Dashboard';
import { Operations } from '@/pages/Operations';
import { Categories } from '@/pages/Categories';
import { Banks } from '@/pages/Banks';
import { Reports } from '@/pages/Reports';
import { Admin } from '@/pages/Admin';
import { Profile } from '@/pages/Profile';

export function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} />

      {/* Private routes */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
      <Route
        path="/operations"
        element={
          <PrivateRoute>
            <Operations />
          </PrivateRoute>
        }
      />
      <Route
        path="/categories"
        element={
          <PrivateRoute>
            <Categories />
          </PrivateRoute>
        }
      />
      <Route
        path="/banks"
        element={
          <PrivateRoute>
            <Banks />
          </PrivateRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <PrivateRoute>
            <Reports />
          </PrivateRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        }
      />

      {/* Admin routes */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <Admin />
          </AdminRoute>
        }
      />

      {/* Fallback */}
      <Route path="/" element={<Navigate to="/dashboard" />} />
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
}
