import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'

const apiPort = process.env.API_PORT ?? '3001'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'EmiKettik Flight Tickets',
        short_name: 'EmiKettik',
        description: 'Find and book flights with EmiKettik.',
        theme_color: '#10243b',
        background_color: '#f8fafc',
        display: 'standalone',
        start_url: '/',
        scope: '/',
        icons: [
          { src: '/pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: '/pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{css,html,ico,js,png,svg,webmanifest}'],
      },
    }),
  ],
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': `http://127.0.0.1:${apiPort}`,
    },
  },
})
