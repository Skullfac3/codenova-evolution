import { expect, test } from '@playwright/test';
import { clickContinue } from './helpers';
import { era1Lessons } from '../src/learning/lessons/era1';
import { era2Lessons } from '../src/learning/lessons/era2';

/**
 * Era 2 · CSS + Tailwind: el mapa muestra las 8 lecciones y la primera se
 * completa viendo el cambio de color en la vista previa.
 * Se siembra la Era 1 completa, como si el estudiante acabara de llegar.
 */
test.describe('Era 2 · CSS + Tailwind', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript((ids) => {
      if (localStorage.getItem('codenova:save')) return;
      localStorage.setItem(
        'codenova:save',
        JSON.stringify({
          version: 3, explorerName: 'Explorador', avatar: 'explorer-01', xp: 170, novacoins: 90, currentEra: 2,
          unlockedEras: [1, 2],
          completedLessons: Object.fromEntries(ids.map((id) => [id, { score: 100, completedAt: '2026-11-05T00:00:00Z', eventId: id }])),
          worlds: { 1: { objects: [] }, 2: { objects: [] } }, inventory: {}, pets: [], pendingSync: [], updatedAt: '2026-11-05T00:00:00Z',
        }),
      );
    }, era1Lessons.map((l) => l.id));
  });

  test('el mapa muestra la Era 2 con 8 lecciones y la primera está abierta', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('tab-lecciones').click();
    await expect(page.getByTestId('era-1')).toHaveAttribute('data-state', 'done');
    await expect(page.getByTestId('era-2')).toHaveAttribute('data-state', 'open');
    await expect(page.getByTestId('era-3')).toHaveAttribute('data-state', 'locked');
    for (const l of era2Lessons) {
      await expect(page.getByTestId(`lesson-${l.id}`)).toBeVisible();
    }
    await expect(page.getByTestId(`lesson-${era2Lessons[0]!.id}`)).toHaveAttribute('data-state', 'open');
  });

  test('completar la lección 1: el código inicial falla y la solución pinta el título de rojo', async ({ page }) => {
    const lesson = era2Lessons[0]!;
    await page.goto('/');
    await page.getByTestId('tab-lecciones').click();
    await page.getByTestId(`lesson-${lesson.id}`).click();
    await expect(page.getByTestId('player')).toHaveAttribute('data-lesson', lesson.id);

    await page.getByTestId('duration-5').click();
    await page.getByTestId('btn-start').click();

    // El botón es de vista previa, como en HTML: no hay consola de JavaScript.
    await expect(page.getByTestId('btn-run')).toHaveText('👁 Ver vista previa');
    await expect(page.getByTestId('html-preview-wrap')).toBeVisible();
    await expect(page.getByTestId('console')).toHaveCount(0);

    // El código inicial no aprueba y el título sigue negro en la vista previa.
    await page.getByTestId('btn-run').click();
    await expect(page.getByTestId('feedback')).toHaveAttribute('data-status', 'fail');
    const colorAntes = await page
      .frameLocator('[data-testid="html-preview"]')
      .locator('h1')
      .evaluate((el) => getComputedStyle(el).color);
    expect(colorAntes).not.toBe('rgb(255, 0, 0)');

    // La solución aprueba y el título se ve rojo en la vista previa.
    const content = page.locator('.cm-content').first();
    await content.click();
    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.press('Delete');
    await page.keyboard.insertText(lesson.exercise.solution);
    await page.getByTestId('btn-run').click();
    await expect(page.getByTestId('feedback')).toHaveAttribute('data-status', 'pass');
    const colorDespues = await page
      .frameLocator('[data-testid="html-preview"]')
      .locator('h1')
      .evaluate((el) => getComputedStyle(el).color);
    expect(colorDespues).toBe('rgb(255, 0, 0)');

    await clickContinue(page);
    await expect(page.getByTestId('reward')).toHaveAttribute('data-awarded', 'true');
    await expect(page.getByTestId('hud-xp')).toHaveText('190 XP');
  });

  test('la lección de Tailwind viste el título con clases y la vista previa lo muestra', async ({ page }) => {
    const lesson = era2Lessons[6]!;
    await page.goto('/');
    await page.getByTestId('tab-lecciones').click();
    // El Administrador ve todo abierto; aquí se usa el perfil normal con
    // la Era 1 completa, así que se llega a Tailwind completando antes
    // las 6 lecciones de CSS con sus soluciones.
    for (const l of era2Lessons.slice(0, 6)) {
      if (await page.getByTestId('map').isVisible()) {
        await page.getByTestId(`lesson-${l.id}`).click();
      }
      await expect(page.getByTestId('player')).toHaveAttribute('data-lesson', l.id);
      await page.getByTestId('duration-5').click();
      await page.getByTestId('btn-start').click();
      const content = page.locator('.cm-content').first();
      await content.click();
      await page.keyboard.press('ControlOrMeta+A');
      await page.keyboard.press('Delete');
      await page.keyboard.insertText(l.exercise.solution);
      await page.getByTestId('btn-run').click();
      await expect(page.getByTestId('feedback')).toHaveAttribute('data-status', 'pass');
      await clickContinue(page);
      await page.getByTestId('btn-next-lesson').click();
    }
    await expect(page.getByTestId('player')).toHaveAttribute('data-lesson', lesson.id);
    await page.getByTestId('duration-5').click();
    await page.getByTestId('btn-start').click();
    const content = page.locator('.cm-content').first();
    await content.click();
    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.press('Delete');
    await page.keyboard.insertText(lesson.exercise.solution);
    await page.getByTestId('btn-run').click();
    await expect(page.getByTestId('feedback')).toHaveAttribute('data-status', 'pass');
    // El mini-Tailwind pinta el fondo ámbar (#d97706) en la vista previa.
    const fondo = await page
      .frameLocator('[data-testid="html-preview"]')
      .locator('h1')
      .evaluate((el) => getComputedStyle(el).backgroundColor);
    expect(fondo).toBe('rgb(217, 119, 6)');
  });
});
