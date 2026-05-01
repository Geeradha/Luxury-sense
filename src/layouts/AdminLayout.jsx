import { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const navItems = [
  { to: '/admin/dashboard', label: 'Overview' },
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/orders', label: 'Orders' },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/admin/login', { replace: true });
  };

  const handleNavClick = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className={`admin-shell${isSidebarOpen ? ' admin-shell--open' : ''}`}>
      <button
        type="button"
        className="admin-mobile-toggle"
        onClick={() => setIsSidebarOpen((current) => !current)}
        aria-label="Toggle admin navigation"
        aria-expanded={isSidebarOpen}
      >
        ☰
      </button>

      <div
        className={`admin-sidebar-backdrop${isSidebarOpen ? ' admin-sidebar-backdrop--visible' : ''}`}
        onClick={() => setIsSidebarOpen(false)}
        aria-hidden="true"
      />

      <aside className="admin-sidebar" aria-label="Admin navigation">
        <div className="admin-brand">
          <span className="admin-brand__eyebrow">Luxury Sense</span>
          <h1 className="admin-brand__title">Management</h1>
        </div>

        <nav className="admin-nav">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleNavClick}
              className={({ isActive }) =>
                `admin-nav__link${isActive ? ' admin-nav__link--active' : ''}`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>

        <button type="button" className="admin-logout" onClick={handleLogout}>
          Logout
        </button>
      </aside>

      <main className="admin-content">
        <Outlet />
      </main>
    </div>
  );
}