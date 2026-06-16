import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function AdminRoute() {
  const { token, role, user } = useAuth();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user?.is_admin || ['admin', 'super-admin', 'editor'].includes(role);

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}