/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Luxury palette
        'luxury': {
          'black': '#0a0a0a',      // Deep black
          'charcoal': '#141414',   // Dark gray for cards/surfaces
          'white': '#fafafa',      // Soft off-white
          'gold': '#d4af9e',       // Muted champagne gold
          'gold-light': '#e5cfc4', // Lighter gold for highlights
          'dark': '#0f0f0f',       // Deep black for accents
          'stone': '#a3a3a3',      // Muted stone gray for body text
          'gray': {
            '50': '#fafafa',
            '100': '#f5f5f5',
            '200': '#e8e8e8',
            '300': '#d3d3d3',
            '400': '#a9a9a9',
            '500': '#808080',
            '600': '#666666',
            '700': '#4d4d4d',
            '800': '#333333',
            '900': '#1a1a1a',
          }
        }
      },
      boxShadow: {
        'luxury-sm': '0 4px 20px rgba(0, 0, 0, 0.3)',
        'luxury-md': '0 12px 40px rgba(0, 0, 0, 0.4)',
        'luxury-lg': '0 24px 60px rgba(0, 0, 0, 0.5)',
        'gold-glow': '0 0 20px rgba(212, 175, 158, 0.15)',
      },
      fontFamily: {
        'playfair': ['Playfair Display', 'serif'],
        'inter': ['Inter', 'sans-serif'],
        'lato': ['Lato', 'sans-serif'],
      },
      letterSpacing: {
        'wide-luxury': '0.2em',    // For tracked-out headings
        'wider-luxury': '0.25em',  // Extra wide for logo
      },
      spacing: {
        'luxury': '1.5rem',
      },
      transitionDuration: {
        'luxury': '600ms',         // Slow transitions for elegance
      },
      backgroundImage: {
        'gradient-luxury': 'linear-gradient(135deg, #0a0a0a 0%, #141414 100%)',
        'gradient-gold': 'linear-gradient(135deg, rgba(212,175,158,0.15) 0%, transparent 60%)',
      },
    },
  },
  plugins: [],
}
