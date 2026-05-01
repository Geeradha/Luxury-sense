import { useMemo, useState } from 'react';
import ProductCard from './ProductCard';
import luxuryProducts from '../data/luxuryProducts.json';

const filterMap = {
  All: null,
  Fragrances: 'Perfumes',
  Footwear: 'Shoes',
  'Leather Goods': 'Bags',
};

export default function Boutique() {
  const [activeFilter, setActiveFilter] = useState('All');

  const visibleProducts = useMemo(() => {
    const category = filterMap[activeFilter];

    return category
      ? luxuryProducts.filter((product) => product.category === category)
      : luxuryProducts;
  }, [activeFilter]);

  return (
    <main style={{ background: '#FAFAFA', minHeight: '100vh', padding: '2rem 0 3.5rem' }}>
      <div style={{ maxWidth: '1600px', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: '1.6rem' }}>
          <p
            style={{
              margin: 0,
              fontFamily: 'Inter, Lato, sans-serif',
              fontSize: '0.74rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              color: '#8d8d8d',
            }}
          >
            Luxury Sense
          </p>
          <h1
            style={{
              margin: '0.75rem 0 0',
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: 'clamp(2.6rem, 5vw, 4.4rem)',
              lineHeight: 1.05,
              fontWeight: 600,
              color: '#111111',
            }}
          >
            The Boutique
          </h1>
        </header>

        <nav
          aria-label="Boutique filters"
          style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '0.95rem 1.35rem',
            flexWrap: 'wrap',
            marginBottom: '2rem',
          }}
        >
          {Object.keys(filterMap).map((label) => {
            const isActive = activeFilter === label;

            return (
              <button
                key={label}
                type="button"
                onClick={() => setActiveFilter(label)}
                style={{
                  border: 'none',
                  background: 'transparent',
                  padding: 0,
                  fontFamily: 'Inter, Lato, sans-serif',
                  fontSize: '0.86rem',
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: isActive ? '#111111' : '#8f8f8f',
                  cursor: 'pointer',
                  position: 'relative',
                  transition: 'color 240ms ease',
                }}
              >
                <span
                  style={{
                    position: 'relative',
                    display: 'inline-block',
                  }}
                >
                  {label}
                  <span
                    style={{
                      position: 'absolute',
                      left: 0,
                      bottom: '-0.35rem',
                      width: '100%',
                      height: '1px',
                      background: '#111111',
                      opacity: isActive ? 1 : 0,
                      transform: isActive ? 'scaleX(1)' : 'scaleX(0.65)',
                      transformOrigin: 'center',
                      transition: 'opacity 240ms ease, transform 240ms ease',
                    }}
                  />
                </span>
              </button>
            );
          })}
        </nav>

        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 w-full px-4">
          {visibleProducts.map((product) => (
            <ProductCard
              key={product.name}
              product={product}
              editorial
            />
          ))}
        </section>
      </div>
    </main>
  );
}