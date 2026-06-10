import { useNavigate } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import ProductCard from '../components/ProductCard';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

export default function WishlistView() {
  const { wishlistItems, isLoading } = useWishlist();
  const navigate = useNavigate();

  return (
    <main className="min-h-screen bg-luxury-black pt-32 pb-16 px-6 sm:px-8 lg:px-10">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center md:text-left">
          <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold/90 mb-4">
            Private Selection
          </p>
          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl tracking-tight text-white">
            Your Curated Collection
          </h1>
        </div>

        {isLoading ? (
          <div className="py-32 flex justify-center">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-luxury-gold border-t-transparent" />
          </div>
        ) : wishlistItems.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {wishlistItems.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="py-32 flex flex-col items-center justify-center text-center border border-white/5 bg-luxury-charcoal/30 rounded-[40px]">
            <Heart size={48} className="text-stone-700 mb-6" strokeWidth={1} />
            <h2 className="font-serif text-3xl text-white mb-4">Your collection awaits.</h2>
            <p className="text-stone-400 max-w-md mb-8 leading-relaxed">
              Discover our signature pieces and curate your own personal selection of luxury goods.
            </p>
            <button
              onClick={() => navigate('/shop')}
              className="rounded-full border border-luxury-gold bg-luxury-gold px-10 py-4 text-[11px] font-bold uppercase tracking-[0.25em] text-luxury-dark transition-all duration-500 hover:bg-transparent hover:text-luxury-gold shadow-gold-glow"
            >
              Explore Boutique
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
