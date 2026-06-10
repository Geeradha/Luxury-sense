import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const SESSION_DURATION_MS = 60 * 60 * 1000;

function readStoredLoginAt() {
  const rawLoginAt = localStorage.getItem('luxury_sense_login_at');
  const parsedLoginAt = Number(rawLoginAt);

  return Number.isFinite(parsedLoginAt) ? parsedLoginAt : null;
}

function isSessionExpired(loginAt) {
  if (!loginAt) {
    return false;
  }

  return Date.now() - loginAt >= SESSION_DURATION_MS;
}

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
  const loginAt = readStoredLoginAt();

  if (loginAt && isSessionExpired(loginAt)) {
    localStorage.removeItem('luxury_sense_user');
    localStorage.removeItem('luxury_sense_role');
    localStorage.removeItem('luxury_sense_token');
    localStorage.removeItem('luxury_sense_login_at');

    return {
      user: null,
      role: null,
      token: null,
      loginAt: null,
    };
  }

  return {
    user,
    role: localStorage.getItem('luxury_sense_role') || user?.role || null,
    token: localStorage.getItem('luxury_sense_token') || null,
    loginAt,
  };
}

export function AuthProvider({ children }) {
  const initialAuth = readStoredAuth();
  const [user, setUser] = useState(() => initialAuth.user);
  const [role, setRole] = useState(() => initialAuth.role);
  const [token, setToken] = useState(() => initialAuth.token);
  const [loginAt, setLoginAt] = useState(() => initialAuth.loginAt);

  const login = useCallback(({ user: nextUser, token: nextToken, role: nextRole, loginAt: nextLoginAt = Date.now() }) => {
    setUser(nextUser ?? null);
    setToken(nextToken ?? null);
    setRole(nextRole ?? nextUser?.role ?? null);
    setLoginAt(nextLoginAt);

    if (nextUser) {
      localStorage.setItem('luxury_sense_user', JSON.stringify(nextUser));
    } else {
      localStorage.removeItem('luxury_sense_user');
    }

    if (nextToken) {
      localStorage.setItem('auth_token', nextToken);
      localStorage.setItem('luxury_sense_token', nextToken);
    } else {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('luxury_sense_token');
    }

    if (nextRole ?? nextUser?.role) {
      localStorage.setItem('luxury_sense_role', nextRole ?? nextUser.role);
    } else {
      localStorage.removeItem('luxury_sense_role');
    }

    if (nextLoginAt) {
      localStorage.setItem('luxury_sense_login_at', String(nextLoginAt));
    } else {
      localStorage.removeItem('luxury_sense_login_at');
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    setRole(null);
    setLoginAt(null);
    localStorage.removeItem('luxury_sense_user');
    localStorage.removeItem('auth_token');
    localStorage.removeItem('luxury_sense_token');
    localStorage.removeItem('luxury_sense_role');
    localStorage.removeItem('luxury_sense_login_at');
  }, []);

  useEffect(() => {
    if (!token || !loginAt) {
      return undefined;
    }

    const remainingMs = SESSION_DURATION_MS - (Date.now() - loginAt);

    if (remainingMs <= 0) {
      logout();
      return undefined;
    }

    const timeoutId = window.setTimeout(() => {
      logout();
    }, remainingMs);

    return () => window.clearTimeout(timeoutId);
  }, [loginAt, logout, token]);

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
