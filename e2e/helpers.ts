import { expect, type Page } from '@playwright/test';

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
  for (let attempt = 1; attempt <= 3; attempt++) {
    // En el celular, al tocar «Ejecutar» el editor sale del modo escritura y la
    // pantalla se reacomoda: se espera a que termine para no tocar a mitad del cambio.
    await page.waitForFunction(() => !document.body.classList.contains('typing'));
    await button.scrollIntoViewIfNeeded();
    await page.evaluate(() => new Promise<void>((resolve) => requestAnimationFrame(() => requestAnimationFrame(() => resolve()))));
    await button.click();
    // Si el clic llegó, el botón desaparece (siguiente reto o recompensa). Si el
    // navegador se lo dio al iframe por error, el botón sigue ahí: se reintenta.
    try {
      await expect(button).toBeHidden({ timeout: 1500 });
      return;
    } catch (e) {
      if (attempt === 3) throw e;
    }
  }
}
