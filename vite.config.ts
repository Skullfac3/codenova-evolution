/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// En GitHub Pages el sitio vive en https://<usuario>.github.io/codenova-evolution/
const base = process.env.GITHUB_ACTIONS ? '/codenova-evolution/' : '/';

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? '0.5.0'),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
  },
  base,
  plugins: [
    react(),
    VitePWA({
      // autoUpdate: la versión nueva se activa sola. Con 'prompt' la app instalada
      // se quedaba en la versión vieja porque no había botón de actualizar.
      registerType: 'autoUpdate',
      injectRegister: false, // se registra en src/pwa.ts
      workbox: { cleanupOutdatedCaches: true, clientsClaim: true, skipWaiting: true },
      includeAssets: ['favicon.svg', 'icons/apple-touch-icon.png', 'sprites/**/*', 'audio/**/*'],
      manifest: {
        name: 'CodeNova Evolution',
        short_name: 'CodeNova',
        lang: 'es',
        start_url: base,
        display: 'standalone',
        background_color: '#1b1325',
        theme_color: '#1b1325',
        icons: [
          { src: 'icons/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icons/icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
    }),
  ],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
