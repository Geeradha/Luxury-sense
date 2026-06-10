import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function HeroSection() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-screen items-center justify-center overflow-hidden bg-luxury-black px-6 sm:px-8"
    >
      {/* Parallax Background */}
      <motion.div 
        style={{ y }}
        className="absolute inset-0 z-0"
      >
        <div 
          className="h-full w-full bg-cover bg-center bg-no-repeat transition-transform duration-1000"
          style={{ backgroundImage: 'url("/hero_bg.png")' }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-luxury-black/60 via-luxury-black/20 to-luxury-black" />
      </motion.div>

      {/* Content Reveal */}
      <motion.div 
        style={{ opacity }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 w-full max-w-5xl text-center"
      >
        <motion.p 
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          animate={{ opacity: 0.9, letterSpacing: "0.45em" }}
          transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
          className="mb-8 text-[11px] font-bold uppercase text-luxury-gold sm:text-xs"
        >
          Exclusive Collection
        </motion.p>

        <motion.h1 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-6xl leading-[0.9] tracking-[-0.04em] text-white sm:text-8xl lg:text-9xl"
        >
          Timeless <br className="hidden sm:block" /> Elegance
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.6, ease: "easeOut" }}
          className="mx-auto mt-10 max-w-xl text-sm leading-8 text-white/70 sm:text-lg sm:leading-9"
        >
          Step into a world of curated artisanal fragrances, handcrafted footwear, and statement leather goods.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
          className="mt-14 flex flex-col items-center justify-center gap-8 sm:flex-row"
        >
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <Link
              to="/products"
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-full border border-luxury-gold bg-luxury-gold px-12 py-5 text-[11px] font-bold uppercase tracking-[0.25em] text-luxury-dark transition-colors duration-500 hover:bg-transparent hover:text-luxury-gold shadow-gold-glow"
            >
              <span className="relative z-10">Explore Collection</span>
            </Link>
          </motion.div>

          <Link
            to="/heritage"
            className="group text-[11px] font-bold uppercase tracking-[0.25em] text-white/80 transition-all duration-500 hover:text-white"
          >
            <span className="relative">
              Our Heritage
              <span className="absolute -bottom-2 left-0 h-px w-0 bg-luxury-gold transition-all duration-500 group-hover:w-full" />
            </span>
          </Link>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="h-12 w-px bg-gradient-to-b from-luxury-gold/50 to-transparent"
        />
      </motion.div>
    </section>
  );
}