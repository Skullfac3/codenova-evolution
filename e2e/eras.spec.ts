import { expect, test, type Page } from '@playwright/test';
import { era1Lessons } from '../src/learning/lessons/era1';
import { era2Lessons } from '../src/learning/lessons/era2';
import type { Exercise, Lesson } from '../src/types/lesson';

const allExercises = new Map<string, Exercise>(
  [...era1Lessons, ...era2Lessons].flatMap((l) => [l.exercise, ...l.extraChallenges]).map((e) => [e.id, e]),
);

async function shot(page: Page, name: string) {
  await page.screenshot({ path: `e2e-results/${test.info().project.name}/${name}.png`, fullPage: true });
}

async function expectNoHorizontalScroll(page: Page) {
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  expect(overflow, 'la página no debe desplazarse horizontalmente').toBeLessThanOrEqual(0);
}

async function typeCode(page: Page, code: string) {
  const content = page.locator('.cm-content').first();
  await content.click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.press('Delete');
  await page.keyboard.insertText(code);
}

async function currentExercise(page: Page): Promise<Exercise> {
  const testId = await page.locator('[data-testid^="exercise-"]').getAttribute('data-testid');
  return allExercises.get(testId!.replace('exercise-', ''))!;
}

/** Resuelve el reto visible: primero prueba el código inicial (debe fallar), luego la solución. */
async function solveCurrentExercise(page: Page, opts: { useHint?: boolean } = {}) {
  const ex = await currentExercise(page);
  await page.getByTestId('btn-run').click();
  await expect(page.getByTestId('feedback')).toHaveAttribute('data-status', 'fail');

  if (opts.useHint) {
    await page.getByTestId('btn-hint').click();
    await expect(page.getByTestId('hints')).toContainText(ex.hints[0]!);
  }

  await typeCode(page, ex.solution);
  await page.getByTestId('btn-run').click();
  await expect(page.getByTestId('feedback')).toHaveAttribute('data-status', 'pass');
  await page.getByTestId('btn-continue').click();
}

const hud = async (page: Page) => ({
  xp: await page.getByTestId('hud-xp').textContent(),
  coins: await page.getByTestId('hud-coins').textContent(),
  level: await page.getByTestId('hud-level').textContent(),
});

