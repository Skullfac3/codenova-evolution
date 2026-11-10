import { expect, test, type Page } from '@playwright/test';
import { era1Lessons } from '../src/learning/lessons/era1';

/**
 * Regresión de los dos errores reportados por Erick en el Nivel 1 (Era 1)
 * desde su iPhone:
 *
 * 1. La cinta de atajos inserta al recorrerla: al desplazar la cinta
 *    horizontalmente, los atajos se colocan en el editor aunque no se
 *    hayan tocado (el chip insertaba en pointerdown).
 * 2. Diseño responsive: la pantalla se desajusta al dispositivo
 *    (desbordamiento horizontal en pantallas angostas).
 */

async function openLesson1(page: Page) {
  const lesson = era1Lessons[0]!;
  await page.goto('/');
  await page.getByTestId('tab-lecciones').click();
  await page.getByTestId(`lesson-${lesson.id}`).click();
  await page.getByTestId('duration-5').click();
  await page.getByTestId('btn-start').click();
  await expect(page.getByTestId('player')).toHaveAttribute('data-lesson', lesson.id);
  return lesson;
}

async function editorText(page: Page) {
  return (await page.locator('.cm-content').first().innerText()).trim();
}

/** Desliza con el dedo sobre un elemento (gestos táctiles reales vía CDP). */
async function touchSwipeLeft(page: Page, selector: string, distance = 160) {
  const cdp = await page.context().newCDPSession(page);
  const box = await page.locator(selector).first().boundingBox();
  expect(box, 'la cinta de atajos debe ser visible').not.toBeNull();
  const x0 = box!.x + box!.width - 30;
  const y = box!.y + box!.height / 2;
  await cdp.send('Input.dispatchTouchEvent', {
    type: 'touchStart',
    touchPoints: [{ x: x0, y, id: 1 }],
  });
  const steps = 10;
  for (let i = 1; i <= steps; i++) {
    await cdp.send('Input.dispatchTouchEvent', {
      type: 'touchMove',
      touchPoints: [{ x: x0 - (distance * i) / steps, y, id: 1 }],
    });
    await page.waitForTimeout(16);
  }
  await cdp.send('Input.dispatchTouchEvent', { type: 'touchEnd', touchPoints: [] });
}

test.describe('Error 1 · la cinta de atajos no debe insertar al recorrerla', () => {
  // Los gestos táctiles solo se prueban en el proyecto móvil (Pixel 7).
  const onlyMobile = (testInfo: { project: { name: string } }) => testInfo.project.name !== 'movil-android';

  test('desplazar la cinta no inserta nada en el editor', async ({ page }, testInfo) => {
    test.skip(onlyMobile(testInfo), 'los gestos táctiles solo se prueban en el proyecto móvil');
    const lesson = await openLesson1(page);
    const before = await editorText(page);
    expect(before).toContain('Escribe el título aquí');
    expect(before).not.toContain('<h2>');

    const row = page.locator('.snip-row').first();
    const scrollBefore = await row.evaluate((el) => el.scrollLeft);
    await touchSwipeLeft(page, '.snip-row >> nth=0');
    await page.waitForTimeout(300);
    const scrollAfter = await row.evaluate((el) => el.scrollLeft);
    // El gesto sí desplazó la cinta (si no, la prueba no estaría probando nada).
    expect(scrollAfter).toBeGreaterThan(scrollBefore);

    const after = await editorText(page);
    expect(after).not.toContain('<h2>');
    expect(after).toBe(before);
    expect(lesson.exercise.starterCode).toContain('Escribe el título aquí');
  });

  test('tocar un atajo sí lo inserta en el editor', async ({ page }, testInfo) => {
    test.skip(onlyMobile(testInfo), 'los gestos táctiles solo se prueban en el proyecto móvil');
    await openLesson1(page);
    const before = await editorText(page);
    expect(before).not.toContain('<h2>');

    const chip = page.getByTestId('snip-h2');
    await expect(chip).toBeVisible();
    const box = await chip.boundingBox();
    await page.touchscreen.tap(box!.x + box!.width / 2, box!.y + box!.height / 2);
    await expect.poll(() => editorText(page)).toContain('<h2>');
  });

  test('el atajo también se inserta con el teclado (Enter)', async ({ page }, testInfo) => {
    test.skip(onlyMobile(testInfo), 'el foco de teclado se prueba junto al proyecto móvil');
    await openLesson1(page);
    const chip = page.getByTestId('snip-h2');
    await chip.focus();
    await page.keyboard.press('Enter');
    await expect.poll(() => editorText(page)).toContain('<h2>');
  });
});

interface OverflowReport {
  vw: number;
  docScrollWidth: number;
  offenders: { tag: string; cls: string; testid: string; left: number; right: number }[];
}

