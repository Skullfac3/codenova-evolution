/**
 * Sprites del refugio: pixel art original de CodeNova, 16x16, definidos como
 * cuadrículas de caracteres. Cada carácter es un color de PALETTE; '.' es transparente.
 */
export const PALETTE: Record<string, string> = {
  k: '#1a1020', // contorno
  g: '#5a8f4e', G: '#7bb062', h: '#3f6b3a', // pasto
  d: '#9c6b43', D: '#7a5033', // tierra
  s: '#9a93a3', S: '#c4bfcc', t: '#6e6878', // piedra
  w: '#8a5a34', W: '#b07a48', // madera
  f: '#ff8a3d', y: '#ffd166', r: '#e0533d', // fuego
  m: '#6fae4f', l: '#2f6b33', L: '#a6e07f', // musgo y hojas
  c: '#c06a3e', C: '#e08f5a', // barro
  b: '#4aa3d8', B: '#9fd8f0', // agua
  p: '#f0c08a', P: '#d49a68', q: '#3a2a22', // piel y cabello
  T: '#3d6fb5', U: '#2c5287', // túnica (se recolorea con el atuendo)
  x: '#8f8a9a', X: '#c9c4d4', // dodo
  v: '#8cc63f', V: '#5a8a2a', // lagartija
  n: '#8b6a4a', N: '#d2b48c', // búho
  a: '#2b2433', A: '#e0b84a', // gato
  z: '#ffffff', e: '#fff3b0',
};

export type SpriteKey = keyof typeof RAW;

