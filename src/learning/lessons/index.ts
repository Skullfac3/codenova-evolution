import type { EraId, Lesson } from '../../types/lesson';
import { era1Lessons } from './era1';
import { era2Lessons } from './era2';

export interface EraInfo {
  id: EraId;
  name: string;
  icon: string;
  /** Lecciones publicadas. Vacío = era anunciada pero sin contenido aún. */
  lessons: Lesson[];
}

/** Catálogo de eras: el mismo orden que la tabla `eras` en Supabase. */
export const ERAS: EraInfo[] = [
  { id: 1, name: 'Prehistoria', icon: '🪨', lessons: era1Lessons },
  { id: 2, name: 'Civilizaciones antiguas', icon: '🏛️', lessons: era2Lessons },
  { id: 3, name: 'Era industrial', icon: '⚙️', lessons: [] },
  { id: 4, name: 'Era digital', icon: '💻', lessons: [] },
  { id: 5, name: 'Era futurista', icon: '🚀', lessons: [] },
];

export const allLessons: Lesson[] = ERAS.flatMap((e) => e.lessons);

export const findLesson = (id: string) => allLessons.find((l) => l.id === id);
export const lessonsOfEra = (era: number) => ERAS.find((e) => e.id === era)?.lessons ?? [];
