import { expect, test } from '@playwright/test';
import { era1Lessons } from '../src/learning/lessons/era1';

/**
 * Era 1 · HTML: el mapa muestra las 7 lecciones y la primera se completa
 * viendo el resultado en la vista previa (sin consola de JavaScript).
 */
test.describe('Era 1 · HTML', () => {
  test('el mapa muestra la Era 1 con 7 lecciones y la primera está abierta', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('tab-lecciones').click();
    await expect(page.getByTestId('era-1')).toHaveAttribute('data-state', 'open');
    for (const l of era1Lessons) {
      await expect(page.getByTestId(`lesson-${l.id}`)).toBeVisible();
    }
    await expect(page.getByTestId(`lesson-${era1Lessons[0]!.id}`)).toHaveAttribute('data-state', 'open');
  });

  test('completar la lección 1: el código inicial falla y la solución se ve en la vista previa', async ({ page }) => {
    const lesson = era1Lessons[0]!;
    await page.goto('/');
    await page.getByTestId('tab-lecciones').click();
    await page.getByTestId(`lesson-${lesson.id}`).click();
    await expect(page.getByTestId('player')).toHaveAttribute('data-lesson', lesson.id);

    await page.getByTestId('duration-5').click();
    await page.getByTestId('btn-start').click();

    // El botón es de vista previa, no de consola.
    await expect(page.getByTestId('btn-run')).toHaveText('👁 Ver vista previa');
    await expect(page.getByTestId('html-preview-wrap')).toBeVisible();
    await expect(page.getByTestId('console')).toHaveCount(0);

    // El código inicial no aprueba, pero la vista previa ya muestra algo.
    await page.getByTestId('btn-run').click();
    await expect(page.getByTestId('feedback')).toHaveAttribute('data-status', 'fail');
    await expect(page.frameLocator('[data-testid="html-preview"]').locator('body')).toContainText('Escribe el título aquí');

    // La solución aprueba y la vista previa muestra el título real.
    const content = page.locator('.cm-content').first();
    await content.click();
    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.press('Delete');
    await page.keyboard.insertText(lesson.exercise.solution);
    await page.getByTestId('btn-run').click();
    await expect(page.getByTestId('feedback')).toHaveAttribute('data-status', 'pass');
    await expect(page.frameLocator('[data-testid="html-preview"]').locator('h1')).toHaveText('Mi refugio');

    await page.getByTestId('btn-continue').click();
    await expect(page.getByTestId('reward')).toHaveAttribute('data-awarded', 'true');
    await expect(page.getByTestId('hud-xp')).toHaveText('20 XP');
  });
});
