/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

// En GitHub Pages el sitio vive en https://<usuario>.github.io/codenova-evolution/
const base = process.env.GITHUB_ACTIONS ? '/codenova-evolution/' : '/';

export default defineConfig({
  base,
  plugins: [
    react(),
    VitePWA({
      registerType: 'prompt', // el usuario decide cuándo actualizar (no se pierde una lección a medias)
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
