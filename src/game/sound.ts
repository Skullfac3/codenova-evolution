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

export const SOUNDS: Record<SoundName, Note[]> = {
  success: [[N.C5, 0, 0.07], [N.E5, 0.07, 0.07], [N.G5, 0.14, 0.07], [N.C6, 0.21, 0.2]],
  error: [[N.G3, 0, 0.11, 'square', 0.1], [N.C4 * 0.75, 0.12, 0.26, 'square', 0.1, N.G3 * 0.5]],
  hint: [[N.A5, 0, 0.06, 'triangle', 0.14], [N.D6, 0.07, 0.12, 'triangle', 0.14]],
  alert: [[N.B5, 0, 0.08, 'square', 0.08], [N.B5, 0.14, 0.08, 'square', 0.08], [N.E5, 0.28, 0.14, 'square', 0.08]],
  coin: [[N.C6, 0, 0.06], [N.G6, 0.06, 0.18]],
  place: [[N.E4, 0, 0.07, 'triangle', 0.16, N.C5]],
  remove: [[N.C5, 0, 0.07, 'triangle', 0.16, N.E4]],
  levelup: [
    [N.G4, 0, 0.06], [N.C5, 0.06, 0.06], [N.E5, 0.12, 0.06], [N.G5, 0.18, 0.06],
    [N.C6, 0.24, 0.12], [N.G5, 0.36, 0.06], [N.C6, 0.42, 0.3],
    [N.C4, 0.42, 0.3, 'triangle', 0.12],
  ],
  evolve: [
    [N.C4, 0, 0.6, 'square', 0.06, N.C6],
    [N.C5, 0.62, 0.07], [N.E5, 0.69, 0.07], [N.G5, 0.76, 0.07], [N.C6, 0.83, 0.07],
    [N.E6, 0.9, 0.07], [N.G6, 0.97, 0.35],
    [N.C4, 0.97, 0.35, 'triangle', 0.12],
  ],
  blip: [[N.A5, 0, 0.05, 'square', 0.07]],
  tick: [[N.E6, 0, 0.02, 'square', 0.035]],
};

/**
 * Ganancia general. Las notas están escritas con volúmenes bajos (0.035 a 0.16)
 * para que la mezcla de varias a la vez no sature; este factor las lleva a un
 * nivel que se oye bien en la bocina de un teléfono (picos cerca de 0.5).
 */
export const MASTER_GAIN = 3.2;

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

type AudioSessionNavigator = Navigator & { audioSession?: { type: string } };

function audio(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctor = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!Ctor) return null;
  if (!ctx) {
    // iPhone: por defecto Web Audio se calla con el interruptor de silencio.
    // 'playback' hace que suene como cualquier video o juego (Safari 16.4+).
    try {
      const nav = navigator as AudioSessionNavigator;
      if (nav.audioSession) nav.audioSession.type = 'playback';
    } catch {
      /* navegador sin audioSession */
    }
    ctx = new Ctor();
  }
  return ctx;
}

/** Programa las notas de un sonido en cualquier contexto de audio (también uno sin conexión, en las pruebas). */
export function scheduleSound(ac: BaseAudioContext, destination: AudioNode, name: SoundName, t0: number): void {
  const master = ac.createGain();
  master.gain.value = MASTER_GAIN;
  master.connect(destination);
  for (const [freq, start, dur, wave = 'square', vol = 0.1, slideTo] of SOUNDS[name]) {
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

/** Registro para las pruebas automáticas (no afecta a la app). */
declare global {
  interface Window { __codenovaSounds?: SoundName[] }
}

export function play(name: SoundName): void {
  if (muted) return;
  window.__codenovaSounds?.push(name);
  const ac = audio();
  if (!ac) return;
  const go = () => scheduleSound(ac, ac.destination, name, ac.currentTime + 0.01);
  if (ac.state === 'running') return go();
  // Suspendido (aún sin desbloquear) o "interrumpido" (iOS tras una llamada o
  // al volver de segundo plano): reanudar y tocar en cuanto esté listo, en vez
  // de programar notas sobre un reloj detenido.
  ac.resume().then(go, () => undefined);
}

/** WAV de 50 ms en silencio, para el truco del elemento <audio> en iOS. */
function silentWavUrl(): string {
  const rate = 8000;
  const samples = 400;
  const buf = new ArrayBuffer(44 + samples);
  const v = new DataView(buf);
  const str = (o: number, t: string) => [...t].forEach((c, i) => v.setUint8(o + i, c.charCodeAt(0)));
  str(0, 'RIFF'); v.setUint32(4, 36 + samples, true); str(8, 'WAVE'); str(12, 'fmt ');
  v.setUint32(16, 16, true); v.setUint16(20, 1, true); v.setUint16(22, 1, true);
  v.setUint32(24, rate, true); v.setUint32(28, rate, true); v.setUint16(32, 1, true); v.setUint16(34, 8, true);
  str(36, 'data'); v.setUint32(40, samples, true);
  for (let i = 0; i < samples; i++) v.setUint8(44 + i, 128);
  return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
}

/**
 * Los navegadores de teléfono solo permiten audio después de que la persona
 * toca la pantalla. En cada toque se intenta desbloquear hasta que el contexto
 * queda en marcha (antes se rendía tras el primer intento, y si ese fallaba la
 * app quedaba muda toda la sesión). En iPhones anteriores a Safari 16.4, un
 * <audio> en silencio pasa el sonido a la categoría "multimedia", que no se
 * calla con el interruptor de silencio.
 */
export function unlockAudioOnFirstTouch(): void {
  let silentEl: HTMLAudioElement | null = null;
  const events = ['pointerdown', 'touchend', 'click', 'keydown'] as const;
  const unlock = () => {
    const ac = audio();
    if (!ac) return;
    if (!(navigator as AudioSessionNavigator).audioSession) {
      try {
        silentEl ??= Object.assign(new Audio(silentWavUrl()), { loop: false, volume: 0 });
        silentEl.setAttribute('playsinline', '');
        void silentEl.play().catch(() => undefined);
      } catch {
        /* sin elemento <audio> */
      }
    }
    // Un sonido vacío dentro del toque desbloquea el contexto.
    const src = ac.createBufferSource();
    src.buffer = ac.createBuffer(1, 1, 22050);
    src.connect(ac.destination);
    src.start(0);
    void ac.resume().then(() => {
      if (ac.state === 'running') events.forEach((e) => window.removeEventListener(e, unlock, true));
    }, () => undefined);
  };
  events.forEach((e) => window.addEventListener(e, unlock, true));
  // iOS detiene el audio al pasar a segundo plano: al volver, se vuelve a escuchar el próximo toque.
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible' && ctx && ctx.state !== 'running') {
      events.forEach((e) => window.addEventListener(e, unlock, true));
    }
  });
}
