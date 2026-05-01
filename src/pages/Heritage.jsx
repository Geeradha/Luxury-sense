const storySections = [
  {
    title: 'Our Origins',
    body:
      'Luxury Sense began with a singular idea: to translate timeless taste into a modern retail language. The brand draws from old-world ateliers, quiet tailoring rooms, and the ritual of selecting objects that feel personal, enduring, and beautifully made.',
    image:
      'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=1400&q=80',
    alt: 'Black and white image of raw leather materials',
  },
  {
    title: 'Master Craftsmanship',
    body:
      'Every collection is curated with the same reverence a master artisan brings to a finished piece. We value precise construction, tactile materials, and the invisible discipline behind elevated objects that reveal their quality slowly, in use and over time.',
    image:
      'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=1400&q=80',
    alt: 'Elegant monochrome image of an artisan working with materials',
  },
  {
    title: 'Sustainable Luxury',
    body:
      'For Luxury Sense, sustainability is not a trend but an essential expression of restraint and longevity. We champion considered sourcing, enduring design, and pieces meant to be cherished, repaired, and remembered rather than replaced.',
    image:
      'https://images.unsplash.com/photo-1594035910387-fea47794261f?auto=format&fit=crop&w=1400&q=80',
    alt: 'Black and white image of perfume bottles and glass reflections',
  },
];

function StoryImage({ src, alt }) {
  return (
    <figure
      style={{
        margin: 'clamp(1.2rem, 4vw, 2.5rem) 0',
        width: '100%',
      }}
    >
      <div
        style={{
          width: '100%',
          minHeight: 'clamp(18rem, 42vw, 30rem)',
          overflow: 'hidden',
          background: '#e9e6e1',
        }}
      >
        <img
          src={src}
          alt={alt}
          style={{
            width: '100%',
            height: '100%',
            display: 'block',
            objectFit: 'cover',
            objectPosition: 'center',
            filter: 'grayscale(100%) contrast(1.02)',
          }}
        />
      </div>
    </figure>
  );
}

function StorySection({ title, body, image, alt, firstParagraph = false }) {
  return (
    <section style={{ marginBottom: 'clamp(1.5rem, 4vw, 3.5rem)' }}>
      <h2
        style={{
          margin: 0,
          fontFamily: 'Playfair Display, Georgia, serif',
          fontSize: 'clamp(2rem, 3vw, 3.25rem)',
          lineHeight: 1.05,
          fontWeight: 600,
          color: '#111111',
        }}
      >
        {title}
      </h2>

      <p
        style={{
          margin: 'clamp(0.8rem, 2vw, 1.25rem) 0 0',
          fontFamily: 'Inter, Lato, sans-serif',
          fontSize: 'clamp(0.98rem, 1.8vw, 1.02rem)',
          lineHeight: 1.82,
          color: '#4f4f4f',
        }}
      >
        {firstParagraph ? (
          <span
            style={{
              float: 'left',
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: 'clamp(2.7rem, 11vw, 4.4rem)',
              lineHeight: 0.84,
              fontWeight: 600,
              paddingRight: 'clamp(0.14rem, 1vw, 0.2rem)',
              paddingTop: 'clamp(0.1rem, 0.8vw, 0.22rem)',
              color: '#111111',
            }}
          >
            {body.charAt(0)}
          </span>
        ) : null}
        {firstParagraph ? body.slice(1) : body}
      </p>

      <StoryImage src={image} alt={alt} />
    </section>
  );
}

export default function Heritage() {
  return (
    <main style={{ background: '#FAFAFA', minHeight: '100vh', padding: '2rem 0 2.75rem' }}>
      <div style={{ maxWidth: '48rem', margin: '0 auto' }}>
        <header style={{ textAlign: 'center', marginBottom: 'clamp(1.5rem, 4vw, 3.5rem)' }}>
          <p
            style={{
              margin: 0,
              fontFamily: 'Inter, Lato, sans-serif',
              fontSize: '0.74rem',
              letterSpacing: '0.32em',
              textTransform: 'uppercase',
              color: '#8b8b8b',
            }}
          >
            Luxury Sense
          </p>
          <h1
            style={{
              margin: '0.9rem 0 0',
              fontFamily: 'Playfair Display, Georgia, serif',
              fontSize: 'clamp(2.8rem, 5vw, 4.6rem)',
              lineHeight: 1.02,
              fontWeight: 600,
              color: '#111111',
            }}
          >
            Heritage
          </h1>
        </header>

        <div style={{ maxWidth: '42rem', margin: '0 auto' }}>
          <StorySection {...storySections[0]} firstParagraph />
          <StorySection {...storySections[1]} />
          <StorySection {...storySections[2]} />
        </div>
      </div>
    </main>
  );
}