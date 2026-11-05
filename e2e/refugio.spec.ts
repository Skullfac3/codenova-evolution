import { expect, test, type Page } from '@playwright/test';
import { era1Lessons } from '../src/learning/lessons/era1';

/** Partida como la de una persona que acaba de terminar la Era 1: 170 XP y 90 NovaCoins. */
async function seedEra1Done(page: Page, opts: { protoSeen?: number } = { protoSeen: 2 }) {
  const ids = era1Lessons.map((l) => l.id);
  await page.addInitScript(({ ids, protoSeen }) => {
    (window as unknown as { __codenovaSounds: string[] }).__codenovaSounds = [];
    if (localStorage.getItem('codenova:save')) return;
    // Proto-0 ya evolucionado a v2 (salvo que la prueba quiera ver la evolución).
    if (protoSeen) localStorage.setItem('codenova:proto-version', String(protoSeen));
    localStorage.setItem(
      'codenova:save',
      JSON.stringify({
        version: 2, explorerName: 'Explorador', avatar: 'explorer-01', xp: 170, novacoins: 90, currentEra: 2,
        unlockedEras: [1, 2],
        completedLessons: Object.fromEntries(ids.map((id) => [id, { score: 100, completedAt: '2026-11-05T00:00:00Z', eventId: id }])),
        worlds: { 1: { objects: [] }, 2: { objects: [] } }, inventory: {}, pets: [], pendingSync: [], updatedAt: '2026-11-05T00:00:00Z',
      }),
    );
  }, { ids, protoSeen: opts.protoSeen ?? 0 });
}

const sounds = (page: Page) => page.evaluate(() => (window as unknown as { __codenovaSounds: string[] }).__codenovaSounds);

