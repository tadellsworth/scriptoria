import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'icon-maskable.svg', 'apple-touch-icon.png', 'splash/*.png'],
      manifest: {
        id: '/',
        name: 'Scriptoria',
        short_name: 'Scriptoria',
        description: 'Your whole life of prayer, gathered into one quiet manuscript.',
        theme_color: '#1e3a5f',
        background_color: '#11233a',
        display: 'standalone',
        orientation: 'portrait',
        start_url: '/',
        scope: '/',
        lang: 'en',
        dir: 'ltr',
        categories: ['lifestyle', 'education', 'books'],
        icons: [
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
          { src: 'icon.svg', sizes: 'any', type: 'image/svg+xml' },
        ],
      },
      workbox: {
        // The embedded Latin course is its own page — keep the SPA navigation
        // fallback (which serves the React index.html) away from /lingua/*,
        // otherwise the course iframe would be served the app shell.
        navigateFallbackDenylist: [/^\/lingua\//],
        // Cache the app shell; readings/parish data are runtime-cached so the
        // app stays useful offline (with the bundled fallbacks).
        globPatterns: ['**/*.{js,css,html,svg,woff,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.(googleapis|gstatic)\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts',
              expiration: { maxEntries: 20, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/cpbjr\.github\.io\/catholic-readings-api\/.*/i,
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'lectionary',
              expiration: { maxEntries: 60, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      devOptions: { enabled: false },
    }),
  ],
});
