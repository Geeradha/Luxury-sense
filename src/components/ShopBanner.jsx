import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.3,
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

export default function ShopBanner() {
  return (
    <section className="relative overflow-hidden py-20 sm:py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-16 lg:grid-cols-2 lg:gap-24">
        
        {/* Left: Dynamic Exhibition Image */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="group relative overflow-hidden rounded-[48px] border border-white/5 bg-luxury-black shadow-luxury-lg transition-all duration-1000 hover:border-luxury-gold/30 hover:shadow-gold-glow"
        >
          <motion.div
            animate={{ scale: [1, 1.05] }}
            transition={{ 
              duration: 15, 
              repeat: Infinity, 
              repeatType: "reverse", 
              ease: "linear" 
            }}
            className="h-full w-full"
          >
            <img
              src="/shop.png"
              alt="Luxury Sense boutique"
              className="aspect-[4/3] w-full object-cover grayscale-[0.2] transition-all duration-1000 group-hover:grayscale-0 group-hover:scale-110"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-tr from-luxury-black/60 via-transparent to-transparent" />
        </motion.div>

        {/* Right: Staggered Content Reveal */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center lg:text-left"
        >
          <motion.p 
            variants={itemVariants}
            className="text-[10px] font-bold uppercase tracking-[0.5em] text-luxury-gold/90"
          >
            The Boutique
          </motion.p>
          
          <motion.h2 
            variants={itemVariants}
            className="mt-8 font-serif text-6xl tracking-tight text-white sm:text-7xl lg:text-8xl"
          >
            Step Inside <br className="hidden sm:block" /> Our World
          </motion.h2>
          
          <motion.p 
            variants={itemVariants}
            className="mt-10 max-w-lg text-sm leading-8 text-stone-400 sm:text-lg sm:leading-9 mx-auto lg:mx-0"
          >
            From artisanal perfumes to handcrafted leather, every piece in our boutique is chosen for its character, quality, and quiet luxury.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-12">
            <Link
              to="/products"
              className="group relative inline-flex items-center justify-center gap-3 overflow-hidden rounded-full border border-luxury-gold bg-transparent px-10 py-5 text-[11px] font-bold uppercase tracking-[0.25em] text-luxury-gold transition-all duration-700 hover:bg-luxury-gold hover:text-luxury-dark"
            >
              <span className="relative z-10 transition-transform duration-500 group-hover:-translate-x-2">
                Shop the Collection
              </span>
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                whileHover={{ opacity: 1, x: 0 }}
                className="absolute right-8 opacity-0 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-3"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </motion.span>
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
