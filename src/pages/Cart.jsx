import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';

export default function Cart() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { items, cartTotal, updateQuantity, removeFromCart } = useCart();
  const isProfileComplete = Boolean(user?.phone_number && user?.address);
  const shouldBlockCheckout = Boolean(token) && !isProfileComplete;

  const getImageUrl = (path) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;
    const apiOrigin = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '');
    return `${apiOrigin}/storage/${path}`;
  };

  return (
    <main className="min-h-screen bg-luxury-black px-6 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-12 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold/90">Your Selection</p>
            <h1 className="mt-4 font-serif text-5xl tracking-tight text-white sm:text-6xl">Shopping Bag</h1>
          </div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-stone-500">
            {items.length} {items.length === 1 ? 'Item' : 'Items'} in Collection
          </p>
        </header>

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="mb-8 text-lg text-stone-500">Your collection is currently empty.</p>
            <Link
              to="/shop"
              className="rounded-full border border-luxury-gold bg-luxury-gold px-10 py-4 text-[11px] font-bold uppercase tracking-[0.3em] text-luxury-dark transition-all duration-700 hover:bg-transparent hover:text-luxury-gold shadow-gold-glow"
            >
              Continue Exploring
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-8 space-y-6">
              {items.map((item) => (
                <article
                  key={item.id}
                  className="group relative flex flex-col sm:flex-row items-center gap-8 rounded-[32px] border border-white/5 bg-luxury-charcoal p-6 shadow-luxury-md transition-all duration-700 hover:border-luxury-gold/20"
                >
                  <div className="h-32 w-32 shrink-0 overflow-hidden rounded-2xl border border-white/5 bg-luxury-black">
                    <img
                      src={getImageUrl(item.image_path)}
                      alt={item.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>

                  <div className="flex flex-1 flex-col sm:flex-row sm:items-center justify-between gap-6">
                    <div>
                      <h3 className="font-serif text-2xl tracking-tight text-white">{item.name}</h3>
                      <p className="mt-1 text-sm font-medium text-luxury-gold">RS. {Number(item.price).toFixed(2)}</p>
                    </div>

                    <div className="flex items-center gap-8">
                      <div className="flex items-center rounded-full border border-white/10 bg-luxury-black/50 px-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-white transition-colors"
                        >
                          −
                        </button>
                        <span className="w-8 h-8 flex items-center justify-center text-xs font-bold text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center text-stone-400 hover:text-white transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[10px] font-bold uppercase tracking-[0.2em] text-rose-500 hover:text-rose-400 transition-colors"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>

            <aside className="lg:col-span-4">
              <div className="sticky top-32 rounded-[32px] border border-white/5 bg-luxury-charcoal p-8 shadow-luxury-lg backdrop-blur-xl">
                <h2 className="font-serif text-3xl tracking-tight text-white mb-8">Summary</h2>
                
                <div className="space-y-6">
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500 uppercase tracking-widest">Subtotal</span>
                    <span className="text-white font-medium">RS. {cartTotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-stone-500 uppercase tracking-widest">Delivery</span>
                    <span className="text-emerald-500 uppercase tracking-widest font-bold">Complimentary</span>
                  </div>
                  <div className="border-t border-white/5 pt-6 flex justify-between">
                    <span className="text-lg font-serif text-white">Total</span>
                    <span className="text-2xl font-medium text-white">RS. {cartTotal.toFixed(2)}</span>
                  </div>
                </div>

                {shouldBlockCheckout && (
                  <div className="mt-8 rounded-2xl border border-luxury-gold/30 bg-luxury-gold/5 p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold mb-3 leading-relaxed text-center">
                      Complete your profile to place an order
                    </p>
                    <Link
                      to="/profile"
                      className="block w-full rounded-full bg-white/5 py-2.5 text-center text-[10px] font-bold uppercase tracking-widest text-white hover:bg-white/10 transition-colors"
                    >
                      Update Profile
                    </Link>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => navigate('/checkout')}
                  disabled={!items.length || shouldBlockCheckout}
                  className={`mt-10 block w-full rounded-full border border-luxury-gold py-5 text-center text-[11px] font-bold uppercase tracking-[0.3em] transition-all duration-700 shadow-gold-glow ${
                    !items.length || shouldBlockCheckout
                      ? 'bg-stone-800 text-stone-500 border-stone-700 cursor-not-allowed shadow-none'
                      : 'bg-luxury-gold text-luxury-dark hover:bg-transparent hover:text-luxury-gold'
                  }`}
                >
                  Proceed to Checkout
                </button>

                <p className="mt-6 text-center text-[10px] font-bold uppercase tracking-[0.2em] text-stone-600">
                  Secure Checkout Guaranteed
                </p>
              </div>
            </aside>
          </div>
        )}
      </div>
    </main>
  );
}
