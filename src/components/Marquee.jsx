import { motion } from 'framer-motion';

const keywords = [
  'ARTISANAL FRAGRANCES',
  'BESPOKE LEATHER',
  'TIMELESS ELEGANCE',
  'CURATED LUXURY',
  'HANDCRAFTED HERITAGE',
  'EXQUISITE CRAFTSMANSHIP',
];

export default function Marquee() {
  return (
    <div className="relative z-50 overflow-hidden bg-neutral-900 py-7 border-y border-white/5 shadow-2xl">
      <motion.div
        animate={{ x: [0, -1200] }}
        transition={{
          duration: 40,
          repeat: Infinity,
          ease: "linear",
        }}
        className="flex whitespace-nowrap"
      >
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center">
            {keywords.map((word, j) => (
              <div key={j} className="flex items-center">
                <span className="text-[11px] font-extrabold uppercase tracking-[0.45em] text-luxury-gold mx-12">
                  {word}
                </span>
                <span className="h-1.5 w-1.5 rounded-full bg-luxury-gold" />
              </div>
            ))}
          </div>
        ))}
      </motion.div>
      
      {/* Cinematic gradient masks for the edges */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-neutral-900 via-neutral-900/80 to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-neutral-900 via-neutral-900/80 to-transparent z-10" />
    </div>
  );
}
