import type { Check, DurationMinutes, Exercise, Lesson, RunResult } from '../types/lesson';

export interface ValidationResult {
  passed: boolean;
  /** Mensajes de Proto-0 para cada comprobación fallida. */
  failures: string[];
}

/** Elimina comentarios para que `code-matches` no se engañe con texto comentado. */
export function stripComments(code: string): string {
  return code
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[^:"'`\\])\/\/.*$/gm, '$1');
}

function runCheck(check: Check, result: RunResult, code: string): boolean {
  const clean = stripComments(code);
  switch (check.type) {
    case 'no-error':
      return !result.error && !result.timedOut;
    case 'output-equals':
      return (
        result.logs.length === check.expected.length &&
        check.expected.every((line, i) => result.logs[i]?.trim() === line)
      );
    case 'output-matches': {
      const line = result.logs[check.line];
      return line !== undefined && new RegExp(check.pattern).test(line.trim());
    }
    case 'code-matches':
      return new RegExp(check.pattern, 'm').test(clean);
    case 'code-not-matches':
      return !new RegExp(check.pattern, 'm').test(clean);
  }
}

export function validate(exercise: Exercise, code: string, result: RunResult): ValidationResult {
  // Un error de ejecución se explica primero: es lo que el estudiante necesita entender.
  if (result.timedOut) {
    return { passed: false, failures: [explainError({ name: 'Timeout', message: '' })] };
  }
  if (result.error) {
    return { passed: false, failures: [explainError(result.error)] };
  }
  const failures = exercise.checks
    .filter((check) => !runCheck(check, result, code))
    .map((check) => check.message);
  return { passed: failures.length === 0, failures };
}

/**
 * Validación completa: comprobaciones visibles + pruebas ocultas.
 * `run` ejecuta código (sandbox en el navegador, vm en las pruebas).
 */
export async function validateWithTests(
  exercise: Exercise,
  code: string,
  result: RunResult,
  run: (code: string) => Promise<RunResult>,
): Promise<ValidationResult> {
  const base = validate(exercise, code, result);
  if (!base.passed || !exercise.tests?.length) return base;

  for (const test of exercise.tests) {
    const r = await run(`${code}\n;\n${test.code}`);
    if (r.timedOut || r.error) {
      return { passed: false, failures: [explainError(r.error ?? { name: 'Timeout', message: '' })] };
    }
    const tail = r.logs.slice(-test.expected.length);
    const ok = tail.length === test.expected.length && test.expected.every((line, i) => tail[i]?.trim() === line);
    if (!ok) return { passed: false, failures: [test.message] };
  }
  return base;
}

/** Traduce errores de JavaScript a explicaciones amables de Proto-0. */
export function explainError(error: { name: string; message: string }): string {
  const { name, message } = error;
  if (name === 'Timeout') {
    return 'Tu programa tardó demasiado. ¿Hay un ciclo que nunca termina?';
  }
  if (name === 'TypeError' && /constant/i.test(message)) {
    return 'Intentaste cambiar el valor de una constante (const). Si el valor debe cambiar, usa let.';
  }
  if (name === 'ReferenceError') {
    const match = message.match(/^(\S+) is not defined/);
    const word = match?.[1];
    return word
      ? `No conozco "${word}". ¿Olvidaste crear la variable, escribirla igual (mayúsculas cuentan) o poner comillas si era texto?`
      : 'Usaste un nombre que todavía no existe. Revisa que la variable esté creada antes de usarla.';
  }
  if (name === 'SyntaxError') {
    return 'Hay algo mal escrito: revisa comillas, paréntesis y que cada texto empiece y termine con la misma comilla.';
  }
  return `Ocurrió un error (${name}): ${message}`;
}

/** Ejercicios que tocan según la duración elegida. */
export function exercisesFor(lesson: Lesson, minutes: DurationMinutes): Exercise[] {
  const extras = minutes === 5 ? 0 : minutes === 10 ? 1 : 2;
  return [lesson.exercise, ...lesson.extraChallenges.slice(0, extras)];
}

/**
 * Calificación de una lección: 100 al aprobar, −10 por pista usada,
 * mínimo 60 (aprobar siempre cuenta).
 */
export function scoreLesson(passed: boolean, hintsUsed: number): number {
  if (!passed) return 0;
  return Math.max(60, 100 - hintsUsed * 10);
}

/**
 * Calificación de una evaluación: preguntas = 60 %, ejercicio práctico = 40 %.
 * El ejercicio práctico es obligatorio: sin él, la puntuación máxima es 59.
 */
export function scoreEvaluation(correctAnswers: number, totalQuestions: number, practicalPassed: boolean): number {
  const quiz = totalQuestions === 0 ? 60 : Math.round((correctAnswers / totalQuestions) * 60);
  return practicalPassed ? quiz + 40 : Math.min(quiz, 59);
}

/** Formatea valores igual que lo hará la consola del sandbox. */
export function formatValue(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value === undefined) return 'undefined';
  if (typeof value === 'function') return `[función ${value.name || 'anónima'}]`;
  if (typeof value === 'object' && value !== null) {
    try {
      return JSON.stringify(value);
    } catch {
      return String(value);
    }
  }
  return String(value);
}
