import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import { startPwa } from './pwa';
import { unlockAudioOnFirstTouch } from './game/sound';
import { ErrorBoundary } from './components/ErrorBoundary';

// Tras publicar una versión nueva, una página vieja (guardada por el navegador
// unos minutos) puede pedir piezas que ya no existen: la app tronaba y quedaba
// en blanco. Si una pieza no carga, se recarga una sola vez para tomar la nueva.
const RELOAD_FLAG = 'codenova:recargado';
window.addEventListener('vite:preloadError', (event) => {
  if (sessionStorage.getItem(RELOAD_FLAG)) return; // ya se intentó: que lo muestre el aviso de error
  sessionStorage.setItem(RELOAD_FLAG, '1');
  event.preventDefault();
  location.reload();
});
setTimeout(() => sessionStorage.removeItem(RELOAD_FLAG), 15_000);

startPwa();
unlockAudioOnFirstTouch();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);
