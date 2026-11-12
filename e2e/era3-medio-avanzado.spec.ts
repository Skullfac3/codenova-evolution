import { expect, test, type Page } from '@playwright/test';
import { clickContinue } from './helpers';
import { era1Lessons } from '../src/learning/lessons/era1';
import { era2Lessons } from '../src/learning/lessons/era2';
import { era3Lessons } from '../src/learning/lessons/era3';
import type { Lesson } from '../src/types/lesson';

/**
 * Era 3 · Medio avanzado (DOM, eventos, JSON/fetch, promesas y async/await):
 * las 4 lecciones nuevas van antes de la evaluación final, que sigue
 * cerrando la era. Se siembran las Eras 1 y 2 completas y la Era 3 hasta
 * Objetos (e3-14), como si el estudiante acabara de llegar a Medio.
 */
const seeded = [...era1Lessons, ...era2Lessons, ...era3Lessons.slice(0, 13)].map((l) => l.id);
const newLessons = ['e3-16-el-dom', 'e3-17-eventos', 'e3-18-json-fetch', 'e3-19-promesas-async'].map(
  (id) => era3Lessons.find((l) => l.id === id)!,
);
const medioLessons = ['e3-20-metodos-arreglos', 'e3-21-desestructuracion'].map(
  (id) => era3Lessons.find((l) => l.id === id)!,
);
const objetos = era3Lessons.find((l) => l.id === 'e3-14-objetos')!;
const evaluacion = era3Lessons.find((l) => l.id === 'e3-15-evaluacion')!;

test.describe('Era 3 · Medio avanzado', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((ids) => {
      if (localStorage.getItem('codenova:save')) return;
      localStorage.setItem(
        'codenova:save',
        JSON.stringify({
          // Eras 1 y 2 (360 XP) + Era 3 hasta e3-13 (320 XP).
          version: 3, explorerName: 'Explorador', avatar: 'explorer-01', xp: 680, novacoins: 370, currentEra: 3,
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
    // La solución aprueba (en el sandbox real, con promesas y temporizadores).
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

  test('el mapa muestra la Era 3 con 21 lecciones y Medio avanzado bloqueado', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('tab-lecciones').click();
    await expect(page.getByTestId('era-1')).toHaveAttribute('data-state', 'done');
    await expect(page.getByTestId('era-2')).toHaveAttribute('data-state', 'done');
    await expect(page.getByTestId('era-3')).toHaveAttribute('data-state', 'open');
    await expect(page.getByTestId('era-3')).toContainText('Progreso: 13 de 21');
    await expect(page.getByTestId(`lesson-${objetos.id}`)).toHaveAttribute('data-state', 'open');
    for (const l of [...medioLessons, ...newLessons, evaluacion]) {
      await expect(page.getByTestId(`lesson-${l.id}`)).toBeVisible();
      await expect(page.getByTestId(`lesson-${l.id}`)).toHaveAttribute('data-state', 'locked');
    }
  });

  test('completar Objetos abre la primera de Medio (métodos de arreglos)', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('tab-lecciones').click();
    await page.getByTestId(`lesson-${objetos.id}`).click();
    await solveLesson(page, objetos);
    await page.getByTestId('btn-exit').click();
    await expect(page.getByTestId(`lesson-${objetos.id}`)).toHaveAttribute('data-state', 'done');
    await expect(page.getByTestId(`lesson-${medioLessons[0]!.id}`)).toHaveAttribute('data-state', 'open');
  });

  test('completar Medio y Medio avanzado abre la evaluación final', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('tab-lecciones').click();
    await page.getByTestId(`lesson-${objetos.id}`).click();
    await solveLesson(page, objetos);
    for (const lesson of medioLessons) {
      await page.getByTestId('btn-next-lesson').click();
      await solveLesson(page, lesson);
    }
    for (const lesson of newLessons) {
      await page.getByTestId('btn-next-lesson').click();
      await solveLesson(page, lesson);
    }
    await expect(page.getByTestId('hud-xp')).toHaveText('825 XP');
    await page.getByTestId('btn-exit').click();
    await expect(page.getByTestId(`lesson-${evaluacion.id}`)).toHaveAttribute('data-state', 'open');
    await expect(page.getByTestId('era-3')).toContainText('Progreso: 20 de 21');
  });
});
