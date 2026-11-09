import { describe, expect, it } from 'vitest';
import { PROTO_FUTURE_NOTE, PROTO_STAGES, stageForEra } from './proto';

describe('etapas de Proto-0', () => {
  it('tiene una etapa por era con contenido (1 y 2)', () => {
    expect(PROTO_STAGES.map((s) => s.era)).toEqual([1, 2]);
    for (const stage of PROTO_STAGES) {
      expect(stage.name).toMatch(/^v\d+ \S+/);
      expect(stage.description.length).toBeGreaterThan(10);
    }
  });

  it('la v1 es el Explorador de antena naranja', () => {
    const v1 = PROTO_STAGES[0]!;
    expect(v1.name).toBe('v1 Explorador');
    expect(v1.description).toMatch(/naranja/i);
  });

  it('la v2 es el Guardián de gema azul y banda dorada', () => {
    const v2 = PROTO_STAGES[1]!;
    expect(v2.name).toBe('v2 Guardián');
    expect(v2.description).toMatch(/gema azul/i);
    expect(v2.description).toMatch(/banda dorada/i);
  });

  it('avisa que vendrán más evoluciones con las eras 3-5', () => {
    expect(PROTO_FUTURE_NOTE).toMatch(/eras 3, 4 y 5/);
  });

  it('stageForEra devuelve la etapa de la era y no pasa de la última', () => {
    expect(stageForEra(1).name).toBe('v1 Explorador');
    expect(stageForEra(2).name).toBe('v2 Guardián');
    // Las eras 3-5 aún no tienen etapa: se queda en la v2.
    expect(stageForEra(5).name).toBe('v2 Guardián');
    expect(stageForEra(0).name).toBe('v1 Explorador');
  });
});
