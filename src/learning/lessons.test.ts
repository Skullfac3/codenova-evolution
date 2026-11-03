import { describe, expect, it } from 'vitest';
import vm from 'node:vm';
import { era1Lessons } from './lessons/era1';
import { formatValue, scoreEvaluation, validate } from './validate';
import type { Exercise, RunResult } from '../types/lesson';

/** Ejecutor de pruebas en Node (en el navegador se usa el sandbox de iframe). */
function runInNode(code: string): RunResult {
  const logs: string[] = [];
  const context = vm.createContext({
    console: { log: (...args: unknown[]) => logs.push(args.map(formatValue).join(' ')) },
  });
  try {
    new vm.Script(code).runInContext(context, { timeout: 1000 });
    return { logs };
  } catch (e) {
    const err = e as Error;
    if (/timed out/i.test(err.message)) return { logs, timedOut: true };
    return { logs, error: { name: err.name, message: err.message } };
  }
}

const allExercises: Array<[string, Exercise]> = era1Lessons.flatMap((lesson) =>
  [lesson.exercise, ...lesson.extraChallenges].map((ex) => [`${lesson.id} › ${ex.id}`, ex] as [string, Exercise]),
);

describe('Era 1 — estructura', () => {
  it('tiene 7 lecciones con ids únicos y encadenadas por "next"', () => {
    expect(era1Lessons).toHaveLength(7);
    const ids = era1Lessons.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
    era1Lessons.slice(0, -1).forEach((l, i) => expect(l.next).toBe(ids[i + 1]));
  });

  it('cada lección normal tiene 2 retos extra (10 y 15 min) y al menos una pista', () => {
    for (const l of era1Lessons.filter((l) => l.kind === 'lesson')) {
      expect(l.extraChallenges, l.id).toHaveLength(2);
      for (const ex of [l.exercise, ...l.extraChallenges]) expect(ex.hints.length, ex.id).toBeGreaterThan(0);
    }
  });

  it('la evaluación tiene máximo 5 preguntas con respuesta válida', () => {
    const evaluation = era1Lessons.find((l) => l.kind === 'evaluation')!;
    expect(evaluation.quiz!.length).toBeLessThanOrEqual(5);
    for (const q of evaluation.quiz!) expect(q.options[q.correctIndex]).toBeDefined();
  });

  it('los ejemplos producen exactamente la salida documentada', () => {
    for (const l of era1Lessons.filter((l) => l.example.code)) {
      expect(runInNode(l.example.code).logs, l.id).toEqual(l.example.output);
    }
  });
});

describe.each(allExercises)('%s', (_name, exercise) => {
  it('la solución aprueba', () => {
    const result = validate(exercise, exercise.solution, runInNode(exercise.solution));
    expect(result.failures).toEqual([]);
  });

  it('el código inicial NO aprueba', () => {
    const result = validate(exercise, exercise.starterCode, runInNode(exercise.starterCode));
    expect(result.passed).toBe(false);
  });
});

describe('calificación de evaluaciones', () => {
  it('sin ejercicio práctico no se aprueba', () => {
    expect(scoreEvaluation(5, 5, false)).toBeLessThan(60);
  });
  it('3 de 5 correctas + práctico aprueba', () => {
    expect(scoreEvaluation(3, 5, true)).toBe(76);
  });
});
