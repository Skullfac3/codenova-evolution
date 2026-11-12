import { useEffect, useRef, useState } from 'react';
import { drawProto, stageForEra, type ProtoFrame, type ProtoLook } from '../game/proto';
import { tipFor, useProto } from '../store/proto';
import { useProgress } from '../store/progress';
import { play } from '../game/sound';

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
  // La era más alta desbloqueada, hasta la Era 3 (JavaScript): ahí
  // llegan los consejos de JS. Las eras 4 y 5 aún no tienen contenido.
  const era = useProgress((s) => Math.max(...s.save.unlockedEras.filter((e) => e <= 3)));

  const moodRef = useRef(mood);
  moodRef.current = mood;
  const eraRef = useRef(era);
  eraRef.current = era;
  // Aspecto: el de la era elegida en el refugio (nunca más allá de lo desbloqueado).
  const viewEra = useProto((s) => s.viewEra);
  const setViewEra = useProto((s) => s.setViewEra);
  const stage = stageForEra(Math.min(viewEra ?? era, era));
  /** Era que se dibuja; cambia a mitad del destello de la transformación. */
  const drawnEra = useRef(stage.era);
  const [morphing, setMorphing] = useState(false);
  const justUnlocked = useRef(false);

  // Cuando se desbloquea la Era 2, Proto-0 anuncia su evolución una sola
  // vez. El ref guarda la era anterior: en el primer render es la misma
  // (cargar ya en Era 2, p. ej. como Administrador, no anuncia nada).
  const prevEra = useRef(era);
  useEffect(() => {
    if (era > prevEra.current) setViewEra(null); // una era nueva: Proto-0 muestra su etapa más reciente
    if (prevEra.current === 1 && era === 2) {
      justUnlocked.current = true;
      say('¡Evolucioné! Mira mi gema azul y mi banda dorada.', 'happy', 6000);
    }
    prevEra.current = era;
  }, [era, say, setViewEra]);

  // Cambio de aspecto al cambiar de era: destello, sonido y unas palabras.
  const shownStage = useRef(stage.era);
  useEffect(() => {
    const from = shownStage.current;
    const to = stage.era;
    if (from === to) return;
    shownStage.current = to;
    setMorphing(true);
    play(to > from ? 'evolve' : 'hint');
    if (justUnlocked.current) justUnlocked.current = false;
    else if (to > from) say('¡Forma Guardián! Bronce pulido, ojos azules y laureles.', 'surprised', 4500);
    else say('Así me veía en la Prehistoria: gris, oxidado y con ojos naranjas.', 'surprised', 4500);
    const swap = setTimeout(() => { drawnEra.current = to; }, 280);
    const end = setTimeout(() => setMorphing(false), 900);
    return () => { clearTimeout(swap); clearTimeout(end); drawnEra.current = to; };
  }, [stage.era, say]);

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
      state.era = drawnEra.current;
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
        el.dataset.era = String(eraRef.current);
        el.dataset.stage = String(state.era);
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
        className={`proto-bot mood-${mood}${morphing ? ' morphing' : ''}`}
        aria-label={`Proto-0, ${stage.name}: tócame para un consejo`}
        data-testid="proto-bot"
        onClick={() => { play('blip'); say(tipFor(era), 'talking', 5000); }}
      >
        <canvas ref={canvas} width={32} height={32} />
        <span className="proto-name">Proto-0 · {stage.name}</span>
      </button>
    </div>
  );
}