async function measureOverflow(page: Page): Promise<OverflowReport> {
  return page.evaluate(() => {
    const vw = window.innerWidth;
    const offenders: OverflowReport['offenders'] = [];
    const isClipped = (el: Element) => {
      let p = el.parentElement;
      while (p) {
        const ox = getComputedStyle(p).overflowX;
        if (ox === 'auto' || ox === 'scroll' || ox === 'hidden') return true;
        p = p.parentElement;
      }
      return false;
    };
    document.querySelectorAll('body *').forEach((el) => {
      const r = el.getBoundingClientRect();
      if ((r.right > vw + 1 || r.left < -1) && !isClipped(el)) {
        const h = el as HTMLElement;
        offenders.push({
          tag: el.tagName,
          cls: (h.className?.baseVal ?? h.className ?? '').toString().slice(0, 60),
          testid: h.dataset?.testid ?? '',
          left: Math.round(r.left),
          right: Math.round(r.right),
        });
      }
    });
    // Quedarse solo con los más externos: si un padre ya desborda, el hijo no aporta.
    const outer = offenders.filter(
      (o) => !offenders.some((p) => p !== o && p.left <= o.left && p.right >= o.right && p.tag === o.tag),
    );
    return { vw, docScrollWidth: document.documentElement.scrollWidth, offenders: outer.slice(0, 12) };
  });
}

async function expectNoHorizontalOverflow(page: Page, where: string) {
  const report = await measureOverflow(page);
  expect(report.docScrollWidth).toBeLessThanOrEqual(report.vw + 1);
  expect(
    report.offenders,
    `${where}: hay elementos fuera del viewport: ${JSON.stringify(report.offenders)}`,
  ).toEqual([]);
}

test.describe('Error 2 · sin desbordamiento horizontal en pantallas angostas', () => {
  test.use({ viewport: { width: 360, height: 800 } });

  test('360px: Refugio, mapa, Tienda y Perfiles no desbordan', async ({ page }) => {
    await page.goto('/');
    await expectNoHorizontalOverflow(page, 'Refugio 360px');
    await page.getByTestId('tab-lecciones').click();
    await expectNoHorizontalOverflow(page, 'Lecciones 360px');
    await page.getByTestId('tab-tienda').click();
    await expectNoHorizontalOverflow(page, 'Tienda 360px');
    await page.getByTestId('tab-perfiles').click();
    await expectNoHorizontalOverflow(page, 'Perfiles 360px');
  });

  test('360px: dentro de una lección de la Era 1 no desborda, ni con el autocompletado abierto', async ({
    page,
  }) => {
    await openLesson1(page);
    await expectNoHorizontalOverflow(page, 'Lección Era 1 360px');
    // Abrir el autocompletado: el tooltip es el sospechoso de desbordar.
    const content = page.locator('.cm-content').first();
    await content.click();
    await page.keyboard.press('End');
    await page.keyboard.insertText('h');
    await page.waitForTimeout(400);
    await expectNoHorizontalOverflow(page, 'Lección Era 1 con autocompletado 360px');
  });

  test('360px: con el globo de Proto-0 abierto no desborda', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('proto-bot').click();
    await expect(page.getByTestId('proto-bubble')).toBeVisible();
    await expectNoHorizontalOverflow(page, 'Refugio con globo de Proto-0 360px');
  });

  test('360px: la pantalla de recompensa no desborda', async ({ page }) => {
    const lesson = await openLesson1(page);
    const content = page.locator('.cm-content').first();
    await content.click();
    await page.keyboard.press('ControlOrMeta+A');
    await page.keyboard.press('Delete');
    await page.keyboard.insertText(lesson.exercise.solution);
    await page.getByTestId('btn-run').click();
    await expect(page.getByTestId('feedback')).toHaveAttribute('data-status', 'pass');
    await page.getByTestId('btn-continue').click();
    await expect(page.getByTestId('reward')).toBeVisible();
    await expectNoHorizontalOverflow(page, 'Recompensa 360px');
  });

  test('360px: el quiz de la evaluación no desborda', async ({ page }) => {
    const evaluation = era1Lessons[6]!;
    await page.goto('/');
    // Como Administrador todas las lecciones están abiertas.
    await page.getByTestId('tab-perfiles').click();
    await page.getByTestId('btn-switch-admin').click();
    await page.getByTestId('tab-lecciones').click();
    await page.getByTestId(`lesson-${evaluation.id}`).click();
    // Las evaluaciones no tienen selector de duración: van directo al quiz.
    await page.getByTestId('btn-start').click();
    await expect(page.getByTestId('quiz')).toBeVisible();
    await expectNoHorizontalOverflow(page, 'Quiz evaluación 360px');
  });
});

test.describe('Error 2 · sin desbordamiento horizontal a 390px (iPhone)', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('390px: Refugio, mapa, Tienda y Perfiles no desbordan', async ({ page }) => {
    await page.goto('/');
    await expectNoHorizontalOverflow(page, 'Refugio 390px');
    await page.getByTestId('tab-lecciones').click();
    await expectNoHorizontalOverflow(page, 'Lecciones 390px');
    await page.getByTestId('tab-tienda').click();
    await expectNoHorizontalOverflow(page, 'Tienda 390px');
    await page.getByTestId('tab-perfiles').click();
    await expectNoHorizontalOverflow(page, 'Perfiles 390px');
  });

  test('390px: dentro de una lección de la Era 1 no desborda', async ({ page }) => {
    await openLesson1(page);
    await expectNoHorizontalOverflow(page, 'Lección Era 1 390px');
  });
});
