import { expect, test, type Page } from '@playwright/test';
import { era3Lessons } from '../src/learning/lessons/era3';

/** Partida como la de una persona que acaba de terminar la primera parte de JavaScript (Era 3): 170 XP y 90 NovaCoins. */
async function seedEra1Done(page: Page) {
  const ids = era3Lessons.slice(0, 7).map((l) => l.id);
  await page.addInitScript((ids) => {
    if (localStorage.getItem('codenova:save')) return;
    localStorage.setItem(
      'codenova:save',
      JSON.stringify({
        version: 2, explorerName: 'Explorador', avatar: 'explorer-01', xp: 170, novacoins: 90, currentEra: 2,
        unlockedEras: [1, 2],
        completedLessons: Object.fromEntries(ids.map((id) => [id, { score: 100, completedAt: '2026-11-05T00:00:00Z', eventId: id }])),
        worlds: { 1: { objects: [] }, 2: { objects: [] } }, inventory: {}, pets: [], pendingSync: [], updatedAt: '2026-11-05T00:00:00Z',
      }),
    );
  }, ids);
}

async function shot(page: Page, name: string) {
  await page.screenshot({ path: `e2e-results/${test.info().project.name}/${name}.png` });
}

/** Toca el centro de una casilla del mapa (10 x 9), con la posición relativa al canvas. */
async function tapTile(page: Page, x: number, y: number) {
  const world = page.getByTestId('world');
  await world.scrollIntoViewIfNeeded();
  const box = (await world.boundingBox())!;
  await world.click({ position: { x: ((x + 0.5) * box.width) / 10, y: ((y + 0.5) * box.height) / 9 } });
}

