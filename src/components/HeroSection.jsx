import { Link } from 'react-router-dom';

export default function HeroSection() {
  return (
    <section
      style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'grid',
        placeItems: 'center',
        overflow: 'hidden',
        backgroundImage:
          "linear-gradient(rgba(10, 10, 10, 0.46), rgba(10, 10, 10, 0.52)), url('https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=1600&q=80')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          width: 'min(92vw, 900px)',
          textAlign: 'center',
          padding: 'clamp(2rem, 6vw, 4rem)',
          color: '#ffffff',
        }}
      >
        <p
          style={{
            margin: 0,
            marginBottom: '1rem',
            fontFamily: 'Inter, Lato, sans-serif',
            fontSize: '0.8rem',
            fontWeight: 500,
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.72)',
          }}
        >
          Luxury Sense
        </p>

        <h1
          style={{
            margin: 0,
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: 'clamp(3.5rem, 10vw, 7.5rem)',
            lineHeight: 0.95,
            fontWeight: 500,
            letterSpacing: '-0.03em',
            textWrap: 'balance',
          }}
        >
          Redefining Elegance
        </h1>

        <p
          style={{
            width: 'min(100%, 46rem)',
            margin: '1.5rem auto 0',
            fontFamily: 'Inter, Lato, sans-serif',
            fontSize: 'clamp(1rem, 1.5vw, 1.2rem)',
            lineHeight: 1.8,
            color: 'rgba(255, 255, 255, 0.84)',
          }}
        >
          Discover our curated collection of artisanal fragrances, handcrafted footwear, and statement leather goods.
        </p>

        <div style={{ marginTop: '2.25rem' }}>
          <Link
            to="/shop"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              minWidth: '14rem',
              padding: '1rem 1.75rem',
              backgroundColor: '#111111',
              color: '#ffffff',
              textDecoration: 'none',
              fontFamily: 'Inter, Lato, sans-serif',
              fontSize: '0.9rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              transition: 'transform 320ms ease, background-color 320ms ease, color 320ms ease, border-color 320ms ease',
            }}
            onMouseEnter={(event) => {
              event.currentTarget.style.backgroundColor = '#ffffff';
              event.currentTarget.style.color = '#111111';
              event.currentTarget.style.borderColor = '#ffffff';
              event.currentTarget.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(event) => {
              event.currentTarget.style.backgroundColor = '#111111';
              event.currentTarget.style.color = '#ffffff';
              event.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.14)';
              event.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            Explore the Collection
          </Link>
        </div>
      </div>
    </section>
  );
}