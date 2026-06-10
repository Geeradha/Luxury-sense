import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartSlideOut({ isOpen, onClose }) {
  const navigate = useNavigate();
  const { items, cartTotal, updateQuantity, removeFromCart } = useCart();

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          {/* Slide-out Panel */}
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="fixed top-0 right-0 z-[110] flex h-screen w-full flex-col border-l border-white/5 bg-luxury-charcoal shadow-2xl sm:max-w-md"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-6 sm:px-8">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold/90">Shopping Bag</p>
                <h2 className="mt-2 font-serif text-3xl tracking-tight text-white">Your Selection</h2>
              </motion.div>
              <button
                onClick={onClose}
                className="group flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-white transition-all duration-300 hover:border-luxury-gold hover:text-luxury-gold"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-6 py-8 sm:px-8 custom-scrollbar">
              {items.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center">
                  <p className="text-lg text-stone-500 font-serif">Your selection is empty.</p>
                  <button
                    onClick={onClose}
                    className="mt-8 text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-gold transition-all duration-500"
                  >
                    <span className="relative">
                      Continue Exploring
                      <span className="absolute -bottom-2 left-0 h-px w-full bg-luxury-gold/30" />
                    </span>
                  </button>
                </div>
              ) : (
                <div className="space-y-10">
                  {items.map((item, index) => (
                    <motion.div 
                      key={item.id} 
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1, duration: 0.8 }}
                      className="group relative flex gap-6"
                    >
                      <div className="h-28 w-24 shrink-0 overflow-hidden rounded-2xl border border-white/5 bg-luxury-black shadow-lg">
                        <motion.img
                          src={item.image_path ? (item.image_path.startsWith('http') ? item.image_path : `${(import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '')}/storage/${item.image_path}`) : ''}
                          alt={item.name}
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.8 }}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="flex flex-1 flex-col justify-between py-1">
                        <div>
                          <h3 className="font-serif text-xl text-white group-hover:text-luxury-gold transition-colors duration-500">{item.name}</h3>
                          <p className="mt-1 text-sm font-medium text-luxury-gold">RS. {Number(item.price).toFixed(2)}</p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center rounded-full border border-white/10 bg-white/5 px-2">
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
                            className="text-[9px] font-bold uppercase tracking-[0.2em] text-stone-500 hover:text-rose-500 transition-colors"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="border-t border-white/5 bg-white/2 px-6 py-10 sm:px-8"
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-stone-500">Subtotal</span>
                  <span className="font-serif text-2xl text-white">RS. {cartTotal.toFixed(2)}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    onClose();
                    navigate('/checkout');
                  }}
                  className="w-full rounded-full border border-luxury-gold bg-luxury-gold py-5 text-[11px] font-bold uppercase tracking-[0.3em] text-luxury-dark transition-all duration-700 hover:bg-transparent hover:text-luxury-gold shadow-gold-glow"
                >
                  Secure Checkout
                </motion.button>
                <p className="mt-6 text-center text-[9px] font-bold uppercase tracking-[0.3em] text-stone-600 font-sans">
                  Complimentary Delivery Included
                </p>
              </motion.div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}