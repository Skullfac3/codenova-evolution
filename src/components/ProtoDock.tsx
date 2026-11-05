import { useEffect, useRef } from 'react';
import { drawProto, type ProtoFrame, type ProtoLook } from '../game/proto';
import { tipFor, useProto } from '../store/proto';
import { useProgress } from '../store/progress';

const LOOKS: ProtoLook[] = ['center', 'left', 'right', 'up', 'center'];

/**
 * Proto-0 vive abajo a la derecha: parpadea, mira a su alrededor,
 * reacciona a lo que haces y da consejos al tocarlo.
 */
export function ProtoDock() {
  const canvas = useRef<HTMLCanvasElement>(null);
  const root = useRef<HTMLDivElement>(null);
  const mood = useProto((s) => s.mood);
  const message = useProto((s) => s.message);
  const messageId = useProto((s) => s.messageId);
  const say = useProto((s) => s.say);
  const era = useProgress((s) => Math.max(...s.save.unlockedEras.filter((e) => e <= 2)));

  const moodRef = useRef(mood);
  moodRef.current = mood;
  const eraRef = useRef(era);
  eraRef.current = era;

  useEffect(() => {
    const ctx = canvas.current!.getContext('2d')!;
    const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const state: ProtoFrame = { mood: 'idle', look: 'center', blinking: false, antennaOn: true, tick: 0, era: 1 };
    let nextBlink = performance.now() + 2500;
    let blinkUntil = 0;
    let nextLook = performance.now() + 1800;
    let last = 0;
    let raf = 0;

    const loop = (now: number) => {
      raf = requestAnimationFrame(loop);
      if (now - last < 120) return; // ~8 fps: suficiente para pixel art y ahorra batería
      last = now;
      state.mood = moodRef.current;
      state.era = eraRef.current;
      state.tick++;

      if (!reduced) {
        if (now > nextBlink) { blinkUntil = now + 140; nextBlink = now + 2500 + Math.random() * 3500; }
        state.blinking = now < blinkUntil;
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
        el.dataset.era = String(state.era);
      }
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="proto-dock" ref={root} data-testid="proto-dock">
      {message && (
        <div className="proto-bubble" key={messageId} role="status" data-testid="proto-bubble">
          {message}
        </div>
      )}
      <button
        type="button"
        className={`proto-bot mood-${mood}`}
        aria-label="Proto-0: tócame para un consejo"
        data-testid="proto-bot"
        onClick={() => say(tipFor(era), 'talking', 5000)}
      >
        <canvas ref={canvas} width={32} height={32} />
        <span className="proto-name">Proto-0 · v{era}</span>
      </button>
    </div>
  );
}
