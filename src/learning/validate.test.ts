import { describe, expect, it } from 'vitest';
import { JSDOM } from 'jsdom';
import { stripHtmlComments, validateHtml, type HtmlParser } from './validate';
import type { Exercise } from '../types/lesson';

const parseHtml: HtmlParser = (code) => new JSDOM(code).window.document;

function htmlExercise(checks: Exercise['checks']): Exercise {
  return {
    id: 'test-html',
    language: 'html',
    prompt: 'prueba',
    starterCode: '',
    solution: '',
    checks,
    hints: ['pista'],
  };
}

describe('validateHtml', () => {
  it('html-contains: encuentra el elemento por selector y texto', () => {
    const ex = htmlExercise([
      { type: 'html-contains', selector: 'h1', text: 'Mi refugio', message: 'falta el título' },
    ]);
    expect(validateHtml(ex, '<h1>Mi refugio</h1>', parseHtml).passed).toBe(true);
    expect(validateHtml(ex, '<h1>Otra cosa</h1>', parseHtml).failures).toEqual(['falta el título']);
    expect(validateHtml(ex, '<p>Mi refugio</p>', parseHtml).passed).toBe(false);
  });

  it('html-contains: comprueba atributos con y sin valor', () => {
    const ex = htmlExercise([
      { type: 'html-contains', selector: 'a', attr: { name: 'href', value: 'mapa.html' }, message: 'falta href' },
      { type: 'html-contains', selector: 'img', attr: { name: 'alt' }, message: 'falta alt' },
    ]);
    const ok = '<a href="mapa.html">Ir</a><img src="x.png" alt="foto">';
    expect(validateHtml(ex, ok, parseHtml).passed).toBe(true);
    expect(validateHtml(ex, '<a href="otro.html">Ir</a><img src="x.png" alt="foto">', parseHtml).failures).toEqual(['falta href']);
    expect(validateHtml(ex, '<a href="mapa.html">Ir</a><img src="x.png">', parseHtml).failures).toEqual(['falta alt']);
  });

  it('html-contains: cuenta elementos y usa selectores descendientes', () => {
    const ex = htmlExercise([
      { type: 'html-contains', selector: 'ul li', count: 3, message: 'deben ser 3' },
    ]);
    expect(validateHtml(ex, '<ul><li>1</li><li>2</li><li>3</li></ul>', parseHtml).passed).toBe(true);
    expect(validateHtml(ex, '<ul><li>1</li><li>2</li></ul>', parseHtml).passed).toBe(false);
  });

  it('html-contains: el texto puede ser parte del contenido del elemento', () => {
    const ex = htmlExercise([
      { type: 'html-contains', selector: 'p', text: 'Proto-0', message: 'falta el nombre' },
    ]);
    expect(validateHtml(ex, '<p>Aquí vive Proto-0.</p>', parseHtml).passed).toBe(true);
  });

  it('code-matches no se engaña con comentarios HTML', () => {
    const ex = htmlExercise([
      { type: 'code-matches', pattern: '<h1>', message: 'falta h1' },
    ]);
    expect(validateHtml(ex, '<!-- <h1> -->', parseHtml).passed).toBe(false);
    expect(validateHtml(ex, '<h1>Título</h1>', parseHtml).passed).toBe(true);
  });

  it('un selector inválido no rompe la validación: simplemente falla', () => {
    const ex = htmlExercise([
      { type: 'html-contains', selector: 'h1 [', message: 'selector roto' },
    ]);
    expect(validateHtml(ex, '<h1>Hola</h1>', parseHtml).failures).toEqual(['selector roto']);
  });

  it('los scripts del estudiante no se ejecutan al validar', () => {
    const ex = htmlExercise([
      { type: 'html-contains', selector: 'h1', text: 'Hola', message: 'falta h1' },
    ]);
    const code = '<h1>Hola</h1><script>window.__hackeado = true;</script>';
    expect(validateHtml(ex, code, parseHtml).passed).toBe(true);
    expect((globalThis as Record<string, unknown>).__hackeado).toBeUndefined();
  });
});

describe('stripHtmlComments', () => {
  it('quita comentarios de varias líneas', () => {
    expect(stripHtmlComments('<h1>A</h1><!-- comentario\nlargo --><p>B</p>')).toBe('<h1>A</h1><p>B</p>');
  });
});