const RAW = {
  fogata1: [
    '................',
    '................',
    '................',
    '.......f........',
    '......ff.f......',
    '......fyff......',
    '.....ffyyf......',
    '.....fyyyff.....',
    '....ffyyyyf.....',
    '....fyyeyyff....',
    '.....ffyyff.....',
    '...wWw..wWw.....',
    '..ttwWwwwWtt....',
    '.tsstwwwwtsst...',
    '..tt......tt....',
    '................',
  ],
  fogata2: [
    '................',
    '................',
    '................',
    '........f.......',
    '.....f.ff.......',
    '......ffyf......',
    '......fyyff.....',
    '.....ffyyyf.....',
    '.....fyyyyff....',
    '....ffyyeyyf....',
    '.....fyyyff.....',
    '...wWw..wWw.....',
    '..ttwWwwwWtt....',
    '.tsstwwwwtsst...',
    '..tt......tt....',
    '................',
  ],
  roca: [
    '................',
    '................',
    '................',
    '................',
    '................',
    '......kkkk......',
    '....kkmmmmkk....',
    '...kmmLmmmsSk...',
    '..ksmmmmsssSSk..',
    '..kssmsssssSSk..',
    '.ksssssssssSsk..',
    '.kttsssssssssk..',
    '.kttttssssssstk.',
    '..kkttttttttkk..',
    '....kkkkkkkk....',
    '................',
  ],
  helecho: [
    '................',
    '.......L........',
    '...L...L...L....',
    '....L..L..L.....',
    '..LL.L.L.L.LL...',
    '....LlLlLlL.....',
    '.L...LlLlL...L..',
    '..LL.LlLlL.LL...',
    '....LLlLlLL.....',
    '..LLL.LlL.LLL...',
    '.....LLlLL......',
    '......LlL.......',
    '.......L........',
    '......hhh.......',
    '................',
    '................',
  ],
  columna: [
    '...kkkkkkkkkk...',
    '...kSSSSSSSSk...',
    '....kttttttk....',
    '.....kSsStk.....',
    '.....kSsStk.....',
    '.....kSsStk.....',
    '.....kSsStk.....',
    '.....kSsStk.....',
    '.....kSsStk.....',
    '.....kSsStk.....',
    '.....kSsStk.....',
    '.....kSsStk.....',
    '....kttttttk....',
    '...kSSSSSSSSk...',
    '...kttttttttk...',
    '...kkkkkkkkkk...',
  ],
  anfora: [
    '................',
    '.....kkkkkk.....',
    '.....kCcccck....',
    '......kCck......',
    '......kCck......',
    '....kkCcccckk...',
    '...kCCcccccccck.',
    '..kCCcyyyyyyyck.',
    '..kCcckkckkcccck',
    '..kCcccccccccck.',
    '..kCcyyyyyyyyck.',
    '...kCcccccccck..',
    '....kCcccccck...',
    '.....kcccccck...',
    '......kkkkkk....',
    '................',
  ],
  fuente: [
    '.......B........',
    '......BbB.......',
    '.....B.b.B......',
    '.......b........',
    '.....kssSk......',
    '......ksk.......',
    '......ksk.......',
    '..kkkkkkkkkkkk..',
    '.kSSSSSSSSSSSSk.',
    '.ksBBbBBbBBBbsk.',
    '.ksbbbBbbbBbbsk.',
    '.ktsssssssssstk.',
    '..kttttttttttk..',
    '...kkkkkkkkkk...',
    '................',
    '................',
  ],
  dodo: [
    '................',
    '................',
    '................',
    '................',
    '.......kkk......',
    '......kXXXk.....',
    '......kXzkXk....',
    '......kXXXXkyyk.',
    '.......kXXkyyk..',
    '.....kkxXXxkk...',
    '....kxxxXXxxk...',
    '...kxxxxxxxxk...',
    '....kxxxxxxk....',
    '.....kkkkkk.....',
    '......y...y.....',
    '.....yy..yy.....',
  ],
  lagartija: [
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '................',
    '...........kk...',
    '..........kvvk..',
    '...kkkkkkkvzvvk.',
    '.kkvvVvVvVvvvk..',
    'kvvVvVvVvVvkk...',
    '.kk.kvk..kvk....',
    '....kk....kk....',
    '................',
    '................',
  ],
  buho: [
    '................',
    '................',
    '....k......k....',
    '....knk..knk....',
    '....knnkknnk....',
    '...knzzNNzznk...',
    '...knzkNNkznk...',
    '...knnNyyNnnk...',
    '...knNNyNNNnk...',
    '...knNnNnNNnk...',
    '...knNNnNnNnk...',
    '....knNNNNnk....',
    '.....knnnnk.....',
    '.....yk..ky.....',
    '................',
    '................',
  ],
  gato: [
    '................',
    '................',
    '................',
    '................',
    '.....k...k......',
    '....kak.kak.....',
    '....kaaaaak.....',
    '....kyaaaya.k...',
    '....kaaaaak.ak..',
    '.....kAAAk..ak..',
    '....kaaaaak.ak..',
    '....kaaaaaakak..',
    '....kaaaaaaak...',
    '....kk.kk.kk....',
    '................',
    '................',
  ],
  explorador1: [
    '................',
    '......kkkk......',
    '.....kqqqqk.....',
    '....kqqqqqqk....',
    '....kqppppqk....',
    '....kpkppkpk....',
    '....kppppppk....',
    '.....kpPPpk.....',
    '....kTTTTTTk....',
    '...kpTTTTTTpk...',
    '...kpkTTTTkpk...',
    '....kTTUUTTk....',
    '....kUUkkUUk....',
    '.....kPk.kPk....',
    '.....kk...kk....',
    '................',
  ],
  explorador2: [
    '................',
    '......kkkk......',
    '.....kqqqqk.....',
    '....kqqqqqqk....',
    '....kqppppqk....',
    '....kpkppkpk....',
    '....kppppppk....',
    '.....kpPPpk.....',
    '....kTTTTTTk....',
    '...kpTTTTTTpk...',
    '...kpkTTTTkpk...',
    '....kTTUUTTk....',
    '....kUUkkUUk....',
    '....kPk...kPk...',
    '....kk.....kk...',
    '................',
  ],
} satisfies Record<string, string[]>;

export const SPRITE_KEYS = Object.keys(RAW) as SpriteKey[];
export const spriteRows = (key: SpriteKey): string[] => RAW[key];

/** Colores de la túnica según el atuendo equipado. */
export const OUTFIT_COLORS: Record<string, { T: string; U: string }> = {
  'outfit-piel': { T: '#9a6a3a', U: '#6e4824' },
  'outfit-toga': { T: '#f2ece0', U: '#c9bfae' },
};

const cache = new Map<string, HTMLCanvasElement>();

/** Sprite ya dibujado en un canvas de 16x16 (en caché). */
export function spriteCanvas(key: SpriteKey, overrides: Record<string, string> = {}): HTMLCanvasElement {
  const cacheKey = key + JSON.stringify(overrides);
  const hit = cache.get(cacheKey);
  if (hit) return hit;
  const rows = RAW[key];
  const cv = document.createElement('canvas');
  cv.width = 16;
  cv.height = rows.length;
  const ctx = cv.getContext('2d')!;
  rows.forEach((row, y) => {
    for (let x = 0; x < 16; x++) {
      const ch = row[x] ?? '.';
      if (ch === '.') continue;
      ctx.fillStyle = overrides[ch] ?? PALETTE[ch]!;
      ctx.fillRect(x, y, 1, 1);
    }
  });
  cache.set(cacheKey, cv);
  return cv;
}

