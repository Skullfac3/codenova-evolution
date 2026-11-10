/// <reference types="vitest/config" />
import { readFileSync } from 'node:fs';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// En GitHub Pages el sitio vive en https://<usuario>.github.io/codenova-evolution/
const base = process.env.GITHUB_ACTIONS ? '/codenova-evolution/' : '/';

// La versión vive solo en package.json; se inyecta en el build para
// mostrarla en la app (src/version.ts). No se hardcodea en dos sitios.
const { version: appVersion } = JSON.parse(
  readFileSync(new URL('./package.json', import.meta.url), 'utf-8'),
) as { version: string };

export default defineConfig({
  base,
  define: {
    __APP_VERSION__: JSON.stringify(appVersion),
  },
  plugins: [
    react(),
    VitePWA({
      // autoUpdate: la versión nueva se activa sola. Con 'prompt' la app instalada
      // se quedaba en la versión vieja porque no había botón de actualizar.
      registerType: 'autoUpdate',
      injectRegister: false, // se registra en src/pwa.ts
      workbox: {
        cleanupOutdatedCaches: true,
        clientsClaim: true,
        skipWaiting: true,
        // El patrón por defecto no incluye woff2: sin esto, las fuentes
        // propias no quedarían en la caché offline del service worker.
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
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
  build: {
    rollupOptions: {
      output: {
        // Los dos lenguajes del editor (JS y HTML) son los trozos más
        // grandes de CodeMirror y son independientes entre sí: cada uno
        // en su propio paquete, en vez de un solo CodeEditor de 500 KB.
        // Ambos se bajan junto con el editor cuando se abre un ejercicio.
        manualChunks(id) {
          if (id.includes('@codemirror/lang-javascript') || id.includes('@lezer/javascript')) return 'cm-lang-js';
          if (
            id.includes('@codemirror/lang-html') ||
            id.includes('@codemirror/lang-css') ||
            id.includes('@lezer/html') ||
            id.includes('@lezer/css')
          )
            return 'cm-lang-html';
        },
      },
    },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
