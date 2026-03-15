import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

/**
 * Injects <link rel="modulepreload"> for dynamically-imported chunks
 * so the browser fetches them in parallel with the main bundle.
 */
function modulePreloadDynamic(): Plugin {
  return {
    name: 'module-preload-dynamic',
    enforce: 'post',
    transformIndexHtml(html, ctx) {
      if (!ctx.bundle) return html;
      const dynamicChunks = Object.values(ctx.bundle)
        .filter(
          (chunk): chunk is Extract<typeof chunk, { type: 'chunk' }> =>
            chunk.type === 'chunk' && chunk.isDynamicEntry,
        )
        .map((chunk) => chunk.fileName);

      const tags = dynamicChunks.map((file) => ({
        tag: 'link' as const,
        attrs: { rel: 'modulepreload', href: `/quranic-prayers/${file}` },
        injectTo: 'head' as const,
      }));
      return tags;
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: '/quranic-prayers/',
  plugins: [
    react(),
    modulePreloadDynamic(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: 'script-defer',
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'gstatic-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },
      manifest: {
        name: 'Quranic Prayers — Supplications from the Holy Quran',
        short_name: 'Quranic Prayers',
        description: 'Quranic prayers with Arabic text, word-by-word breakdowns, and translations in English, Urdu and Hindi.',
        theme_color: '#2c5f2d',
        background_color: '#faf9f6',
        display: 'standalone',
        start_url: '/quranic-prayers/',
        icons: [
          {
            src: 'favicon.svg',
            sizes: 'any',
            type: 'image/svg+xml',
            purpose: 'any',
          },
        ],
      },
    }),
  ],
})
