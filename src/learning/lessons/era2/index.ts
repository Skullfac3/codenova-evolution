import type { Lesson } from '../../../types/lesson';
import { lesson as l1 } from './01-tu-primera-regla';
import { lesson as l2 } from './02-selectores';
import { lesson as l3 } from './03-colores-fondos';
import { lesson as l4 } from './04-texto-tipografia';
import { lesson as l5 } from './05-modelo-caja';
import { lesson as l6 } from './06-flexbox';
import { lesson as l7 } from './07-tailwind';
import { lesson as l8 } from './08-evaluacion';

/**
 * Era 2 — Civilizaciones antiguas: CSS + Tailwind. 8 microlecciones
 * (7 lecciones + evaluación). Los ejercicios son HTML con bloques
 * <style>: se validan contra el DOM y con el check style-contains,
 * y se ven en la vista previa (ver validateHtml).
 * La lección de Tailwind usa un mini-Tailwind en <style> (ver 07-tailwind.ts).
 * El orden importa: es la ruta del estudiante.
 */
export const era2Lessons: Lesson[] = [l1, l2, l3, l4, l5, l6, l7, l8];
