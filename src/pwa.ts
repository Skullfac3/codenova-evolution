import { registerSW } from 'virtual:pwa-register';

/** Aviso de "hay una nueva versión": lo escucha App.tsx. */
type UpdateListener = () => void;
const updateListeners = new Set<UpdateListener>();

export function onUpdateAvailable(cb: UpdateListener): () => void {
  updateListeners.add(cb);
  return () => {
    updateListeners.delete(cb);
  };
}

function notifyUpdateAvailable(): void {
  updateListeners.forEach((cb) => cb());
}

/**
 * Registra el service worker y busca versiones nuevas:
 * al abrir la app, cada hora y cada vez que vuelve a primer plano
 * (importante en la app instalada del iPhone, que casi nunca se cierra).
 *
 * Cuando hay una versión nueva avisa a la app (banner "Actualizar ahora")
 * en vez de quedarse en silencio con el JS viejo: onNeedRefresh cuando el
 * SW nuevo queda esperando, y 'controllerchange' cuando el SW nuevo ya
 * tomó el control pero la página sigue corriendo el JS anterior.
 * El controllerchange solo avisa si la página ya tenía un SW controlándola
 * al cargar (en la primera instalación no hay versión vieja que avisar).
 */
export function startPwa(): void {
  if (!('serviceWorker' in navigator)) return;
  const hadController = Boolean(navigator.serviceWorker.controller);
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (hadController) notifyUpdateAvailable();
  });
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
    onNeedRefresh() {
      notifyUpdateAvailable();
    },
    onRegisterError() {
      /* sin service worker la app funciona igual, solo sin modo offline */
    },
  });
}
