import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await apiClient.post('/register', form);
      localStorage.setItem('pending_verification_email', form.email);
      navigate('/verify-otp', { state: { email: form.email }, replace: true });
    } catch (registerError) {
      const validationErrors = registerError?.response?.data?.errors;
      const validationMessage = validationErrors
        ? Object.values(validationErrors).flat().join(' ')
        : null;

      setError(validationMessage || registerError?.response?.data?.message || 'Unable to create your account.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-luxury-black flex items-center justify-center px-6 py-20 sm:px-8 lg:px-10">
      <div className="w-full max-w-md">
        <div className="rounded-[32px] border border-white/5 bg-luxury-charcoal p-8 shadow-luxury-lg backdrop-blur-xl sm:p-10">
          <div className="mb-10 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold/90">Join the Boutique</p>
            <h1 className="mt-4 font-serif text-4xl tracking-tight text-white sm:text-5xl">Create Account</h1>
            <p className="mt-4 text-sm text-stone-500">Begin your journey into luxury.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="signup-name" className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Full Name</label>
              <input
                id="signup-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="John Doe"
                required
                className="w-full rounded-2xl border border-white/10 bg-luxury-black/50 px-5 py-4 text-sm text-white outline-none focus:border-luxury-gold/50"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="signup-email" className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Email Address</label>
              <input
                id="signup-email"
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
              <label htmlFor="signup-password" className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Password</label>
              <input
                id="signup-password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="••••••••"
                required
                className="w-full rounded-2xl border border-white/10 bg-luxury-black/50 px-5 py-4 text-sm text-white outline-none focus:border-luxury-gold/50"
              />
            </div>

            {error ? (
              <p className="text-center text-xs font-bold text-rose-500 tracking-wide uppercase">{error}</p>
            ) : null}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full border border-luxury-gold bg-luxury-gold py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-luxury-dark transition-all duration-700 hover:bg-transparent hover:text-luxury-gold shadow-gold-glow disabled:opacity-50"
            >
              {isSubmitting ? 'Creating Account...' : 'Sign Up'}
            </button>
          </form>

          <p className="mt-10 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
            Already have an account?{' '}
            <Link to="/login" className="text-luxury-gold transition-colors hover:text-luxury-gold-light">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}