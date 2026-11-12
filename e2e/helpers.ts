import type { Page } from '@playwright/test';

/**
 * Pulsa «Continuar →» sin perder el clic.
 *
 * La vista previa de HTML es un iframe con sandbox, que Chromium aísla en
 * otro proceso. Si el botón queda fuera de pantalla, Playwright desplaza
 * la página y hace clic enseguida; durante un instante el navegador
 * todavía cree que el iframe está donde estaba antes del desplazamiento
 * y le entrega el clic a él. La página nunca recibe el evento y la
 * prueba se queda esperando. Una persona no puede hacer clic tan rápido,
 * así que esto solo pasa en las pruebas.
 *
 * Por eso primero se desplaza y se esperan dos cuadros de animación, para
 * que la posición del iframe ya esté al día antes de hacer clic.
 */
export async function clickContinue(page: Page): Promise<void> {
  const button = page.getByTestId('btn-continue');
  await button.scrollIntoViewIfNeeded();
  await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
  await button.click();
}
