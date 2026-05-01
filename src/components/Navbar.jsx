import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

export default function Navbar() {
  const { items } = useCart();

  const cartCount = items.reduce((total, item) => total + Number(item.quantity || 0), 0);

  return (
    <header className="site-navbar">
      <div className="site-navbar__brand">
        <Link to="/" className="site-navbar__logo">
          Luxury Sense
        </Link>
      </div>

      <nav className="site-navbar__nav" aria-label="Primary navigation">
        <NavLink to="/" className={({ isActive }) => `site-navbar__link${isActive ? ' site-navbar__link--active' : ''}`} end>
          Home
        </NavLink>
        <NavLink to="/shop" className={({ isActive }) => `site-navbar__link${isActive ? ' site-navbar__link--active' : ''}`}>
          Shop
        </NavLink>
        <NavLink to="/cart" className={({ isActive }) => `site-navbar__link${isActive ? ' site-navbar__link--active' : ''}`}>
          <span>Cart</span>
          <span className="site-navbar__badge">{cartCount}</span>
        </NavLink>
        <NavLink to="/login" className={({ isActive }) => `site-navbar__link${isActive ? ' site-navbar__link--active' : ''}`}>
          Login/Register
        </NavLink>
      </nav>
    </header>
  );
}