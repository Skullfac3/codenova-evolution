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
  /** Era cuyo aspecto se dibuja: 1 Explorador gris y oxidado, 2 Guardián de bronce, 3 o más Ingeniero de vapor. */
  era: number;
}

const PAL: Record<string, string> = {
  o: '#0d0812', L: '#e6dcef', M: '#b6a6c8', D: '#7a6790',
  A: '#ff8a3d', a: '#ffd08a', x: '#8a4a26',
  E: '#ff8a3d', e: '#d9682a', Y: '#fff0c2', k: '#1b1325',
  g: '#7bd389', G: '#2a1f35',
  b: '#4aa3d8', B: '#bfe8ff', n: '#c9962e', N: '#ffd97a',
  W: '#f7f2fb', S: '#54446a', F: '#ffb066', // brillo, sombra profunda y resplandor del ojo
  r: '#a8552e', R: '#d07a3e', q: '#6e3520', // óxido (v1)
  v: '#3f8a3a', V: '#8fd66a', // laureles (v2)
};

/**
 * v2 Guardián: el mismo dibujo con otra paleta. Cuerpo de bronce pulido,
 * ojos de lapislázuli y rejilla turquesa, para que el cambio se note de lejos.
 */
const PAL_V2: Record<string, string> = {
  L: '#ffe9a8', M: '#d9a441', D: '#a8742a', S: '#6e4a1a', W: '#fff8dc',
  E: '#4aa3d8', e: '#2f7fb8', F: '#9fd8f0', Y: '#ffffff',
  g: '#5fe0c8', G: '#16323a',
  n: '#fff3b0', N: '#ffffff',
};

/**
 * v3 Ingeniero de vapor: cobre con remaches y pátina verde, ojos verde
 * esmeralda, rejilla ámbar, orejas de engrane, goggles de latón y una
 * chimenea con vapor en lugar de antena.
 */
const PAL_V3: Record<string, string> = {
  L: '#ffc49a', M: '#d9824a', D: '#a8522a', S: '#5e2a14', W: '#ffe6d0',
  E: '#5ff09a', e: '#2aa864', F: '#c8ffd8', Y: '#ffffff',
  g: '#ffbf3d', G: '#2a1a12',
  n: '#c9962e', N: '#ffd97a', h: '#8a6420', // latón
  p: '#4fb0a0', P: '#2f7a70', // pátina
  c: '#9fd8f0', C: '#3e70b6', // cristal de los goggles
  i: '#3e3948', I: '#6e6878', // hierro de la chimenea
  w: '#e6e6ee', Z: '#ffffff', // vapor
};

/** Paleta con la que se dibuja a Proto-0 en una era. */
export const protoPalette = (era: number): Record<string, string> =>
  era >= 3 ? { ...PAL, ...PAL_V3 } : era >= 2 ? { ...PAL, ...PAL_V2 } : PAL;

const N = 32;

