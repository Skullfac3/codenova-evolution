import { describe, expect, it } from 'vitest';
import { createEmptySave, SAVE_KEY, writeSave } from './save';
import {
  ADMIN_PROFILE_ID,
  TEST_PROFILE_ID,
  createAdminSave,
  loadAllProfileSaves,
  loadProfiles,
  loadProfileSave,
  writeProfileSave,
  type Profile,
} from './profiles';

class MemoryStorage implements Storage {
  private data = new Map<string, string>();
  get length() { return this.data.size; }
  clear() { this.data.clear(); }
  getItem(k: string) { return this.data.get(k) ?? null; }
  key(i: number) { return [...this.data.keys()][i] ?? null; }
  removeItem(k: string) { this.data.delete(k); }
  setItem(k: string, v: string) { this.data.set(k, String(v)); }
}

const admin: Profile = { id: ADMIN_PROFILE_ID, name: 'Administrador', kind: 'admin', createdAt: '2026-11-09T00:00:00Z' };
const pruebas: Profile = { id: TEST_PROFILE_ID, name: 'Pruebas', kind: 'player', createdAt: '2026-11-09T00:00:00Z' };

describe('perfiles', () => {
  it('en una instalación nueva crea Administrador y Pruebas, activo Pruebas', () => {
    const state = loadProfiles(new MemoryStorage());
    expect(state.profiles.map((p) => p.id)).toEqual([ADMIN_PROFILE_ID, TEST_PROFILE_ID]);
    expect(state.activeId).toBe(TEST_PROFILE_ID);
  });

  it('el perfil Administrador tiene las 5 eras desbloqueadas', () => {
    const save = createAdminSave();
    expect(save.admin).toBe(true);
    expect(save.unlockedEras).toEqual([1, 2, 3, 4, 5]);
  });

  it('migra la partida vieja como "Mi partida" sin perder progreso', () => {
    const storage = new MemoryStorage();
    writeSave({ ...createEmptySave(), xp: 40, novacoins: 20, completedLessons: { 'e1-01-que-es-programar': { score: 100, completedAt: '2026-11-09T00:00:00Z', eventId: 'x' } } }, storage);
    const state = loadProfiles(storage);
    expect(state.profiles.map((p) => p.id)).toContain('mi-partida');
    expect(state.activeId).toBe('mi-partida');
    const migrated = loadProfileSave(state.profiles.find((p) => p.id === 'mi-partida')!, storage);
    expect(migrated.xp).toBe(40);
    expect(migrated.completedLessons['e1-01-que-es-programar']).toBeDefined();
  });

  it('cada perfil guarda su propia partida, sin mezclarse', () => {
    const storage = new MemoryStorage();
    writeProfileSave(TEST_PROFILE_ID, { ...createEmptySave(), xp: 20, novacoins: 10 }, storage);
    writeProfileSave(ADMIN_PROFILE_ID, createAdminSave(), storage);
    expect(loadProfileSave(pruebas, storage).xp).toBe(20);
    expect(loadProfileSave(admin, storage).xp).toBe(0);
    expect(loadProfileSave(admin, storage).admin).toBe(true);
    // La partida activa también se espeja en la clave histórica.
    expect(JSON.parse(storage.getItem(SAVE_KEY)!).xp).toBe(0);
  });

  it('el panel del admin lee las partidas de todos los perfiles', () => {
    const storage = new MemoryStorage();
    writeProfileSave(TEST_PROFILE_ID, { ...createEmptySave(), xp: 20, purchases: [{ id: 'c1', itemId: 'deco-fogata', price: 10, at: '2026-11-09T00:00:00Z' }] }, storage);
    const all = loadAllProfileSaves([admin, pruebas], storage);
    const testSave = all.find((s) => s.profile.id === TEST_PROFILE_ID)!.save;
    expect(testSave.purchases).toHaveLength(1);
    expect(testSave.purchases![0]).toMatchObject({ itemId: 'deco-fogata', price: 10 });
  });
});
