import { describe, expect, it } from 'vitest';
import { ERAS, allLessons } from './catalog';
import { era1Lessons } from './lessons/era1';
import { era2Lessons } from './lessons/era2';
import { era3Lessons } from './lessons/era3';

/**
 * El catálogo es una copia ligera de los metadatos de las lecciones
 * (título, temas, recompensa, orden, siguiente). Si alguien edita
 * una lección y no actualiza el catálogo, el mapa mostraría datos
 * viejos: esta prueba lo impide.
 */
describe('catálogo de lecciones', () => {
  it('hay 5 eras y 36 lecciones publicadas', () => {
    expect(ERAS).toHaveLength(5);
    expect(allLessons).toHaveLength(36);
    expect(ERAS.map((e) => e.lessons.length)).toEqual([7, 8, 21, 0, 0]);
  });

  it('cada metadato coincide con su lección completa', () => {
    const full = [...era1Lessons, ...era2Lessons, ...era3Lessons];
    expect(allLessons).toHaveLength(full.length);
    for (const lesson of full) {
      const meta = allLessons.find((m) => m.id === lesson.id);
      expect(meta, lesson.id).toBeDefined();
      expect(meta).toEqual({
        id: lesson.id,
        era: lesson.era,
        order: lesson.order,
        kind: lesson.kind,
        title: lesson.title,
        topics: lesson.topics,
        reward: lesson.reward,
        next: lesson.next,
      });
    }
  });

  it('las eras anunciadas conservan su nombre, icono y adelanto', () => {
    expect(ERAS.find((e) => e.id === 4)).toMatchObject({
      name: 'Era digital',
      icon: '💻',
      teaser: 'React: componentes e interfaces',
    });
    expect(ERAS.find((e) => e.id === 5)).toMatchObject({
      name: 'Era futurista',
      icon: '🚀',
      teaser: 'TypeScript y Next.js: la web profesional',
    });
  });
});
