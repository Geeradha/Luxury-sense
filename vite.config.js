import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // When building on Vercel, output to 'dist'. 
    // Otherwise, output to 'backend/public' for local Laravel development.
    outDir: process.env.VERCEL ? 'dist' : 'backend/public',
    emptyOutDir: !!process.env.VERCEL, // True for Vercel (dist), False for local (backend/public)
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      }
    }
  }
})