import HeroSection from '../components/HeroSection';
import CollectionsSection from '../components/CollectionsSection';
import BestSellers from '../components/BestSellers';
import ShopBanner from '../components/ShopBanner';
import Marquee from '../components/Marquee';

export default function LandingPage() {
  return (
    <main className="bg-luxury-black overflow-hidden">
      <HeroSection />

      <div className="relative z-40">
        <Marquee />
      </div>

      <div className="relative z-30 -mt-4 sm:-mt-6">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10 bg-luxury-black rounded-t-[60px] shadow-[0_-30px_60px_rgba(0,0,0,0.8)] border-t border-white/5">
          <CollectionsSection />
          <BestSellers />
          <ShopBanner />
        </div>
      </div>
    </main>
  );
}