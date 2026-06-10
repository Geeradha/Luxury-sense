import React, { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import CartSlideOut from './CartSlideOut';
import { motion, AnimatePresence } from 'framer-motion';

const LuxuryNavbar = () => {
  const navigate = useNavigate();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { items } = useCart();
  const { token } = useAuth();
  const { wishlistItems } = useWishlist();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const wishlistCount = wishlistItems?.length || 0;

  const closeMenu = () => setIsMenuOpen(false);
  const openMenu = () => setIsMenuOpen(true);
  const toggleSearch = () => setIsSearchOpen((current) => !current);

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();
    navigate(trimmedQuery ? `/products?search=${encodeURIComponent(trimmedQuery)}` : '/products');
    setIsSearchOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinkClass = ({ isActive }) =>
    `group relative text-[11px] uppercase tracking-[0.3em] font-bold transition-colors duration-500 ${
      isActive ? 'text-luxury-gold' : 'text-stone-400 hover:text-white'
    }`;

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 w-full border-b transition-all duration-700 ${
          isScrolled
            ? 'border-white/5 bg-luxury-dark/90 shadow-luxury-md backdrop-blur-2xl py-2'
            : 'border-transparent bg-transparent py-4'
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10">
          <Link to="/" className="flex items-center gap-3 transition-transform hover:scale-105" onClick={closeMenu}>
            <img
              src="/logo.png"
              alt="Luxury Sense"
              className="h-16 w-auto object-contain sm:h-24"
            />
          </Link>

          <div className="hidden items-center gap-12 md:flex">
            {[
              { label: 'Boutique', path: '/products' },
              { label: 'Brands', path: '/brands' },
              { label: 'Heritage', path: '/heritage' },
              { label: 'Contact', path: '/contact' }
            ].map((link) => (
              <NavLink key={link.label} to={link.path} className={navLinkClass}>
                {link.label}
                <span className="absolute -bottom-2 left-0 h-px w-0 bg-luxury-gold transition-all duration-500 group-hover:w-full" />
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            {/* Search Toggle */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={toggleSearch}
              className="rounded-full p-2.5 text-stone-400 transition-colors hover:text-white"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
            </motion.button>

            {/* Profile Link */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link
                to={token ? '/profile' : '/login'}
                className="block rounded-full p-2.5 text-stone-400 transition-colors hover:text-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </Link>
            </motion.div>

            {/* Wishlist Link */}
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <Link
                to="/wishlist"
                className="relative block rounded-full p-2.5 text-stone-400 transition-colors hover:text-white"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
                </svg>
                <AnimatePresence>
                  {wishlistCount > 0 && (
                    <motion.span 
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute right-0 top-0 grid h-5 w-5 place-items-center rounded-full bg-luxury-gold text-[10px] font-bold text-luxury-dark shadow-gold-glow"
                    >
                      {wishlistCount}
                    </motion.span>
                  )}
                </AnimatePresence>
              </Link>
            </motion.div>

            {/* Cart Trigger */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsCartOpen(true)}
              className="relative rounded-full p-2.5 text-stone-400 transition-colors hover:text-white"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
              </svg>
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span 
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="absolute right-0 top-0 grid h-5 w-5 place-items-center rounded-full bg-luxury-gold text-[10px] font-bold text-luxury-dark shadow-gold-glow"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Mobile Menu Toggle */}
            <motion.button
              whileTap={{ scale: 0.9 }}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-stone-400 transition-colors hover:border-luxury-gold hover:text-white md:hidden"
              onClick={openMenu}
            >
              <span className="flex flex-col gap-1.5">
                <span className="h-0.5 w-5 rounded-full bg-current" />
                <span className="h-0.5 w-5 rounded-full bg-current opacity-70" />
                <span className="h-0.5 w-5 rounded-full bg-current opacity-40" />
              </span>
            </motion.button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden border-t border-white/5 bg-luxury-black/95 px-6 py-6"
            >
              <form onSubmit={handleSearchSubmit} className="mx-auto max-w-3xl">
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search the collection..."
                  className="w-full rounded-full border border-white/10 bg-white/5 px-8 py-5 text-lg text-white outline-none transition-all placeholder:text-stone-600 focus:border-luxury-gold focus:bg-white/10"
                  autoFocus
                />
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile Slide-over Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="fixed inset-0 z-[60] bg-luxury-black p-10 md:hidden"
            >
              <button onClick={closeMenu} className="absolute right-10 top-10 text-stone-400 hover:text-white">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M18 6L6 18M6 6l12 12" />
                </svg>
              </button>

              <div className="flex h-full flex-col justify-center gap-12">
                {[
                  { label: 'Boutique', path: '/products' },
                  { label: 'Brands', path: '/brands' },
                  { label: 'Heritage', path: '/heritage' },
                  { label: 'Contact', path: '/contact' },
                  { label: 'Wishlist', path: '/wishlist' },
                  { label: 'Profile', path: '/profile' }
                ].map((link, i) => (
                  <motion.div
                    key={link.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 + i * 0.1, duration: 0.8 }}
                  >
                    <NavLink
                      to={link.path}
                      onClick={closeMenu}
                      className="font-serif text-5xl text-stone-200 transition-colors hover:text-luxury-gold"
                    >
                      {link.label}
                    </NavLink>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      <CartSlideOut isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </>
  );
};

export default LuxuryNavbar;
