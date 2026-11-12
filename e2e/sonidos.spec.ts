import { expect, test, type Page } from '@playwright/test';

/** Partida con monedas y un registro de los sonidos que la app pide reproducir. */
async function seed(page: Page) {
  await page.addInitScript(() => {
    (window as unknown as { __codenovaSounds: string[] }).__codenovaSounds = [];
    if (localStorage.getItem('codenova:save')) return;
    localStorage.setItem(
      'codenova:save',
      JSON.stringify({
        version: 2, explorerName: 'Explorador', avatar: 'explorer-01', xp: 170, novacoins: 90, currentEra: 2,
        unlockedEras: [1, 2], completedLessons: {},
        worlds: { 1: { objects: [] }, 2: { objects: [] } }, inventory: {}, pets: [], pendingSync: [], updatedAt: '2026-11-05T00:00:00Z',
      }),
    );
  });
}

const sounds = (page: Page) => page.evaluate(() => (window as unknown as { __codenovaSounds: string[] }).__codenovaSounds);

/** Toca el centro de una casilla del mapa (10 x 9). */
async function tapTile(page: Page, x: number, y: number) {
  const world = page.getByTestId('world');
  await world.scrollIntoViewIfNeeded();
  const box = (await world.boundingBox())!;
  await world.click({ position: { x: ((x + 0.5) * box.width) / 10, y: ((y + 0.5) * box.height) / 9 } });
}

test.describe('Sonidos 8 bits', () => {
  test('comprar, decorar y tocar a Proto-0 suenan', async ({ page }) => {
    await seed(page);
    await page.goto('/');

    await page.getByTestId('proto-bot').click();
    expect(await sounds(page)).toContain('blip');

    await page.getByTestId('tab-tienda').click();
    await page.getByTestId('buy-deco-fogata').click();
    expect(await sounds(page)).toContain('coin');

    await page.getByTestId('tab-refugio').click();
    await page.getByTestId('mode-decorar').click();
    await tapTile(page, 5, 5); // sin adorno elegido: Proto-0 da una pista
    expect(await sounds(page)).toContain('hint');
    await page.getByTestId('inv-deco-fogata').click();
    await tapTile(page, 5, 5);
    expect(await sounds(page)).toContain('place');
    await tapTile(page, 5, 5);
    expect(await sounds(page)).toContain('remove');
  });

  test('el botón de silenciar apaga los sonidos y se recuerda', async ({ page }) => {
    await seed(page);
    await page.goto('/');
    const btn = page.getByTestId('btn-sound');
    await expect(btn).toHaveAttribute('aria-pressed', 'false');

    await btn.click();
    await expect(btn).toHaveAttribute('aria-pressed', 'true');
    await page.getByTestId('tab-tienda').click();
    await page.getByTestId('buy-deco-roca-musgo').click();
    await page.getByTestId('proto-bot').click();
    expect(await sounds(page)).toEqual([]);

    await page.reload();
    await expect(page.getByTestId('btn-sound')).toHaveAttribute('aria-pressed', 'true');

    // Al reactivar, suena un aviso corto.
    await page.getByTestId('btn-sound').click();
    await expect(page.getByTestId('btn-sound')).toHaveAttribute('aria-pressed', 'false');
    expect(await sounds(page)).toEqual(['blip']);
  });
});
