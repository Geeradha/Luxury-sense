import { useState } from 'react';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import LogoutButton from '../components/LogoutButton';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  LayoutDashboard, 
  Package, 
  Layers, 
  Award, 
  ShoppingBag, 
  Users, 
  MessageSquare, 
  HelpCircle,
  LogOut,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/categories', label: 'Categories', icon: Layers },
  { to: '/admin/brands', label: 'Brands', icon: Award },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/customers', label: 'Patrons', icon: Users },
  { to: '/admin/users', label: 'Admins', icon: ShieldCheck },
  { to: '/admin/contact-messages', label: 'Messages', icon: MessageSquare },
  { to: '/admin/questions', label: 'Inquiries', icon: HelpCircle },
];

export default function AdminLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const getCurrentPageLabel = () => {
    const item = navItems.find(item => item.to === location.pathname);
    return item ? item.label : 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-luxury-black text-stone-100 lg:pl-80">
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-80 flex-col border-r border-white/5 bg-luxury-charcoal px-8 py-10 shadow-luxury-lg lg:flex">
        <div className="mb-12">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold/90">Boutique Control</p>
          <h1 className="mt-4 font-serif text-4xl tracking-tight text-white">Admin</h1>
          <div className="mt-6 h-px w-12 bg-luxury-gold/30" />
        </div>

        <nav className="flex flex-1 flex-col gap-2 overflow-y-auto custom-scrollbar pr-2" aria-label="Admin navigation">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `group flex items-center justify-between rounded-2xl border px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] transition-all duration-500 ${
                  isActive
                    ? 'border-luxury-gold/20 bg-luxury-gold/5 text-luxury-gold shadow-[0_0_20px_rgba(212,175,158,0.1)]'
                    : 'border-transparent bg-transparent text-stone-500 hover:border-white/5 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <div className="flex items-center gap-4">
                    <item.icon size={16} className={isActive ? 'text-luxury-gold' : 'text-stone-600 group-hover:text-stone-400'} />
                    {item.label}
                  </div>
                  <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <LogoutButton
          redirectTo="/login"
          className="mt-12 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-rose-500 hover:text-rose-400 transition-colors text-left pl-6"
        >
          <LogOut size={14} />
          Sign Out
        </LogoutButton>
      </aside>

      {/* Mobile Header */}
      <header className="sticky top-0 z-30 border-b border-white/5 bg-luxury-black/80 px-6 py-6 backdrop-blur-2xl lg:hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/5 text-stone-400 transition hover:border-luxury-gold hover:text-luxury-gold"
              aria-label="Open navigation menu"
            >
              <Menu size={20} />
            </button>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-luxury-gold/70">Admin Portal</p>
              <h2 className="font-serif text-2xl tracking-tight text-white">{getCurrentPageLabel()}</h2>
            </div>
          </div>

          <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]" />
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
              className="fixed inset-0 z-50 bg-luxury-black/80 backdrop-blur-sm lg:hidden"
            />
            
            {/* Drawer */}
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-[280px] flex-col bg-luxury-charcoal p-8 shadow-2xl lg:hidden flex"
            >
              <div className="flex items-center justify-between mb-10">
                <div>
                  <p className="text-[8px] font-bold uppercase tracking-[0.4em] text-luxury-gold/90">Boutique</p>
                  <h1 className="font-serif text-2xl tracking-tight text-white">Control</h1>
                </div>
                <button 
                  onClick={closeMobileMenu}
                  className="h-9 w-9 flex items-center justify-center rounded-full border border-white/10 text-stone-400"
                >
                  <X size={18} />
                </button>
              </div>

              <nav className="flex flex-1 flex-col gap-2 overflow-y-auto custom-scrollbar pr-2" aria-label="Mobile navigation">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={closeMobileMenu}
                    className={({ isActive }) =>
                      `flex items-center gap-4 rounded-xl border px-5 py-3 text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-300 ${
                        isActive
                          ? 'border-luxury-gold/30 bg-luxury-gold/10 text-luxury-gold'
                          : 'border-transparent text-stone-500'
                      }`
                    }
                  >
                    <item.icon size={14} />
                    {item.label}
                  </NavLink>
                ))}
              </nav>

              <div className="mt-8 pt-6 border-t border-white/5">
                <LogoutButton
                  redirectTo="/login"
                  className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-rose-500 px-5"
                >
                  <LogOut size={14} />
                  Sign Out
                </LogoutButton>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="min-h-screen px-2 py-6 lg:px-6 lg:py-10">
        <div className="w-full min-h-full rounded-[32px] border border-white/5 bg-luxury-charcoal/30 p-4 sm:p-8 lg:p-10 shadow-luxury-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
