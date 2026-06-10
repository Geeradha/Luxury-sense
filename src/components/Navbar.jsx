import { useEffect, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useWishlist } from '../contexts/WishlistContext';
import LogoutButton from './LogoutButton';

export default function Navbar() {
  const navigate = useNavigate();
  const { items } = useCart();
  const { token } = useAuth();
  const { wishlistItems } = useWishlist();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const cartCount = items.reduce((total, item) => total + Number(item.quantity || 0), 0);
  const wishlistCount = wishlistItems?.length || 0;

  const handleSearchSubmit = (event) => {
    event.preventDefault();
    const trimmedQuery = searchQuery.trim();
    navigate(trimmedQuery ? `/products?search=${encodeURIComponent(trimmedQuery)}` : '/products');
    setIsSearchOpen(false);
  };

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/80 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-serif tracking-[0.18em] text-stone-950">
          Luxury Sense
        </Link>

        <nav className="hidden items-center gap-8 md:flex" aria-label="Primary navigation">
          <NavLink to="/" end className={({ isActive }) => `text-sm uppercase tracking-[0.22em] transition ${isActive ? 'text-stone-950' : 'text-stone-500 hover:text-stone-950'}`}>
            Home
          </NavLink>
          <NavLink to="/products" className={({ isActive }) => `text-sm uppercase tracking-[0.22em] transition ${isActive ? 'text-stone-950' : 'text-stone-500 hover:text-stone-950'}`}>
            Boutique
          </NavLink>
          <NavLink to="/wishlist" className={({ isActive }) => `relative text-sm uppercase tracking-[0.22em] transition ${isActive ? 'text-stone-950' : 'text-stone-500 hover:text-stone-950'}`}>
            Wishlist
            {wishlistCount > 0 ? <span className="ml-2 rounded-full bg-stone-950 px-2 py-0.5 text-[0.65rem] font-semibold text-white">{wishlistCount}</span> : null}
          </NavLink>
          <NavLink to="/cart" className={({ isActive }) => `relative text-sm uppercase tracking-[0.22em] transition ${isActive ? 'text-stone-950' : 'text-stone-500 hover:text-stone-950'}`}>
            Cart
            {cartCount > 0 ? <span className="ml-2 rounded-full bg-stone-950 px-2 py-0.5 text-[0.65rem] font-semibold text-white">{cartCount}</span> : null}
          </NavLink>
          <NavLink to={token ? '/profile' : '/login'} className={({ isActive }) => `text-sm uppercase tracking-[0.22em] transition ${isActive ? 'text-stone-950' : 'text-stone-500 hover:text-stone-950'}`}>
            {token ? 'Profile' : 'Login/Register'}
          </NavLink>
          {token ? (
            <LogoutButton
              redirectTo="/login"
              className="rounded-full border border-stone-200 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-stone-600 transition hover:border-stone-950 hover:text-stone-950"
            >
              Logout
            </LogoutButton>
          ) : null}
        </nav>

        <div className="flex items-center gap-2">
          <button type="button" onClick={() => setIsSearchOpen((current) => !current)} className="rounded-full p-2 text-stone-700 transition hover:bg-stone-100 hover:text-stone-950" aria-label="Search products" aria-expanded={isSearchOpen}>
            Search
          </button>
          <button type="button" onClick={() => setIsMenuOpen((current) => !current)} className="rounded-full p-2 text-stone-700 transition hover:bg-stone-100 hover:text-stone-950 md:hidden" aria-label="Open menu" aria-expanded={isMenuOpen}>
            Menu
          </button>
        </div>
      </div>

      <div className={`border-t border-stone-200/80 bg-white px-4 py-3 ${isSearchOpen ? 'block' : 'hidden'}`}>
        <form onSubmit={handleSearchSubmit} className="mx-auto max-w-3xl">
          <input
            type="search"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search products"
            className="w-full rounded-full border border-stone-200 bg-stone-50 px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-stone-900"
          />
        </form>
      </div>

      <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} border-t border-stone-200/80 bg-white px-4 py-5`}>
        <div className="flex flex-col gap-4">
          <NavLink to="/" end onClick={() => setIsMenuOpen(false)} className="text-sm uppercase tracking-[0.22em] text-stone-700">
            Home
          </NavLink>
          <NavLink to="/products" onClick={() => setIsMenuOpen(false)} className="text-sm uppercase tracking-[0.22em] text-stone-700">
            Boutique
          </NavLink>
          <NavLink to="/wishlist" onClick={() => setIsMenuOpen(false)} className="text-sm uppercase tracking-[0.22em] text-stone-700">
            Wishlist
          </NavLink>
          <NavLink to="/cart" onClick={() => setIsMenuOpen(false)} className="text-sm uppercase tracking-[0.22em] text-stone-700">
            Cart
          </NavLink>
          <NavLink to={token ? '/profile' : '/login'} onClick={() => setIsMenuOpen(false)} className="text-sm uppercase tracking-[0.22em] text-stone-700">
            {token ? 'Profile' : 'Login/Register'}
          </NavLink>
          {token ? (
            <LogoutButton
              redirectTo="/login"
              className="rounded-full border border-stone-200 px-4 py-3 text-left text-sm uppercase tracking-[0.22em] text-stone-700 transition hover:border-stone-950 hover:text-stone-950"
            >
              Logout
            </LogoutButton>
          ) : null}
        </div>
      </div>
    </header>
  );
}