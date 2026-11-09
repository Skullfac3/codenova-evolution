import { describe, expect, it } from 'vitest';
import { createEmptySave, type Save } from '../services/storage/save';
import { availableCount, buyItem, equipOutfit, placeObject, removeObjectAt, transferPet, transferablePets, type Result } from './economy';
import { ITEMS } from './items';
import { PALETTE, SPRITE_KEYS, spriteRows } from './sprites';

let n = 0;
const id = () => `pet-${++n}`;
const ok = (r: Result): Save => {
  if (!r.ok) throw new Error(r.reason);
  return r.save;
};
const withCoins = (coins: number, eras = [1]): Save => ({ ...createEmptySave(), novacoins: coins, unlockedEras: eras });

describe('tienda', () => {
  it('compra un adorno y descuenta las NovaCoins', () => {
    const s = ok(buyItem(withCoins(90), 'deco-fogata'));
    expect(s.novacoins).toBe(80);
    expect(s.inventory['deco-fogata']).toBe(1);
  });

  it('cada compra queda registrada en el historial para el Administrador', () => {
    const s = ok(buyItem(withCoins(90), 'deco-fogata'));
    expect(s.purchases).toHaveLength(1);
    expect(s.purchases![0]).toMatchObject({ itemId: 'deco-fogata', price: 10 });
    const s2 = ok(buyItem(s, 'deco-helecho'));
    expect(s2.purchases).toHaveLength(2);
  });

  it('una compra fallida no deja registro', () => {
    const r = buyItem(withCoins(30), 'pet-dodo');
    expect(r.ok).toBe(false);
  });

  it('no deja comprar sin monedas suficientes y dice cuántas faltan', () => {
    const r = buyItem(withCoins(30), 'pet-dodo');
    expect(r).toEqual({ ok: false, reason: 'Te faltan 10 NovaCoins.' });
  });

  it('no deja comprar objetos de eras bloqueadas', () => {
    expect(buyItem(withCoins(500), 'pet-buho').ok).toBe(false);
    expect(buyItem(withCoins(500, [1, 2]), 'pet-buho').ok).toBe(true);
  });

  it('un atuendo se compra una sola vez', () => {
    const s = ok(buyItem(withCoins(100), 'outfit-piel'));
    expect(buyItem(s, 'outfit-piel').ok).toBe(false);
  });

  it('una mascota se agrega a su era de origen', () => {
    const s = ok(buyItem(withCoins(40), 'pet-dodo', id));
    expect(s.pets).toEqual([{ id: 'pet-1', itemId: 'pet-dodo', originEra: 1, currentEra: 1 }]);
  });
});

describe('decorar', () => {
  const base = () => ok(buyItem(withCoins(90), 'deco-fogata'));

  it('coloca y quita un adorno', () => {
    let s = ok(placeObject(base(), 1, 'deco-fogata', 5, 5));
    expect(s.worlds[1]!.objects).toEqual([{ id: 'deco-fogata', x: 5, y: 5 }]);
    expect(availableCount(s, 'deco-fogata')).toBe(0);
    s = ok(removeObjectAt(s, 1, 5, 5));
    expect(availableCount(s, 'deco-fogata')).toBe(1);
  });

  it('no coloca más de los que tienes, ni en casillas ocupadas, ni sobre la choza', () => {
    const s = ok(placeObject(base(), 1, 'deco-fogata', 5, 5));
    expect(placeObject(s, 1, 'deco-fogata', 6, 6).ok).toBe(false);
    const two = ok(buyItem(s, 'deco-fogata'));
    expect(placeObject(two, 1, 'deco-fogata', 5, 5).ok).toBe(false);
    expect(placeObject(two, 1, 'deco-fogata', 1, 1).ok).toBe(false);
    expect(placeObject(two, 1, 'deco-fogata', 6, 6).ok).toBe(true);
  });
});

describe('atuendos y mascotas', () => {
  it('equipa y quita un atuendo comprado', () => {
    const s = ok(buyItem(withCoins(100), 'outfit-piel'));
    expect(equipOutfit(createEmptySave(), 'outfit-piel').ok).toBe(false);
    const dressed = ok(equipOutfit(s, 'outfit-piel'));
    expect(dressed.equippedOutfit).toBe('outfit-piel');
    expect(ok(equipOutfit(dressed, null)).equippedOutfit).toBeUndefined();
  });

  it('solo una mascota de otra era puede llegar a cada era', () => {
    let s = withCoins(200, [1, 2]);
    s = ok(buyItem(s, 'pet-dodo', id));
    s = ok(buyItem(s, 'pet-lagartija', id));
    const [dodo, lagartija] = s.pets;
    expect(transferablePets(s, 2)).toHaveLength(2);
    s = ok(transferPet(s, dodo!.id, 2));
    expect(transferablePets(s, 2)).toHaveLength(0);
    expect(transferPet(s, lagartija!.id, 2).ok).toBe(false);
    // puede regresar a su era de origen
    expect(transferPet(s, dodo!.id, 1).ok).toBe(true);
  });
});

describe('catálogo y sprites', () => {
  it('cada objeto tiene un sprite y precios positivos', () => {
    for (const item of ITEMS) {
      expect(SPRITE_KEYS).toContain(item.sprite);
      expect(item.price).toBeGreaterThan(0);
    }
  });

  it('los sprites miden 16 de ancho y usan colores de la paleta', () => {
    for (const key of SPRITE_KEYS) {
      for (const row of spriteRows(key)) {
        expect(row.length, key).toBe(16);
        for (const ch of row) if (ch !== '.') expect(PALETTE[ch], `${key}: "${ch}"`).toBeDefined();
      }
    }
  });
});