test.describe('Eras 1 y 2 · prueba completa', () => {
  /** Recorre una era completa: lecciones con duraciones variadas y evaluación (reprobada y luego aprobada). */
  async function completeEra(page: Page, lessons: Lesson[], tag: string, startXp: number) {
    const durations = [15, 10, 5] as const;
    let xp = startXp;

    for (const [index, lesson] of lessons.filter((l) => l.kind === 'lesson').entries()) {
      const minutes = durations[index % 3]!;
      const useHint = index === 2; // una lección por era usa pista → calificación 90
      if (await page.getByTestId('map').isVisible()) await page.getByTestId(`lesson-${lesson.id}`).click();
      await expect(page.getByTestId('player')).toHaveAttribute('data-lesson', lesson.id);
      await expectNoHorizontalScroll(page);
      if (index === 0) await shot(page, `${tag}-02-intro-leccion`);

      await page.getByTestId(`duration-${minutes}`).click();
      await page.getByTestId('btn-start').click();
      const count = minutes === 5 ? 1 : minutes === 10 ? 2 : 3;
      for (let i = 0; i < count; i++) {
        await solveCurrentExercise(page, { useHint: useHint && i === 0 });
        if (index === 0 && i === 0) await shot(page, `${tag}-03-despues-del-primer-reto`);
      }

      await expect(page.getByTestId('reward')).toHaveAttribute('data-awarded', 'true');
      await expect(page.getByTestId('reward-score')).toHaveText(useHint ? '90' : '100');
      xp += lesson.reward.xp;
      await expect(page.getByTestId('hud-xp')).toHaveText(`${xp} XP`);
      await page.getByTestId('btn-next-lesson').click();
    }

    // Evaluación — intento 1: respuestas incorrectas → no aprueba aunque el práctico esté bien.
    const evaluation = lessons.find((l) => l.kind === 'evaluation')!;
    await expect(page.getByTestId('player')).toHaveAttribute('data-lesson', evaluation.id);
    await page.getByTestId('btn-start').click();
    for (const q of evaluation.quiz!) {
      await page.getByTestId(`quiz-option-${(q.correctIndex + 1) % q.options.length}`).click();
      await page.getByTestId('btn-next-question').click();
    }
    await solveCurrentExercise(page);
    await expect(page.getByTestId('eval-failed')).toBeVisible();
    await expect(page.getByTestId('hud-xp')).toHaveText(`${xp} XP`);

    // Intento 2: todas bien.
    await page.getByTestId('btn-retry').click();
    await page.getByTestId('btn-start').click();
    for (const [i, q] of evaluation.quiz!.entries()) {
      await page.getByTestId(`quiz-option-${q.correctIndex}`).click();
      await expect(page.getByTestId('quiz-feedback')).toContainText('¡Correcto!');
      if (i === 0) await shot(page, `${tag}-04-pregunta-evaluacion`);
      await page.getByTestId('btn-next-question').click();
    }
    await solveCurrentExercise(page);
    await expect(page.getByTestId('reward')).toHaveAttribute('data-awarded', 'true');
    await expect(page.getByTestId('era-unlocked')).toBeVisible();
    await shot(page, `${tag}-05-era-desbloqueada`);
    return xp + evaluation.reward.xp;
  }

  test('una persona nueva completa la Prehistoria y las Civilizaciones antiguas', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('tab-lecciones').click();
    await expect(page.getByTestId('map')).toBeVisible();
    expect(await hud(page)).toEqual({ xp: '0 XP', coins: '🪙 0', level: 'Nv 1' });

    // Solo la primera lección está abierta y la Era 2 está bloqueada.
    await expect(page.getByTestId(`lesson-${era1Lessons[0]!.id}`)).toHaveAttribute('data-state', 'open');
    for (const l of era1Lessons.slice(1)) await expect(page.getByTestId(`lesson-${l.id}`)).toHaveAttribute('data-state', 'locked');
    await expect(page.getByTestId('era-2')).toHaveAttribute('data-state', 'locked');
    await expectNoHorizontalScroll(page);
    await shot(page, '01-mapa-inicial');

    // ── Era 1 ──
    let xp = await completeEra(page, era1Lessons, 'era1', 0);
    expect(xp).toBe(170);
    expect(await hud(page)).toEqual({ xp: '170 XP', coins: '🪙 90', level: 'Nv 2' });
    await expect(page.getByTestId('era-unlocked')).toHaveAttribute('data-era', '2');

    // "Siguiente lección" lleva directo a la Era 2.
    await page.getByTestId('btn-next-lesson').click();
    await expect(page.getByTestId('player')).toHaveAttribute('data-lesson', era2Lessons[0]!.id);
    await page.getByTestId('btn-exit').click();
    await expect(page.getByTestId('era-1')).toHaveAttribute('data-state', 'done');
    await expect(page.getByTestId('era-2')).toHaveAttribute('data-state', 'open');
    await expect(page.getByTestId(`lesson-${era2Lessons[1]!.id}`)).toHaveAttribute('data-state', 'locked');
    await shot(page, '06-mapa-era2-abierta');

    // Recargar a mitad del camino: el progreso sigue ahí.
    await page.reload();
    expect(await hud(page)).toEqual({ xp: '170 XP', coins: '🪙 90', level: 'Nv 2' });
    await page.getByTestId('tab-lecciones').click();

    // ── Era 2 ──
    xp = await completeEra(page, era2Lessons, 'era2', xp);
    expect(xp).toBe(405); // igual que en Supabase
    expect(await hud(page)).toEqual({ xp: '405 XP', coins: '🪙 235', level: 'Nv 3' });
    await expect(page.getByTestId('era-unlocked')).toHaveAttribute('data-era', '3');

    await page.getByTestId('btn-next-lesson').click();
    await expect(page.getByTestId('map')).toBeVisible();
    await expect(page.getByTestId('era-banner')).toContainText('Era 3');
    for (const l of [...era1Lessons, ...era2Lessons]) await expect(page.getByTestId(`lesson-${l.id}`)).toHaveAttribute('data-state', 'done');
    await shot(page, '07-mapa-completo');

    // La partida está lista para sincronizar con Supabase: 15 eventos únicos.
    const saved = await page.evaluate(() => JSON.parse(localStorage.getItem('codenova:save')!));
    expect(saved.unlockedEras).toEqual([1, 2, 3]);
    expect(saved.pendingSync).toHaveLength(15);
    expect(new Set(saved.pendingSync.map((e: { eventId: string }) => e.eventId)).size).toBe(15);

    // Repetir una lección no da recompensa doble.
    await page.getByTestId(`lesson-${era2Lessons[0]!.id}`).click();
    await page.getByTestId('btn-start').click();
    await solveCurrentExercise(page);
    await expect(page.getByTestId('reward')).toHaveAttribute('data-awarded', 'false');
    await expect(page.getByTestId('hud-xp')).toHaveText('405 XP');
  });

  test('las pruebas ocultas detectan una función que imprime la respuesta a mano', async ({ page }) => {
    await page.addInitScript(() => {
      // Partida con la Era 1 completa para llegar directo a funciones.
      if (!localStorage.getItem('codenova:save')) {
        const done = Object.fromEntries(
          ['e1-01-que-es-programar','e1-02-la-consola','e1-03-variables','e1-04-constantes','e1-05-tipos-de-datos','e1-06-operadores','e1-07-evaluacion',
           'e2-01-condicionales','e2-02-operadores-logicos','e2-03-ciclo-for','e2-04-ciclo-while']
            .map((id) => [id, { score: 100, completedAt: '2026-11-03T00:00:00Z', eventId: crypto.randomUUID() }]),
        );
        localStorage.setItem('codenova:save', JSON.stringify({
          version: 2, explorerName: 'Prueba', avatar: 'explorer-01', xp: 270, novacoins: 150, currentEra: 2,
          unlockedEras: [1, 2], completedLessons: done, worlds: { 1: { objects: [] }, 2: { objects: [] } },
          inventory: {}, pets: [], pendingSync: [], updatedAt: '2026-11-03T00:00:00Z',
        }));
      }
    });
    await page.goto('/');
    await page.getByTestId('tab-lecciones').click();
    await page.getByTestId('lesson-e2-05-funciones').click();
    await page.getByTestId('btn-start').click();
    await typeCode(page, 'function area(base, altura) {\n  return 20;\n}\nconsole.log(area(4, 5));');
    await page.getByTestId('btn-run').click();
    await expect(page.getByTestId('console')).toContainText('20');
    await expect(page.getByTestId('feedback')).toHaveAttribute('data-status', 'fail');
    await expect(page.getByTestId('feedback')).toContainText('otros valores');
    await shot(page, '10-prueba-oculta');
  });

  test('un ciclo infinito no congela la app y se explica el error', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('tab-lecciones').click();
    await page.getByTestId(`lesson-${era1Lessons[0]!.id}`).click();
    await page.getByTestId('btn-start').click();
    await typeCode(page, 'while (true) {}');

    const t0 = Date.now();
    await page.getByTestId('btn-run').click();
    // Mientras corre, la interfaz sigue respondiendo.
    await page.getByTestId('btn-hint').click();
    await expect(page.getByTestId('hints')).toBeVisible();
    await expect(page.getByTestId('console')).toContainText('Tiempo agotado', { timeout: 5000 });
    await expect(page.getByTestId('feedback')).toContainText('ciclo que nunca termina');
    expect(Date.now() - t0).toBeLessThan(4000);
    await shot(page, '08-ciclo-infinito');

    // Y se puede volver a ejecutar normalmente.
    await typeCode(page, era1Lessons[0]!.exercise.solution);
    await page.getByTestId('btn-run').click();
    await expect(page.getByTestId('feedback')).toHaveAttribute('data-status', 'pass');
  });

  test('errores típicos de principiante reciben una explicación clara', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('tab-lecciones').click();
    await page.getByTestId(`lesson-${era1Lessons[0]!.id}`).click();
    await page.getByTestId('btn-start').click();

    const cases: Array<[string, string]> = [
      ['console.log(Hola)', 'No conozco "Hola"'],
      ['console.log("Hola)', 'Hay algo mal escrito'],
      ['const a = 1;\na = 2;', 'constante'],
      ['consol.log("hola")', 'No conozco "consol"'],
    ];
    for (const [code, expected] of cases) {
      await typeCode(page, code);
      await page.getByTestId('btn-run').click();
      await expect(page.getByTestId('feedback')).toContainText(expected);
    }
    await shot(page, '09-error-explicado');
  });

  test('el código del estudiante no puede leer la sesión ni la red', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('tab-lecciones').click();
    await page.evaluate(() => localStorage.setItem('sb-token', 'SECRETO'));
    await page.getByTestId(`lesson-${era1Lessons[0]!.id}`).click();
    await page.getByTestId('btn-start').click();
    await typeCode(
      page,
      'console.log(typeof localStorage, typeof document, typeof parent, typeof fetch, typeof XMLHttpRequest)',
    );
    await page.getByTestId('btn-run').click();
    await expect(page.getByTestId('console')).toContainText('undefined undefined undefined undefined undefined');
    await expect(page.getByTestId('console')).not.toContainText('SECRETO');
  });

  test('una partida del prototipo HTML se migra sin perder progreso', async ({ page }) => {
    await page.addInitScript(() => {
      if (!localStorage.getItem('codenova:save')) {
        localStorage.setItem(
          'codenova-save',
          JSON.stringify({ name: 'Ana', xp: 40, coins: 20, era: 1, completedLessons: ['e1-01-que-es-programar', 'e1-02-la-consola'] }),
        );
      }
    });
    await page.goto('/');
    await page.getByTestId('tab-lecciones').click();
    await expect(page.getByTestId('map')).toContainText('Hola, Ana');
    expect(await hud(page)).toEqual({ xp: '40 XP', coins: '🪙 20', level: 'Nv 1' });
    await expect(page.getByTestId('lesson-e1-02-la-consola')).toHaveAttribute('data-state', 'done');
    await expect(page.getByTestId('lesson-e1-03-variables')).toHaveAttribute('data-state', 'open');
    await expect(page.getByTestId('lesson-e1-04-constantes')).toHaveAttribute('data-state', 'locked');
    expect(await page.evaluate(() => localStorage.getItem('codenova-save:backup'))).not.toBeNull();
  });
});