// ── Terreno y edificios (procedurales) ──

function speckle(ctx: CanvasRenderingContext2D, x: number, y: number, base: string, specks: string[], rand: () => number, n = 7) {
  ctx.fillStyle = base;
  ctx.fillRect(x, y, 16, 16);
  for (let i = 0; i < n; i++) {
    ctx.fillStyle = specks[i % specks.length]!;
    ctx.fillRect(x + Math.floor(rand() * 15), y + Math.floor(rand() * 15), 1 + (i % 2), 1);
  }
}

export type TileKind = 'pasto' | 'tierra' | 'losa';

export function drawTile(ctx: CanvasRenderingContext2D, kind: TileKind, x: number, y: number, rand: () => number) {
  if (kind === 'pasto') speckle(ctx, x, y, PALETTE.g!, [PALETTE.G!, PALETTE.h!], rand);
  else if (kind === 'tierra') speckle(ctx, x, y, PALETTE.d!, [PALETTE.D!, '#b07c52'], rand, 5);
  else {
    ctx.fillStyle = PALETTE.S!;
    ctx.fillRect(x, y, 16, 16);
    ctx.fillStyle = PALETTE.s!;
    ctx.fillRect(x + 1, y + 1, 14, 6);
    ctx.fillRect(x + 1, y + 9, 6, 6);
    ctx.fillRect(x + 9, y + 9, 6, 6);
    ctx.fillStyle = PALETTE.t!;
    ctx.fillRect(x, y + 7, 16, 1);
    ctx.fillRect(x + 8, y + 8, 1, 8);
  }
}

/** Choza de la Prehistoria: 32x32. */
export function drawHut(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const px = (dx: number, dy: number, w: number, h: number, c: string) => { ctx.fillStyle = c; ctx.fillRect(x + dx, y + dy, w, h); };
  // techo de paja (triángulo escalonado)
  for (let i = 0; i < 14; i++) {
    px(15 - i, 3 + i, 2 + i * 2, 1, i % 3 === 0 ? '#c9a24a' : '#e2bf5e');
  }
  for (let i = 0; i < 14; i++) px(15 - i, 3 + i, 1, 1, PALETTE.k!), px(16 + i, 3 + i, 1, 1, PALETTE.k!);
  px(1, 17, 30, 1, PALETTE.k!);
  // paredes
  px(4, 18, 24, 12, PALETTE.w!);
  for (let i = 0; i < 6; i++) px(5 + i * 4, 18, 1, 12, PALETTE.D!);
  px(4, 18, 1, 12, PALETTE.k!); px(27, 18, 1, 12, PALETTE.k!); px(4, 30, 24, 1, PALETTE.k!);
  // puerta
  px(13, 22, 7, 8, '#2a1a12');
  px(13, 21, 7, 1, PALETTE.k!);
}

/** Templo de las Civilizaciones antiguas: 32x32. */
export function drawTemple(ctx: CanvasRenderingContext2D, x: number, y: number) {
  const px = (dx: number, dy: number, w: number, h: number, c: string) => { ctx.fillStyle = c; ctx.fillRect(x + dx, y + dy, w, h); };
  // frontón
  for (let i = 0; i < 7; i++) px(15 - i * 2, 2 + i, 2 + i * 4, 1, i === 0 ? PALETTE.k! : PALETTE.S!);
  px(2, 9, 28, 2, PALETTE.s!); px(2, 9, 28, 1, PALETTE.k!);
  px(14, 5, 4, 2, '#e0b84a'); // sol dorado
  // columnas
  for (const cx of [4, 11, 18, 25]) {
    px(cx, 11, 4, 15, PALETTE.S!);
    px(cx + 1, 11, 1, 15, PALETTE.s!);
    px(cx + 3, 11, 1, 15, PALETTE.t!);
  }
  // interior oscuro
  for (const cx of [8, 15, 22]) px(cx, 11, 3, 15, '#2f2838');
  // escalones
  px(1, 26, 30, 2, PALETTE.s!); px(0, 28, 32, 3, PALETTE.t!); px(0, 31, 32, 1, PALETTE.k!);
}
