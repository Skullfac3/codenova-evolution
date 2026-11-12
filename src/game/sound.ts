/**
 * Sonidos estilo 8 bits generados con Web Audio (ondas cuadradas y
 * triangulares, como los chips de sonido de consolas clásicas).
 * Todas las melodías son originales de CodeNova: no se usan archivos de audio.
 */
export type SoundName =
  | 'success' // código aprobado
  | 'error' // código con error o que no pasa
  | 'hint' // pista de Proto-0
  | 'alert' // aviso (evaluación reprobada, sin monedas…)
  | 'coin' // compra
  | 'place' // colocar adorno
  | 'remove' // quitar adorno
  | 'levelup' // lección completada
  | 'evolve' // nueva era / evolución de Proto-0
  | 'blip' // tocar a Proto-0
  | 'tick'; // atajo insertado

type Wave = 'square' | 'triangle' | 'sawtooth';
/** [frecuencia Hz, inicio s, duración s, onda, volumen, frecuencia final (deslizamiento)] */
type Note = [number, number, number, Wave?, number?, number?];

const N = {
  G3: 196, B3: 247, C4: 262, E4: 330, G4: 392, A4: 440, C5: 523, D5: 587, E5: 659, F5: 698,
  G5: 784, A5: 880, B5: 988, C6: 1047, D6: 1175, E6: 1319, G6: 1568,
};

const SOUNDS: Record<SoundName, Note[]> = {
  success: [[N.C5, 0, 0.07], [N.E5, 0.07, 0.07], [N.G5, 0.14, 0.07], [N.C6, 0.21, 0.2]],
  error: [[N.G3, 0, 0.11, 'square', 0.07], [N.C4 * 0.75, 0.12, 0.26, 'square', 0.07, N.G3 * 0.5]],
  hint: [[N.A5, 0, 0.06, 'triangle', 0.14], [N.D6, 0.07, 0.12, 'triangle', 0.14]],
  alert: [[N.B5, 0, 0.08, 'square', 0.05], [N.B5, 0.14, 0.08, 'square', 0.05], [N.E5, 0.28, 0.14, 'square', 0.05]],
  coin: [[N.C6, 0, 0.06], [N.G6, 0.06, 0.18]],
  place: [[N.E4, 0, 0.07, 'triangle', 0.16, N.C5]],
  remove: [[N.C5, 0, 0.07, 'triangle', 0.16, N.E4]],
  levelup: [
    [N.G4, 0, 0.06], [N.C5, 0.06, 0.06], [N.E5, 0.12, 0.06], [N.G5, 0.18, 0.06],
    [N.C6, 0.24, 0.12], [N.G5, 0.36, 0.06], [N.C6, 0.42, 0.3],
    [N.C4, 0.42, 0.3, 'triangle', 0.12],
  ],
  evolve: [
    [N.C4, 0, 0.6, 'square', 0.04, N.C6],
    [N.C5, 0.62, 0.07], [N.E5, 0.69, 0.07], [N.G5, 0.76, 0.07], [N.C6, 0.83, 0.07],
    [N.E6, 0.9, 0.07], [N.G6, 0.97, 0.35],
    [N.C4, 0.97, 0.35, 'triangle', 0.12],
  ],
  blip: [[N.A5, 0, 0.04, 'square', 0.04]],
  tick: [[N.E6, 0, 0.018, 'square', 0.025]],
};

const MUTE_KEY = 'codenova:muted';
let ctx: AudioContext | null = null;
let muted = readMuted();

function readMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === '1';
  } catch {
    return false;
  }
}

export const isMuted = () => muted;

export function setMuted(value: boolean): void {
  muted = value;
  try {
    localStorage.setItem(MUTE_KEY, value ? '1' : '0');
  } catch {
    /* sin almacenamiento: solo dura esta sesión */
  }
}

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  ctx ??= new Ctor();
  if (ctx.state === 'suspended') void ctx.resume().catch(() => undefined);
  return ctx;
}

/** Registro para las pruebas automáticas (no afecta a la app). */
declare global {
  interface Window { __codenovaSounds?: SoundName[] }
}

export function play(name: SoundName): void {
  if (muted) return;
  window.__codenovaSounds?.push(name);
  const ac = audio();
  if (!ac) return;
  const t0 = ac.currentTime + 0.01;
  const master = ac.createGain();
  master.gain.value = 0.9;
  master.connect(ac.destination);

  for (const [freq, start, dur, wave = 'square', vol = 0.06, slideTo] of SOUNDS[name]) {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    osc.type = wave;
    osc.frequency.setValueAtTime(freq, t0 + start);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + start + dur);
    // Envolvente corta: ataque rápido y caída, sin chasquidos.
    gain.gain.setValueAtTime(0.0001, t0 + start);
    gain.gain.exponentialRampToValueAtTime(vol, t0 + start + 0.008);
    gain.gain.setValueAtTime(vol, t0 + start + dur * 0.7);
    gain.gain.exponentialRampToValueAtTime(0.0001, t0 + start + dur);
    osc.connect(gain).connect(master);
    osc.start(t0 + start);
    osc.stop(t0 + start + dur + 0.02);
  }
}

/**
 * iOS solo permite audio después de que la persona toca la pantalla:
 * el primer toque "desbloquea" el sonido.
 */
export function unlockAudioOnFirstTouch(): void {
  const unlock = () => {
    const ac = audio();
    if (ac) {
      // Un sonido vacío desbloquea el audio en iOS.
      const buffer = ac.createBuffer(1, 1, 22050);
      const src = ac.createBufferSource();
      src.buffer = buffer;
      src.connect(ac.destination);
      src.start(0);
    }
    window.removeEventListener('pointerdown', unlock);
    window.removeEventListener('keydown', unlock);
  };
  window.addEventListener('pointerdown', unlock);
  window.addEventListener('keydown', unlock);
}
