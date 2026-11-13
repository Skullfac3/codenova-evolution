import { expect, test, type Page } from '@playwright/test';
import { clickContinue } from './helpers';
import { era1Lessons } from '../src/learning/lessons/era1';
import { era2Lessons } from '../src/learning/lessons/era2';
import { era3Lessons } from '../src/learning/lessons/era3';
import type { Lesson } from '../src/types/lesson';

/**
 * Era 3 · Avanzado (manejo de errores, clases, módulos y proyecto final):
 * las 4 lecciones nuevas van tras async/await (e3-19) y antes de la
 * evaluación final. Se siembran las Eras 1 y 2 completas y la Era 3 hasta
 * async/await, como si el estudiante acabara de llegar a Avanzado.
 */
const seeded = [...era1Lessons, ...era2Lessons, ...era3Lessons.slice(0, 19)].map((l) => l.id);
const avanzadoLessons = ['e3-22-manejo-errores', 'e3-23-clases', 'e3-24-modulos', 'e3-25-proyecto-final'].map(
  (id) => era3Lessons.find((l) => l.id === id)!,
);
const asyncLesson = era3Lessons.find((l) => l.id === 'e3-19-promesas-async')!;
const evaluacion = era3Lessons.find((l) => l.id === 'e3-15-evaluacion')!;

test.describe('Era 3 · Avanzado', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((ids) => {
      if (localStorage.getItem('codenova:save')) return;
      localStorage.setItem(
        'codenova:save',
        JSON.stringify({
          // Eras 1 y 2 (360 XP) + Era 3 hasta e3-18 (445 XP).
          version: 3, explorerName: 'Explorador', avatar: 'explorer-01', xp: 805, novacoins: 435, currentEra: 3,
          unlockedEras: [1, 2, 3],
          completedLessons: Object.fromEntries(ids.map((id) => [id, { score: 100, completedAt: '2026-11-05T00:00:00Z', eventId: id }])),
          worlds: { 1: { objects: [] }, 2: { objects: [] }, 3: { objects: [] } }, inventory: {}, pets: [], pendingSync: [], updatedAt: '2026-11-05T00:00:00Z',
        }),
      );
    }, seeded);
  });

  /** Resuelve el ejercicio principal de la lección abierta con su solución. */
  async function solveLesson(page: Page, lesson: Lesson) {
    await expect(page.getByTestId('player')).toHaveAttribute('data-lesson', lesson.id);
    await page.getByTestId('duration-5').click();
    await page.getByTestId('btn-start').click();
    // El código inicial no aprueba.
    await page.getByTestId('btn-run').click();
    await expect(page.getByTestId('feedback')).toHaveAttribute('data-status', 'fail');
    // La solución aprueba (en el sandbox real).
    const content = page.locator('.cm-content').first();
    await content.click();
    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.press('Delete');
    await page.keyboard.insertText(lesson.exercise.solution);
    await page.getByTestId('btn-run').click();
    await expect(page.getByTestId('feedback')).toHaveAttribute('data-status', 'pass');
    await clickContinue(page);
    await expect(page.getByTestId('reward')).toHaveAttribute('data-awarded', 'true');
  }

  test('el mapa muestra la Era 3 con 25 lecciones y Avanzado bloqueado', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('tab-lecciones').click();
    await expect(page.getByTestId('era-1')).toHaveAttribute('data-state', 'done');
    await expect(page.getByTestId('era-2')).toHaveAttribute('data-state', 'done');
    await expect(page.getByTestId('era-3')).toHaveAttribute('data-state', 'open');
    await expect(page.getByTestId('era-3')).toContainText('Progreso: 19 de 25');
    await expect(page.getByTestId(`lesson-${asyncLesson.id}`)).toHaveAttribute('data-state', 'open');
    for (const l of [...avanzadoLessons, evaluacion]) {
      await expect(page.getByTestId(`lesson-${l.id}`)).toBeVisible();
      await expect(page.getByTestId(`lesson-${l.id}`)).toHaveAttribute('data-state', 'locked');
    }
  });

  test('completar async/await abre la primera de Avanzado (manejo de errores)', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('tab-lecciones').click();
    await page.getByTestId(`lesson-${asyncLesson.id}`).click();
    await solveLesson(page, asyncLesson);
    await page.getByTestId('btn-exit').click();
    await expect(page.getByTestId(`lesson-${asyncLesson.id}`)).toHaveAttribute('data-state', 'done');
    await expect(page.getByTestId(`lesson-${avanzadoLessons[0]!.id}`)).toHaveAttribute('data-state', 'open');
  });

  test('completar las 4 de Avanzado abre la evaluación final', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('tab-lecciones').click();
    await page.getByTestId(`lesson-${asyncLesson.id}`).click();
    await solveLesson(page, asyncLesson);
    for (const lesson of avanzadoLessons) {
      await page.getByTestId('btn-next-lesson').click();
      await solveLesson(page, lesson);
    }
    await expect(page.getByTestId('hud-xp')).toHaveText('905 XP');
    await page.getByTestId('btn-exit').click();
    await expect(page.getByTestId(`lesson-${evaluacion.id}`)).toHaveAttribute('data-state', 'open');
    await expect(page.getByTestId('era-3')).toContainText('Progreso: 24 de 25');
  });
});
