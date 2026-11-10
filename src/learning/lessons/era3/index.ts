import type { Lesson } from '../../../types/lesson';
import { lesson as l1 } from './01-que-es-programar';
import { lesson as l2 } from './02-la-consola';
import { lesson as l3 } from './03-variables';
import { lesson as l4 } from './04-constantes';
import { lesson as l5 } from './05-tipos-de-datos';
import { lesson as l6 } from './06-operadores';
import { lesson as l7 } from './07-evaluacion';
import { lesson as l8 } from './01-condicionales';
import { lesson as l9 } from './02-operadores-logicos';
import { lesson as l10 } from './03-ciclo-for';
import { lesson as l11 } from './04-ciclo-while';
import { lesson as l12 } from './05-funciones';
import { lesson as l13 } from './06-arreglos';
import { lesson as l14 } from './07-objetos';
import { lesson as l16 } from './08-el-dom';
import { lesson as l17 } from './09-eventos';
import { lesson as l18 } from './10-json-fetch';
import { lesson as l19 } from './11-promesas-async';
import { lesson as l15 } from './08-evaluacion';

/**
 * Era 3 — Era industrial: JavaScript por niveles. Las 15 microlecciones
 * vivían antes en las eras 1 y 2; se mudaron aquí cuando el mapa se
 * reordenó para que HTML (Era 1) y CSS (Era 2) vayan primero.
 * El orden importa: es la ruta del estudiante. Medio avanzado
 * (DOM, eventos, JSON/fetch, promesas y async/await) va antes de la
 * evaluación final, que sigue cerrando la era por ahora.
 */
export const era3Lessons: Lesson[] = [l1, l2, l3, l4, l5, l6, l7, l8, l9, l10, l11, l12, l13, l14, l16, l17, l18, l19, l15];
