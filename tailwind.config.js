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
          'black': '#1a1a1a',      // Charcoal black
          'white': '#fafafa',      // Soft off-white
          'gold': '#d4af9e',       // Muted champagne gold
          'dark': '#0f0f0f',       // Deep black for accents
          'light': '#f8f8f8',      // Light background
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
        'gradient-luxury': 'linear-gradient(135deg, #fafafa 0%, #f5f5f5 100%)',
      },
    },
  },
  plugins: [],
}
