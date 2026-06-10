const storySections = [
  {
    title: 'Our Origins',
    body:
      'Luxury Sense began with a singular idea: to translate timeless taste into a modern retail language. The brand draws from old-world ateliers, quiet tailoring rooms, and the ritual of selecting objects that feel personal, enduring, and beautifully made.',
    image: '/accessories_category.jfif',
    alt: 'Luxury accessories and leather goods',
  },
  {
    title: 'Master Craftsmanship',
    body:
      'Every collection is curated with the same reverence a master artisan brings to a finished piece. We value precise construction, tactile materials, and the invisible discipline behind elevated objects that reveal their quality slowly, in use and over time.',
    image: '/men_category.jfif',
    alt: 'Handcrafted menswear and footwear',
  },
  {
    title: 'Sustainable Luxury',
    body:
      'For Luxury Sense, sustainability is not a trend but an essential expression of restraint and longevity. We champion considered sourcing, enduring design, and pieces meant to be cherished, repaired, and remembered rather than replaced.',
    image: '/perfume_category.jfif',
    alt: 'Artisanal fragrances and perfume collection',
  },
];

function StoryImage({ src, alt }) {
  return (
    <figure className="my-12 w-full sm:my-16">
      <div className="relative min-h-[22rem] w-full overflow-hidden rounded-[40px] border border-white/5 bg-luxury-charcoal shadow-luxury-lg sm:min-h-[28rem] md:min-h-[36rem]">
        <img
          src={src}
          alt={alt}
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-1000 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-luxury-black/40 via-transparent to-transparent" />
      </div>
    </figure>
  );
}

function StorySection({ title, body, image, alt, firstParagraph = false }) {
  return (
    <section className="mb-16 md:mb-24">
      <h2 className="m-0 font-serif text-5xl tracking-tight text-white sm:text-6xl lg:text-7xl">
        {title}
      </h2>

      <p className="mt-8 font-sans text-lg leading-9 text-stone-400 sm:text-xl sm:leading-10">
        {firstParagraph ? (
          <span className="float-left mr-3 font-serif text-7xl font-medium leading-[0.8] text-luxury-gold sm:text-8xl md:text-9xl">
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
    <main className="min-h-screen bg-luxury-black px-6 py-20 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <header className="mb-20 text-center md:mb-32">
          
          <h1 className="mt-8 font-serif text-6xl tracking-[-0.02em] text-white sm:text-8xl lg:text-9xl">
            Heritage
          </h1>
          <div className="mx-auto mt-12 h-px w-24 bg-luxury-gold/30" />
        </header>

        <div className="mx-auto max-w-4xl">
          <StorySection {...storySections[0]} firstParagraph />
          <StorySection {...storySections[1]} />
          <StorySection {...storySections[2]} />
        </div>
      </div>
    </main>
  );
}
