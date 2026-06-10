import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer';
import LuxuryNavbar from '../components/LuxuryNavbar';
import WhatsAppButton from '../components/WhatsAppButton';

export default function PublicLayout() {
  return (
    <div className="public-layout flex min-h-screen flex-col bg-luxury-black text-stone-100">
      <LuxuryNavbar />
      <div className="flex-1 pt-28 sm:pt-36">
        <Outlet />
      </div>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}