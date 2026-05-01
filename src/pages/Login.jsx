import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api/axios';

export default function Login() {
  const navigate = useNavigate();
  const { login, token } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [isFocused, setIsFocused] = useState({ email: false, password: false });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // If already authenticated, redirect to the appropriate area
    if (token) {
      const isAdmin = Boolean((user && user.is_admin) || role === 'admin');
      navigate(isAdmin ? '/admin/dashboard' : '/shop', { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, role]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await apiClient.post('/login', form);
      const payload = response.data ?? {};

      // Normalize token + user payload
      const tokenValue = payload.token || payload.access_token || null;
      const userPayload = payload.user ?? payload;

      // Persist token for axios instance (it reads `auth_token`) and for AuthContext
      if (tokenValue) {
        localStorage.setItem('auth_token', tokenValue);
      }

      // Update auth context (this will persist `luxury_sense_token` etc.)
      login({
        user: userPayload ?? null,
        token: tokenValue ?? null,
        role: userPayload?.role ?? null,
      });

      // Redirect based on admin flag
      const isAdmin = Boolean(userPayload?.is_admin || userPayload?.role === 'admin');
      navigate(isAdmin ? '/admin/dashboard' : '/shop', { replace: true });
    } catch (loginError) {
      // Handle 401 Unauthorized specifically
      if (loginError?.response?.status === 401) {
        setError('Invalid email or password.');
      } else {
        const responseMessage =
          loginError?.response?.data?.message ||
          loginError?.response?.data?.error ||
          'Unable to sign in. Please check your credentials and try again.';

        setError(responseMessage);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputBaseStyle = {
    width: '100%',
    border: 'none',
    borderBottom: '1px solid #1a1a1a',
    background: 'transparent',
    padding: '1rem 0 0.7rem',
    fontFamily: 'Inter, Lato, sans-serif',
    fontSize: '1rem',
    color: '#111111',
    outline: 'none',
    transition: 'border-color 260ms ease',
  };

  const floatingLabelStyle = (field) => ({
    position: 'absolute',
    left: 0,
    top: isFocused[field] || form[field] ? '-0.1rem' : '0.95rem',
    fontFamily: 'Inter, Lato, sans-serif',
    fontSize: isFocused[field] || form[field] ? '0.72rem' : '0.95rem',
    letterSpacing: '0.12em',
    textTransform: 'uppercase',
    color: isFocused[field] ? '#111111' : '#8a8a8a',
    pointerEvents: 'none',
    transition: 'all 220ms ease',
  });

  return (
    <main
      style={{
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        background: '#fafafa',
        padding: '2rem',
      }}
    >
      <section
        style={{
          width: 'min(100%, 28rem)',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: 'clamp(2.4rem, 5vw, 3.6rem)',
            lineHeight: 1,
            fontWeight: 600,
            letterSpacing: '0.16em',
            textTransform: 'none',
            color: '#111111',
          }}
        >
          Sign In
        </h1>

        <form onSubmit={handleSubmit} style={{ marginTop: '3rem', textAlign: 'left' }}>
          <div style={{ position: 'relative', marginBottom: '2rem' }}>
            <label htmlFor="email" style={floatingLabelStyle('email')}>
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              onFocus={() => setIsFocused((current) => ({ ...current, email: true }))}
              onBlur={() => setIsFocused((current) => ({ ...current, email: false }))}
              style={{
                ...inputBaseStyle,
                borderBottomColor: isFocused.email ? '#111111' : '#1f1f1f',
              }}
              autoComplete="email"
              required
            />
          </div>

          <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
            <label htmlFor="password" style={floatingLabelStyle('password')}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              onFocus={() => setIsFocused((current) => ({ ...current, password: true }))}
              onBlur={() => setIsFocused((current) => ({ ...current, password: false }))}
              style={{
                ...inputBaseStyle,
                borderBottomColor: isFocused.password ? '#111111' : '#1f1f1f',
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
                color: '#7a7a7a',
                lineHeight: 1.6,
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
              background: '#111111',
              color: '#ffffff',
              padding: '1rem 1.25rem',
              fontFamily: 'Inter, Lato, sans-serif',
              fontSize: '0.86rem',
              fontWeight: 600,
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              cursor: isSubmitting ? 'wait' : 'pointer',
              transition: 'transform 220ms ease, background-color 220ms ease',
            }}
          >
            {isSubmitting ? 'Entering...' : 'Enter Boutique'}
          </button>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Link
              to="/register"
              style={{
                fontFamily: 'Inter, Lato, sans-serif',
                fontSize: '0.84rem',
                color: '#9a9a9a',
                textDecoration: 'none',
                letterSpacing: '0.06em',
              }}
            >
              New Guest? Create an Account
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}