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
    expect(save).toMatchObject({ explorerName: 'Ana', xp: 120, novacoins: 35, currentEra: 2, unlockedEras: [1, 2] });
    expect(save.completedLessons['e1-01-que-es-programar']).toBeDefined();
    expect(save.worlds[2]!.objects).toEqual([{ id: 'deco-fogata', x: 3, y: 4 }]);
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
