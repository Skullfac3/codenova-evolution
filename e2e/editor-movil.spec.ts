import { expect, test, type Page } from '@playwright/test';

/** Abre el primer reto de JavaScript (Era 3). */
async function openExercise(page: Page) {
  await page.addInitScript(() => {
    if (localStorage.getItem('codenova:save')) return;
    localStorage.setItem('codenova:save', JSON.stringify({
      version: 3, explorerName: 'E', avatar: 'explorer-01', xp: 0, novacoins: 90, currentEra: 3, unlockedEras: [1, 2, 3],
      completedLessons: {}, worlds: { 1: { objects: [] } }, inventory: {}, pets: [], pendingSync: [], updatedAt: '2026-11-17T00:00:00Z',
    }));
  });
  await page.goto('/');
  await page.getByTestId('tab-lecciones').click();
  await page.locator('[data-testid^="lesson-e3-"]').first().click();
  await page.getByTestId('duration-15').click();
  await page.getByTestId('btn-start').click();
  await page.getByTestId('editor').waitFor();
}

test.describe('Editor en el celular', () => {
  test('al escribir: atajos sobre el teclado, sin pestañas y con Proto-0 a la vista', async ({ page, hasTouch }) => {
    test.skip(!hasTouch, 'El modo escritura es solo para pantallas táctiles');
    // Teclado abierto: queda una ventana de ~520px de alto.
    await page.setViewportSize({ width: 412, height: 520 });
    await openExercise(page);
    await page.locator('.cm-content').first().tap();

    await expect(page.locator('body')).toHaveClass(/typing/);
    await expect(page.getByTestId('tab-refugio')).toBeHidden();
    await expect(page.getByTestId('proto-bot')).toBeVisible();

    // La barra de atajos queda pegada al borde inferior visible.
    const bar = (await page.getByTestId('snip-bar').boundingBox())!;
    expect(Math.round(bar.y + bar.height)).toBeGreaterThanOrEqual(518);
    // El editor ocupa casi todo el espacio libre (antes: ~154px).
    const editor = (await page.getByTestId('editor').boundingBox())!;
    expect(editor.height).toBeGreaterThan(300);

    // Sugerencias del tamaño de un dedo.
    await page.keyboard.press('End');
    await page.keyboard.press('Enter');
    await page.keyboard.type('con');
    const item = page.locator('.cm-tooltip-autocomplete li').first();
    await expect(item).toBeVisible();
    expect((await item.boundingBox())!.height).toBeGreaterThanOrEqual(44);
    await page.keyboard.press('Escape');

    // ▶ en la barra ejecuta el código sin cerrar el teclado.
    await page.getByTestId('snip-run').tap();
    await expect(page.getByTestId('console')).not.toContainText('Ejecuta tu código para ver el resultado');

    // Al salir del editor todo vuelve a la normalidad.
    await page.getByTestId('btn-reset').tap();
    await expect(page.locator('body')).not.toHaveClass(/typing/);
    await expect(page.getByTestId('tab-refugio')).toBeVisible();
  });

  test('en computadora el editor no cambia de modo', async ({ page, hasTouch }) => {
    test.skip(hasTouch, 'Solo para pantallas sin toque');
    await openExercise(page);
    await page.locator('.cm-content').first().click();
    await expect(page.locator('body')).not.toHaveClass(/typing/);
    await expect(page.getByTestId('tab-refugio')).toBeVisible();
  });
});
