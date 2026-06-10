import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';

function clearAuthStorage() {
  localStorage.removeItem('token');
  localStorage.removeItem('auth_token');
  localStorage.removeItem('luxury_sense_token');
  localStorage.removeItem('luxury_sense_user');
  localStorage.removeItem('luxury_sense_role');
  localStorage.removeItem('luxury_sense_login_at');
}

export default function LogoutButton({ className = '', children = 'Logout', redirectTo = '/login' }) {
  const navigate = useNavigate();
  const { token, logout } = useAuth();

  const handleLogout = async () => {
    const bearerToken = token || localStorage.getItem('auth_token') || localStorage.getItem('luxury_sense_token') || localStorage.getItem('token');

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/logout`,
        {},
        {
          headers: {
            Accept: 'application/json',
            ...(bearerToken ? { Authorization: `Bearer ${bearerToken}` } : {}),
          },
        }
      );
    } catch {
      // Clear client state even if the token is already expired or revoked.
    } finally {
      clearAuthStorage();
      logout();
      toast.success('Successfully logged out');
      navigate(redirectTo, { replace: true });
    }
  };

  return (
    <button type="button" onClick={handleLogout} className={className}>
      {children}
    </button>
  );
}