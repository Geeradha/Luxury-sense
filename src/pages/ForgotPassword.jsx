import { useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');
    setIsSubmitting(true);

    try {
      const response = await apiClient.post('/forgot-password', { email });
      setMessage(response.data?.message || 'If the email exists, a reset link has been sent.');
    } catch (forgotError) {
      const validationErrors = forgotError?.response?.data?.errors;
      const validationMessage = validationErrors
        ? Object.values(validationErrors).flat().join(' ')
        : null;

      setError(validationMessage || forgotError?.response?.data?.message || 'Unable to send the reset link.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-luxury-black flex items-center justify-center px-6 py-20 sm:px-8 lg:px-10">
      <div className="w-full max-w-md">
        <div className="rounded-[32px] border border-white/5 bg-luxury-charcoal p-8 shadow-luxury-lg backdrop-blur-xl sm:p-10">
          <div className="mb-10 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold/90">Account Recovery</p>
            <h1 className="mt-4 font-serif text-4xl tracking-tight text-white sm:text-5xl">Forgot Password</h1>
            <p className="mt-4 text-sm text-stone-500 leading-relaxed">
              Enter your email and we’ll send a link to securely reset your credentials.
            </p>
          </div>

          {message ? (
            <div className="mb-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-center text-xs font-bold text-emerald-500 tracking-wide uppercase">
              {message}
            </div>
          ) : null}

          {error ? (
            <div className="mb-8 rounded-2xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-center text-xs font-bold text-rose-500 tracking-wide uppercase">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label htmlFor="forgot-email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Email Address</label>
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                className="w-full rounded-2xl border border-white/10 bg-luxury-black/50 px-5 py-4 text-sm text-white outline-none focus:border-luxury-gold/50"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full border border-luxury-gold bg-luxury-gold py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-luxury-dark transition-all duration-700 hover:bg-transparent hover:text-luxury-gold shadow-gold-glow disabled:opacity-50"
            >
              {isSubmitting ? 'Requesting Link...' : 'Send Reset Link'}
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