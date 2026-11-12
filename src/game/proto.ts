/**
 * Proto-0 en pixel art (32x32), con expresiones. Original de CodeNova.
 * Misma base que scripts/make_icons.py.
 */
export type ProtoMood = 'idle' | 'happy' | 'sad' | 'thinking' | 'surprised' | 'talking';
export type ProtoLook = 'center' | 'left' | 'right' | 'up';

export interface ProtoFrame {
  mood: ProtoMood;
  look: ProtoLook;
  blinking: boolean;
  antennaOn: boolean;
  /** Alterna para la boca al hablar y el escáner al pensar. */
  tick: number;
  /** Era actual: Proto-0 evoluciona con el estudiante. */
  era: number;
}

const PAL: Record<string, string> = {
  o: '#0d0812', L: '#e6dcef', M: '#b6a6c8', D: '#7a6790',
  A: '#ff8a3d', a: '#ffd08a', x: '#8a4a26',
  E: '#ff8a3d', e: '#d9682a', Y: '#fff0c2', k: '#1b1325',
  g: '#7bd389', G: '#2a1f35',
  b: '#4aa3d8', B: '#bfe8ff', n: '#c9962e', N: '#ffd97a',
  W: '#f7f2fb', S: '#54446a', F: '#ffb066', // brillo, sombra profunda y resplandor del ojo
};

const N = 32;

export function buildProtoGrid(f: ProtoFrame): string[][] {
  const g: string[][] = Array.from({ length: N }, () => Array<string>(N).fill('.'));
  const put = (x: number, y: number, c: string) => { g[y]![x] = c; };
  const hline = (x0: number, x1: number, y: number, c: string) => { for (let x = x0; x <= x1; x++) put(x, y, c); };
  const rect = (x0: number, y0: number, x1: number, y1: number, c: string) => { for (let y = y0; y <= y1; y++) hline(x0, x1, y, c); };
  const evolved = f.era >= 2;

  // Antena (en la Era 2 es una gema azul)
  hline(14, 17, 2, 'o'); rect(13, 3, 18, 4, 'o');
  if (f.antennaOn) {
    rect(14, 3, 17, 4, evolved ? 'b' : 'A');
    put(14, 3, evolved ? 'B' : 'a'); put(15, 3, evolved ? 'B' : 'a');
  } else {
    rect(14, 3, 17, 4, evolved ? 'D' : 'x');
  }
  hline(14, 17, 5, 'o');
  for (const y of [6, 7, 8]) { put(14, y, 'o'); put(15, y, 'L'); put(16, y, 'D'); put(17, y, 'o'); }

  // Orejas
  rect(2, 14, 4, 21, 'o'); rect(3, 15, 4, 20, 'M'); for (let y = 15; y < 21; y++) put(4, y, 'D');
  rect(27, 14, 29, 21, 'o'); rect(27, 15, 28, 20, 'M'); for (let y = 15; y < 21; y++) put(28, y, 'D');
  put(3, 15, 'L'); put(27, 15, 'L'); hline(3, 4, 20, 'S'); hline(27, 28, 20, 'S');

  // Cabeza
  rect(5, 9, 26, 28, 'o');
  rect(6, 10, 25, 27, 'M');
  hline(6, 24, 10, 'L');
  for (let y = 10; y < 27; y++) { put(6, y, 'L'); put(25, y, 'D'); }
  hline(6, 25, 27, 'D');
  // Volumen: sombra interior en dos tonos, brillo especular y esquinas redondeadas.
  for (let y = 12; y < 27; y++) put(24, y, 'D');
  hline(8, 24, 26, 'D');
  for (let x = 8; x <= 23; x += 2) put(x, 25, 'D');
  for (let y = 11; y < 28; y++) put(25, y, 'S');
  hline(7, 25, 27, 'S');
  hline(10, 14, 11, 'W'); put(16, 11, 'W'); put(7, 12, 'W'); put(7, 13, 'W');
  for (const [x, y] of [[8, 11], [23, 11], [8, 26], [23, 26]] as const) put(x, y, 'S');
  for (const [x, y] of [[5, 9], [26, 9], [5, 28], [26, 28]] as const) put(x, y, '.');
  if (evolved) for (let x = 6; x <= 25; x++) put(x, 10, x % 2 ? 'n' : 'N'); // banda dorada
  for (const [x, y] of [[6, 10], [25, 10], [6, 27], [25, 27]] as const) put(x, y, 'o');

  // Ojos
  for (const ex of [8, 18]) drawEye(ex, f, put, rect, hline);

  // Boca
  drawMouth(f, put, rect, hline);

  // Cuello
  rect(11, 29, 20, 30, 'o'); rect(12, 29, 19, 30, 'D'); hline(12, 19, 30, 'S'); put(12, 29, 'M');
  return g;
}

type Put = (x: number, y: number, c: string) => void;
type Rect = (x0: number, y0: number, x1: number, y1: number, c: string) => void;
type HLine = (x0: number, x1: number, y: number, c: string) => void;

