import { useEffect, useRef, useState } from 'react';
import { drawProto, type ProtoFrame, type ProtoLook } from '../game/proto';
import { tipFor, useProto } from '../store/proto';
import { useProgress } from '../store/progress';
import { lessonsOfEra } from '../learning/lessons';
import { play } from '../game/sound';

const LOOKS: ProtoLook[] = ['center', 'left', 'right', 'up', 'center'];
const SEEN_KEY = 'codenova:proto-version';
const EVOLVE_MS = 2400;

function readSeen(): number {
  try {
    return Number(localStorage.getItem(SEEN_KEY)) || 1;
  } catch {
    return 1;
  }
}
function writeSeen(v: number) {
  try {
    localStorage.setItem(SEEN_KEY, String(v));
  } catch {
    /* sin almacenamiento: se volverá a mostrar la evolución */
  }
}

/**
 * Proto-0 vive abajo a la derecha: parpadea, mira a su alrededor,
 * reacciona a lo que haces, da consejos y EVOLUCIONA contigo:
 *  - Era 1: empieza oxidado y se repara con cada lección.
 *  - Era 2 (v2): bronce, ojos azules, gemas y laureles que crecen por lección.
 */
export function ProtoDock() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const mood = useProto((s) => s.mood);
  const message = useProto((s) => s.message);
  const messageId = useProto((s) => s.messageId);
  const say = useProto((s) => s.say);
  const save = useProgress((s) => s.save);

  const era = Math.max(...save.unlockedEras.filter((e) => e <= 2));
  const eraLessons = lessonsOfEra(era);
  const progress = eraLessons.length ? eraLessons.filter((l) => save.completedLessons[l.id]).length / eraLessons.length : 0;
  const [evolvingUntil, setEvolvingUntil] = useState(0);

  const live = useRef({ mood, era, progress, evolvingUntil });
  live.current = { mood, era, progress, evolvingUntil };

  // Evolución: si la era es mayor que la última versión que vio la persona.
  useEffect(() => {
    if (era > readSeen()) {
      const until = performance.now() + EVOLVE_MS;
      setEvolvingUntil(until);
      play('evolve');
      say(`¡Evolucioné! Ahora soy Proto-0 v${era}.`, 'surprised', 5000);
      writeSeen(era);
      const t = setTimeout(() => setEvolvingUntil(0), EVOLVE_MS);
      return () => clearTimeout(t);
    }
    if (era < readSeen()) writeSeen(era); // progreso borrado: vuelve a v1
    return undefined;
  }, [era, say]);

  useEffect(() => {
    const ctx = canvas.current!.getContext('2d')!;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const state: ProtoFrame = { mood: 'idle', look: 'center', blinking: false, antennaOn: true, tick: 0, era: 1, progress: 0 };
    let nextBlink = performance.now() + 2500;
    let blinkUntil = 0;
    let nextLook = performance.now() + 1800;
    let last = 0;
    let raf = 0;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 120) return; // ~8 fps: suficiente para pixel art y ahorra batería
      last = now;
      const { mood: m, era: e, progress: p, evolvingUntil: ev } = live.current;
      const evolving = now < ev;
      state.mood = evolving ? 'surprised' : m;
      state.progress = p;
      state.tick++;
      // Durante la evolución alterna destellos y muestra la forma nueva al final.
      state.flash = evolving && !reduced && state.tick % 2 === 0;
      state.era = evolving && now < ev - EVOLVE_MS / 2 && state.tick % 4 < 2 ? Math.max(1, e - 1) : e;

      if (!reduced) {
        if (now > nextBlink) { blinkUntil = now + 140; nextBlink = now + 2500 + Math.random() * 3500; }
        state.blinking = !evolving && now < blinkUntil;
        if (now > nextLook) {
          state.look = LOOKS[Math.floor(Math.random() * LOOKS.length)]!;
          nextLook = now + 1200 + Math.random() * 2500;
        }
        const period = state.mood === 'thinking' ? 2 : 8;
        state.antennaOn = Math.floor(state.tick / period) % 2 === 0;
      }
      drawProto(ctx, state);
      const el = root.current;
      if (el) {
        el.dataset.mood = state.mood;
        el.dataset.look = state.look;
        el.dataset.era = String(e);
        el.dataset.evolving = String(evolving);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  const parts = era === 1
    ? `${Math.round(progress * 100)}% reparado`
    : `${Math.round(progress * 8)} de 8 laureles`;

  return (
    <div className="proto-dock" ref={root} data-testid="proto-dock" data-progress={progress.toFixed(2)}>
      {message && (
        <div className="proto-bubble" key={messageId} role="status" data-testid="proto-bubble">
          {message}
        </div>
      )}
      <button
        type="button"
        className={`proto-bot mood-${mood} ${evolvingUntil ? 'evolving' : ''}`}
        aria-label={`Proto-0 versión ${era}, ${parts}. Tócame para un consejo.`}
        data-testid="proto-bot"
        onClick={() => {
          play('blip');
          say(tipFor(era), 'talking', 5000);
        }}
      >
        <canvas ref={canvas} width={32} height={32} />
        <span className="proto-name">Proto-0 · v{era}</span>
      </button>
    </div>
  );
}
