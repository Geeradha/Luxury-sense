import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import CartSlideOut from './CartSlideOut';

const LuxuryNavbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { items } = useCart();

  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const openMenu = () => {
    setIsMenuOpen(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!isMenuOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isMenuOpen]);

  return (
    <nav
      className="luxury-navbar"
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 50,
        width: '100%',
        transition: 'all 0.6s ease',
        backgroundColor: isScrolled ? '#ffffff' : 'rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(12px)',
        borderBottom: isScrolled ? '1px solid #e5e7eb' : 'none',
        boxShadow: isScrolled ? '0 2px 8px rgba(26, 26, 26, 0.05)' : 'none',
      }}
    >
      <div className="luxury-navbar__inner">
        <div className="luxury-navbar__left">
          <NavLink to="/shop" className="luxury-navbar__link underline-fade">
            Boutique
          </NavLink>
          <NavLink to="/collections" className="luxury-navbar__link underline-fade">
            Collections
          </NavLink>
          <NavLink to="/heritage" className="luxury-navbar__link underline-fade">
            Heritage
          </NavLink>
        </div>

        <Link to="/" className="luxury-navbar__logo" onClick={closeMenu}>
          Luxury Sense
        </Link>

        <div className="luxury-navbar__right">
          <button type="button" className="luxury-navbar__icon-button" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
          </button>

          <Link to="/login" className="luxury-navbar__icon-button" aria-label="Account">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
              <circle cx="12" cy="7" r="4"></circle>
            </svg>
          </Link>

          <button type="button" onClick={() => setIsCartOpen(true)} className="luxury-navbar__icon-button luxury-navbar__cart-button" aria-label="Open Shopping Tote">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="9" cy="21" r="1"></circle>
              <circle cx="20" cy="21" r="1"></circle>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
            </svg>
            {cartCount > 0 ? <span className="luxury-navbar__cart-badge">{cartCount}</span> : null}
          </button>

          <button type="button" className="luxury-navbar__menu-button" onClick={openMenu} aria-label="Open menu" aria-expanded={isMenuOpen}>
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`luxury-menu-overlay${isMenuOpen ? ' luxury-menu-overlay--open' : ''}`} aria-hidden={!isMenuOpen}>
        <button type="button" className="luxury-menu-overlay__close" onClick={closeMenu} aria-label="Close menu">
          ×
        </button>

        <div className="luxury-menu-overlay__links">
          <NavLink to="/shop" className="luxury-menu-overlay__link" onClick={closeMenu}>
            Boutique
          </NavLink>
          <NavLink to="/collections" className="luxury-menu-overlay__link" onClick={closeMenu}>
            Collections
          </NavLink>
          <NavLink to="/heritage" className="luxury-menu-overlay__link" onClick={closeMenu}>
            Heritage
          </NavLink>
          <NavLink to="/cart" className="luxury-menu-overlay__link" onClick={closeMenu}>
            Cart
          </NavLink>
          <NavLink to="/login" className="luxury-menu-overlay__link" onClick={closeMenu}>
            Login
          </NavLink>
        </div>
      </div>

      <CartSlideOut isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </nav>
  );
};

export default LuxuryNavbar;
