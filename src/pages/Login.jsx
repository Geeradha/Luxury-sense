import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { login, token, role, user } = useAuth();
  const [form, setForm] = useState({ email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    if (!token || !role) {
      return;
    }

    const isAdmin = user?.is_admin || ['admin', 'super-admin', 'editor'].includes(role);
    navigate(isAdmin ? '/admin/dashboard' : '/', { replace: true });
  }, [navigate, role, token, user]);

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
      const userValue = payload.user ?? null;
      const tokenValue = payload.token ?? null;
      const loginAt = Date.now();

      if (tokenValue) {
        localStorage.setItem('auth_token', tokenValue);
      }

      // 1. Update global state BEFORE redirecting
      login({
        user: userValue,
        token: tokenValue,
        role: userValue?.role ?? null,
        loginAt,
      });

      // 2. Perform role-based redirect immediately using response data
      const userRole = userValue?.role ?? null;
      const isAdmin = userValue?.is_admin || ['admin', 'super-admin', 'editor'].includes(userRole);
      navigate(isAdmin ? '/admin/dashboard' : '/', { replace: true });
    } catch (loginError) {
      const status = loginError?.response?.status;
      const message = loginError?.response?.data?.message || 'Unable to sign in. Please try again.';

      if (status === 403 || /verify/i.test(message)) {
        setError('Please verify your email first. Check your inbox for the OTP and complete verification.');
        return;
      }

      setError(status === 401 ? 'Invalid email or password.' : message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-luxury-black flex items-center justify-center px-6 py-20 sm:px-8 lg:px-10">
      <div className="w-full max-w-md">
        <div className="rounded-[32px] border border-white/5 bg-luxury-charcoal p-8 shadow-luxury-lg backdrop-blur-xl sm:p-10">
          <div className="mb-10 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold/90">Luxury Sense</p>
            <h1 className="mt-4 font-serif text-4xl tracking-tight text-white sm:text-5xl">Sign In</h1>
            <p className="mt-4 text-sm text-stone-500">Welcome back to your collection.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="login-email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Email Address</label>
              <input
                id="login-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
                required
                className="w-full rounded-2xl border border-white/10 bg-luxury-black/50 px-5 py-4 text-sm text-white outline-none focus:border-luxury-gold/50"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Password</label>
                <Link to="/forgot-password" size="sm" className="text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gold/70 hover:text-luxury-gold transition-colors">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-2xl border border-white/10 bg-luxury-black/50 px-5 py-4 pr-12 text-sm text-white outline-none focus:border-luxury-gold/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-stone-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error ? (
              <p className="text-center text-xs font-bold text-rose-500 tracking-wide uppercase">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full border border-luxury-gold bg-luxury-gold py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-luxury-dark transition-all duration-700 hover:bg-transparent hover:text-luxury-gold shadow-gold-glow disabled:opacity-50"
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <p className="mt-10 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
            New to the boutique?{' '}
            <Link to="/signup" className="text-luxury-gold transition-colors hover:text-luxury-gold-light">
              Create an account
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}