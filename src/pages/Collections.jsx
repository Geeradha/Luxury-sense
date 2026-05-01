const collections = [
  {
    title: 'The Midnight Oud Series',
    description:
      'A deep, atmospheric study in smoked woods, velvet resin, and the quiet tension of midnight dressing. Inspired by private salons, lacquered interiors, and the lingering warmth of hand-poured extrait, it feels both intimate and cinematic.',
    image:
      'https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1600&q=80',
    reverse: false,
    href: '/shop',
  },
  {
    title: 'Artisan Leather Fall/Winter',
    description:
      'Supple hides, burnished edges, and tactile grain come together in a collection shaped by heritage ateliers and cold-weather sophistication. It is a wardrobe of enduring structure, soft patina, and the kind of craftsmanship that deepens over time.',
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1600&q=80',
    reverse: true,
    href: '/shop',
  },
  {
    title: 'The Minimalist Sneaker Edit',
    description:
      'Clean silhouettes, refined materials, and considered proportions define a quieter kind of luxury. Designed for movement and ease, this edit pairs crisp minimalism with a polished finish that feels modern, effortless, and distinctly elevated.',
    image:
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
    reverse: false,
    href: '/shop',
  },
];

function CollectionSection({ title, description, image, reverse, href }) {
  const media = (
    <div
      className="collections-media"
      style={{
        minHeight: 'clamp(16rem, 56vw, 52vh)',
        overflow: 'hidden',
        position: 'relative',
        background: '#ece7e0',
      }}
    >
      <img
        src={image}
        alt={title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          objectPosition: 'center',
          display: 'block',
        }}
      />
    </div>
  );

  const copy = (
    <div
      className="collections-copy"
      style={{
        display: 'grid',
        alignContent: 'center',
        minHeight: 'clamp(15rem, 42vw, 52vh)',
        padding: 'clamp(1.4rem, 4vw, 5rem)',
      }}
    >
      <div style={{ maxWidth: '34rem' }}>
        <p
          style={{
            margin: 0,
            fontFamily: 'Inter, Lato, sans-serif',
            fontSize: '0.72rem',
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            color: '#8c8c8c',
          }}
        >
          Editorial Collection
        </p>
        <h2
          style={{
            margin: '0.9rem 0 0',
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: 'clamp(2.3rem, 4vw, 4.5rem)',
            lineHeight: 1.02,
            fontWeight: 600,
            color: '#111111',
          }}
        >
          {title}
        </h2>
        <p
          style={{
            margin: '1.2rem 0 0',
            fontFamily: 'Inter, Lato, sans-serif',
            fontSize: '1.02rem',
            lineHeight: 1.9,
            color: '#686868',
          }}
        >
          {description}
        </p>
        <a
          href={href}
          style={{
            marginTop: '1.8rem',
            display: 'inline-flex',
            alignItems: 'center',
            paddingBottom: '0.2rem',
            fontFamily: 'Inter, Lato, sans-serif',
            fontSize: '0.82rem',
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#111111',
            textDecoration: 'none',
            position: 'relative',
          }}
          className="collections-cta"
        >
          Explore Collection
        </a>
      </div>
    </div>
  );

  return (
    <section
      className={`collections-section${reverse ? ' collections-section--reverse' : ''}`}
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: 0,
        alignItems: 'stretch',
      }}
    >
      {media}
      {copy}
    </section>
  );
}

export default function Collections() {
  return (
    <main style={{ background: '#FAFAFA', minHeight: '100vh', paddingTop: '2.25rem', paddingBottom: '2.75rem' }}>
      <style>{`
        .collections-cta::after {
          content: '';
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 1px;
          background: #111111;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 600ms ease;
        }

        .collections-cta:hover::after {
          transform: scaleX(1);
        }

        @media (min-width: 900px) {
          .collections-section {
            grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
          }

          .collections-section--reverse .collections-media {
            order: 2;
          }

          .collections-section--reverse .collections-copy {
            order: 1;
          }
        }
      `}</style>

      <header
        style={{
          padding: '0 0 1.6rem',
          textAlign: 'center',
        }}
      >
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
            margin: '0.85rem 0 0',
            fontFamily: 'Playfair Display, Georgia, serif',
            fontSize: 'clamp(2.8rem, 5vw, 4.8rem)',
            lineHeight: 1.02,
            fontWeight: 600,
            color: '#111111',
          }}
        >
          Collections
        </h1>
      </header>

      <div className="collections-list" style={{ display: 'grid', gap: '0.25rem' }}>
        {collections.map((collection) => (
          <CollectionSection key={collection.title} {...collection} />
        ))}
      </div>
    </main>
  );
}