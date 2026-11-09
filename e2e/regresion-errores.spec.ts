import { expect, test } from '@playwright/test';
import { era3Lessons } from '../src/learning/lessons/era3';

/**
 * Regresión de los errores encontrados en la prueba manual del 9 nov 2026:
 * 1. La lección 2 seguía bloqueada tras completar la 1 hasta recargar.
 * 2. "Ropa de inicio" no daba ninguna respuesta visible.
 * 3. Al aprobar un reto no se veía que la recompensa llegaba al continuar.
 */

test('la lección 2 se desbloquea en el mapa sin recargar, tras completar la 1', async ({ page }) => {
  await page.goto('/');
  await page.getByTestId('tab-lecciones').click();
  await page.getByTestId(`lesson-${era3Lessons[0]!.id}`).click();
  await page.getByTestId('btn-start').click();

  // Resolver el reto principal con la solución oficial.
  const content = page.locator('.cm-content').first();
  await content.click();
  await page.keyboard.press('ControlOrMeta+A');
  await page.keyboard.press('Delete');
  await page.keyboard.insertText(era3Lessons[0]!.exercise.solution);
  await page.getByTestId('btn-run').click();
  await expect(page.getByTestId('feedback')).toHaveAttribute('data-status', 'pass');
  // Error 3: al aprobar debe verse la recompensa pendiente antes de continuar.
  await expect(page.getByTestId('feedback')).toContainText('Recompensa al completar');
  await expect(page.getByTestId('feedback')).toContainText('+20 XP');
  await page.getByTestId('btn-continue').click();

  await expect(page.getByTestId('reward')).toHaveAttribute('data-awarded', 'true');
  await expect(page.getByTestId('hud-xp')).toHaveText('20 XP');

  // Ir a la lección 2 y volver al mapa: debe aparecer abierta SIN recargar.
  await page.getByTestId('btn-next-lesson').click();
  await expect(page.getByTestId('player')).toHaveAttribute('data-lesson', era3Lessons[1]!.id);
  await page.getByTestId('btn-exit').click();
  await expect(page.getByTestId(`lesson-${era3Lessons[1]!.id}`)).toHaveAttribute('data-state', 'open');
});

test('Ropa de inicio responde y no borra los adornos del refugio', async ({ page }) => {
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
  }, era3Lessons.slice(0, 7).map((l) => l.id));
  await page.goto('/');

  // Comprar y colocar una fogata.
  await page.getByTestId('tab-tienda').click();
  await page.getByTestId('buy-deco-fogata').click();
  await page.getByTestId('tab-refugio').click();
  await page.getByTestId('world-era-1').click();
  await page.getByTestId('mode-decorar').click();
  await page.getByTestId('inv-deco-fogata').click();
  const world = page.getByTestId('world');
  await world.scrollIntoViewIfNeeded();
  const box = (await world.boundingBox())!;
  await world.click({ position: { x: (5.5 * box.width) / 10, y: (4.5 * box.height) / 9 } });
  await expect(page.getByTestId('habitat')).toHaveAttribute('data-objects', '1');

  // Error 2: pulsar "Ropa de inicio" debe dar una respuesta visible de Proto-0
  // y el adorno debe seguir ahí. Primero se espera a que se apague el globo
  // de "¡Fogata colocado!" para que el globo que se comprueba sea el nuevo.
  await expect(page.getByTestId('proto-bubble')).toBeHidden({ timeout: 5000 });
  await page.getByTestId('outfit-none').click();
  await expect(page.getByTestId('proto-bubble')).toBeVisible();
  await expect(page.getByTestId('proto-bubble')).toContainText(/ropa de inicio/i);
  await expect(page.getByTestId('habitat')).toHaveAttribute('data-objects', '1');
});
