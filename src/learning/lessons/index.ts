import type { EraId, Lesson } from '../../types/lesson';
import { era1Lessons } from './era1';
import { era3Lessons } from './era3';

export interface EraInfo {
  id: EraId;
  name: string;
  icon: string;
  /** Lecciones publicadas. Vacío = era anunciada pero sin contenido aún. */
  lessons: Lesson[];
  /** Qué viene en esta era, mientras no tiene lecciones. */
  teaser?: string;
}

/**
 * Catálogo de eras: el mismo orden que la tabla `eras` en Supabase.
 *
 * El mapa se reordenó (2026-11-09) para que HTML y CSS vayan primero:
 * Era 1 HTML, Era 2 CSS + Tailwind, Era 3 JavaScript por niveles,
 * Era 4 React, Era 5 TypeScript + Next.js. Las 15 lecciones de
 * JavaScript, que antes estaban en las eras 1 y 2, viven ahora en la
 * Era 3 (sus ids pasaron de e1/e2 a e3; el progreso guardado
 * se migra en services/storage/save.ts).
 */
export const ERAS: EraInfo[] = [
  { id: 1, name: 'Prehistoria', icon: '🪨', lessons: era1Lessons },
  { id: 2, name: 'Civilizaciones antiguas', icon: '🏛️', lessons: [], teaser: 'CSS y Tailwind: colores, diseño y estilo' },
  { id: 3, name: 'Era industrial', icon: '⚙️', lessons: era3Lessons },
  { id: 4, name: 'Era digital', icon: '💻', lessons: [], teaser: 'React: componentes e interfaces' },
  { id: 5, name: 'Era futurista', icon: '🚀', lessons: [], teaser: 'TypeScript y Next.js: la web profesional' },
];

export const allLessons: Lesson[] = ERAS.flatMap((e) => e.lessons);

export const findLesson = (id: string) => allLessons.find((l) => l.id === id);
export const lessonsOfEra = (era: number) => ERAS.find((e) => e.id === era)?.lessons ?? [];
