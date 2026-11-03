import { useState } from 'react';
import { ERAS, findLesson } from './learning/lessons';
import { levelForXp, useProgress } from './store/progress';
import { LessonPlayer } from './components/LessonPlayer';

export default function App() {
  const save = useProgress((s) => s.save);
  const isUnlocked = useProgress((s) => s.isLessonUnlocked);
  const isEraComplete = useProgress((s) => s.isEraComplete);
  const resetProgress = useProgress((s) => s.resetProgress);
  const [openId, setOpenId] = useState<string | null>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const lesson = openId ? findLesson(openId) : undefined;

  // Muestra las eras con contenido y, como anuncio, la siguiente sin contenido.
  const published = ERAS.filter((e) => e.lessons.length > 0);
  const upcoming = ERAS.find((e) => e.lessons.length === 0);

  return (
    <div className="app">
      <header className="hud">
        <span className="brand">CodeNova</span>
        <span data-testid="hud-level">Nv {levelForXp(save.xp)}</span>
        <span data-testid="hud-xp">{save.xp} XP</span>
        <span data-testid="hud-coins">🪙 {save.novacoins}</span>
      </header>

      <main>
        {lesson ? (
          <LessonPlayer
            key={lesson.id}
            lesson={lesson}
            onExit={() => setOpenId(null)}
            onNext={(next) => setOpenId(next && isUnlocked(next) ? next : null)}
          />
        ) : (
          <div className="map" data-testid="map">
            <p className="muted greeting">Hola, {save.explorerName}.</p>

            {published.map((era) => {
              const unlocked = save.unlockedEras.includes(era.id);
              const done = era.lessons.filter((l) => save.completedLessons[l.id]).length;
              return (
                <section key={era.id} className={`era ${unlocked ? '' : 'era-locked'}`} data-testid={`era-${era.id}`} data-state={unlocked ? (isEraComplete(era.id) ? 'done' : 'open') : 'locked'}>
                  <h1>{era.icon} Era {era.id} · {era.name}</h1>
                  {unlocked ? (
                    <>
                      <p className="muted">Progreso: {done} de {era.lessons.length}</p>
                      <div className="bar"><span style={{ width: `${(done / era.lessons.length) * 100}%` }} /></div>
                      <ol className="lessons">
                        {era.lessons.map((l) => {
                          const isDone = Boolean(save.completedLessons[l.id]);
                          const open = isUnlocked(l.id);
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
        )}
      </main>
    </div>
  );
}
