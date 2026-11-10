/**
 * Modelo de datos de las microlecciones de CodeNova Evolution.
 *
 * Las lecciones son DATOS, no componentes: así se pueden revisar por
 * docentes, traducir y validar automáticamente sin tocar la interfaz.
 *
 * Estructura pedagógica (siempre en este orden):
 *   1. intro  2. concept  3. example  4. exercise
 *   5. feedback  6. reward  7. next
 */

export type EraId = 1 | 2 | 3 | 4 | 5;
export type LessonKind = 'lesson' | 'evaluation';
export type DurationMinutes = 5 | 10 | 15;

/** Resultado de ejecutar código del estudiante en el sandbox. */
export interface RunResult {
  /** Cada llamada a console.log, ya formateada como texto. */
  logs: string[];
  /** Error no capturado, si lo hubo. */
  error?: { name: string; message: string };
  /** true si la ejecución superó el tiempo límite. */
  timedOut?: boolean;
}

/**
 * Comprobaciones declarativas. Cada una lleva el mensaje que Proto-0
 * dirá si falla, escrito en lenguaje sencillo.
 */
export type Check =
  | { type: 'no-error'; message: string }
  | { type: 'output-equals'; expected: string[]; message: string }
  | { type: 'output-matches'; line: number; pattern: string; message: string }
  | { type: 'code-matches'; pattern: string; message: string }
  | { type: 'code-not-matches'; pattern: string; message: string }
  | {
      type: 'html-contains';
      /** Selector CSS (p. ej. 'h1', 'a[href]', 'ul li'). */
      selector: string;
      /** Si se indica, el texto visible del elemento debe contenerlo. */
      text?: string;
      /** Si se indica, el elemento debe tener ese atributo (y valor, si se indica). */
      attr?: { name: string; value?: string };
      /** Si se indica, deben coincidir exactamente esa cantidad de elementos. */
      count?: number;
      message: string;
    };

/**
 * Prueba oculta: se agrega `code` al final del código del estudiante y se
 * comparan las últimas líneas de la consola con `expected`. Sirve para
 * comprobar que una función funciona con OTROS valores, no solo con los
 * del enunciado (evita que se imprima la respuesta a mano).
 */
export interface HiddenTest {
  code: string;
  expected: string[];
  message: string;
}

export interface Exercise {
  id: string;
  /** Lenguaje del ejercicio: 'js' ejecuta en el sandbox; 'html' se valida
   *  contra el DOM y se muestra en una vista previa. Por defecto 'js'. */
  language?: 'js' | 'html';
  /** Pruebas ocultas que se ejecutan solo si las comprobaciones visibles pasan. */
  tests?: HiddenTest[];
  /** Qué debe hacer el estudiante. */
  prompt: string;
  /** Código inicial que aparece en el editor. */
  starterCode: string;
  /** Solución de referencia (la usan las pruebas automáticas, nunca se muestra de entrada). */
  solution: string;
  checks: Check[];
  /** Pistas progresivas de Proto-0: de la más general a la más concreta. */
  hints: string[];
}

export interface QuizQuestion {
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface Lesson {
  id: string;
  era: EraId;
  order: number;
  kind: LessonKind;
  title: string;
  /** Conceptos que cubre (para el mapa de aprendizaje). */
  topics: string[];

  /** 1. Introducción narrativa breve. */
  intro: string;
  /** 2. Explicación del concepto (Markdown sencillo). */
  concept: string;
  /** 3. Ejemplo práctico con su salida esperada. */
  example: { code: string; output: string[] };
  /** 4. Ejercicio principal (obligatorio en cualquier duración). */
  exercise: Exercise;
  /** Retos extra: 10 min = primero; 15 min = ambos. */
  extraChallenges: Exercise[];
  /** Solo en evaluaciones: máximo 5 preguntas. */
  quiz?: QuizQuestion[];

  /** 5. Retroalimentación de Proto-0. */
  feedback: { success: string; retry: string };
  /** 6. Recompensa. Valor de referencia: la fuente de verdad es la tabla `lessons` en Supabase. */
  reward: { xp: number; coins: number };
  /** 7. Siguiente desafío. */
  next: string | null;
}
