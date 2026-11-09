import { describe, expect, it } from 'vitest';
import vm from 'node:vm';
import { ERAS, allLessons } from './lessons';
import { formatValue, scoreEvaluation, validateWithTests } from './validate';
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
const run = async (code: string) => runInNode(code);
const check = (ex: Exercise, code: string) => validateWithTests(ex, code, runInNode(code), run);

const publishedEras = ERAS.filter((e) => e.lessons.length > 0);
const allExercises: Array<[string, Exercise]> = allLessons.flatMap((lesson) =>
  [lesson.exercise, ...lesson.extraChallenges].map((ex) => [`${lesson.id} › ${ex.id}`, ex] as [string, Exercise]),
);

describe('estructura de las eras', () => {
  it('ids únicos en todas las eras', () => {
    const ids = allLessons.map((l) => l.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('las 15 microlecciones de JavaScript están publicadas en la Era 3', () => {
    expect(allLessons).toHaveLength(15);
    expect(ERAS.find((e) => e.id === 3)!.lessons).toHaveLength(15);
  });

  it('las eras 1, 2, 4 y 5 están anunciadas sin lecciones todavía', () => {
    for (const id of [1, 2, 4, 5] as const) {
      expect(ERAS.find((e) => e.id === id)!.lessons).toHaveLength(0);
    }
  });

  it.each(publishedEras.map((e) => [e.name, e] as const))('%s: orden, encadenado y una evaluación al final', (_n, era) => {
    era.lessons.forEach((l, i) => {
      expect(l.era).toBe(era.id);
      expect(l.order).toBe(i + 1);
    });
    era.lessons.slice(0, -1).forEach((l, i) => expect(l.next).toBe(era.lessons[i + 1]!.id));
    expect(era.lessons.at(-1)!.kind).toBe('evaluation');
  });

  it('la última lección de la Era 3 no tiene siguiente (la Era 4 llega después)', () => {
    expect(ERAS.find((e) => e.id === 3)!.lessons.at(-1)!.next).toBeNull();
  });

  it('cada lección normal tiene 2 retos extra y pistas', () => {
    for (const l of allLessons.filter((l) => l.kind === 'lesson')) {
      expect(l.extraChallenges, l.id).toHaveLength(2);
      for (const ex of [l.exercise, ...l.extraChallenges]) expect(ex.hints.length, ex.id).toBeGreaterThan(0);
    }
  });

  it('las evaluaciones tienen máximo 5 preguntas con respuesta válida', () => {
    for (const ev of allLessons.filter((l) => l.kind === 'evaluation')) {
      expect(ev.quiz!.length).toBeLessThanOrEqual(5);
      for (const q of ev.quiz!) expect(q.options[q.correctIndex], ev.id).toBeDefined();
    }
  });

  it('los ejemplos producen exactamente la salida documentada', () => {
    for (const l of allLessons.filter((l) => l.example.code)) {
      expect(runInNode(l.example.code).logs, l.id).toEqual(l.example.output);
    }
  });
});

describe.each(allExercises)('%s', (_name, exercise) => {
  it('la solución aprueba (incluidas las pruebas ocultas)', async () => {
    expect((await check(exercise, exercise.solution)).failures).toEqual([]);
  });

  it('el código inicial NO aprueba', async () => {
    expect((await check(exercise, exercise.starterCode)).passed).toBe(false);
  });
});

describe('pruebas ocultas', () => {
  const find = (id: string) => allExercises.find(([, e]) => e.id === id)![1];

  it('rechazan una función que imprime la respuesta a mano', async () => {
    const ex = find('e3-12-ex-main');
    const tramposo = 'function area(base, altura) {\n  return 20;\n}\nconsole.log(area(4, 5));';
    const r = await check(ex, tramposo);
    expect(r.passed).toBe(false);
    expect(r.failures[0]).toContain('otros valores');
  });

  it('detectan "mayor o igual" cuando se pedía "mayor que"', async () => {
    const ex = find('e3-15-ex-practical');
    const casi = ex.solution.replace('n > limite', 'n >= limite');
    expect((await check(ex, casi)).passed).toBe(false);
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
