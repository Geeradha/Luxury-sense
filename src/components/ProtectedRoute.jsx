import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function ProtectedRoute() {
  const { token, role } = useAuth();

  // If not authenticated, send to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but not admin, redirect to home (disallow access)
  if (token && role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}