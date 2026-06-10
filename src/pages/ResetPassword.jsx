import { useMemo, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../api/axios';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';
  const initialState = useMemo(
    () => ({
      email,
      password: '',
      password_confirmation: '',
    }),
    [email]
  );

  const [form, setForm] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      await apiClient.post('/reset-password', {
        email: form.email,
        token,
        password: form.password,
        password_confirmation: form.password_confirmation,
      });

      setMessage('Your password has been reset. You can now sign in with the new password.');
      setTimeout(() => navigate('/login', { replace: true }), 1200);
    } catch (resetError) {
      const validationErrors = resetError?.response?.data?.errors;
      const validationMessage = validationErrors
        ? Object.values(validationErrors).flat().join(' ')
        : null;

      setError(validationMessage || resetError?.response?.data?.message || 'Unable to reset your password.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isMissingToken = !token || !email;

  return (
    <main className="min-h-screen bg-luxury-black flex items-center justify-center px-6 py-20 sm:px-8 lg:px-10">
      <div className="w-full max-w-md">
        <div className="rounded-[32px] border border-white/5 bg-luxury-charcoal p-8 shadow-luxury-lg backdrop-blur-xl sm:p-10">
          <div className="mb-10 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold/90">Secure Access</p>
            <h1 className="mt-4 font-serif text-4xl tracking-tight text-white sm:text-5xl">Set Password</h1>
            <p className="mt-4 text-sm text-stone-500 leading-relaxed">
              Create a new secure password for <br />
              <span className="text-white font-medium">{email || 'your account'}</span>
            </p>
          </div>

          {isMissingToken ? (
            <div className="mb-8 rounded-2xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 text-center text-xs font-bold text-amber-500 tracking-wide uppercase leading-relaxed">
              This reset link is missing essential tokens. Please request a new one.
            </div>
          ) : null}

          {message ? (
            <div className="mb-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-center text-xs font-bold text-emerald-500 tracking-wide uppercase leading-relaxed">
              {message}
            </div>
          ) : null}

          {error ? (
            <div className="mb-8 rounded-2xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-center text-xs font-bold text-rose-500 tracking-wide uppercase leading-relaxed">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="reset-email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Email Address</label>
              <input
                id="reset-email"
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
              <label htmlFor="reset-password" className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">New Password</label>
              <input
                id="reset-password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full rounded-2xl border border-white/10 bg-luxury-black/50 px-5 py-4 text-sm text-white outline-none focus:border-luxury-gold/50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="reset-password-confirmation" className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Confirm New Password</label>
              <input
                id="reset-password-confirmation"
                type="password"
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full rounded-2xl border border-white/10 bg-luxury-black/50 px-5 py-4 text-sm text-white outline-none focus:border-luxury-gold/50"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isMissingToken}
              className="w-full rounded-full border border-luxury-gold bg-luxury-gold py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-luxury-dark transition-all duration-700 hover:bg-transparent hover:text-luxury-gold shadow-gold-glow disabled:opacity-50"
            >
              {isSubmitting ? 'Updating...' : 'Reset Password'}
            </button>
          </form>

          <p className="mt-10 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
            Remembered your password?{' '}
            <Link to="/login" className="text-luxury-gold transition-colors hover:text-luxury-gold-light">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}