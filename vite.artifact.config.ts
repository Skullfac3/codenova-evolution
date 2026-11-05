// Build de demostración en un solo archivo HTML (sin PWA), para compartir la prueba de la Era 1.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version ?? '0.5.0'),
    __BUILD_DATE__: JSON.stringify(new Date().toISOString().slice(0, 10)),
  },
  plugins: [react(), viteSingleFile()],
  // La demo de un solo archivo no usa service worker.
  resolve: { alias: { 'virtual:pwa-register': '/src/pwa-stub.ts' } },
  build: { outDir: 'dist-demo', emptyOutDir: true },
});
