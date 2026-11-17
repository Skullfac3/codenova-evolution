import { Component, type ReactNode } from 'react';

/** Borra la caché de la app (service worker y Cache Storage) y recarga. No toca la partida guardada. */
export function clearCacheAndReload(): void {
  const jobs: Promise<unknown>[] = [];
  if ('serviceWorker' in navigator) {
    jobs.push(navigator.serviceWorker.getRegistrations().then((rs) => Promise.all(rs.map((r) => r.unregister()))));
  }
  if ('caches' in window) jobs.push(caches.keys().then((ks) => Promise.all(ks.map((k) => caches.delete(k)))));
  void Promise.all(jobs).catch(() => undefined).then(() => location.reload());
}

interface State {
  error: Error | null;
}

/**
 * Si algo truena al dibujar la app, React borra toda la pantalla y queda en
 * blanco. Esto muestra el error y un botón para reintentar, para que la
 * persona no se quede atorada y pueda contar qué pasó.
 */
export class ErrorBoundary extends Component<{ children: ReactNode }, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    console.error('CodeNova se detuvo:', error);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    const detail = `${error.name}: ${error.message}\n${(error.stack ?? '').split('\n').slice(1, 4).join('\n')}`;
    return (
      <div className="crash" role="alert" data-testid="crash">
        <div className="splash-logo">CodeNova</div>
        <p>Algo falló al abrir la app. Toca «Reintentar»: tu partida está a salvo.</p>
        <button type="button" className="btn primary" onClick={clearCacheAndReload}>Reintentar</button>
        <p className="muted">Si vuelve a pasar, comparte este mensaje:</p>
        <pre data-testid="crash-detail">{detail}</pre>
      </div>
    );
  }
}
