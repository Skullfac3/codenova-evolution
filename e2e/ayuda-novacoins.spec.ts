import { expect, test, type Page } from '@playwright/test';

async function seed(page: Page, novacoins: number) {
  await page.addInitScript((novacoins) => {
    if (localStorage.getItem('codenova:save')) return;
    localStorage.setItem('codenova:save', JSON.stringify({
      version: 3, explorerName: 'E', avatar: 'explorer-01', xp: 0, novacoins, currentEra: 3, unlockedEras: [1, 2, 3],
      completedLessons: {}, worlds: { 1: { objects: [] } }, inventory: {}, pets: [], pendingSync: [], updatedAt: '2026-11-17T00:00:00Z',
    }));
  }, novacoins);
}

/** Abre el primer reto de JavaScript y gasta las 3 pistas gratis. */
async function stuckOnFirstExercise(page: Page) {
  await page.getByTestId('tab-lecciones').click();
  await page.locator('[data-testid^="lesson-e3-"]').first().click();
  await page.getByTestId('duration-15').click();
  await page.getByTestId('btn-start').click();
  await expect(page.getByTestId('paid-help')).toHaveCount(0);
  for (let i = 0; i < 3; i++) await page.getByTestId('btn-hint').click();
  await expect(page.getByTestId('btn-hint')).toBeDisabled();
}

test.describe('Ayuda de Proto-0 con NovaCoins', () => {
  test('tras las 3 pistas, por 3 NovaCoins Proto escribe la solución', async ({ page }) => {
    await seed(page, 10);
    await page.goto('/');
    await stuckOnFirstExercise(page);

    await page.getByTestId('btn-help').click();
    await expect(page.getByTestId('hud-coins')).toContainText('7');
    await expect(page.getByTestId('help-done')).toBeVisible();
    await expect(page.getByTestId('proto-bubble')).toContainText('escribí la solución');

    // La solución ya está en el editor: al ejecutarla, el reto se aprueba.
    await page.getByTestId('btn-run').click();
    await expect(page.getByTestId('feedback')).toHaveAttribute('data-status', 'pass');
    await expect(page.getByTestId('paid-help')).toHaveCount(0);
  });

  test('sin saldo, Proto regala 5 NovaCoins a los 30 minutos', async ({ page }) => {
    await page.clock.install({ time: new Date('2026-11-17T10:00:00Z') });
    await seed(page, 1);
    await page.goto('/');
    await stuckOnFirstExercise(page);

    await expect(page.getByTestId('btn-help')).toHaveCount(0);
    await expect(page.getByTestId('help-wait')).toContainText('tienes 1');
    await expect(page.getByTestId('help-wait')).toContainText('en 30 min');

    await page.clock.fastForward('20:00');
    await expect(page.getByTestId('help-wait')).toContainText('en 10 min');

    await page.clock.fastForward('10:30');
    await expect(page.getByTestId('hud-coins')).toContainText('6');
    await expect(page.getByTestId('proto-bubble')).toContainText('regalé 5 NovaCoins');
    await expect(page.getByTestId('btn-help')).toBeVisible();
  });
});
