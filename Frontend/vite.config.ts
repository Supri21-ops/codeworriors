import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(process.cwd(), './src'),
    },
  },
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      '@tanstack/react-query',
      'axios',
      'zustand',
      'react-hot-toast'
    ],
    force: false, // Allow Vite to cache dependencies properly
  },
  server: {
    port: 5173,
    host: 'localhost', // Use localhost specifically to avoid WebSocket issues
    strictPort: false,
    open: true,
    cors: true,
    hmr: {
      port: 5173,
      host: 'localhost',
      clientPort: 5173,
      overlay: true, // Show error overlay
    },
    watch: {
      usePolling: false, // Disable polling for better performance
      interval: 300,     // Polling interval if needed
    },
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '/api'),
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@headlessui/react', '@heroicons/react'],
          charts: ['recharts'],
          forms: ['react-hook-form'],
          state: ['zustand'],
        },
      },
    },
  },
  define: {
    'process.env': {},
  },
  esbuild: {
    logOverride: { 'this-is-undefined-in-esm': 'silent' }
  },
})