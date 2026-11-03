/**
 * Guardado local versionado.
 *
 * Cada partida guardada lleva `version`. Al cargar, se aplican en orden
 * las migraciones necesarias hasta llegar a CURRENT_VERSION. Así una
 * actualización de la app nunca borra el progreso del estudiante.
 *
 * ⚠️ Ajusta LEGACY_KEY y migrateFromLegacy() al formato real que usa
 *    hoy el prototipo HTML (revisa localStorage en las DevTools).
 */

export const SAVE_KEY = 'codenova:save';
export const LEGACY_KEY = 'codenova-save';
export const CURRENT_VERSION = 2;

export interface SaveV2 {
  version: 2;
  explorerName: string;
  avatar: string;
  xp: number;
  novacoins: number;
  currentEra: number;
  unlockedEras: number[];
  completedLessons: Record<string, { score: number; completedAt: string; eventId: string }>;
  worlds: Record<number, { objects: Array<{ id: string; x: number; y: number }> }>;
  inventory: Record<string, number>;
  pets: Array<{ id: string; itemId: string; originEra: number; currentEra: number; nickname?: string }>;
  /** Recompensas completadas sin conexión, pendientes de enviar a Supabase. */
  pendingSync: Array<{ lessonId: string; score: number; eventId: string }>;
  updatedAt: string;
}

export type Save = SaveV2;

export function createEmptySave(): Save {
  return {
    version: 2,
    explorerName: 'Explorador',
    avatar: 'explorer-01',
    xp: 0,
    novacoins: 0,
    currentEra: 1,
    unlockedEras: [1],
    completedLessons: {},
    worlds: { 1: { objects: [] } },
    inventory: {},
    pets: [],
    pendingSync: [],
    updatedAt: new Date().toISOString(),
  };
}

const num = (v: unknown, fallback = 0) => (typeof v === 'number' && Number.isFinite(v) && v >= 0 ? v : fallback);
const str = (v: unknown, fallback: string) => (typeof v === 'string' && v.trim() ? v.trim().slice(0, 24) : fallback);

/** v0 (prototipo HTML) → v1. Lee de forma defensiva: cualquier campo puede faltar. */
function migrateFromLegacy(legacy: Record<string, unknown>): Record<string, unknown> {
  return {
    version: 1,
    explorerName: str(legacy.explorerName ?? legacy.name, 'Explorador'),
    xp: num(legacy.xp),
    novacoins: num(legacy.novacoins ?? legacy.coins),
    era: num(legacy.era ?? legacy.currentEra, 1) || 1,
    lessons: Array.isArray(legacy.completedLessons) ? legacy.completedLessons : [],
    decorations: Array.isArray(legacy.decorations) ? legacy.decorations : [],
  };
}

/** v1 → v2: mundos por era, inventario, mascotas y cola de sincronización. */
function migrateV1toV2(v1: Record<string, unknown>): SaveV2 {
  const base = createEmptySave();
  const era = num(v1.era, 1) || 1;
  const lessons = (v1.lessons as unknown[]).filter((l): l is string => typeof l === 'string');
  const decorations = (v1.decorations as unknown[]).filter(
    (d): d is { id: string; x: number; y: number } =>
      typeof d === 'object' && d !== null && typeof (d as { id?: unknown }).id === 'string',
  );
  const now = new Date().toISOString();
  return {
    ...base,
    explorerName: str(v1.explorerName, base.explorerName),
    xp: num(v1.xp),
    novacoins: num(v1.novacoins),
    currentEra: era,
    unlockedEras: Array.from({ length: era }, (_, i) => i + 1),
    completedLessons: Object.fromEntries(
      lessons.map((id) => [id, { score: 100, completedAt: now, eventId: crypto.randomUUID() }]),
    ),
    worlds: { ...base.worlds, [era]: { objects: decorations.map(({ id, x, y }) => ({ id, x: num(x), y: num(y) })) } },
  };
}

/** Aplica migraciones en cadena. Agrega aquí cada nueva versión. */
export function migrate(raw: unknown): Save {
  if (typeof raw !== 'object' || raw === null) return createEmptySave();
  let data = raw as Record<string, unknown>;
  const version = typeof data.version === 'number' ? data.version : 0;
  if (version > CURRENT_VERSION) {
    throw new Error(`Partida de una versión más nueva (${version}). Actualiza la aplicación.`);
  }
  if (version < 1) data = migrateFromLegacy(data);
  if (version < 2) data = migrateV1toV2(data) as unknown as Record<string, unknown>;
  return data as unknown as Save;
}

/** localStorage puede no existir o lanzar error (modo privado, sitio bloqueado). */
function defaultStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function loadSave(storage: Storage | null = defaultStorage()): Save {
  if (!storage) return createEmptySave();
  try {
    const current = storage.getItem(SAVE_KEY);
    if (current) return migrate(JSON.parse(current));
    const legacy = storage.getItem(LEGACY_KEY);
    if (legacy) {
      const migrated = migrate(JSON.parse(legacy));
      storage.setItem(`${LEGACY_KEY}:backup`, legacy); // nunca se pierde el original
      writeSave(migrated, storage);
      return migrated;
    }
  } catch (error) {
    console.error('[CodeNova] No se pudo leer la partida', error);
  }
  return createEmptySave();
}

export function writeSave(save: Save, storage: Storage | null = defaultStorage()): void {
  if (!storage) return;
  try {
    storage.setItem(SAVE_KEY, JSON.stringify({ ...save, updatedAt: new Date().toISOString() }));
  } catch (error) {
    console.error('[CodeNova] No se pudo guardar la partida', error);
  }
}
