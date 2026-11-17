import { expect, test } from '@playwright/test';

test.describe('Pantalla de carga', () => {
  test('si la app no arranca, a los 12 s ofrece «Reintentar»', async ({ page }) => {
    // Simula que el JavaScript de la app nunca llega.
    await page.route('**/assets/index-*.js', (route) => route.abort());
    await page.route('**/src/main.tsx', (route) => route.abort());
    await page.clock.install();
    await page.goto('/');
    await expect(page.getByText('Cargando tu aventura…')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reintentar' })).toBeHidden();
    await page.clock.fastForward(12_500);
    await expect(page.getByRole('button', { name: 'Reintentar' })).toBeVisible();
  });

  test('cuando la app arranca, el aviso nunca aparece', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByTestId('habitat')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reintentar' })).toHaveCount(0);
  });
});
