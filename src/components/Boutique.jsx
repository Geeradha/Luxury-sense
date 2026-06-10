import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import apiClient from '../api/axios';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

function extractItems(response) {
  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }
  if (Array.isArray(response?.data)) {
    return response.data;
  }
  return [];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function Boutique() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const searchQuery = searchParams.get('search')?.trim() || '';
  const categoryIdParam = searchParams.get('category_id')?.trim() || '';
  const activeGender = searchParams.get('gender') || 'all';

  const activeCategoryId = useMemo(() => {
    if (!categoryIdParam) return '';
    return categories.some((category) => String(category.id) === categoryIdParam) ? categoryIdParam : '';
  }, [categories, categoryIdParam]);

  useEffect(() => {
    let isActive = true;
    const loadData = async () => {
      setIsLoading(true);
      setError('');
      try {
        const [productsResponse, categoriesResponse] = await Promise.all([
          apiClient.get('/products', {
            params: searchQuery ? { search: searchQuery } : {},
          }),
          apiClient.get('/categories'),
        ]);
        if (isActive) {
          setProducts(extractItems(productsResponse));
          setCategories(extractItems(categoriesResponse));
        }
      } catch {
        if (isActive) {
          setError('Unable to load products right now.');
          setProducts([]);
          setCategories([]);
        }
      } finally {
        if (isActive) setIsLoading(false);
      }
    };
    loadData();
    return () => { isActive = false; };
  }, [searchQuery]);

  const visibleProducts = useMemo(() => {
    return products.filter((product) => {
      const matchCategory = !activeCategoryId || String(product.category_id ?? product.category?.id ?? '') === activeCategoryId;
      const matchGender = activeGender === 'all' || product.gender_category === activeGender;
      return matchCategory && matchGender;
    });
  }, [activeCategoryId, activeGender, products]);

  const handleCategoryTab = (categoryId) => {
    const nextParams = new URLSearchParams(searchParams);
    if (categoryId) nextParams.set('category_id', categoryId);
    else nextParams.delete('category_id');
    setSearchParams(nextParams, { replace: true });
  };

  const handleGenderTab = (gender) => {
    const nextParams = new URLSearchParams(searchParams);
    if (gender !== 'all') nextParams.set('gender', gender);
    else nextParams.delete('gender');
    setSearchParams(nextParams, { replace: true });
  };

  const handleClearSearch = () => {
    navigate('/products', { replace: true });
  };

  return (
    <main className="min-h-screen bg-luxury-black px-6 py-16 sm:px-8 lg:px-10">
      <div className="mx-auto w-full max-w-7xl">
        <motion.header 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="mb-16 text-center"
        >
          
          <h1 className="mt-6 font-serif text-5xl tracking-tight text-white sm:text-6xl lg:text-7xl">The Boutique</h1>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-stone-500 sm:text-base sm:leading-9">
            Browse our full catalog of artisanal goods or narrow your search by category to find the perfect piece for your collection.
          </p>
        </motion.header>

        {searchQuery ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mx-auto mb-10 flex w-fit items-center gap-6 rounded-full border border-white/5 bg-white/5 px-6 py-4 backdrop-blur-xl"
          >
            <span className="text-sm text-stone-400">
              Showing results for: <strong className="font-semibold text-white tracking-tight">{searchQuery}</strong>
            </span>
            <button
              type="button"
              onClick={handleClearSearch}
              className="rounded-full border border-luxury-gold/30 bg-transparent px-5 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-gold transition-all duration-500 hover:border-luxury-gold hover:bg-luxury-gold hover:text-luxury-dark"
            >
              Clear
            </button>
          </motion.div>
        ) : null}

        <motion.nav 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2 }}
          aria-label="Product categories" 
          className="mb-12 flex flex-wrap items-center justify-center gap-4"
        >
          <button
            type="button"
            onClick={() => handleCategoryTab('')}
            className={`rounded-full border px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-500 ${
              !activeCategoryId
                ? 'border-luxury-gold bg-luxury-gold text-luxury-dark shadow-gold-glow'
                : 'border-white/10 bg-transparent text-stone-500 hover:border-luxury-gold/50 hover:text-luxury-gold'
            }`}
          >
            All
          </button>

          {categories.map((category) => {
            const isActive = String(category.id) === activeCategoryId;

            return (
              <button
                key={category.id}
                type="button"
                onClick={() => handleCategoryTab(String(category.id))}
                className={`rounded-full border px-6 py-2.5 text-[10px] font-bold uppercase tracking-[0.25em] transition-all duration-500 ${
                  isActive
                    ? 'border-luxury-gold bg-luxury-gold text-luxury-dark shadow-gold-glow'
                    : 'border-white/10 bg-transparent text-stone-500 hover:border-luxury-gold/50 hover:text-luxury-gold'
                }`}
              >
                {category.name}
              </button>
            );
          })}
        </motion.nav>

        {/* SECONDARY FILTERS: Gender (Framer Motion Version) */}
        <motion.nav 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.4 }}
          aria-label="Gender categories" 
          className="mb-16 flex items-center justify-center gap-8 sm:gap-12 border-t border-white/5 pt-8"
        >
          {['all', 'men', 'women', 'unisex'].map((g) => {
            const isActive = activeGender === g;
            return (
              <button
                key={g}
                onClick={() => handleGenderTab(g)}
                className={`relative pb-2 text-[11px] font-bold uppercase tracking-[0.3em] transition-colors duration-300 ${
                  isActive ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                {g === 'all' ? 'All Genders' : g}
                {isActive && (
                  <motion.div 
                    layoutId="active-gender-tab" 
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-white shadow-gold-glow" 
                  />
                )}
              </button>
            );
          })}
        </motion.nav>

        {error ? (
          <p className="mb-6 text-center text-sm text-rose-400 font-bold uppercase tracking-widest">{error}</p>
        ) : null}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-luxury-gold border-t-transparent"></div>
          </div>
        ) : (
          <motion.section 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-50px" }}
            className="grid w-full grid-cols-1 gap-10 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4"
          >
            {visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                editorial
              />
            ))}
          </motion.section>
        )}
      </div>
    </main>
  );
}
