import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/fast-dashboard/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'FAST Dashboard',
        short_name: 'FAST',
        description: 'Sajeel Ahmed — BCY-4A Student Planner',
        theme_color: '#1a1a2e',
        background_color: '#f7f6f3',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/fast-dashboard/',
        start_url: '/fast-dashboard/',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' }
        ]
      },
      workbox: { globPatterns: ['**/*.{js,css,html,ico,png,svg}'] }
    })
  ]
})
