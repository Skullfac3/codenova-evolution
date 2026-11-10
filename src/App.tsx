import { Suspense, lazy, useEffect, useState } from 'react';
import { ERAS } from './learning/catalog';
import { loadLesson } from './learning/lessons';
import type { Lesson } from './types/lesson';
import { levelForXp, useProgress } from './store/progress';
import { APP_VERSION } from './version';
import { onUpdateAvailable } from './pwa';
import { Habitat } from './components/Habitat';
import { ProtoDock } from './components/ProtoDock';

/**
 * Estas tres pantallas no hacen falta en la primera carga: se bajan
 * bajo demanda. LessonPlayer arrastra además el editor CodeMirror,
 * la validación y el render de Markdown, que son lo más pesado.
 */
const LessonPlayer = lazy(() => import('./components/LessonPlayer').then((m) => ({ default: m.LessonPlayer })));
const Shop = lazy(() => import('./components/Shop').then((m) => ({ default: m.Shop })));
const Profiles = lazy(() => import('./components/Profiles').then((m) => ({ default: m.Profiles })));

type Tab = 'refugio' | 'lecciones' | 'tienda' | 'perfiles';
const TABS: Array<{ id: Tab; icon: string; label: string }> = [
  { id: 'refugio', icon: '🏡', label: 'Refugio' },
  { id: 'lecciones', icon: '📚', label: 'Lecciones' },
  { id: 'tienda', icon: '🛒', label: 'Tienda' },
  { id: 'perfiles', icon: '👤', label: 'Perfiles' },
];

