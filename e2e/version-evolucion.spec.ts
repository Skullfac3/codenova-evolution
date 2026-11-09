import { expect, test } from '@playwright/test';

/**
 * Versión 0.4.0: leyenda de versión en letras pequeñas en todas las
 * pestañas, y panel "Evolución de Proto-0" en el Refugio que muestra la
 * etapa actual (v1 Explorador en Era 1, v2 Guardián en Era 2).
 */
test.describe('Versión y evolución de Proto-0', () => {
  test('la leyenda de versión se ve en todas las pestañas', async ({ page }) => {
    await page.goto('/');
    const version = page.getByTestId('app-version');
    await expect(version).toBeVisible();
    await expect(version).toHaveText('CodeNova v0.4.0');

    for (const tab of ['lecciones', 'tienda', 'perfiles']) {
      await page.getByTestId(`tab-${tab}`).click();
      await expect(version).toBeVisible();
      await expect(version).toHaveText('CodeNova v0.4.0');
    }
  });

  test('el Refugio muestra la etapa actual de Proto-0 (v1 Explorador)', async ({ page }) => {
    await page.goto('/');
    // Pruebas es el perfil activo al inicio: Era 1.
    const panel = page.getByTestId('proto-evolution');
    await expect(panel).toBeVisible();
    await expect(panel).toContainText('Evolución de Proto-0');
    await expect(page.getByTestId('proto-stage-1')).toHaveAttribute('data-state', 'current');
    await expect(page.getByTestId('proto-stage-1')).toContainText('v1 Explorador');
    await expect(page.getByTestId('proto-stage-2')).toHaveAttribute('data-state', 'locked');
    await expect(page.getByTestId('proto-stage-2')).toContainText('llega pronto');
    await expect(page.getByTestId('proto-dock')).toContainText('Proto-0 · v1 Explorador');
  });

  test('con el Administrador la etapa es v2 Guardián', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('tab-perfiles').click();
    await page.getByTestId('btn-switch-admin').click();

    await page.getByTestId('tab-refugio').click();
    const panel = page.getByTestId('proto-evolution');
    await expect(panel).toBeVisible();
    await expect(page.getByTestId('proto-stage-2')).toHaveAttribute('data-state', 'current');
    await expect(page.getByTestId('proto-stage-2')).toContainText('v2 Guardián');
    await expect(page.getByTestId('proto-stage-2')).toContainText(/gema azul/i);
    await expect(page.getByTestId('proto-stage-2')).toContainText(/banda dorada/i);
    await expect(page.getByTestId('proto-dock')).toContainText('Proto-0 · v2 Guardián');
  });
});