export function buildProtoGrid(f: ProtoFrame): string[][] {
  const g: string[][] = Array.from({ length: N }, () => Array<string>(N).fill('.'));
  const put = (x: number, y: number, c: string) => { g[y]![x] = c; };
  const hline = (x0: number, x1: number, y: number, c: string) => { for (let x = x0; x <= x1; x++) put(x, y, c); };
  const rect = (x0: number, y0: number, x1: number, y1: number, c: string) => { for (let y = y0; y <= y1; y++) hline(x0, x1, y, c); };
  const evolved = f.era >= 2;
  const steam = f.era >= 3;

  // Antena (en la Era 2 es una gema azul; en la 3, una chimenea con vapor)
  if (steam) {
    rect(12, 2, 19, 3, 'o'); rect(13, 4, 18, 8, 'o');
    hline(13, 18, 2, 'I'); hline(13, 18, 3, 'i'); put(13, 2, 'W');
    rect(14, 4, 17, 8, 'i'); put(14, 4, 'I'); put(14, 5, 'I'); put(14, 6, 'I');
    hline(14, 17, 6, 'n'); put(14, 6, 'N');
    if (f.antennaOn) {
      const d = f.tick % 2;
      for (const [x, y, c] of [[15, 1, 'w'], [16, 1, 'Z'], [14 + d, 0, 'w'], [17 - d, 0, 'Z'], [18 + d, 1, 'w']] as const) put(x, y, c);
    }
  } else {
  hline(14, 17, 2, 'o'); rect(13, 3, 18, 4, 'o');
  if (f.antennaOn) {
    rect(14, 3, 17, 4, evolved ? 'b' : 'A');
    put(14, 3, evolved ? 'B' : 'a'); put(15, 3, evolved ? 'B' : 'a');
  } else {
    rect(14, 3, 17, 4, evolved ? 'D' : 'x');
  }
  hline(14, 17, 5, 'o');
  for (const y of [6, 7, 8]) { put(14, y, 'o'); put(15, y, 'L'); put(16, y, 'D'); put(17, y, 'o'); }
  }

  // Orejas (de engrane en la Era 3)
  if (steam) for (const cx of [4.5, 26.5]) drawGear(cx, 17.5, f.tick, put);
  else {
  rect(2, 14, 4, 21, 'o'); rect(3, 15, 4, 20, 'M'); for (let y = 15; y < 21; y++) put(4, y, 'D');
  rect(27, 14, 29, 21, 'o'); rect(27, 15, 28, 20, 'M'); for (let y = 15; y < 21; y++) put(28, y, 'D');
  put(3, 15, 'L'); put(27, 15, 'L'); hline(3, 4, 20, 'S'); hline(27, 28, 20, 'S');
  }

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
  if (steam) {
    // goggles de latón subidos a la frente
    hline(6, 25, 11, 'n'); hline(6, 25, 12, 'S');
    for (const cx of [11, 20]) {
      rect(cx - 2, 9, cx + 2, 13, 'o');
      rect(cx - 1, 10, cx + 1, 12, 'C'); put(cx - 1, 10, 'c'); put(cx, 10, 'c'); put(cx - 1, 11, 'c');
      for (const [x, y] of [[cx - 2, 10], [cx + 2, 10], [cx - 2, 12], [cx + 2, 12]] as const) put(x, y, 'N');
      put(cx - 2, 9, '.'); put(cx + 2, 9, '.');
    }
    // remaches en el borde de la cabeza
    for (let x = 8; x <= 23; x += 3) put(x, 26, 'N');
    for (let y = 15; y <= 24; y += 3) { put(7, y, 'N'); put(24, y, 'S'); }
    // pátina verde en las orillas
    for (const [x, y, c] of [[6, 22, 'p'], [6, 23, 'P'], [7, 23, 'p'], [6, 24, 'p'], [7, 25, 'P'], [8, 25, 'p'],
      [25, 13, 'P'], [24, 14, 'p'], [25, 14, 'p'], [23, 25, 'p'], [24, 25, 'P'], [22, 26, 'p']] as const) put(x, y, c);
  } else if (evolved) {
    for (let x = 6; x <= 25; x++) put(x, 10, x % 2 ? 'n' : 'N'); // banda dorada
    put(15, 12, 'b'); put(16, 12, 'b'); put(15, 11, 'B'); put(16, 11, 'b'); // gema en la frente
    // laureles a los lados de la cabeza
    for (const [x, y, c] of [[6, 8, 'v'], [7, 7, 'V'], [8, 8, 'v'], [9, 7, 'V'], [10, 8, 'v'], [5, 7, 'V'], [4, 9, 'v'], [4, 11, 'V'], [3, 12, 'v'],
      [25, 8, 'v'], [24, 7, 'V'], [23, 8, 'v'], [22, 7, 'V'], [21, 8, 'v'], [26, 7, 'V'], [27, 9, 'v'], [27, 11, 'V'], [28, 12, 'v']] as const) put(x, y, c);
  } else {
    // v1: manchas de óxido, una grieta y un remache perdido.
    for (const [x, y, c] of [[7, 20, 'R'], [6, 21, 'r'], [7, 21, 'r'], [8, 21, 'R'], [6, 22, 'r'], [7, 22, 'q'], [8, 22, 'r'], [7, 23, 'r'], [8, 23, 'r'], [6, 24, 'r'], [7, 24, 'R'],
      [21, 11, 'r'], [22, 11, 'R'], [23, 12, 'r'], [22, 12, 'q'], [24, 12, 'r'], [24, 13, 'R'],
      [22, 19, 'R'], [23, 19, 'r'], [23, 20, 'q'], [24, 20, 'r'], [24, 21, 'r'], [22, 25, 'r'], [23, 25, 'R'],
      [14, 19, 'r'], [15, 20, 'R'], [3, 18, 'r'], [3, 19, 'q'], [28, 16, 'r'], [15, 7, 'r']] as const) put(x, y, c);
    for (const [x, y] of [[13, 11], [14, 12], [14, 13], [15, 13], [16, 14], [16, 15]] as const) put(x, y, 'S');
    put(8, 26, 'k');
  }
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

/** Oreja de engrane de la v3, en latón: gira medio diente con cada `tick`. */
function drawGear(cx: number, cy: number, tick: number, put: Put) {
  const rot = (tick % 2) * (Math.PI / 6);
  const filled = new Map<string, string>();
  for (let y = Math.floor(cy - 6); y <= Math.ceil(cy + 6); y++) {
    for (let x = Math.floor(cx - 6); x <= Math.ceil(cx + 6); x++) {
      const dx = x - cx, dy = y - cy;
      const r = Math.hypot(dx, dy);
      const tooth = Math.cos(6 * (Math.atan2(dy, dx) - rot)) > 0.35;
      if (r <= 1.4) filled.set(`${x},${y}`, 'o');
      else if (r <= 3.4 || (r <= 4.9 && tooth)) filled.set(`${x},${y}`, dx + dy < -1.5 ? 'N' : dx + dy > 1.5 ? 'h' : 'n');
    }
  }
  for (const key of filled.keys()) {
    const [x, y] = key.split(',').map(Number) as [number, number];
    for (const [ox, oy] of [[1, 0], [-1, 0], [0, 1], [0, -1]] as const) {
      const k = `${x + ox},${y + oy}`;
      if (!filled.has(k) && x + ox >= 0 && x + ox <= 31) put(x + ox, y + oy, 'o');
    }
  }
  for (const [key, c] of filled) {
    const [x, y] = key.split(',').map(Number) as [number, number];
    if (x >= 0 && x <= 31) put(x, y, c);
  }
}

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
  const pal = protoPalette(f.era);
  for (let y = 0; y < N; y++) {
    for (let x = 0; x < N; x++) {
      const c = g[y]![x]!;
      if (c === '.') continue;
      ctx.fillStyle = pal[c]!;
      ctx.fillRect(x, y, 1, 1);
    }
  }
}

