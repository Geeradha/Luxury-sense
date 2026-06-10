import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = useMemo(
    () => location.state?.email || localStorage.getItem('pending_verification_email') || '',
    [location.state?.email]
  );
  const [otp, setOtp] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!email) {
      navigate('/signup', { replace: true });
    }
  }, [email, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await apiClient.post('/verify-otp', { email, otp });
      localStorage.removeItem('pending_verification_email');
      navigate('/login', { replace: true });
    } catch (verificationError) {
      const message = verificationError?.response?.data?.message || 'Invalid OTP. Please try again.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-luxury-black flex items-center justify-center px-6 py-20 sm:px-8 lg:px-10">
      <div className="w-full max-w-md">
        <div className="rounded-[32px] border border-white/5 bg-luxury-charcoal p-8 shadow-luxury-lg backdrop-blur-xl sm:p-10">
          <div className="mb-10 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold/90">Authentication</p>
            <h1 className="mt-4 font-serif text-4xl tracking-tight text-white sm:text-5xl">Verify Email</h1>
            <p className="mt-4 text-sm text-stone-500 leading-relaxed">
              Enter the 6-digit code sent to <br />
              <span className="text-white font-medium">{email || 'your email'}</span>
            </p>
          </div>

          {error ? (
            <div className="mb-8 rounded-2xl border border-rose-500/20 bg-rose-500/5 px-4 py-3 text-center text-xs font-bold text-rose-500 tracking-wide uppercase">
              {error}
            </div>
          ) : null}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-2">
              <label htmlFor="otp" className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Verification Code</label>
              <input
                id="otp"
                type="text"
                name="otp"
                inputMode="numeric"
                pattern="[0-9]*"
                maxLength={6}
                value={otp}
                onChange={(event) => setOtp(event.target.value.replace(/\D/g, '').slice(0, 6))}
                placeholder="0 0 0 0 0 0"
                required
                className="w-full text-center text-2xl tracking-[0.6em] font-medium rounded-2xl border border-white/10 bg-luxury-black/50 px-5 py-5 text-white outline-none focus:border-luxury-gold/50"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-full border border-luxury-gold bg-luxury-gold py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-luxury-dark transition-all duration-700 hover:bg-transparent hover:text-luxury-gold shadow-gold-glow disabled:opacity-50"
            >
              {isSubmitting ? 'Verifying...' : 'Complete Verification'}
            </button>
          </form>

          <p className="mt-10 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">
            Didn't receive a code?{' '}
            <Link to="/signup" className="text-luxury-gold transition-colors hover:text-luxury-gold-light">
              Try again
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}