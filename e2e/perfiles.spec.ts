import { expect, test } from '@playwright/test';
import { era1Lessons } from '../src/learning/lessons/era1';
import { era2Lessons } from '../src/learning/lessons/era2';

/**
 * Perfiles: Administrador (todo desbloqueado + historial de compras) y
 * Pruebas (partida normal). Sin PIN: cambiar es solo un toque.
 */
test.describe('Perfiles: Administrador y Pruebas', () => {
  test('el Administrador ve todas las lecciones abiertas sin completar nada', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('tab-perfiles').click();
    await expect(page.getByTestId('profile-admin')).toBeVisible();
    await expect(page.getByTestId('profile-pruebas')).toBeVisible();
    await page.getByTestId('btn-switch-admin').click();
    await expect(page.getByTestId('admin-panel')).toBeVisible();
    await expect(page.getByTestId('purchases-empty')).toBeVisible();

    await page.getByTestId('tab-lecciones').click();
    // Era 2 completa, sin haber completado la Era 1.
    await expect(page.getByTestId('era-2')).toHaveAttribute('data-state', 'open');
    for (const l of [...era1Lessons, ...era2Lessons]) {
      await expect(page.getByTestId(`lesson-${l.id}`)).toHaveAttribute('data-state', 'open');
    }
  });

  test('lo que compra el perfil de Pruebas lo ve el Administrador', async ({ page }) => {
    await page.goto('/');
    // Pruebas es el perfil activo al inicio.
    await page.getByTestId('tab-perfiles').click();
    await expect(page.getByTestId('btn-switch-pruebas')).toBeDisabled();

    // Completa la lección 1 en Pruebas y gana 10 NovaCoins.
    await page.getByTestId('tab-lecciones').click();
    await page.getByTestId(`lesson-${era1Lessons[0]!.id}`).click();
    await page.getByTestId('btn-start').click();
    const content = page.locator('.cm-content').first();
    await content.click();
    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.press('Delete');
    await page.keyboard.insertText(era1Lessons[0]!.exercise.solution);
    await page.getByTestId('btn-run').click();
    await expect(page.getByTestId('feedback')).toHaveAttribute('data-status', 'pass');
    await page.getByTestId('btn-continue').click();
    await expect(page.getByTestId('hud-coins')).toHaveText('🪙 10');

    // Compra la fogata en Pruebas.
    await page.getByTestId('tab-tienda').click();
    await page.getByTestId('buy-deco-fogata').click();
    await expect(page.getByTestId('hud-coins')).toHaveText('🪙 0');

    // Al cambiar a Administrador, la compra aparece en su panel.
    await page.getByTestId('tab-perfiles').click();
    await page.getByTestId('btn-switch-admin').click();
    await expect(page.getByTestId('admin-panel')).toBeVisible();
    await expect(page.locator('[data-testid^="purchase-"]')).toHaveCount(1);
    const purchase = page.locator('[data-testid^="purchase-"]').first();
    await expect(purchase).toContainText('Fogata');
    await expect(purchase).toContainText('10');
    await expect(purchase).toContainText('Pruebas');
  });

  test('una partida vieja se importa como "Mi partida" sin perder progreso', async ({ page }) => {
    await page.addInitScript(() => {
      if (localStorage.getItem('codenova:save')) return;
      localStorage.setItem(
        'codenova:save',
        JSON.stringify({
          version: 2, explorerName: 'Explorador', avatar: 'explorer-01', xp: 40, novacoins: 20, currentEra: 1,
          unlockedEras: [1],
          completedLessons: { 'e1-01-que-es-programar': { score: 100, completedAt: '2026-11-03T00:00:00Z', eventId: 'x' } },
          worlds: { 1: { objects: [] } }, inventory: {}, pets: [], pendingSync: [], updatedAt: '2026-11-03T00:00:00Z',
        }),
      );
    });
    await page.goto('/');
    await expect(page.getByTestId('hud-xp')).toHaveText('40 XP');
    await page.getByTestId('tab-perfiles').click();
    await expect(page.getByTestId('profile-mi-partida')).toBeVisible();
    await expect(page.getByTestId('btn-switch-mi-partida')).toBeDisabled();
  });
});
