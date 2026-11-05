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

/**
 * Botón "Buscar actualización": pide al service worker la versión más
 * reciente y recarga si hay una nueva.
 */
export async function checkForUpdate(): Promise<string> {
  if (!('serviceWorker' in navigator)) return 'Este navegador no guarda la app sin conexión: siempre ves la última versión.';
  try {
    const reg = await navigator.serviceWorker.getRegistration();
    if (!reg) return 'Ya tienes la última versión.';
    await reg.update();
    const fresh = reg.installing ?? reg.waiting;
    if (!fresh) return 'Ya tienes la última versión.';
    navigator.serviceWorker.addEventListener('controllerchange', () => window.location.reload(), { once: true });
    fresh.postMessage({ type: 'SKIP_WAITING' });
    setTimeout(() => window.location.reload(), 4000);
    return 'Hay una versión nueva. Actualizando…';
  } catch {
    return 'No pude buscar actualizaciones. Revisa tu conexión.';
  }
}
