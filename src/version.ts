// Versión de la app, inyectada en el build desde package.json
// (vite.config.ts: define __APP_VERSION__). Una sola fuente de verdad:
// la versión no se escribe a mano en ningún otro sitio.
declare const __APP_VERSION__: string | undefined;

/** Versión que corre esta build, p. ej. "0.4.0". En tests es "dev". */
export const APP_VERSION: string =
  typeof __APP_VERSION__ === 'string' && __APP_VERSION__.length > 0 ? __APP_VERSION__ : 'dev';
