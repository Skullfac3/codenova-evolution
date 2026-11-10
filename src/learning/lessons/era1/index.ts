import type { Lesson } from '../../../types/lesson';
import { lesson as l1 } from './01-tu-primera-etiqueta';
import { lesson as l2 } from './02-esqueleto-pagina';
import { lesson as l3 } from './03-titulos-parrafos';
import { lesson as l4 } from './04-enlaces-imagenes';
import { lesson as l5 } from './05-listas';
import { lesson as l6 } from './06-formularios';
import { lesson as l7 } from './07-evaluacion';

/**
 * Era 1 — Prehistoria: HTML. 7 microlecciones (6 lecciones + evaluación).
 * Los ejercicios son HTML: se validan contra el DOM y se ven en una
 * vista previa, sin ejecutar código (ver validateHtml).
 * El orden importa: es la ruta del estudiante.
 */
export const era1Lessons: Lesson[] = [l1, l2, l3, l4, l5, l6, l7];
