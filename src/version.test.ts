import { describe, expect, it } from 'vitest';
import { APP_VERSION } from './version';

describe('APP_VERSION', () => {
  it('es la versión de package.json inyectada en el build, no un texto a mano', () => {
    // vite.config.ts lee package.json y define __APP_VERSION__; vitest
    // aplica ese define, así que aquí también debe ser la versión real.
    expect(APP_VERSION).toBe('0.4.0');
    expect(APP_VERSION).toMatch(/^\d+\.\d+\.\d+$/);
  });
});
