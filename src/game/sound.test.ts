import { describe, expect, it } from 'vitest';
import { MASTER_GAIN, SOUNDS, type SoundName } from './sound';

/** Volumen máximo de una nota (el que se usa si la nota no lo indica). */
const vol = (n: (typeof SOUNDS)[SoundName][number]) => n[4] ?? 0.1;

/** Suma de los volúmenes de las notas que suenan a la vez en el peor momento. */
function worstOverlap(name: SoundName): number {
  const notes = SOUNDS[name];
  let worst = 0;
  for (const [, start] of notes) {
    const t = start + 0.01;
    const sum = notes.filter(([, s, d]) => s <= t && t < s + d).reduce((acc, n) => acc + vol(n), 0);
    worst = Math.max(worst, sum);
  }
  return worst;
}

describe('sonidos', () => {
  it('se oyen en la bocina de un teléfono: picos de al menos 0.2 (salvo el tic del atajo)', () => {
    for (const name of Object.keys(SOUNDS) as SoundName[]) {
      if (name === 'tick') continue;
      const loudest = Math.max(...SOUNDS[name].map(vol));
      expect(loudest * MASTER_GAIN, name).toBeGreaterThanOrEqual(0.2);
    }
  });

  it('no saturan: las notas simultáneas no pasan de 1', () => {
    for (const name of Object.keys(SOUNDS) as SoundName[]) {
      expect(worstOverlap(name) * MASTER_GAIN, name).toBeLessThanOrEqual(1);
    }
  });
});
