// Build de demostración en un solo archivo HTML (sin PWA), para compartir la prueba de la Era 1.
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteSingleFile } from 'vite-plugin-singlefile';

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: { outDir: 'dist-demo', emptyOutDir: true },
});
