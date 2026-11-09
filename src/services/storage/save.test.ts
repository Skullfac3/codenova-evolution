import { describe, expect, it } from 'vitest';
import { CURRENT_VERSION, LEGACY_KEY, SAVE_KEY, createEmptySave, loadSave, migrate, writeSave } from './save';

class MemoryStorage implements Storage {
  private data = new Map<string, string>();
  get length() { return this.data.size; }
  clear() { this.data.clear(); }
  getItem(k: string) { return this.data.get(k) ?? null; }
  key(i: number) { return [...this.data.keys()][i] ?? null; }
  removeItem(k: string) { this.data.delete(k); }
  setItem(k: string, v: string) { this.data.set(k, String(v)); }
}

describe('guardado versionado', () => {
  it('migra una partida del prototipo HTML sin perder progreso', () => {
    const save = migrate({ name: 'Ana', xp: 120, coins: 35, era: 2, completedLessons: ['e1-01-que-es-programar'],
      decorations: [{ id: 'deco-fogata', x: 3, y: 4 }] });
    expect(save.version).toBe(CURRENT_VERSION);
    // La lección era de JavaScript: ahora vive en la Era 3, y la partida
    // la sigue teniendo completada, con la Era 3 desbloqueada.
    expect(save).toMatchObject({ explorerName: 'Ana', xp: 120, novacoins: 35, currentEra: 3, unlockedEras: [1, 2, 3] });
    expect(save.completedLessons['e3-01-que-es-programar']).toBeDefined();
    expect(save.completedLessons['e1-01-que-es-programar']).toBeUndefined();
    expect(save.worlds[2]!.objects).toEqual([{ id: 'deco-fogata', x: 3, y: 4 }]);
  });

  it('migra los ids e1-/e2- a e3- conservando todo lo demás (v2 → v3)', () => {
    const save = migrate({
      version: 2, explorerName: 'Explorador', avatar: 'explorer-01', xp: 170, novacoins: 90, currentEra: 2,
      unlockedEras: [1, 2],
      completedLessons: {
        'e1-01-que-es-programar': { score: 100, completedAt: '2026-11-05T00:00:00Z', eventId: 'a' },
        'e1-07-evaluacion': { score: 90, completedAt: '2026-11-05T00:00:00Z', eventId: 'b' },
        'e2-01-condicionales': { score: 100, completedAt: '2026-11-06T00:00:00Z', eventId: 'c' },
        'e2-08-evaluacion': { score: 80, completedAt: '2026-11-06T00:00:00Z', eventId: 'd' },
      },
      worlds: { 1: { objects: [] }, 2: { objects: [] } },
      inventory: { 'deco-fogata': 1 }, pets: [{ id: 'p1', itemId: 'pet-dodo', originEra: 1, currentEra: 1 }],
      pendingSync: [{ lessonId: 'e1-01-que-es-programar', score: 100, eventId: 'a' }],
      updatedAt: '2026-11-06T00:00:00Z',
    });
    expect(save.version).toBe(CURRENT_VERSION);
    expect(save.completedLessons['e3-01-que-es-programar']).toMatchObject({ score: 100, eventId: 'a' });
    expect(save.completedLessons['e3-07-evaluacion']).toMatchObject({ score: 90, eventId: 'b' });
    expect(save.completedLessons['e3-08-condicionales']).toMatchObject({ score: 100, eventId: 'c' });
    expect(save.completedLessons['e3-15-evaluacion']).toMatchObject({ score: 80, eventId: 'd' });
    expect(Object.keys(save.completedLessons)).toHaveLength(4);
    expect(save.pendingSync).toEqual([{ lessonId: 'e3-01-que-es-programar', score: 100, eventId: 'a' }]);
    expect(save.unlockedEras).toEqual([1, 2, 3]);
    expect(save.currentEra).toBe(3);
    // XP, monedas, inventario y mascotas no se tocan.
    expect(save).toMatchObject({ xp: 170, novacoins: 90, inventory: { 'deco-fogata': 1 } });
    expect(save.pets).toHaveLength(1);
  });

  it('una partida v2 sin progreso en JavaScript no se mueve de era', () => {
    const save = migrate({ ...createEmptySave(), version: 2 });
    expect(save.version).toBe(CURRENT_VERSION);
    expect(save.currentEra).toBe(1);
    expect(save.unlockedEras).toEqual([1]);
    expect(save.completedLessons).toEqual({});
  });

  it('la migración de ids es idempotente', () => {
    const once = migrate({ ...createEmptySave(), version: 2, completedLessons: { 'e2-05-funciones': { score: 100, completedAt: '2026-11-06T00:00:00Z', eventId: 'z' } } });
    const twice = migrate(JSON.parse(JSON.stringify(once)));
    expect(twice.completedLessons['e3-12-funciones']).toMatchObject({ score: 100, eventId: 'z' });
    expect(Object.keys(twice.completedLessons)).toHaveLength(1);
  });

  it('tolera datos corruptos o incompletos', () => {
    expect(migrate(null)).toMatchObject({ xp: 0, currentEra: 1 });
    expect(migrate({ xp: -50, coins: 'mucho', decorations: 'x' })).toMatchObject({ xp: 0, novacoins: 0 });
  });

  it('respalda la partida legacy y la reemplaza por la nueva', () => {
    const storage = new MemoryStorage();
    storage.setItem(LEGACY_KEY, JSON.stringify({ xp: 10 }));
    expect(loadSave(storage).xp).toBe(10);
    expect(storage.getItem(`${LEGACY_KEY}:backup`)).not.toBeNull();
    expect(JSON.parse(storage.getItem(SAVE_KEY)!).version).toBe(CURRENT_VERSION);
  });

  it('una partida actual se carga tal cual', () => {
    const storage = new MemoryStorage();
    writeSave({ ...createEmptySave(), xp: 77 }, storage);
    expect(loadSave(storage).xp).toBe(77);
  });

  it('rechaza partidas de versiones futuras', () => {
    expect(() => migrate({ version: 99 })).toThrow();
  });
});
