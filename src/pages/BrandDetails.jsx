import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import ProductCard from '../components/ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

export default function BrandDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [brand, setBrand] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeGender, setActiveGender] = useState('all');

  useEffect(() => {
    setLoading(true);
    apiClient.get(`/brands/${slug}`)
      .then(res => setBrand(res.data))
      .catch(() => navigate('/brands'))
      .finally(() => setLoading(false));
  }, [slug, navigate]);

  const filteredProducts = useMemo(() => {
    if (!brand?.products) return [];
    if (activeGender === 'all') return brand.products;
    return brand.products.filter(p => p.gender_category === activeGender);
  }, [brand, activeGender]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-luxury-black text-luxury-gold">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-current border-t-transparent" />
      </div>
    );
  }

  const genderCards = [
    { id: 'women', label: 'For Her', description: 'Curated elegance' },
    { id: 'men', label: 'For Him', description: 'Defined character' },
    { id: 'unisex', label: 'Unisex', description: 'Shared heritage' }
  ];

  return (
    <main className="min-h-screen bg-luxury-black">
      {/* Hero Section */}
      <section className="relative h-[70vh] w-full overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 z-0">
          <div 
            className="h-full w-full bg-cover bg-center bg-no-repeat opacity-40 grayscale"
            style={{ backgroundImage: `url(${brand.image_url || '/hero_bg.png'})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-luxury-black/60 to-luxury-black" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 text-center px-6"
        >
          <p className="text-[10px] font-bold uppercase tracking-[0.5em] text-luxury-gold/90 mb-6">Maison</p>
          <h1 className="font-serif text-7xl tracking-tight text-white sm:text-9xl">{brand.name}</h1>
          <p className="mx-auto mt-8 max-w-2xl text-sm leading-8 text-stone-400 sm:text-lg sm:leading-9">{brand.description}</p>
        </motion.div>
      </section>

      {/* Shop by Gender */}
      <section className="mx-auto max-w-7xl px-6 py-24 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          {genderCards.map((card) => (
            <motion.button
              key={card.id}
              onClick={() => setActiveGender(card.id === activeGender ? 'all' : card.id)}
              whileHover={{ y: -10 }}
              className={`group relative overflow-hidden rounded-[32px] border transition-all duration-700 p-10 text-left ${
                activeGender === card.id 
                  ? 'border-luxury-gold bg-luxury-gold/5 shadow-gold-glow' 
                  : 'border-white/5 bg-luxury-charcoal hover:border-white/20'
              }`}
            >
              <p className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-colors duration-500 ${activeGender === card.id ? 'text-luxury-gold' : 'text-stone-500'}`}>
                {card.description}
              </p>
              <h3 className="mt-4 font-serif text-4xl text-white">{card.label}</h3>
              <div className={`mt-8 h-px w-12 transition-all duration-700 ${activeGender === card.id ? 'bg-luxury-gold w-full opacity-100' : 'bg-white/20 opacity-40'}`} />
            </motion.button>
          ))}
        </div>
      </section>

      {/* Products Grid */}
      <section className="mx-auto max-w-7xl px-6 pb-32 sm:px-8 lg:px-10">
        <div className="flex items-end justify-between mb-12 border-b border-white/5 pb-8">
          <div>
            <h2 className="font-serif text-4xl text-white">Collection</h2>
            <p className="mt-2 text-[10px] font-bold uppercase tracking-widest text-stone-500">
              {filteredProducts.length} Pieces Available
            </p>
          </div>
          {activeGender !== 'all' && (
            <button 
              onClick={() => setActiveGender('all')}
              className="text-[10px] font-bold uppercase tracking-widest text-luxury-gold hover:text-white transition-colors"
            >
              Clear Filter
            </button>
          )}
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
        >
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.5 }}
              >
                <ProductCard product={product} editorial />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProducts.length === 0 && (
          <div className="py-24 text-center">
            <p className="text-xl text-stone-500 font-serif italic">No products found in this category.</p>
          </div>
        )}
      </section>
    </main>
  );
}
