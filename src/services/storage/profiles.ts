/**
 * Perfiles de CodeNova.
 *
 * La app todavía no tiene cuentas (eso llega con Supabase, Fase 4), así que
 * los perfiles viven en este navegador, en localStorage:
 *
 * - **Administrador**: todo desbloqueado (las 5 eras y todas las lecciones) y
 *   un panel con el historial de compras de todos los perfiles.
 * - **Pruebas**: una partida normal, desde cero, para hacer retos, ganar
 *   NovaCoins y comprar en la tienda. Sus compras son las que ve el admin.
 *
 * Sin PIN, por decisión de Erick: cambiar de perfil es solo un toque.
 *
 * Compatibilidad: la partida que ya existía en `codenova:save` se importa
 * como un perfil más ("Mi partida") la primera vez que se abre esta versión,
 * para no perder progreso. Además, la partida activa se sigue escribiendo
 * también en `codenova:save`, para que nada que la lea se rompa.
 */
import {
  createEmptySave,
  loadSave,
  migrate,
  writeSave,
  type Save,
} from './save';

export type ProfileKind = 'admin' | 'player';

export interface Profile {
  id: string;
  name: string;
  kind: ProfileKind;
  createdAt: string;
}

export const PROFILES_KEY = 'codenova:profiles';
export const ADMIN_PROFILE_ID = 'admin';
export const TEST_PROFILE_ID = 'pruebas';

export const saveKeyForProfile = (profileId: string) => `codenova:save:${profileId}`;

export interface ProfilesState {
  activeId: string;
  profiles: Profile[];
}

function defaultStorage(): Storage | null {
  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

const now = () => new Date().toISOString();

export function createAdminSave(): Save {
  const save = createEmptySave();
  return {
    ...save,
    explorerName: 'Administrador',
    admin: true,
    unlockedEras: [1, 2, 3, 4, 5],
    currentEra: 1,
  };
}

export function createPlayerSave(name: string): Save {
  return { ...createEmptySave(), explorerName: name };
}

function hasProgress(save: Save): boolean {
  return (
    save.xp > 0 ||
    save.novacoins > 0 ||
    Object.keys(save.completedLessons).length > 0 ||
    Object.keys(save.inventory).length > 0 ||
    save.pets.length > 0
  );
}

/**
 * Carga (o crea, con migración) el registro de perfiles.
 * Nunca borra la partida vieja: si `codenova:save` tiene progreso, se
 * importa como perfil "Mi partida" y se convierte en el perfil activo.
 */
export function loadProfiles(storage: Storage | null = defaultStorage()): ProfilesState {
  if (!storage) {
    return {
      activeId: TEST_PROFILE_ID,
      profiles: [
        { id: ADMIN_PROFILE_ID, name: 'Administrador', kind: 'admin', createdAt: now() },
        { id: TEST_PROFILE_ID, name: 'Pruebas', kind: 'player', createdAt: now() },
      ],
    };
  }
  try {
    const raw = storage.getItem(PROFILES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as ProfilesState;
      if (Array.isArray(parsed.profiles) && parsed.profiles.length > 0 && parsed.activeId) {
        return parsed;
      }
    }
  } catch {
    // Registro corrupto: se reconstruye abajo sin borrar las partidas.
  }

  const profiles: Profile[] = [
    { id: ADMIN_PROFILE_ID, name: 'Administrador', kind: 'admin', createdAt: now() },
    { id: TEST_PROFILE_ID, name: 'Pruebas', kind: 'player', createdAt: now() },
  ];
  let activeId = TEST_PROFILE_ID;

  const legacy = loadSave(storage);
  if (hasProgress(legacy)) {
    const migrated: Profile = { id: 'mi-partida', name: 'Mi partida', kind: 'player', createdAt: now() };
    profiles.push(migrated);
    writeProfileSave(migrated.id, legacy, storage);
    activeId = migrated.id;
  }

  const state: ProfilesState = { activeId, profiles };
  try {
    storage.setItem(PROFILES_KEY, JSON.stringify(state));
  } catch {
    // Sin almacenamiento, la app sigue con los perfiles en memoria.
  }
  return state;
}

export function writeProfiles(state: ProfilesState, storage: Storage | null = defaultStorage()): void {
  if (!storage) return;
  try {
    storage.setItem(PROFILES_KEY, JSON.stringify(state));
  } catch {
    // Sin almacenamiento, la app sigue con los perfiles en memoria.
  }
}

/** Partida de un perfil. Si no existe, se crea (admin: todo desbloqueado). */
export function loadProfileSave(profile: Profile, storage: Storage | null = defaultStorage()): Save {
  if (!storage) return profile.kind === 'admin' ? createAdminSave() : createPlayerSave(profile.name);
  try {
    const raw = storage.getItem(saveKeyForProfile(profile.id));
    // Pasa por migrate(): una partida guardada en una versión vieja
    // (p. ej. con ids e1-/e2- de antes del reordenamiento) se actualiza
    // al leerla, sin perder progreso.
    if (raw) return migrate(JSON.parse(raw));
  } catch {
    // Partida corrupta: se crea una nueva abajo.
  }
  const fresh = profile.kind === 'admin' ? createAdminSave() : createPlayerSave(profile.name);
  writeProfileSave(profile.id, fresh, storage);
  return fresh;
}

/** Escribe la partida del perfil y también en la clave histórica `codenova:save`. */
export function writeProfileSave(profileId: string, save: Save, storage: Storage | null = defaultStorage()): void {
  if (!storage) return;
  try {
    storage.setItem(saveKeyForProfile(profileId), JSON.stringify({ ...save, updatedAt: new Date().toISOString() }));
  } catch {
    // Sin almacenamiento, la app sigue en memoria.
  }
  writeSave(save, storage);
}

/** Partidas de todos los perfiles, para el panel del administrador. */
export function loadAllProfileSaves(profiles: Profile[], storage: Storage | null = defaultStorage()): Array<{ profile: Profile; save: Save }> {
  return profiles.map((profile) => ({ profile, save: loadProfileSave(profile, storage) }));
}
