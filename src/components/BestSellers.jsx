import { useState, useEffect, useMemo } from 'react';
import apiClient from '../api/axios';
import ProductCard from './ProductCard';
import { motion, AnimatePresence } from 'framer-motion';

function extractItems(response) {
  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }
  if (Array.isArray(response?.data)) {
    return response.data;
  }
  return [];
}

export default function BestSellers() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [productsRes, categoriesRes] = await Promise.all([
          apiClient.get('/products'),
          apiClient.get('/categories')
        ]);
        setProducts(extractItems(productsRes));
        setCategories(extractItems(categoriesRes));
      } catch (error) {
        console.error('Error fetching best sellers data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return products.slice(0, 8);
    return products
      .filter(p => p.category?.name === activeCategory)
      .slice(0, 8);
  }, [products, activeCategory]);

  const categoryTabs = ['All', ...categories.map(c => c.name)];

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-luxury-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <section className="py-24 border-t border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mb-16 text-center"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold/90 mb-4">Maison Selection</p>
        <h2 className="font-serif text-5xl tracking-tight text-white sm:text-6xl">Best Sellers</h2>
      </motion.div>

      {/* Filter Tabs */}
      <div className="mb-16 flex flex-wrap items-center justify-center gap-8 sm:gap-12">
        {categoryTabs.map((category) => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`relative pb-2 text-[11px] font-bold uppercase tracking-[0.3em] transition-all duration-300 ${
              activeCategory === category
                ? 'text-luxury-gold'
                : 'text-white/50 hover:text-white'
            }`}
          >
            {category}
            {activeCategory === category && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-luxury-gold shadow-gold-glow"
              />
            )}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="mx-auto max-w-7xl">
        <AnimatePresence mode="wait">
          {filteredProducts.length > 0 ? (
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4"
            >
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} editorial />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center"
            >
              <p className="font-serif text-xl italic text-stone-500">
                New arrivals for this collection are being curated.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
