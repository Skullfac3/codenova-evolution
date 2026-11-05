/** Sustituto de virtual:pwa-register para builds sin service worker. */
export function registerSW(): () => Promise<void> {
  return async () => undefined;
}
