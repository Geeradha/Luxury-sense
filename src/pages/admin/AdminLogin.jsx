import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login, token, role, logout } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [focusedField, setFocusedField] = useState({ email: false, password: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token && role === 'admin') {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate, role, token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/login', form);
      const payload = response.data ?? {};
      const nextRole = payload.user?.role ?? payload.role ?? null;

      if (nextRole !== 'admin') {
        logout();
        setError('Access denied. This portal is reserved for administrators only.');
        return;
      }

      login({
        user: payload.user ?? null,
        token: payload.token ?? null,
        role: nextRole,
      });

      navigate('/admin/dashboard', { replace: true });
    } catch (adminLoginError) {
      setError(
        adminLoginError?.response?.data?.message ||
          'Authentication failed. Please verify your management credentials.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldBaseStyle = {
    width: '100%',
    border: '1px solid rgba(255, 255, 255, 0.85)',
    borderRadius: '14px',
    background: 'rgba(255, 255, 255, 0.04)',
    padding: '1rem 1rem 0.9rem',
    color: '#ffffff',
    fontFamily: 'Inter, Lato, sans-serif',
    fontSize: '0.98rem',
    outline: 'none',
    transition: 'border-color 220ms ease, background-color 220ms ease',
  };

  const labelStyle = (field) => ({
    position: 'absolute',
    left: '1rem',
    top: focusedField[field] || form[field] ? '0.55rem' : '1rem',
    fontFamily: 'Inter, Lato, sans-serif',
    fontSize: focusedField[field] || form[field] ? '0.68rem' : '0.92rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: 'rgba(255, 255, 255, 0.7)',
    pointerEvents: 'none',
    transition: 'all 220ms ease',
  });

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#09090b',
        color: '#ffffff',
        padding: '2rem',
      }}
    >
      <section
        style={{
          width: 'min(100%, 28rem)',
        }}
      >
        <div
          style={{
            padding: '2rem',
            border: '1px solid rgba(255, 255, 255, 0.16)',
            borderRadius: '24px',
            background: 'rgba(24, 24, 27, 0.78)',
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.42)',
            backdropFilter: 'blur(18px)',
          }}
        >
          <p
            style={{
              margin: 0,
              fontFamily: 'Inter, Lato, sans-serif',
              fontSize: '0.74rem',
              letterSpacing: '0.28em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.65)',
            }}
          >
            Luxury Sense | Management Portal
          </p>

          <h1
            style={{
              margin: '0.9rem 0 0',
              fontFamily: 'Inter, Lato, sans-serif',
              fontSize: 'clamp(1.7rem, 3.5vw, 2.4rem)',
              lineHeight: 1.1,
              fontWeight: 600,
              color: '#ffffff',
            }}
          >
            Authenticate
          </h1>

          <form onSubmit={handleSubmit} style={{ marginTop: '2rem' }}>
            <div style={{ position: 'relative', marginBottom: '1.35rem' }}>
              <label htmlFor="admin-email" style={labelStyle('email')}>
                Email Address
              </label>
              <input
                id="admin-email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                onFocus={() => setFocusedField((current) => ({ ...current, email: true }))}
                onBlur={() => setFocusedField((current) => ({ ...current, email: false }))}
                style={{
                  ...fieldBaseStyle,
                  borderColor: focusedField.email ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                }}
                autoComplete="email"
                required
              />
            </div>

            <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
              <label htmlFor="admin-password" style={labelStyle('password')}>
                Password
              </label>
              <input
                id="admin-password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                onFocus={() => setFocusedField((current) => ({ ...current, password: true }))}
                onBlur={() => setFocusedField((current) => ({ ...current, password: false }))}
                style={{
                  ...fieldBaseStyle,
                  borderColor: focusedField.password ? '#ffffff' : 'rgba(255, 255, 255, 0.75)',
                }}
                autoComplete="current-password"
                required
              />
            </div>

            {error ? (
              <p
                style={{
                  margin: '0 0 1rem',
                  fontFamily: 'Inter, Lato, sans-serif',
                  fontSize: '0.9rem',
                  lineHeight: 1.6,
                  color: 'rgba(255, 255, 255, 0.75)',
                }}
              >
                {error}
              </p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                border: 'none',
                borderRadius: '14px',
                background: '#ffffff',
                color: '#111111',
                padding: '1rem 1.2rem',
                fontFamily: 'Inter, Lato, sans-serif',
                fontSize: '0.82rem',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                cursor: isSubmitting ? 'wait' : 'pointer',
                transition: 'transform 220ms ease, opacity 220ms ease',
              }}
            >
              Authenticate
            </button>

            <div style={{ marginTop: '1rem', textAlign: 'center' }}>
              <Link
                to="/login"
                style={{
                  fontFamily: 'Inter, Lato, sans-serif',
                  fontSize: '0.84rem',
                  color: 'rgba(255, 255, 255, 0.68)',
                  textDecoration: 'none',
                  letterSpacing: '0.05em',
                }}
              >
                Customer Sign In
              </Link>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}