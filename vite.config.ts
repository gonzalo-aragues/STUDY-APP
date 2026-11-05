import { defineConfig } from 'vite';
import { VitePWA } from 'vite-plugin-pwa';

// GitHub Pages serves the site at https://<user>.github.io/<repo>/ (case-sensitive).
// The deploy workflow passes VITE_BASE=/<repo name>/; locally we default to /STUDY-APP/.
const base = process.env.VITE_BASE ?? '/STUDY-APP/';

export default defineConfig({
  root: 'app',
  base,
  publicDir: 'public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
    target: 'es2022',
  },
  server: { port: 5173 },
  preview: { port: 4173 },
  plugins: [
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: false, // registered from main.ts
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Estudio — repaso y material',
        short_name: 'Estudio',
        description: 'Material de estudio y repaso espaciado de la carrera. Funciona sin conexión.',
        lang: 'es-ES',
        dir: 'ltr',
        start_url: './#/hoy',
        scope: './',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#f6f5f1',
        theme_color: '#2f7d6d',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
        shortcuts: [
          { name: 'Repasar', short_name: 'Repasar', url: './#/repasar', icons: [{ src: 'icon-192.png', sizes: '192x192' }] },
          { name: 'Sesión de 5 minutos', short_name: '5 min', url: './#/repasar?modo=5min', icons: [{ src: 'icon-192.png', sizes: '192x192' }] },
        ],
      },
      workbox: {
        // Precache the app shell AND all study content so it works fully offline.
        globPatterns: ['**/*.{js,css,html,svg,png,woff2,json}'],
        // Archived subjects are not precached; they are cached the first time you open them.
        globIgnores: ['content/archivo/**'],
        runtimeCaching: [
          {
            urlPattern: /\/content\/archivo\//,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'contenido-archivado', expiration: { maxEntries: 500 } },
          },
        ],
        maximumFileSizeToCacheInBytes: 8 * 1024 * 1024,
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
      },
    }),
  ],
});
