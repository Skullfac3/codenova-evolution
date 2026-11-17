import { describe, expect, it } from 'vitest';
import { createEmptySave, type Save } from '../services/storage/save';
import { GIFT_COINS, GIFT_EVERY_MS, HELP_COST, buyHelp, claimGift, msUntilGift } from './economy';

const t0 = new Date('2026-11-17T10:00:00Z');
const later = (ms: number) => new Date(t0.getTime() + ms);
const withCoins = (novacoins: number): Save => ({ ...createEmptySave(), novacoins });

describe('ayuda de Proto-0 con NovaCoins', () => {
  it('cuesta 3 NovaCoins y queda registrada', () => {
    const r = buyHelp(withCoins(10), 'e3-01-ex-main', t0);
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(HELP_COST).toBe(3);
    expect(r.save.novacoins).toBe(7);
    expect(r.save.helpPurchases).toEqual([{ exerciseId: 'e3-01-ex-main', price: 3, at: t0.toISOString() }]);
    expect(r.save.lowCoinsSince).toBeUndefined();
  });

  it('no se puede pagar con menos de 3', () => {
    const r = buyHelp(withCoins(2), 'x', t0);
    expect(r.ok).toBe(false);
    if (r.ok) return;
    expect(r.reason).toMatch(/3 NovaCoins/);
  });

  it('si el saldo queda por debajo de 3, empieza la espera del regalo', () => {
    const r = buyHelp(withCoins(4), 'x', t0);
    expect(r.ok && r.save.novacoins).toBe(1);
    expect(r.ok && r.save.lowCoinsSince).toBe(t0.toISOString());
  });
});

describe('regalo de NovaCoins', () => {
  it('regala 5 a los 30 minutos con saldo menor a 3, aunque la app haya estado cerrada', () => {
    const { save: waiting } = claimGift(withCoins(1), t0);
    expect(waiting.lowCoinsSince).toBe(t0.toISOString());
    expect(claimGift(waiting, later(GIFT_EVERY_MS - 1000)).granted).toBe(0);

    const { save, granted } = claimGift(waiting, later(3 * GIFT_EVERY_MS)); // cerrada 1.5 h: un solo regalo
    expect(GIFT_COINS).toBe(5);
    expect(granted).toBe(5);
    expect(save.novacoins).toBe(6);
    expect(save.gifts).toEqual([{ coins: 5, at: later(3 * GIFT_EVERY_MS).toISOString() }]);
    // Ya alcanza para la ayuda: no hay más espera ni más regalos.
    expect(save.lowCoinsSince).toBeUndefined();
    expect(claimGift(save, later(10 * GIFT_EVERY_MS)).granted).toBe(0);
  });

  it('también aplica con 0, 1 o 2, pero no con 3 o más', () => {
    for (const n of [0, 1, 2]) {
      const { save } = claimGift(withCoins(n), t0);
      expect(claimGift(save, later(GIFT_EVERY_MS)).granted, String(n)).toBe(5);
    }
    for (const n of [3, 50]) {
      const { save } = claimGift(withCoins(n), t0);
      expect(save.lowCoinsSince, String(n)).toBeUndefined();
      expect(claimGift(save, later(GIFT_EVERY_MS)).granted, String(n)).toBe(0);
    }
  });

  it('si gana monedas antes de tiempo, se cancela la espera', () => {
    const { save: waiting } = claimGift(withCoins(0), t0);
    const earned = { ...waiting, novacoins: 10 };
    const { save, granted } = claimGift(earned, later(GIFT_EVERY_MS));
    expect(granted).toBe(0);
    expect(save.lowCoinsSince).toBeUndefined();
  });

  it('cuenta los minutos que faltan', () => {
    const { save } = claimGift(withCoins(1), t0);
    expect(msUntilGift(save, later(10 * 60_000))).toBe(20 * 60_000);
    expect(msUntilGift(withCoins(5), t0)).toBeNull();
  });
});
