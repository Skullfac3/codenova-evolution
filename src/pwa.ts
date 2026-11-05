import { registerSW } from 'virtual:pwa-register';

/**
 * Registra el service worker y busca versiones nuevas:
 * al abrir la app, cada hora y cada vez que vuelve a primer plano
 * (importante en la app instalada del iPhone, que casi nunca se cierra).
 */
export function startPwa(): void {
  if (!('serviceWorker' in navigator)) return;
  registerSW({
    immediate: true,
    onRegisteredSW(_url, registration) {
      if (!registration) return;
      const check = () => registration.update().catch(() => undefined);
      setInterval(check, 60 * 60 * 1000);
      document.addEventListener('visibilitychange', () => {
        if (document.visibilityState === 'visible') check();
      });
    },
    onRegisterError() {
      /* sin service worker la app funciona igual, solo sin modo offline */
    },
  });
}
