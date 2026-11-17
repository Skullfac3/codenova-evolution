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

test.describe('Si la app truena al dibujarse', () => {
  test('una pieza que ya no existe: recarga una vez y luego muestra el error con «Reintentar»', async ({ page }) => {
    // Como tras publicar una versión nueva: la pieza de la tienda ya no está.
    await page.route('**/assets/Shop-*.js', (route) => route.fulfill({ status: 404, body: 'no existe' }));
    let loads = 0;
    page.on('load', () => loads++);
    await page.goto('/');
    await expect(page.getByTestId('habitat')).toBeVisible();
    await page.getByTestId('tab-tienda').click();
    // Primero se recarga sola; al volver a fallar, muestra el aviso (nunca en blanco).
    await expect.poll(() => loads).toBeGreaterThanOrEqual(2);
    await page.getByTestId('tab-tienda').click();
    await expect(page.getByTestId('crash')).toBeVisible();
    await expect(page.getByRole('button', { name: 'Reintentar' })).toBeVisible();
    await expect(page.getByTestId('crash-detail')).not.toBeEmpty();
  });

  test('si el código principal truena al arrancar, a los 12 s muestra el error', async ({ page }) => {
    await page.route('**/assets/index-*.js', (route) =>
      route.fulfill({ status: 200, contentType: 'text/javascript', body: "throw new Error('Error de prueba al arrancar');" }),
    );
    await page.clock.install();
    await page.goto('/');
    await page.clock.fastForward(12_500);
    await expect(page.getByRole('button', { name: 'Reintentar' })).toBeVisible();
    await expect(page.getByText('Error de prueba al arrancar')).toBeVisible();
  });
});
