import {
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';

import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';

import EmployeeDashboard from '../pages/EmployeeDashboard';
import AdminDashboard from '../pages/AdminDashboard';

import ProtectedRoute from './ProtectedRoute';
import { useAuth } from '../hooks/useAuth';

export default function AppRoutes() {
  const { user } = useAuth();

  const getHomeRoute = () => {
    if (!user) return '/login';

    return user.role === 'admin'
      ? '/admin'
      : '/employee';
  };

  return (
    <Routes>

      <Route
        path="/login"
        element={
          user ? (
            <Navigate
              to={getHomeRoute()}
              replace
            />
          ) : (
            <LoginPage />
          )
        }
      />

      <Route
        path="/register"
        element={
          user ? (
            <Navigate
              to={getHomeRoute()}
              replace
            />
          ) : (
            <RegisterPage />
          )
        }
      />

      <Route
        path="/employee"
        element={
          <ProtectedRoute
            roles={['employee']}
          >
            <EmployeeDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute
            roles={['admin']}
          >
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/"
        element={
          <Navigate
            to={getHomeRoute()}
            replace
          />
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to={getHomeRoute()}
            replace
          />
        }
      />

    </Routes>
  );
}