/** Color de un píxel del dibujo de Proto-0 (cuadrícula de 32x32). */
const protoPixel = (page: Page, x: number, y: number) =>
  page.locator('[data-testid="proto-bot"] canvas').evaluate((c: HTMLCanvasElement, [x, y]) => {
    const [r, g, b] = c.getContext('2d')!.getImageData(x!, y!, 1, 1).data;
    return `#${[r, g, b].map((v) => v!.toString(16).padStart(2, '0')).join('')}`;
  }, [x, y]);

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
    await expect(dock).toHaveAttribute('data-era', '2'); // ya evolucionó

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
    await page.getByTestId('lesson-e2-01-condicionales').click();
    await page.getByTestId('btn-start').click();
    await page.getByTestId('btn-run').click();
    await expect(dock).toHaveAttribute('data-mood', 'sad');
    await expect(page.getByTestId('proto-bubble')).toContainText('Casi');
  });

  test('los atajos y el autocompletado escriben el código por ti', async ({ page }) => {
    await seedEra1Done(page);
    await page.goto('/');
    await page.getByTestId('tab-lecciones').click();
    await page.getByTestId('lesson-e2-01-condicionales').click();
    await page.getByTestId('btn-start').click();

    // Los atajos de la Era 2 aparecen (if, for, function…), además de los de la Era 1.
    for (const id of ['log', 'let', 'if', 'for', 'function']) await expect(page.getByTestId(`snip-${id}`)).toBeVisible();

    const editor = page.locator('.cm-content');
    await editor.click();
    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.press('Delete');
    await page.keyboard.insertText('const antorchas = 3;\n');

    // if/else con dos toques: solo se escribe la condición y los textos.
    await page.getByTestId('snip-ifelse').click();
    await page.keyboard.type('antorchas >= 2');
    await page.keyboard.press('Tab');
    await page.getByTestId('snip-log').click();
    await page.getByTestId('snip-texto').click();
    await page.keyboard.type('La cueva está iluminada');
    // Ir a la línea vacía del else (penúltima línea) con el teclado.
    await page.keyboard.press('ControlOrMeta+End');
    await page.keyboard.press('ArrowUp');
    await page.keyboard.press('End');

    // Autocompletado: escribir "log" y elegir de la lista.
    await page.keyboard.type('log');
    // En el celular se elige tocando la opción de la lista.
    const option = page.locator('.cm-tooltip-autocomplete li', { hasText: 'console.log' });
    await expect(option).toBeVisible();
    await option.click();
    await expect(page.locator('.cm-tooltip-autocomplete')).toHaveCount(0);
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

  test('deslizar la cinta de atajos NO inserta nada; tocar sí', async ({ page }) => {
    await seedEra1Done(page);
    await page.goto('/');
    await page.getByTestId('tab-lecciones').click();
    await page.getByTestId('lesson-e2-01-condicionales').click();
    await page.getByTestId('btn-start').click();
    const editor = page.locator('.cm-content');
    const before = await editor.innerText();

    // Deslizar: el dedo baja sobre "if" y se mueve 60 px antes de levantarse.
    const box = (await page.getByTestId('snip-if').boundingBox())!;
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await page.mouse.move(box.x + box.width / 2 - 60, box.y + box.height / 2, { steps: 6 });
    await page.mouse.up();
    expect(await editor.innerText()).toBe(before);

    // Tocar: sí inserta.
    await page.getByTestId('snip-log').click();
    await expect(editor).toContainText('console.log()');
  });

  test('sonidos de 8 bits: error, pista, aprobado, compra; y se pueden silenciar', async ({ page }) => {
    await seedEra1Done(page);
    await page.goto('/');
    await page.getByTestId('tab-lecciones').click();
    await page.getByTestId('lesson-e2-01-condicionales').click();
    await page.getByTestId('btn-start').click();

    await page.getByTestId('btn-run').click();
    await expect.poll(() => sounds(page)).toContain('error');
    await page.getByTestId('btn-hint').click();
    await expect.poll(() => sounds(page)).toContain('hint');

    const editor = page.locator('.cm-content');
    await editor.click();
    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.press('Delete');
    await page.keyboard.insertText('const antorchas = 3;\nif (antorchas >= 2) {\n  console.log("La cueva está iluminada");\n} else {\n  console.log("Está muy oscuro");\n}');
    await page.getByTestId('btn-run').click();
    await expect.poll(() => sounds(page)).toContain('success');

    await page.getByTestId('tab-tienda').click();
    await page.getByTestId('buy-deco-roca-musgo').click();
    await expect.poll(() => sounds(page)).toContain('coin');

    // Silenciar: ya no suena nada.
    await page.getByTestId('btn-sound').click();
    await expect(page.getByTestId('btn-sound')).toHaveAttribute('aria-pressed', 'true');
    const count = (await sounds(page)).length;
    await page.getByTestId('buy-deco-roca-musgo').click();
    await page.waitForTimeout(300);
    expect((await sounds(page)).length).toBe(count);
    // Se recuerda al recargar.
    await page.reload();
    await expect(page.getByTestId('btn-sound')).toHaveAttribute('aria-pressed', 'true');
  });

  test('Proto-0 evoluciona a v2 con animación y cambia de color', async ({ page }) => {
    await seedEra1Done(page, { protoSeen: 1 }); // la persona aún no ha visto la v2
    await page.goto('/');
    const dock = page.getByTestId('proto-dock');
    await expect(dock).toHaveAttribute('data-evolving', 'true');
    await expect(page.getByTestId('proto-bubble')).toContainText('Evolucioné');
    await shot(page, 'r06-evolucion');
    await expect(dock).toHaveAttribute('data-evolving', 'false', { timeout: 5000 });
    expect(await protoPixel(page, 16, 12)).toBe('#d8a657'); // cabeza de bronce (v2)
    expect(await page.evaluate(() => localStorage.getItem('codenova:proto-version'))).toBe('2');

    // No se repite al recargar.
    await page.reload();
    await page.waitForTimeout(500);
    await expect(dock).toHaveAttribute('data-evolving', 'false');
  });

  test('una persona nueva ve a Proto-0 v1 oxidado y el número de versión de la app', async ({ page }) => {
    await page.goto('/');
    const dock = page.getByTestId('proto-dock');
    await expect(dock).toHaveAttribute('data-era', '1');
    await expect(dock).toHaveAttribute('data-progress', '0.00');
    await page.waitForTimeout(400);
    expect(await protoPixel(page, 16, 12)).toBe('#b6a6c8'); // metal gris (v1)
    expect(await protoPixel(page, 10, 11)).toBe('#8a4a26'); // mancha de óxido
    await page.getByTestId('tab-lecciones').click();
    await expect(page.getByTestId('app-version')).toContainText(/CodeNova v0\.5\.0/);
  });
});
