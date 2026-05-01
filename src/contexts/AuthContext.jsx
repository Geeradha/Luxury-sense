import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

function readStoredUser() {
  const rawUser = localStorage.getItem('luxury_sense_user');

  if (!rawUser) {
    return null;
  }

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

function readStoredAuth() {
  const user = readStoredUser();

  return {
    user,
    role: localStorage.getItem('luxury_sense_role') || user?.role || null,
    token: localStorage.getItem('luxury_sense_token') || null,
  };
}

export function AuthProvider({ children }) {
  const initialAuth = readStoredAuth();
  const [user, setUser] = useState(() => initialAuth.user);
  const [role, setRole] = useState(() => initialAuth.role);
  const [token, setToken] = useState(() => initialAuth.token);

  const login = ({ user: nextUser, token: nextToken, role: nextRole }) => {
    setUser(nextUser ?? null);
    setToken(nextToken ?? null);
    setRole(nextRole ?? nextUser?.role ?? null);

    if (nextUser) {
      localStorage.setItem('luxury_sense_user', JSON.stringify(nextUser));
    } else {
      localStorage.removeItem('luxury_sense_user');
    }

    if (nextToken) {
      localStorage.setItem('luxury_sense_token', nextToken);
    } else {
      localStorage.removeItem('luxury_sense_token');
    }

    if (nextRole ?? nextUser?.role) {
      localStorage.setItem('luxury_sense_role', nextRole ?? nextUser.role);
    } else {
      localStorage.removeItem('luxury_sense_role');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    setRole(null);
    localStorage.removeItem('luxury_sense_user');
    localStorage.removeItem('luxury_sense_token');
    localStorage.removeItem('luxury_sense_role');
  };

  const value = useMemo(
    () => ({
      user,
      role,
      token,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [user, role, token]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
