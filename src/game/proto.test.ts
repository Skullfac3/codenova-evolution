import { describe, expect, it } from 'vitest';
import { PROTO_FUTURE_NOTE, PROTO_STAGES, buildProtoGrid, protoPalette, stageForEra, type ProtoFrame } from './proto';

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

  it('cada etapa se dibuja con un aspecto claramente distinto', () => {
    const frame = (era: number): ProtoFrame => ({ mood: 'idle', look: 'center', blinking: false, antennaOn: true, tick: 0, era });
    const colors = (era: number) => {
      const pal = protoPalette(era);
      return buildProtoGrid(frame(era)).map((row) => row.map((c) => (c === '.' ? '' : pal[c])));
    };
    const v1 = colors(1);
    const v2 = colors(2);
    // Todos los caracteres usados tienen color en su paleta.
    for (const grid of [v1, v2]) for (const row of grid) for (const c of row) expect(c).toBeDefined();
    // Cuerpo gris contra bronce, y ojos naranjas contra azules.
    expect(v1[20]![12]).toBe('#b6a6c8');
    expect(v2[20]![12]).toBe('#d9a441');
    expect(v1[16]![9]).toBe('#ff8a3d');
    expect(v2[16]![9]).toBe('#4aa3d8');
    // Más de una cuarta parte del dibujo cambia de color entre etapas.
    let filled = 0;
    let changed = 0;
    for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) {
      if (!v1[y]![x] && !v2[y]![x]) continue;
      filled++;
      if (v1[y]![x] !== v2[y]![x]) changed++;
    }
    expect(changed / filled).toBeGreaterThan(0.25);
    // Las eras sin etapa propia conservan el aspecto de la v2.
    expect(colors(3)).toEqual(v2);
  });
});
