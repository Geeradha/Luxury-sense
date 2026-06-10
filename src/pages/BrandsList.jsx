import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import apiClient from '../api/axios';
import { motion } from 'framer-motion';

export default function BrandsList() {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');

  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  useEffect(() => {
    apiClient.get('/brands')
      .then(res => setBrands(res.data))
      .finally(() => setLoading(false));
  }, []);

  const groupedBrands = useMemo(() => {
    const groups = {};
    brands.forEach(brand => {
      const firstLetter = brand.name.charAt(0).toUpperCase();
      if (!groups[firstLetter]) groups[firstLetter] = [];
      groups[firstLetter].push(brand);
    });
    return groups;
  }, [brands]);

  const filteredLetters = useMemo(() => {
    if (filter === 'All') return Object.keys(groupedBrands).sort();
    return alphabet.includes(filter) ? [filter] : [];
  }, [filter, groupedBrands]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-luxury-black text-luxury-gold">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-current border-t-transparent" />
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-luxury-black px-6 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-20 text-center">
          
          <h1 className="mt-8 font-serif text-6xl tracking-[-0.02em] text-white sm:text-8xl">Our Brands</h1>
          <div className="mx-auto mt-12 h-px w-24 bg-luxury-gold/30" />
        </header>

        {/* Alphabet Filter */}
        <nav className="mb-16 flex flex-wrap justify-center gap-x-6 gap-y-4 border-b border-white/5 pb-10 sm:gap-x-8">
          <button
            onClick={() => setFilter('All')}
            className={`px-2 py-1 text-base uppercase tracking-widest transition-all duration-300 ${
              filter === 'All' 
                ? 'text-white font-bold scale-110 border-b-2 border-luxury-gold' 
                : 'text-white/60 hover:text-white'
            }`}
          >
            Show All
          </button>
          {alphabet.map(letter => (
            <button
              key={letter}
              onClick={() => setFilter(letter)}
              disabled={!groupedBrands[letter]}
              className={`px-1 py-1 text-lg font-medium uppercase tracking-widest transition-all duration-300 disabled:opacity-10 ${
                filter === letter 
                  ? 'text-white font-bold scale-125 border-b-2 border-luxury-gold' 
                  : 'text-white/60 hover:text-white'
              }`}
            >
              {letter}
            </button>
          ))}
        </nav>

        {/* Brands Grid */}
        <div className="space-y-32">
          {filteredLetters.map(letter => (
            groupedBrands[letter] && (
              <section key={letter} className="grid grid-cols-1 gap-12 lg:grid-cols-[140px_1fr]">
                <div className="flex items-center justify-center lg:justify-start">
                  <span className="font-serif text-8xl text-white/30 select-none">{letter}</span>
                </div>
                <div className="grid grid-cols-1 gap-x-12 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
                  {groupedBrands[letter].map(brand => (
                    <motion.div
                      key={brand.id}
                      whileHover={{ x: 10 }}
                      transition={{ duration: 0.5 }}
                    >
                      <Link
                        to={`/brands/${brand.slug}`}
                        className="group block"
                      >
                        <h3 className="font-serif text-3xl text-stone-200 transition-colors duration-500 group-hover:text-luxury-gold sm:text-4xl">
                          {brand.name}
                        </h3>
                        <p className="mt-3 line-clamp-2 text-sm leading-7 text-stone-500">
                          {brand.description}
                        </p>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </section>
            )
          ))}
        </div>

        {!filteredLetters.some(l => groupedBrands[l]) && (
          <div className="py-20 text-center">
            <p className="text-lg text-stone-500 font-serif">No brands found for your selection.</p>
            <button onClick={() => setFilter('All')} className="mt-6 text-[10px] font-bold uppercase tracking-widest text-luxury-gold">Reset Filter</button>
          </div>
        )}
      </div>
    </main>
  );
}