test.describe('Refugio, tienda y Proto-0', () => {
  test('la app abre en el refugio, sin desbordarse en el celular', async ({ page }) => {
    await seedEra1Done(page);
    await page.goto('/');
    await expect(page.getByTestId('habitat')).toBeVisible();
    await expect(page.getByTestId('habitat')).toHaveAttribute('data-era', '2');
    await expect(page.getByTestId('proto-dock')).toBeVisible();
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    await shot(page, 'r01-refugio-era2');
  });

  test('comprar, decorar, vestir y llevar una mascota a la Era 2', async ({ page }) => {
    await seedEra1Done(page);
    await page.goto('/');

    // ── Tienda ──
    await page.getByTestId('tab-tienda').click();
    await expect(page.getByTestId('wallet')).toContainText('90');
    await page.getByTestId('buy-deco-fogata').click(); // 80
    await page.getByTestId('buy-deco-helecho').click(); // 72
    await page.getByTestId('buy-pet-dodo').click(); // 32
    await page.getByTestId('buy-outfit-piel').click(); // 7
    await expect(page.getByTestId('wallet')).toContainText('🪙 7');
    await expect(page.getByTestId('hud-coins')).toHaveText('🪙 7');
    await expect(page.getByTestId('proto-bubble')).toContainText('Túnica de piel');
    await expect(page.getByTestId('buy-pet-buho')).toBeDisabled();
    await expect(page.getByTestId('buy-pet-buho')).toHaveText('Faltan 53');
    await expect(page.getByTestId('buy-outfit-piel')).toHaveText('Ya es tuyo');
    await shot(page, 'r02-tienda');

    // ── Decorar la Prehistoria ──
    await page.getByTestId('tab-refugio').click();
    await page.getByTestId('world-era-1').click();
    const habitat = page.getByTestId('habitat');
    await expect(habitat).toHaveAttribute('data-pets', '1'); // el dodo vive en la Era 1
    await page.getByTestId('mode-decorar').click();
    await page.getByTestId('inv-deco-fogata').click();
    await tapTile(page, 5, 4);
    await expect(habitat).toHaveAttribute('data-objects', '1');
    await expect(page.getByTestId('inv-deco-fogata')).toContainText('0 disponibles');
    await tapTile(page, 6, 4); // sin fogatas disponibles: no coloca
    await expect(habitat).toHaveAttribute('data-objects', '1');
    await tapTile(page, 1, 1); // sobre la choza: no se puede
    await expect(habitat).toHaveAttribute('data-objects', '1');
    await page.getByTestId('inv-deco-helecho').click();
    await tapTile(page, 7, 2);
    await expect(habitat).toHaveAttribute('data-objects', '2');
    await tapTile(page, 7, 2); // tocar un adorno lo quita
    await expect(habitat).toHaveAttribute('data-objects', '1');
    await tapTile(page, 7, 2);
    await expect(habitat).toHaveAttribute('data-objects', '2');

    // ── Vestirse ──
    await page.getByTestId('outfit-outfit-piel').click();
    await expect(habitat).toHaveAttribute('data-outfit', 'outfit-piel');

    // ── Caminar ──
    await page.getByTestId('mode-explorar').click();
    await tapTile(page, 7, 7);
    await expect(page.getByTestId('world')).toHaveAttribute('data-explorer', '7,7', { timeout: 6000 });
    await shot(page, 'r03-prehistoria-decorada');

    // ── Todo se guarda ──
    await page.reload();
    await page.getByTestId('world-era-1').click();
    await expect(page.getByTestId('habitat')).toHaveAttribute('data-objects', '2');
    await expect(page.getByTestId('habitat')).toHaveAttribute('data-outfit', 'outfit-piel');

    // ── Llevar al dodo a la Era 2 (solo una mascota por era) ──
    await page.getByTestId('world-era-2').click();
    await expect(page.getByTestId('habitat')).toHaveAttribute('data-pets', '0');
    await page.locator('[data-testid^="transfer-"]').first().click();
    await expect(page.getByTestId('habitat')).toHaveAttribute('data-pets', '1');
    await expect(page.locator('[data-testid^="transfer-"]')).toHaveCount(0);
    await page.getByTestId('world-era-1').click();
    await expect(page.getByTestId('habitat')).toHaveAttribute('data-pets', '0');
    await page.getByTestId('world-era-2').click();
    await shot(page, 'r04-era2-con-dodo');
  });

  test('Proto-0 parpadea, mira a su alrededor, da consejos y reacciona al código', async ({ page }) => {
    await seedEra1Done(page);
    await page.goto('/');
    const dock = page.getByTestId('proto-dock');
    await expect(dock).toHaveAttribute('data-era', '3'); // ya evolucionó

    // Mira hacia distintos lados con el tiempo.
    const looks = new Set<string>();
    for (let i = 0; i < 24 && looks.size < 2; i++) {
      looks.add((await dock.getAttribute('data-look')) ?? '');
      await page.waitForTimeout(400);
    }
    expect(looks.size).toBeGreaterThanOrEqual(2);

    // Tocarlo da un consejo.
    await page.getByTestId('proto-bot').click();
    await expect(page.getByTestId('proto-bubble')).toBeVisible();
    await expect(dock).toHaveAttribute('data-mood', 'talking');

    // Reacciona al ejecutar código.
    await page.getByTestId('tab-lecciones').click();
    await page.getByTestId('lesson-e3-08-condicionales').click();
    await page.getByTestId('btn-start').click();
    await page.getByTestId('btn-run').click();
    await expect(dock).toHaveAttribute('data-mood', 'sad');
    await expect(page.getByTestId('proto-bubble')).toContainText('Casi');
  });

  test('los atajos y el autocompletado escriben el código por ti', async ({ page }) => {
    await seedEra1Done(page);
    await page.goto('/');
    await page.getByTestId('tab-lecciones').click();
    await page.getByTestId('lesson-e3-08-condicionales').click();
    await page.getByTestId('btn-start').click();

    // Los atajos de la Era 3 aparecen (if, for, function…), además de los de la primera parte.
    for (const id of ['log', 'let', 'if', 'for', 'function']) await expect(page.getByTestId(`snip-${id}`)).toBeVisible();

    const editor = page.locator('.cm-content');
    await editor.click();
    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.press('Delete');
    await page.keyboard.insertText('const antorchas = 3;\n');

    // if/else con dos toques: solo se escribe la condición y los textos.
    await page.getByTestId('snip-ifelse').dispatchEvent('pointerdown');
    await page.keyboard.type('antorchas >= 2');
    await page.keyboard.press('Tab');
    await page.getByTestId('snip-log').dispatchEvent('pointerdown');
    await page.getByTestId('snip-texto').dispatchEvent('pointerdown');
    await page.keyboard.type('La cueva está iluminada');
    // Ir a la línea vacía del else (penúltima línea) con el teclado.
    await page.keyboard.press('ControlOrMeta+End');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('End');

    // Autocompletado: escribir "log" y elegir de la lista.
    // Se toca la sugerencia (el gesto natural en el móvil) en lugar de
    // pulsar Enter: en el móvil el Enter llegaba a veces como salto de
    // línea y la prueba fallaba incluso sin cambios de la app.
    await page.keyboard.type('log');
    const suggestion = page.locator('.cm-tooltip-autocomplete li[aria-selected]');
    await expect(suggestion).toContainText('console.log');
    await suggestion.click();
    await page.keyboard.type('"Está muy oscuro"');

    await expect(editor).toContainText('if (antorchas >= 2) {');
    await expect(editor).toContainText('console.log("La cueva está iluminada")');
    await expect(editor).toContainText('} else {');
    await expect(editor).toContainText('console.log("Está muy oscuro")');
    await shot(page, 'r05-atajos');

    await page.getByTestId('btn-run').click();
    await expect(page.getByTestId('console')).toContainText('La cueva está iluminada');
    await expect(page.getByTestId('feedback')).toHaveAttribute('data-status', 'pass');
    await expect(page.getByTestId('proto-dock')).toHaveAttribute('data-mood', 'happy');
  });
});