export default function App() {
  const save = useProgress((s) => s.save);
  const isEraComplete = useProgress((s) => s.isEraComplete);
  const isEraUnlocked = useProgress((s) => s.isEraUnlocked);
  const resetProgress = useProgress((s) => s.resetProgress);
  const [tab, setTab] = useState<Tab>('refugio');
  const [openId, setOpenId] = useState<string | null>(null);
  // La lección completa (intro, concepto, ejercicios, quiz) se baja
  // bajo demanda cuando se abre; el mapa solo usa el catálogo ligero.
  const [lesson, setLesson] = useState<Lesson | null>(null);
  const [lessonLoading, setLessonLoading] = useState(false);
  useEffect(() => {
    if (!openId) {
      setLesson(null);
      setLessonLoading(false);
      return;
    }
    let cancelled = false;
    setLessonLoading(true);
    loadLesson(openId)
      .then((loaded) => {
        if (!cancelled) setLesson(loaded ?? null);
      })
      .catch(() => {
        if (!cancelled) setLesson(null);
      })
      .finally(() => {
        if (!cancelled) setLessonLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [openId]);
  const [confirmingReset, setConfirmingReset] = useState(false);
  // Hay una versión nueva lista: el banner ofrece recargar para usarla.
  // Sin esto, la app instalada se quedaba en silencio con el JS viejo.
  const [updateAvailable, setUpdateAvailable] = useState(false);
  useEffect(() => onUpdateAvailable(() => setUpdateAvailable(true)), []);

  // Muestra todas las eras: las que tienen lecciones y, como anuncio,
  // las que aún no tienen (HTML y CSS van primero en el mapa). El banner
  // anuncia la siguiente era sin contenido después de la última publicada.
  const published = ERAS.filter((e) => e.lessons.length > 0);
  const lastPublishedId = Math.max(...published.map((e) => e.id));
  const upcoming = ERAS.find((e) => e.lessons.length === 0 && e.id > lastPublishedId);

  return (
    <div className="app">
      <header className="hud">
        <span className="brand">CodeNova</span>
        <span data-testid="hud-level">Nv {levelForXp(save.xp)}</span>
        <span data-testid="hud-xp">{save.xp} XP</span>
        <span data-testid="hud-coins">🪙 {save.novacoins}</span>
      </header>

      <main>
        {tab === 'refugio' && <Habitat onGoToLessons={() => setTab('lecciones')} onGoToShop={() => setTab('tienda')} />}
        {tab === 'tienda' && (
          <Suspense fallback={<p className="muted">Cargando la tienda…</p>}>
            <Shop onGoToHabitat={() => setTab('refugio')} />
          </Suspense>
        )}
        {tab === 'perfiles' && (
          <Suspense fallback={<p className="muted">Cargando los perfiles…</p>}>
            <Profiles />
          </Suspense>
        )}
        {tab === 'lecciones' && (lesson ? (
          <Suspense fallback={<p className="muted">Cargando la lección…</p>}>
            <LessonPlayer
              key={lesson.id}
              lesson={lesson}
              onExit={() => setOpenId(null)}
              // La siguiente lección se desbloquea al completar esta: no volver
              // a comprobarlo aquí. Antes, esa comprobación dejaba la lección
              // siguiente bloqueada en el mapa hasta recargar la página.
              onNext={(next) => setOpenId(next ?? null)}
            />
          </Suspense>
        ) : lessonLoading ? (
          <p className="muted">Cargando la lección…</p>
        ) : (
          <div className="map" data-testid="map">
            <p className="muted greeting">Hola, {save.explorerName}.</p>

            {ERAS.map((era) => {
              const unlocked = isEraUnlocked(era.id);
              // Era anunciada sin lecciones todavía: se muestra qué viene.
              if (era.lessons.length === 0) {
                return (
                  <section key={era.id} className="era era-coming" data-testid={`era-${era.id}`} data-state="coming-soon">
                    <h1>{era.icon} Era {era.id} · {era.name}</h1>
                    <p className="muted">{era.teaser}</p>
                    <p className="coming-note">📣 Sus lecciones llegan pronto.</p>
                  </section>
                );
              }
              const done = era.lessons.filter((l) => save.completedLessons[l.id]).length;
              return (
                <section key={era.id} className={`era ${unlocked ? '' : 'era-locked'}`} data-testid={`era-${era.id}`} data-state={unlocked ? (isEraComplete(era.id) ? 'done' : 'open') : 'locked'}>
                  <h1>{era.icon} Era {era.id} · {era.name}</h1>
                  {unlocked ? (
                    <>
                      <p className="muted">Progreso: {done} de {era.lessons.length}</p>
                      <div className="bar"><span style={{ width: `${(done / era.lessons.length) * 100}%` }} /></div>
                      <ol className="lessons">
                        {era.lessons.map((l, index) => {
                          const isDone = Boolean(save.completedLessons[l.id]);
                          // Se calcula desde la partida guardada, no desde una
                          // función capturada: así el mapa se actualiza en
                          // cuanto se completa la lección anterior, sin
                          // necesidad de recargar. El Administrador lo ve todo abierto.
                          const open = Boolean(save.admin) || index === 0 || Boolean(save.completedLessons[era.lessons[index - 1]!.id]);
                          const state = isDone ? 'done' : open ? 'open' : 'locked';
                          return (
                            <li key={l.id}>
                              <button className={`lesson-card ${state}`} disabled={!open} onClick={() => setOpenId(l.id)} data-testid={`lesson-${l.id}`} data-state={state}>
                                <span className="num">{isDone ? '✓' : open ? l.order : '🔒'}</span>
                                <span className="title">
                                  {l.title}
                                  <small>{l.kind === 'evaluation' ? 'Evaluación' : l.topics.slice(0, 3).join(' · ')}</small>
                                </span>
                                <span className="pts">+{l.reward.xp} XP</span>
                              </button>
                            </li>
                          );
                        })}
                      </ol>
                    </>
                  ) : (
                    <p className="locked-note">🔒 Completa la Era {era.id - 1} para desbloquear {era.lessons.length} lecciones nuevas.</p>
                  )}
                </section>
              );
            })}

            {upcoming && save.unlockedEras.includes(upcoming.id) && (
              <div className="era-banner" data-testid="era-banner">
                {upcoming.icon} <strong>Era {upcoming.id} desbloqueada.</strong> {upcoming.name}: sus lecciones llegan pronto.
              </div>
            )}

            {confirmingReset ? (
              <div className="confirm" role="alertdialog" aria-label="Confirmar borrado">
                <p>¿Borrar todo tu progreso? Se perderán XP, NovaCoins y lecciones completadas.</p>
                <div className="row">
                  <button className="btn danger small" onClick={() => { resetProgress(); setConfirmingReset(false); }} data-testid="btn-confirm-reset">
                    Sí, borrar
                  </button>
                  <button className="btn ghost small" onClick={() => setConfirmingReset(false)}>Cancelar</button>
                </div>
              </div>
            ) : (
              <button className="btn ghost small" onClick={() => setConfirmingReset(true)} data-testid="btn-reset-progress">
                Borrar progreso
              </button>
            )}
          </div>
        ))}
      </main>

      <ProtoDock />

      {updateAvailable && (
        <div className="update-banner" role="alert" data-testid="update-banner">
          <span>Hay una nueva versión de CodeNova</span>
          <button className="btn small" onClick={() => window.location.reload()} data-testid="btn-apply-update">
            Actualizar ahora
          </button>
        </div>
      )}

      <footer className="app-footer">
        <span data-testid="app-version">CodeNova v{APP_VERSION}</span>
      </footer>

      <nav className="tabbar" aria-label="Secciones">
        {TABS.map((t) => (
          <button
            key={t.id}
            className={`tab ${tab === t.id ? 'on' : ''}`}
            aria-current={tab === t.id ? 'page' : undefined}
            onClick={() => { setTab(t.id); if (t.id !== 'lecciones') setOpenId(null); }}
            data-testid={`tab-${t.id}`}
          >
            <span aria-hidden>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </nav>
    </div>
  );
}
