export { default } from './Signup';import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import apiClient from '../api/axios';

export default function Register() {
  const navigate = useNavigate();
  const { login, token } = useAuth();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  });
  const [isFocused, setIsFocused] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (token) {
      navigate('/shop', { replace: true });
    }
  }, [navigate, token]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const payload = {
        first_name: form.firstName,
        last_name: form.lastName,
        email: form.email,
        password: form.password,
      };

      const response = await apiClient.post('/register', payload);
      const data = response.data ?? {};

      // Save token to localStorage keys used by the app
      if (data.token) {
        localStorage.setItem('luxury_sense_token', data.token);
        localStorage.setItem('auth_token', data.token);
      }

      // Update auth context
      login({
        user: data.user ?? null,
        token: data.token ?? null,
        role: data.user?.role ?? null,
      });

      navigate('/shop', { replace: true });
    } catch (registerError) {
      const validationErrors = registerError?.response?.data?.errors;
      const validationMessage = validationErrors
        ? Object.values(validationErrors).flat().join(' ')
        : null;

      setError(
        validationMessage ||
          registerError?.response?.data?.message ||
          'Unable to create your account. Please review your details and try again.'
      );
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
            color: '#111111',
          }}
        >
          Create an Account
        </h1>

        <p
          style={{
            margin: '1rem 0 0',
            fontFamily: 'Inter, Lato, sans-serif',
            fontSize: '0.95rem',
            lineHeight: 1.8,
            color: '#7d7d7d',
          }}
        >
          Join to manage your collection and track your orders.
        </p>

        <form onSubmit={handleSubmit} style={{ marginTop: '2.75rem', textAlign: 'left' }}>
          <div style={{ position: 'relative', marginBottom: '1.8rem' }}>
            <label htmlFor="firstName" style={floatingLabelStyle('firstName')}>
              First Name
            </label>
            <input
              id="firstName"
              name="firstName"
              type="text"
              value={form.firstName}
              onChange={handleChange}
              onFocus={() => setIsFocused((current) => ({ ...current, firstName: true }))}
              onBlur={() => setIsFocused((current) => ({ ...current, firstName: false }))}
              style={{
                ...inputBaseStyle,
                borderBottomColor: isFocused.firstName ? '#111111' : '#1f1f1f',
              }}
              autoComplete="given-name"
              required
            />
          </div>

          <div style={{ position: 'relative', marginBottom: '1.8rem' }}>
            <label htmlFor="lastName" style={floatingLabelStyle('lastName')}>
              Last Name
            </label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              value={form.lastName}
              onChange={handleChange}
              onFocus={() => setIsFocused((current) => ({ ...current, lastName: true }))}
              onBlur={() => setIsFocused((current) => ({ ...current, lastName: false }))}
              style={{
                ...inputBaseStyle,
                borderBottomColor: isFocused.lastName ? '#111111' : '#1f1f1f',
              }}
              autoComplete="family-name"
              required
            />
          </div>

          <div style={{ position: 'relative', marginBottom: '1.8rem' }}>
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
              autoComplete="new-password"
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
            {isSubmitting ? 'Creating...' : 'Create Account'}
          </button>

          <div style={{ marginTop: '1rem', textAlign: 'center' }}>
            <Link
              to="/login"
              style={{
                fontFamily: 'Inter, Lato, sans-serif',
                fontSize: '0.84rem',
                color: '#9a9a9a',
                textDecoration: 'none',
                letterSpacing: '0.06em',
              }}
            >
              Already a member? Sign In
            </Link>
          </div>
        </form>
      </section>
    </main>
  );
}