import { VitePWA } from 'vite-plugin-pwa';
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), VitePWA({
    registerType: 'autoUpdate',
    injectRegister: 'auto',

    pwaAssets: {
      disabled: false,
      config: true,
    },

    manifest: {
      name: 'Solus - Singular clarity for every decision',
      short_name: 'Solus',
      description: 'AI-powered decision making assistant that helps you make better choices with confidence',
      theme_color: '#3B82F6',
      background_color: '#FFFFFF',
      display: 'standalone',
      orientation: 'portrait',
      scope: '/',
      start_url: '/',
      id: 'com.soluscore',
      icons: [
        {
          src: 'pwa-64x64.png',
          sizes: '64x64',
          type: 'image/png'
        },
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        },
        {
          src: 'maskable-icon-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable'
        }
      ],
      screenshots: [
        {
          src: 'screenshot-1.png',
          sizes: '1080x1920',
          type: 'image/png',
          form_factor: 'narrow',
          label: 'Quick Decision Mode'
        },
        {
          src: 'screenshot-2.png',
          sizes: '1080x1920',
          type: 'image/png',
          form_factor: 'narrow',
          label: 'Deep Reflection Mode'
        }
      ],
      categories: ['productivity', 'lifestyle', 'utilities'],
      lang: 'en-US',
      dir: 'ltr',
      prefer_related_applications: false,
      related_applications: [],
      shortcuts: [
        {
          name: 'Quick Decision',
          short_name: 'Quick',
          description: 'Make a quick decision',
          url: '/quick-decision',
          icons: [{ src: 'quick-decision-icon.png', sizes: '192x192' }]
        },
        {
          name: 'Deep Reflection',
          short_name: 'Deep',
          description: 'Start a deep reflection',
          url: '/deep-reflection',
          icons: [{ src: 'deep-reflection-icon.png', sizes: '192x192' }]
        }
      ]
    },

    workbox: {
      globPatterns: ['**/*.{js,css,html,svg,png,ico,woff,woff2,ttf,eot}'],
      cleanupOutdatedCaches: true,
      clientsClaim: true,
      skipWaiting: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'gstatic-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        }
      ]
    },

    devOptions: {
      enabled: true,
      navigateFallback: 'index.html',
      suppressWarnings: true,
      type: 'module',
    },
  })],
})