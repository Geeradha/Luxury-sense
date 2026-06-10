import { Link } from 'react-router-dom';
import { FiInstagram, FiFacebook, FiTwitter, FiYoutube } from 'react-icons/fi';

const footerLinks = [
  { label: 'Boutique', to: '/products' },
  { label: 'Heritage', to: '/heritage' },
  { label: 'My Orders', to: '/my-orders' },
];

const supportLinks = [
  { label: 'Profile', to: '/profile' },
  { label: 'Cart', to: '/cart' },
  { label: 'Sign In', to: '/login' },
  { label: 'Create Account', to: '/signup' },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-white/5 bg-luxury-black">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-1">
            <Link to="/" className="inline-flex items-center gap-3 transition-transform hover:scale-105">
              <img
                src="/logo.png"
                alt="Luxury Sense"
                className="h-12 w-auto object-contain"
              />
            </Link>
            <p className="mt-6 max-w-xs text-sm leading-8 text-stone-500">
              Curated fragrances, footwear, and leather goods — crafted for those who appreciate the finer things in life.
            </p>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold">
              Explore
            </h3>
            <ul className="mt-6 space-y-4">
              {footerLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-stone-400 transition-colors duration-300 hover:text-luxury-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold">
              Account
            </h3>
            <ul className="mt-6 space-y-4">
              {supportLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-stone-400 transition-colors duration-300 hover:text-luxury-gold"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold">
              Contact Us
            </h3>
            <p className="mt-6 text-sm leading-8 text-stone-400">
              Open Daily, 11am – 9pm
              <br />
              DHA Phase 6, Karachi
            </p>
            <a
              href="mailto:luxurysense.ls@gmail.com"
              className="mt-4 inline-block text-sm text-stone-400 transition-colors duration-300 hover:text-luxury-gold"
            >
              luxurysense.ls@gmail.com
            </a>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-white/5 pt-10 sm:flex-row">
          <p className="text-[11px] uppercase tracking-[0.2em] text-stone-600">
            &copy; {currentYear} Luxury Sense Boutique. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-stone-500 transition-all duration-500 hover:scale-110 hover:text-luxury-gold" aria-label="Instagram">
              <FiInstagram size={18} />
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-stone-500 transition-all duration-500 hover:scale-110 hover:text-luxury-gold" aria-label="Facebook">
              <FiFacebook size={18} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-stone-500 transition-all duration-500 hover:scale-110 hover:text-luxury-gold" aria-label="Twitter">
              <FiTwitter size={18} />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-stone-500 transition-all duration-500 hover:scale-110 hover:text-luxury-gold" aria-label="YouTube">
              <FiYoutube size={18} />
            </a>
            <span className="ml-4 pl-4 border-l border-white/10 text-[10px] uppercase tracking-[0.3em] text-stone-700 hidden lg:block">
              Handcrafted in Pakistan
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
