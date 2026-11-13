/**
 * Sprites del refugio: pixel art original de CodeNova, 32x32 (edificios 64x64),
 * con rampas de 4 a 6 tonos por material y luz desde arriba a la izquierda.
 * Los dibujos viven en sprites.data.ts, que genera scripts/make_sprites.py.
 */
import { PALETTE, RAW_BUILDINGS, RAW_SPRITES, RAW_TILES } from './sprites.data';

export { PALETTE };

/** Lado en píxeles de un sprite y de una casilla del mundo. */
export const SPRITE_SIZE = 32;

export type SpriteKey = keyof typeof RAW_SPRITES;
type TileSprite = keyof typeof RAW_TILES;
type BuildingKey = keyof typeof RAW_BUILDINGS;

export const SPRITE_KEYS = Object.keys(RAW_SPRITES) as SpriteKey[];
export const spriteRows = (key: SpriteKey): string[] => RAW_SPRITES[key];

/** Todas las cuadrículas (sprites, terrenos y edificios), para las pruebas. */
export const ALL_GRIDS: Record<string, string[]> = { ...RAW_SPRITES, ...RAW_TILES, ...RAW_BUILDINGS };

/**
 * Colores de la túnica según el atuendo equipado, de oscuro a claro.
 * Las letras V, U, T y t están reservadas para la túnica en la paleta.
 */
export const OUTFIT_COLORS: Record<string, Record<string, string>> = {
  'outfit-piel': { V: '#4a2f14', U: '#6e4824', T: '#9a6a3a', t: '#c08a4e' },
  'outfit-toga': { V: '#a3967f', U: '#c9bfae', T: '#f2ece0', t: '#ffffff' },
};

const cache = new Map<string, HTMLCanvasElement>();

function gridCanvas(cacheKey: string, rows: string[], overrides: Record<string, string> = {}): HTMLCanvasElement {
  const hit = cache.get(cacheKey);
  if (hit) return hit;
  const cv = document.createElement('canvas');
  cv.width = rows[0]!.length;
  cv.height = rows.length;
  const ctx = cv.getContext('2d')!;
  rows.forEach((row, y) => {
    for (let x = 0; x < row.length; x++) {
      const ch = row[x]!;
      if (ch === '.') continue;
      ctx.fillStyle = overrides[ch] ?? PALETTE[ch]!;
      ctx.fillRect(x, y, 1, 1);
    }
  });
  cache.set(cacheKey, cv);
  return cv;
}

/** Sprite ya dibujado en un canvas de 32x32 (en caché). */
export function spriteCanvas(key: SpriteKey, overrides: Record<string, string> = {}): HTMLCanvasElement {
  return gridCanvas(key + JSON.stringify(overrides), RAW_SPRITES[key], overrides);
}

const tileCanvas = (key: TileSprite) => gridCanvas('tile:' + key, RAW_TILES[key]);
const buildingCanvas = (key: BuildingKey) => gridCanvas('building:' + key, RAW_BUILDINGS[key]);

// ── Terreno y edificios ──

export type TileKind = 'pasto' | 'tierra' | 'losa';

const TILE_VARIANTS: Record<TileKind, TileSprite[]> = {
  pasto: ['pasto1', 'pasto2', 'pasto3'],
  tierra: ['tierra1', 'tierra2'],
  losa: ['losa1', 'losa2'],
};

/** Dibuja una casilla de 32x32; `rand` elige la variante (determinista si lo es `rand`). */
export function drawTile(ctx: CanvasRenderingContext2D, kind: TileKind, x: number, y: number, rand: () => number) {
  const variants = TILE_VARIANTS[kind];
  ctx.drawImage(tileCanvas(variants[Math.floor(rand() * variants.length)]!), x, y);
}

export type TileSide = 'N' | 'S' | 'E' | 'O';

/** Franja de pasto que invade una casilla de tierra o losa por el lado indicado. */
export function drawGrassEdge(ctx: CanvasRenderingContext2D, side: TileSide, x: number, y: number) {
  ctx.drawImage(tileCanvas(`borde${side}`), x, y);
}

/** Choza de la Prehistoria: 64x64 (2x2 casillas). */
export function drawHut(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.drawImage(buildingCanvas('choza'), x, y);
}

/** Templo de las Civilizaciones antiguas: 64x64 (2x2 casillas). */
export function drawTemple(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.drawImage(buildingCanvas('templo'), x, y);
}