/**
 * Etapas de evolución de Proto-0: su aspecto cambia con la era del
 * estudiante (ver buildProtoGrid y protoPalette). En el refugio se dibuja
 * la etapa de la era que la persona está viendo, así que al volver a la
 * Era 1 Proto-0 recupera su aspecto de entonces.
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
    description: 'Cuerpo gris con óxido y grietas, ojos y antena naranja: el robot con el que empieza la aventura.',
  },
  {
    era: 2,
    name: 'v2 Guardián',
    description: 'Bronce pulido, ojos azules, gema azul en la antena y banda dorada con laureles: evoluciona al completar la Era 1.',
  },
  {
    era: 3,
    name: 'v3 Ingeniero de vapor',
    description: 'Cobre con remaches y pátina, ojos verdes, goggles de latón, orejas de engrane y una chimenea con vapor: evoluciona al completar la Era 2.',
  },
] as const;

export const PROTO_FUTURE_NOTE =
  'Vendrán más evoluciones con las eras 4 y 5, cuando lleguen sus lecciones.';

/** Etapa de Proto-0 para una era: la más alta disponible sin pasarla. */
export function stageForEra(era: number): ProtoStage {
  const stage = [...PROTO_STAGES].reverse().find((s) => s.era <= era);
  return stage ?? PROTO_STAGES[0]!;
}
