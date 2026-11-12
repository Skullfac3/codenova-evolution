import type { SpriteKey } from './sprites';

export type ItemKind = 'decoration' | 'outfit' | 'pet';

export interface ShopItem {
  id: string;
  kind: ItemKind;
  name: string;
  price: number;
  era: number;
  sprite: SpriteKey;
  description: string;
}

/**
 * Catálogo de la tienda. Mismos ids, precios y eras que la tabla `items`
 * de Supabase (migraciones 0001 y 0002): el servidor valida las compras.
 */
export const ITEMS: ShopItem[] = [
  // Era 1 · Prehistoria
  { id: 'deco-fogata', kind: 'decoration', name: 'Fogata', price: 10, era: 1, sprite: 'fogata1', description: 'Da luz y calor. ¡Está animada!' },
  { id: 'deco-roca-musgo', kind: 'decoration', name: 'Roca con musgo', price: 5, era: 1, sprite: 'roca', description: 'Una roca antigua cubierta de musgo.' },
  { id: 'deco-helecho', kind: 'decoration', name: 'Helecho gigante', price: 8, era: 1, sprite: 'helecho', description: 'Planta prehistórica.' },
  { id: 'outfit-piel', kind: 'outfit', name: 'Túnica de piel', price: 25, era: 1, sprite: 'explorador1', description: 'Abrigo para las noches de la cueva.' },
  { id: 'pet-dodo', kind: 'pet', name: 'Dodo curioso', price: 40, era: 1, sprite: 'dodo', description: 'Camina por tu refugio picoteando todo.' },
  { id: 'pet-lagartija', kind: 'pet', name: 'Lagartija solar', price: 40, era: 1, sprite: 'lagartija', description: 'Le encanta tomar el sol junto a la fogata.' },
  // Era 2 · Civilizaciones antiguas
  { id: 'deco-anfora', kind: 'decoration', name: 'Ánfora pintada', price: 15, era: 2, sprite: 'anfora', description: 'Vasija decorada con bandas doradas.' },
  { id: 'deco-columna', kind: 'decoration', name: 'Columna antigua', price: 20, era: 2, sprite: 'columna', description: 'Piedra tallada por los mejores artesanos.' },
  { id: 'deco-fuente', kind: 'decoration', name: 'Fuente de piedra', price: 35, era: 2, sprite: 'fuente', description: 'Agua fresca en el centro de la plaza.' },
  { id: 'outfit-toga', kind: 'outfit', name: 'Túnica de escriba', price: 45, era: 2, sprite: 'explorador1', description: 'Vestimenta de quienes saben escribir.' },
  { id: 'pet-buho', kind: 'pet', name: 'Búho sabio', price: 60, era: 2, sprite: 'buho', description: 'Observa todo con sus grandes ojos.' },
  { id: 'pet-gato-sagrado', kind: 'pet', name: 'Gato del templo', price: 60, era: 2, sprite: 'gato', description: 'Protege los almacenes de los ratones.' },
];

export const itemById = (id: string) => ITEMS.find((i) => i.id === id);

// ── Mundo ──
export const COLS = 10;
export const ROWS = 9;
/** Lado de una casilla en píxeles: igual al de un sprite (32x32). */
export const TILE = 32;

/** Eras con mundo dibujado. */
export const WORLD_ERAS = [1, 2] as const;

/** Casillas ocupadas por el edificio principal (choza o templo). */
export const LANDMARK = { x: 1, y: 1, w: 2, h: 2 };
export const isLandmarkTile = (x: number, y: number) =>
  x >= LANDMARK.x && x < LANDMARK.x + LANDMARK.w && y >= LANDMARK.y && y < LANDMARK.y + LANDMARK.h;
