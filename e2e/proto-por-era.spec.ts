import { expect, test, type Page } from '@playwright/test';

/** Partida con las eras 1 y 2 desbloqueadas. */
async function seed(page: Page, unlockedEras: number[]) {
  await page.addInitScript((unlockedEras) => {
    if (localStorage.getItem('codenova:save')) return;
    localStorage.setItem(
      'codenova:save',
      JSON.stringify({
        version: 2, explorerName: 'Explorador', avatar: 'explorer-01', xp: 170, novacoins: 90, currentEra: Math.max(...unlockedEras),
        unlockedEras, completedLessons: {},
        worlds: { 1: { objects: [] }, 2: { objects: [] } }, inventory: {}, pets: [], pendingSync: [], updatedAt: '2026-11-05T00:00:00Z',
      }),
    );
  }, unlockedEras);
}

/** Color de un píxel del dibujo de Proto-0 (cuadrícula de 32x32). */
const protoPixel = (page: Page, x: number, y: number) =>
  page.locator('[data-testid="proto-bot"] canvas').evaluate((c: HTMLCanvasElement, [x, y]) => {
    const [r, g, b] = c.getContext('2d')!.getImageData(x!, y!, 1, 1).data;
    return `#${[r, g, b].map((v) => v!.toString(16).padStart(2, '0')).join('')}`;
  }, [x, y]);

const GRIS = '#b6a6c8';
const BRONCE = '#d9a441';

test.describe('Proto-0 cambia de aspecto con la era', () => {
  test('al volver a la Era 1 recupera su aspecto y al regresar a la Era 2 vuelve a ser el Guardián', async ({ page }) => {
    await seed(page, [1, 2]);
    await page.goto('/');
    const dock = page.getByTestId('proto-dock');

    // Empieza en la era más alta: Guardián de bronce.
    await expect(dock).toHaveAttribute('data-stage', '2');
    await expect(dock).toContainText('Proto-0 · v2 Guardián');
    await expect.poll(() => protoPixel(page, 12, 20)).toBe(BRONCE);

    // Era 1: Explorador gris y oxidado, y lo dice.
    await page.getByTestId('world-era-1').click();
    await expect(dock).toHaveAttribute('data-stage', '1');
    await expect(dock).toContainText('Proto-0 · v1 Explorador');
    await expect(page.getByTestId('proto-bubble')).toContainText('Prehistoria');
    await expect.poll(() => protoPixel(page, 12, 20)).toBe(GRIS);
    await expect(page.getByTestId('proto-stage-1')).toHaveAttribute('data-shown', 'true');
    await expect(page.getByTestId('proto-stage-1')).toContainText('así se ve en esta era');
    await expect(page.getByTestId('proto-stage-2')).toHaveAttribute('data-state', 'current');

    // El aspecto elegido se mantiene en las otras pestañas.
    await page.getByTestId('tab-tienda').click();
    await expect(dock).toHaveAttribute('data-stage', '1');
    await page.getByTestId('tab-refugio').click();

    // De vuelta a la era actual.
    await page.getByTestId('world-era-2').click();
    await expect(dock).toHaveAttribute('data-stage', '2');
    await expect(page.getByTestId('proto-bubble')).toContainText('Guardián');
    await expect.poll(() => protoPixel(page, 12, 20)).toBe(BRONCE);
  });

  test('con solo la Era 1 Proto-0 es el Explorador', async ({ page }) => {
    await seed(page, [1]);
    await page.goto('/');
    await expect(page.getByTestId('proto-dock')).toHaveAttribute('data-stage', '1');
    await expect.poll(() => protoPixel(page, 12, 20)).toBe(GRIS);
  });
});
