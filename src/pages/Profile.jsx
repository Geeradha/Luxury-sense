import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import LogoutButton from '../components/LogoutButton';
import Toast from '../components/Toast';
import { useAuth } from '../contexts/AuthContext';

export default function Profile() {
  const navigate = useNavigate();
  const { user, token, role, login } = useAuth();
  const [form, setForm] = useState({ name: '', phone_number: '', address: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [isToastVisible, setIsToastVisible] = useState(false);

  useEffect(() => {
    if (!token) {
      navigate('/login', { replace: true });
      return;
    }

    let isActive = true;

    const loadProfile = async () => {
      setIsLoading(true);
      setError('');

      try {
        const response = await apiClient.get('/profile');
        const profileUser = response.data?.user ?? user ?? null;

        if (!isActive) {
          return;
        }

        setForm({
          name: profileUser?.name || '',
          phone_number: profileUser?.phone_number || '',
          address: profileUser?.address || '',
        });
      } catch (profileError) {
        if (!isActive) {
          return;
        }

        setError(profileError?.response?.data?.message || 'Unable to load your profile.');
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isActive = false;
    };
  }, [navigate, token, user]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setIsSaving(true);

    try {
      const response = await apiClient.put('/profile', form);
      const updatedUser = response.data?.user ?? null;

      if (updatedUser) {
        login({
          user: updatedUser,
          token,
          role: updatedUser?.role ?? role ?? null,
        });

        setForm({
          name: updatedUser?.name || '',
          phone_number: updatedUser?.phone_number || '',
          address: updatedUser?.address || '',
        });
      }

      setToastMessage(response.data?.message || 'Profile updated successfully.');
      setIsToastVisible(true);
    } catch (profileSaveError) {
      const validationErrors = profileSaveError?.response?.data?.errors;
      const validationMessage = validationErrors
        ? Object.values(validationErrors).flat().join(' ')
        : null;

      setError(validationMessage || profileSaveError?.response?.data?.message || 'Unable to save changes.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="min-h-screen bg-luxury-black flex items-center justify-center px-6 py-20 sm:px-8 lg:px-10">
      <Toast message={toastMessage} isVisible={isToastVisible} onClose={() => setIsToastVisible(false)} />

      <div className="w-full max-w-2xl">
        <div className="rounded-[32px] border border-white/5 bg-luxury-charcoal p-8 shadow-luxury-lg backdrop-blur-xl sm:p-10">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold/90">Your Account</p>
              <h1 className="mt-4 font-serif text-4xl tracking-tight text-white sm:text-5xl">Profile</h1>
            </div>
            <div className="flex gap-4">
              <Link to="/my-orders" className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 hover:text-luxury-gold transition-colors">
                Orders
              </Link>
              <LogoutButton className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500 hover:text-rose-400 transition-colors" />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="profile-name" className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Full Name</label>
                <input
                  id="profile-name"
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className="w-full rounded-2xl border border-white/10 bg-luxury-black/50 px-5 py-4 text-sm text-white outline-none focus:border-luxury-gold/50"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="profile-phone_number" className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Phone Number</label>
                <input
                  id="profile-phone_number"
                  type="tel"
                  name="phone_number"
                  value={form.phone_number}
                  onChange={handleChange}
                  placeholder="+92 300 1234567"
                  className="w-full rounded-2xl border border-white/10 bg-luxury-black/50 px-5 py-4 text-sm text-white outline-none focus:border-luxury-gold/50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="profile-address" className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-400">Shipping Address</label>
              <textarea
                id="profile-address"
                name="address"
                value={form.address}
                onChange={handleChange}
                rows={4}
                placeholder="Enter your full address"
                className="w-full rounded-[24px] border border-white/10 bg-luxury-black/50 px-5 py-4 text-sm text-white outline-none focus:border-luxury-gold/50"
              />
            </div>

            {error ? (
              <p className="text-center text-xs font-bold text-rose-500 tracking-wide uppercase">{error}</p>
            ) : null}

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving || isLoading}
                className="rounded-full border border-luxury-gold bg-luxury-gold px-10 py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-luxury-dark transition-all duration-700 hover:bg-transparent hover:text-luxury-gold shadow-gold-glow disabled:opacity-50"
              >
                {isSaving ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}