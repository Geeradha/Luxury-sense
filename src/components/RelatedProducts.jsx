import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';

export default function RelatedProducts({ products = [] }) {
  if (products.length === 0) return null;

  return (
    <section className="py-24 border-t border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="mb-16 text-center"
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-luxury-gold/90 mb-4">Curated Selection</p>
        <h2 className="font-serif text-5xl tracking-tight text-white sm:text-6xl">People Also Bought</h2>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="px-4 sm:px-8 lg:px-10"
      >
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{ 
            delay: 5000, 
            disableOnInteraction: false, 
            pauseOnMouseEnter: true 
          }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: {
              slidesPerView: 2,
            },
            1024: {
              slidesPerView: 3,
            },
            1280: {
              slidesPerView: 4,
            },
          }}
          className="related-products-swiper !pb-12"
        >
          {products.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} editorial />
            </SwiperSlide>
          ))}
        </Swiper>
      </motion.div>

      <style dangerouslySetInnerHTML={{ __html: `
        .related-products-swiper .swiper-button-next,
        .related-products-swiper .swiper-button-prev {
          color: #D4AF9E;
          background: rgba(18, 18, 18, 0.8);
          width: 50px;
          height: 50px;
          border-radius: 50%;
          border: 1px solid rgba(212, 175, 158, 0.3);
          backdrop-filter: blur(8px);
          transition: all 0.3s ease;
        }
        .related-products-swiper .swiper-button-next:after,
        .related-products-swiper .swiper-button-prev:after {
          font-size: 18px;
          font-weight: bold;
        }
        .related-products-swiper .swiper-button-next:hover,
        .related-products-swiper .swiper-button-prev:hover {
          background: #D4AF9E;
          color: #121212;
          border-color: #D4AF9E;
          box-shadow: 0 0 20px rgba(212, 175, 158, 0.4);
        }
        .related-products-swiper .swiper-button-disabled {
          opacity: 0;
          pointer-events: none;
        }
      `}} />
    </section>
  );
}
