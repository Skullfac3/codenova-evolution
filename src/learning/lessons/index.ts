import type { Lesson } from '../../types/lesson';
import { findLesson as findLessonMeta } from '../catalog';

/**
 * Lecciones completas: se cargan bajo demanda, por era.
 *
 * El mapa, el refugio, la tienda, los perfiles y el progreso solo
 * necesitan los metadatos (título, temas, recompensa...), que viven
 * en el catálogo ligero src/learning/catalog.ts y viajan en el
 * paquete inicial. El contenido completo de una lección (intro,
 * concepto, ejercicios, quiz) se baja solo cuando se abre esa
 * lección, con loadLesson(). Así la primera pantalla no tiene que
 * bajar las 30 lecciones a la vez.
 *
 * El mapa de eras sigue siendo el mismo (reordenado 2026-11-09 para
 * que HTML y CSS vayan primero): Era 1 HTML, Era 2 CSS + Tailwind,
 * Era 3 JavaScript por niveles, Era 4 React, Era 5 TypeScript +
 * Next.js. Las 15 lecciones de JavaScript viven en la Era 3.
 */
export { ERAS, allLessons, findLesson, lessonsOfEra, eraById } from '../catalog';
export type { EraMeta, LessonMeta } from '../catalog';

const eraModules: Record<number, () => Promise<Record<string, unknown>>> = {
  1: () => import('./era1'),
  2: () => import('./era2'),
  3: () => import('./era3'),
};

const eraLoaders: Record<number, Promise<Lesson[]> | undefined> = {};

const eraLessonsKey = (era: number) => `era${era}Lessons`;

/** Lecciones completas de una era, con caché por sesión. */
export async function loadEraLessons(era: number): Promise<Lesson[]> {
  const cached = eraLoaders[era];
  if (cached) return cached;
  const loader = eraModules[era];
  if (!loader) return [];
  const promise = loader().then((mod) => {
    const lessons = mod[eraLessonsKey(era)] as Lesson[] | undefined;
    return lessons ?? [];
  });
  eraLoaders[era] = promise;
  return promise;
}

/** Lección completa por id, o undefined si no existe. */
export async function loadLesson(id: string): Promise<Lesson | undefined> {
  const meta = findLessonMeta(id);
  if (!meta) return undefined;
  const lessons = await loadEraLessons(meta.era);
  return lessons.find((l) => l.id === id);
}
