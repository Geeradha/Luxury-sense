import { useMemo, useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

function getApiErrorMessage(error) {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }

  const validationErrors = error?.response?.data?.errors;

  if (validationErrors) {
    return Object.values(validationErrors).flat().join(' ');
  }

  return 'Unable to place your order right now.';
}

export default function Checkout() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { items, cartTotal, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    onResize();
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const profilePhone = user?.phone || user?.phone_number;
  const isProfileComplete = Boolean(profilePhone && user?.address);
  const shouldBlockCheckout = Boolean(token) && !isProfileComplete;
  const canPlaceOrder = Boolean(token) && items.length > 0 && !shouldBlockCheckout && !loading;

  const shippingDetails = {
    customer_name: user?.name || '',
    email: user?.email || '',
    phone: profilePhone || '',
    address: user?.address || '',
  };

  const authHeaders = useMemo(
    () => ({
      Accept: 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    }),
    [token]
  );

  const updateField = (field) => (event) => {
    return event;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!items.length) {
      setError('Your cart is empty. Please add items before checking out.');
      return;
    }

    if (!token) {
      setError('Please sign in to place an order.');
      return;
    }

    if (shouldBlockCheckout) {
      const message = 'Please fill in your profile details to place an order';
      setError(message);
      toast.error(message);
      return;
    }

    setLoading(true);
    setError('');

    const payload = {
      ...shippingDetails,
      total_amount: cartTotal,
      items: items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
      order_items: items.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    try {
      await axios.post('/api/orders', payload, { headers: authHeaders });
      clearCart();
      setSuccess(true);
    } catch (submitError) {
      setError(getApiErrorMessage(submitError));
    } finally {
      setLoading(false);
    }
  };

  // --- 1. PREMIUM SUCCESS STATE ---
  if (success) {
    return (
      <main className="min-h-screen bg-luxury-black flex items-center justify-center px-6 py-20">
        <div className="w-full max-w-2xl text-center">
          <div className="mx-auto mb-10 flex h-24 w-24 items-center justify-center rounded-full border border-luxury-gold/30 bg-luxury-gold/10 shadow-gold-glow">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#d4af9e" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          
          <p className="text-[12px] font-bold uppercase tracking-[0.5em] text-luxury-gold mb-6">Confirmed</p>
          <h1 className="font-serif text-5xl tracking-tight text-white sm:text-7xl mb-8">Thank You</h1>
          <p className="mx-auto max-w-md text-sm leading-8 text-stone-500 sm:text-lg sm:leading-9 mb-12">
            Your selection has been secured. Our team will review your order and send a confirmation to your email shortly.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <Link
              to="/my-orders"
              className="w-full sm:w-auto rounded-full border border-luxury-gold bg-luxury-gold px-10 py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-luxury-dark transition-all duration-700 hover:bg-transparent hover:text-luxury-gold shadow-gold-glow"
            >
              View Orders
            </Link>
            <Link
              to="/shop"
              className="text-[11px] font-bold uppercase tracking-[0.3em] text-stone-500 hover:text-white transition-colors underline decoration-stone-800 underline-offset-8"
            >
              Back to Boutique
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // --- 2. MAIN CHECKOUT FORM ---
  return (
    <main className="min-h-screen bg-luxury-black px-6 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold/90">Final Step</p>
          <h1 className="mt-4 font-serif text-5xl tracking-tight text-white sm:text-6xl">Checkout</h1>
        </header>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-7 space-y-8">
            {!token && (
              <div className="rounded-[28px] border border-white/5 bg-luxury-charcoal/50 p-6 flex flex-col sm:flex-row items-center justify-between gap-6 backdrop-blur-sm">
                <p className="text-sm text-stone-400">
                  Already have an account? <span className="text-white font-medium">Sign in</span> for a seamless checkout.
                </p>
                <Link
                  to="/login?redirect=/checkout"
                  className="shrink-0 rounded-full border border-white/30 px-8 py-2.5 text-[10px] font-bold uppercase tracking-[0.2em] text-white transition-all duration-500 hover:bg-white hover:text-luxury-dark shadow-lg"
                >
                  Sign In
                </Link>
              </div>
            )}

            {shouldBlockCheckout && (
              <div className="rounded-[28px] border border-rose-500/20 bg-rose-500/5 p-6 backdrop-blur-xl">
                <p className="text-sm font-bold uppercase tracking-widest text-rose-500 mb-4 text-center">
                  Please complete your profile to place an order
                </p>
                <Link
                  to="/profile"
                  className="block w-full rounded-full bg-rose-500 py-3 text-center text-[10px] font-bold uppercase tracking-widest text-white hover:bg-rose-600 transition-colors"
                >
                  Update Profile
                </Link>
              </div>
            )}

            <section className="rounded-[32px] border border-white/5 bg-luxury-charcoal p-8 shadow-luxury-md">
              <h3 className="text-sm font-bold uppercase tracking-[0.3em] text-white mb-8 border-b border-white/5 pb-4">Shipping Details</h3>
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Full Name</span>
                    <p className="text-white font-medium">{shippingDetails.customer_name || '—'}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Email Address</span>
                    <p className="text-white font-medium">{shippingDetails.email || '—'}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Phone Number</span>
                  <p className="text-white font-medium">{shippingDetails.phone || '—'}</p>
                </div>
                <div className="space-y-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500">Delivery Address</span>
                  <p className="text-white leading-relaxed">{shippingDetails.address || '—'}</p>
                </div>
                <p className="text-[10px] text-stone-600 italic">
                  Note: To change these details, please update your profile.
                </p>
              </div>
            </section>
          </div>

          <aside className="lg:col-span-5">
            <div className="sticky top-32 rounded-[32px] border border-white/5 bg-luxury-charcoal p-8 shadow-luxury-lg backdrop-blur-xl">
              <h2 className="font-serif text-3xl tracking-tight text-white mb-8">Order Summary</h2>

              <div className="space-y-6 max-h-60 overflow-y-auto pr-2 mb-8 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-start gap-4">
                    <div>
                      <h4 className="text-sm font-medium text-white">{item.name}</h4>
                      <p className="text-[10px] text-stone-500 uppercase tracking-widest mt-1">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm text-luxury-gold whitespace-nowrap">RS. {Number(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-4 border-t border-white/5 pt-6">
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500 uppercase tracking-widest text-[10px] font-bold">Subtotal</span>
                  <span className="text-white font-medium">RS. {cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-stone-500 uppercase tracking-widest text-[10px] font-bold">Delivery</span>
                  <span className="text-emerald-500 uppercase tracking-widest text-[10px] font-bold">Complimentary</span>
                </div>
                <div className="border-t border-white/5 pt-6 flex justify-between">
                  <span className="text-lg font-serif text-white">Total</span>
                  <span className="text-2xl font-medium text-white">RS. {cartTotal.toFixed(2)}</span>
                </div>
              </div>

              {error && (
                <p className="mt-6 text-center text-[10px] font-bold uppercase tracking-widest text-rose-500">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={!canPlaceOrder}
                className={`mt-10 block w-full rounded-full border border-luxury-gold py-5 text-center text-[11px] font-bold uppercase tracking-[0.3em] transition-all duration-700 shadow-gold-glow ${
                  !canPlaceOrder
                    ? 'bg-stone-800 text-stone-500 border-stone-700 cursor-not-allowed shadow-none'
                    : 'bg-luxury-gold text-luxury-dark hover:bg-transparent hover:text-luxury-gold'
                }`}
              >
                {loading ? 'Confirming...' : 'Place Secure Order'}
              </button>

              <div className="mt-8 flex items-center justify-center gap-4 border-t border-white/5 pt-6">
                <button
                  type="button"
                  onClick={() => navigate('/cart')}
                  className="text-[10px] font-bold uppercase tracking-[0.2em] text-stone-500 hover:text-white transition-colors"
                >
                  Return to Bag
                </button>
              </div>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}