function drawEye(ex: number, f: ProtoFrame, put: Put, rect: Rect, hline: HLine) {
  if (f.blinking && f.mood !== 'happy') {
    rect(ex, 13, ex + 5, 18, 'o');
    rect(ex + 1, 14, ex + 4, 17, 'D');
    hline(ex + 1, ex + 4, 16, 'k');
    return;
  }
  switch (f.mood) {
    case 'happy': {
      // Ojos en forma de ^ ^
      rect(ex, 13, ex + 5, 18, 'M');
      put(ex + 1, 16, 'E'); put(ex + 2, 15, 'E'); put(ex + 3, 15, 'E'); put(ex + 4, 16, 'E');
      put(ex, 17, 'E'); put(ex + 5, 17, 'E');
      put(ex + 1, 17, 'e'); put(ex + 4, 17, 'e');
      return;
    }
    case 'sad': {
      rect(ex, 13, ex + 5, 18, 'o');
      rect(ex + 1, 14, ex + 4, 15, 'D'); // párpado caído
      rect(ex + 1, 16, ex + 4, 17, 'E');
      hline(ex + 2, ex + 3, 17, 'k');
      // ceja inclinada
      if (ex === 8) { put(ex + 1, 12, 'o'); put(ex + 2, 12, 'o'); put(ex + 3, 11, 'o'); }
      else { put(ex + 2, 11, 'o'); put(ex + 3, 12, 'o'); put(ex + 4, 12, 'o'); }
      return;
    }
    case 'surprised': {
      rect(ex - 1, 12, ex + 6, 19, 'o');
      rect(ex, 13, ex + 5, 18, 'E');
      hline(ex, ex + 5, 18, 'e');
      rect(ex + 2, 15, ex + 3, 16, 'k');
      put(ex, 13, 'Y'); put(ex + 1, 13, 'Y');
      return;
    }
    default: {
      rect(ex, 13, ex + 5, 18, 'o');
      rect(ex + 1, 14, ex + 4, 17, 'E');
      hline(ex + 1, ex + 4, 17, 'e');
      hline(ex + 1, ex + 4, 14, 'F');
      const look = f.mood === 'thinking' ? 'up' : f.look;
      const px = look === 'left' ? ex + 1 : look === 'right' ? ex + 3 : ex + 2;
      const py = look === 'up' ? 14 : 15;
      rect(px, py, px + 1, py + 1, 'k');
      put(ex + 4 === px + 1 && py === 14 ? ex + 1 : ex + 4, 14, 'Y');
    }
  }
}

function drawMouth(f: ProtoFrame, put: Put, rect: Rect, hline: HLine) {
  if (f.mood === 'surprised') {
    rect(13, 21, 18, 25, 'o');
    rect(14, 22, 17, 24, 'k');
    return;
  }
  rect(10, 21, 21, 24, 'o');
  for (const y of [22, 23]) {
    for (let x = 11; x <= 20; x++) {
      let c: string;
      switch (f.mood) {
        case 'happy': c = 'g'; break;
        case 'sad': c = y === 23 && (x === 11 || x === 20) ? 'g' : 'G'; break;
        case 'thinking': c = x === 11 + (f.tick % 10) ? 'g' : 'G'; break; // escáner
        case 'talking': c = f.tick % 2 === 0 ? ((x + y) % 2 === 0 ? 'g' : 'G') : (x >= 13 && x <= 18 ? 'g' : 'G'); break;
        default: c = (x + y) % 2 === 0 ? 'g' : 'G';
      }
      put(x, y, c);
    }
  }
  if (f.mood === 'happy') { put(10, 21, 'M'); put(21, 21, 'M'); hline(10, 21, 25, 'M'); }
}

/** Dibuja a Proto-0 en un canvas de 32x32 (se escala con CSS, sin suavizado). */
export function drawProto(ctx: CanvasRenderingContext2D, f: ProtoFrame): void {
  ctx.clearRect(0, 0, N, N);
  const g = buildProtoGrid(f);
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const c = g[y]![x]!;
      if (c === '.') continue;
      ctx.fillStyle = PAL[c]!;
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

/**
 * Etapas de evolución de Proto-0: su aspecto cambia con la era del
 * estudiante (ver buildProtoGrid: era >= 2 cambia la antena y la banda).
 * Las eras 3-5 aún no tienen lecciones, así que tampoco tienen etapa.
 */
export interface ProtoStage {
  /** Era en la que se desbloquea esta etapa. */
  era: number;
  /** Nombre que se muestra, p. ej. "v1 Explorador". */
  name: string;
  /** Qué cambia en su aspecto al llegar a esta etapa. */
  description: string;
}

export const PROTO_STAGES: readonly ProtoStage[] = [
  {
    era: 1,
    name: 'v1 Explorador',
    description: 'Antena naranja y cuerpo gris: el robot con el que empieza la aventura.',
  },
  {
    era: 2,
    name: 'v2 Guardián',
    description: 'Gema azul en la antena y banda dorada en la frente: evoluciona al completar la Era 1.',
  },
] as const;

export const PROTO_FUTURE_NOTE =
  'Vendrán más evoluciones con las eras 3, 4 y 5, cuando lleguen sus lecciones.';

/** Etapa de Proto-0 para una era: la más alta disponible sin pasarla. */
export function stageForEra(era: number): ProtoStage {
  const stage = [...PROTO_STAGES].reverse().find((s) => s.era <= era);
  return stage ?? PROTO_STAGES[0]!;
}
