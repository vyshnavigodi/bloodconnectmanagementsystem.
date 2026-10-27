import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    warmupFiles: ['./src/main.tsx', './src/App.tsx', './src/pages/LandingPage.tsx']
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      'axios',
      'lucide-react',
      'framer-motion',
      'recharts',
      'react-hook-form',
    ]
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react':   ['react', 'react-dom', 'react-router-dom'],
          'vendor-motion':  ['framer-motion'],
          'vendor-charts':  ['recharts'],
          'vendor-three':   ['three', '@react-three/fiber', '@react-three/drei'],
          'vendor-icons':   ['lucide-react'],
          'vendor-form':    ['react-hook-form', 'axios'],
        }
      }
    }
  }
})
