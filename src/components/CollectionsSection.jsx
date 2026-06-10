import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/axios';
import { getCategoryFallbackImage } from '../utils/categoryImages';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';

function extractItems(response) {
  if (Array.isArray(response?.data?.data)) {
    return response.data.data;
  }
  if (Array.isArray(response?.data)) {
    return response.data;
  }
  return [];
}

const apiOrigin = (import.meta.env.VITE_API_URL || 'http://localhost:8000/api').replace(/\/api$/, '');

function buildCategoryImageUrl(imagePath) {
  if (!imagePath) return '';
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://') || imagePath.startsWith('blob:')) return imagePath;
  return `${apiOrigin}/storage/${imagePath}`;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 1,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function CollectionsSection({ 
  heading = 'Collections', 
  description = 'Discover our signature collections, from artisanal fragrances to handcrafted leather goods.' 
}) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isActive = true;
    const loadCategories = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await apiClient.get('/categories');
        if (isActive) {
          setCategories(extractItems(response));
        }
      } catch {
        if (isActive) {
          setError('Unable to load categories right now.');
          setCategories([]);
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };
    loadCategories();
    return () => { isActive = false; };
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-luxury-gold border-t-transparent" />
      </div>
    );
  }

  return (
    <section className="py-20 sm:py-24">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, ease: "easeOut" }}
        className="mb-16 text-center"
      >
        
        <h2 className="mt-6 font-serif text-5xl tracking-tight text-white sm:text-6xl">{heading}</h2>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-stone-500 sm:text-base sm:leading-9">{description}</p>
      </motion.div>

      {error ? (
        <p className="text-center text-rose-400">{error}</p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="w-full px-4"
        >
          <Swiper
            modules={[Autoplay]}
            loop={true}
            autoplay={{ 
              delay: 3000, 
              disableOnInteraction: false, 
              pauseOnMouseEnter: true 
            }}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="collections-swiper"
          >
            {categories.map((category) => {
              const imageSrc = buildCategoryImageUrl(category.image) || getCategoryFallbackImage(category.name);

              return (
                <SwiperSlide key={category.id}>
                  <motion.article
                    variants={itemVariants}
                    whileHover={{ y: -10 }}
                    className="group relative overflow-hidden rounded-[40px] border border-white/5 bg-luxury-charcoal shadow-luxury-md transition-all duration-700 hover:border-luxury-gold/30 hover:shadow-gold-glow"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-luxury-black">
                      <motion.img
                        src={imageSrc}
                        alt={category.name}
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-luxury-black via-luxury-black/30 to-transparent opacity-70 transition-opacity duration-700 group-hover:opacity-90" />
                      <div className="absolute bottom-0 left-0 right-0 p-10">
                        <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-luxury-gold/90">Collection</p>
                        <h3 className="mt-3 font-serif text-4xl leading-none tracking-tight text-white">{category.name}</h3>
                        
                        <div className="mt-8 flex items-center justify-between gap-6 overflow-hidden">
                          <p className="max-w-[12rem] text-sm leading-6 text-stone-400 opacity-0 transition-all duration-700 translate-y-4 group-hover:translate-y-0 group-hover:opacity-100">
                            {category.description || 'Explore the curated products in this collection.'}
                          </p>
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => navigate(`/products?category_id=${category.id}`)}
                            className="shrink-0 rounded-full border border-luxury-gold bg-luxury-gold px-8 py-3 text-[10px] font-bold uppercase tracking-[0.2em] text-luxury-dark transition-colors duration-500 hover:bg-transparent hover:text-luxury-gold"
                          >
                            View
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </motion.article>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </motion.div>
      )}
    </section>
  );
}
