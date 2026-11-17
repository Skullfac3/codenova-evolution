import { expect, test, type Page } from '@playwright/test';

/** Partida con las tres eras desbloqueadas y monedas para comprar. */
async function seed(page: Page) {
  await page.addInitScript(() => {
    if (localStorage.getItem('codenova:save')) return;
    localStorage.setItem(
      'codenova:save',
      JSON.stringify({
        version: 3, explorerName: 'Explorador', avatar: 'explorer-01', xp: 400, novacoins: 300, currentEra: 3,
        unlockedEras: [1, 2, 3], completedLessons: {},
        worlds: { 1: { objects: [] }, 2: { objects: [] } }, inventory: {}, pets: [], pendingSync: [], updatedAt: '2026-11-17T00:00:00Z',
      }),
    );
  });
}

const protoPixel = (page: Page, x: number, y: number) =>
  page.locator('[data-testid="proto-bot"] canvas').evaluate((c: HTMLCanvasElement, [x, y]) => {
    const [r, g, b] = c.getContext('2d')!.getImageData(x!, y!, 1, 1).data;
    return `#${[r, g, b].map((v) => v!.toString(16).padStart(2, '0')).join('')}`;
  }, [x, y]);

test.describe('Era 3 · Era industrial', () => {
  test('el refugio industrial, su tienda y Proto-0 v3', async ({ page }) => {
    await seed(page);
    await page.goto('/');

    // Abre en la era más reciente, con la fábrica y el aviso de la siguiente era.
    await expect(page.getByTestId('habitat')).toHaveAttribute('data-era', '3');
    await expect(page.getByTestId('habitat-sub')).toHaveText('Era industrial · La Era digital llega pronto.');
    await expect(page.getByTestId('proto-dock')).toHaveAttribute('data-stage', '3');
    await expect(page.getByTestId('proto-dock')).toContainText('v3 Ingeniero de vapor');
    await expect.poll(() => protoPixel(page, 12, 20)).toBe('#d9824a');

    // En la Era 2 no se repite el aviso.
    await page.getByTestId('world-era-2').click();
    await expect(page.getByTestId('habitat-sub')).toHaveText('Civilizaciones antiguas');
    await expect(page.getByTestId('proto-dock')).toHaveAttribute('data-stage', '2');
    await page.getByTestId('world-era-3').click();
    await expect(page.getByTestId('proto-bubble')).toContainText('Ingeniero de vapor');

    // La tienda ofrece los objetos de la Era 3; el perro llega al refugio industrial.
    await page.getByTestId('tab-tienda').click();
    for (const id of ['deco-farol', 'deco-engrane', 'deco-yunque', 'outfit-overol', 'pet-paloma', 'pet-perro']) {
      await expect(page.getByTestId(`buy-${id}`)).toBeVisible();
    }
    await page.getByTestId('buy-pet-perro').click();
    await expect(page.getByTestId('hud-coins')).toContainText('210');
    await page.getByTestId('tab-refugio').click();
    await expect(page.getByTestId('habitat')).toHaveAttribute('data-pets', '1');
  });
});
