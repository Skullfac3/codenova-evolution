import { useState } from 'react';
import { era1Lessons } from './learning/lessons/era1';
import { levelForXp, useProgress } from './store/progress';
import { LessonPlayer } from './components/LessonPlayer';

export default function App() {
  const save = useProgress((s) => s.save);
  const isUnlocked = useProgress((s) => s.isLessonUnlocked);
  const resetProgress = useProgress((s) => s.resetProgress);
  const [openId, setOpenId] = useState<string | null>(null);
  const [confirmingReset, setConfirmingReset] = useState(false);
  const lesson = era1Lessons.find((l) => l.id === openId);
  const doneCount = era1Lessons.filter((l) => save.completedLessons[l.id]).length;

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
            onNext={(next) => setOpenId(next)}
          />
        ) : (
          <section className="map" data-testid="map">
            <h1>🪨 Era 1 · Prehistoria</h1>
            <p className="muted">Hola, {save.explorerName}. Progreso: {doneCount} de {era1Lessons.length}</p>
            <div className="bar"><span style={{ width: `${(doneCount / era1Lessons.length) * 100}%` }} /></div>

            {save.unlockedEras.includes(2) && (
              <div className="era-banner" data-testid="era-banner">
                🏛️ <strong>Era 2 desbloqueada.</strong> Las Civilizaciones antiguas llegan pronto.
              </div>
            )}

            <ol className="lessons">
              {era1Lessons.map((l) => {
                const done = Boolean(save.completedLessons[l.id]);
                const open = isUnlocked(l.id);
                const state = done ? 'done' : open ? 'open' : 'locked';
                return (
                  <li key={l.id}>
                    <button className={`lesson-card ${state}`} disabled={!open} onClick={() => setOpenId(l.id)} data-testid={`lesson-${l.id}`} data-state={state}>
                      <span className="num">{done ? '✓' : open ? l.order : '🔒'}</span>
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
          </section>
        )}
      </main>
    </div>
  );
}

