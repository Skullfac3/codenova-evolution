/**
 * Atajos del editor. Se desbloquean por era, igual que los conceptos:
 * nunca se ofrece un atajo de algo que el estudiante aún no aprendió.
 *
 * `template` usa la sintaxis de snippets de CodeMirror: ${nombre} es un
 * campo editable que queda seleccionado; Tab salta al siguiente.
 */
export interface Snippet {
  id: string;
  /** Texto del botón. */
  label: string;
  /** Explicación corta (autocompletado y lector de pantalla). */
  detail: string;
  template: string;
  era: number;
  kind: 'code' | 'symbol';
}

export const SNIPPETS: Snippet[] = [
  // ── Era 1 · código ──
  { id: 'log', label: 'console.log', detail: 'Mostrar en la consola', template: 'console.log(${})', era: 3, kind: 'code' },
  { id: 'texto', label: '"texto"', detail: 'Texto entre comillas', template: '"${}"', era: 3, kind: 'code' },
  { id: 'let', label: 'let', detail: 'Variable que puede cambiar', template: 'let ${nombre} = ${valor};', era: 3, kind: 'code' },
  { id: 'const', label: 'const', detail: 'Constante', template: 'const ${nombre} = ${valor};', era: 3, kind: 'code' },
  { id: 'typeof', label: 'typeof', detail: 'Tipo de un valor', template: 'typeof ${valor}', era: 3, kind: 'code' },
  // ── Era 2 · código ──
  { id: 'if', label: 'if', detail: 'Condicional', template: 'if (${condición}) {\n\t${}\n}', era: 3, kind: 'code' },
  { id: 'ifelse', label: 'if / else', detail: 'Condicional con dos caminos', template: 'if (${condición}) {\n\t${}\n} else {\n\t${}\n}', era: 3, kind: 'code' },
  { id: 'elseif', label: 'else if', detail: 'Otro camino', template: ' else if (${condición}) {\n\t${}\n}', era: 3, kind: 'code' },
  { id: 'for', label: 'for', detail: 'Ciclo con contador', template: 'for (let i = ${inicio}; i <= ${fin}; i++) {\n\t${}\n}', era: 3, kind: 'code' },
  { id: 'while', label: 'while', detail: 'Ciclo mientras se cumpla', template: 'while (${condición}) {\n\t${}\n}', era: 3, kind: 'code' },
  { id: 'function', label: 'function', detail: 'Función con return', template: 'function ${nombre}(${parámetros}) {\n\treturn ${};\n}', era: 3, kind: 'code' },
  { id: 'return', label: 'return', detail: 'Devolver un valor', template: 'return ${};', era: 3, kind: 'code' },
  { id: 'forof', label: 'for…of', detail: 'Recorrer un arreglo', template: 'for (const ${elemento} of ${lista}) {\n\t${}\n}', era: 3, kind: 'code' },
  { id: 'push', label: '.push', detail: 'Agregar al final de un arreglo', template: '.push(${})', era: 3, kind: 'code' },
  { id: 'length', label: '.length', detail: 'Cantidad de elementos', template: '.length', era: 3, kind: 'code' },
  // ── Símbolos (difíciles de encontrar en el teclado del celular) ──
  { id: 'paren', label: '( )', detail: 'Paréntesis', template: '(${})', era: 3, kind: 'symbol' },
  { id: 'quote', label: '"', detail: 'Comillas', template: '"', era: 3, kind: 'symbol' },
  { id: 'semi', label: ';', detail: 'Punto y coma', template: ';', era: 3, kind: 'symbol' },
  { id: 'eq', label: '=', detail: 'Asignar', template: ' = ', era: 3, kind: 'symbol' },
  { id: 'plus', label: '+', detail: 'Sumar o unir texto', template: ' + ', era: 3, kind: 'symbol' },
  { id: 'times', label: '*', detail: 'Multiplicar', template: ' * ', era: 3, kind: 'symbol' },
  { id: 'mod', label: '%', detail: 'Residuo', template: ' % ', era: 3, kind: 'symbol' },
  { id: 'strict', label: '===', detail: 'Igual a', template: ' === ', era: 3, kind: 'symbol' },
  { id: 'gte', label: '>=', detail: 'Mayor o igual', template: ' >= ', era: 3, kind: 'symbol' },
  { id: 'braces', label: '{ }', detail: 'Llaves', template: '{\n\t${}\n}', era: 3, kind: 'symbol' },
  { id: 'brackets', label: '[ ]', detail: 'Corchetes', template: '[${}]', era: 3, kind: 'symbol' },
  { id: 'and', label: '&&', detail: 'Y', template: ' && ', era: 3, kind: 'symbol' },
  { id: 'or', label: '||', detail: 'O', template: ' || ', era: 3, kind: 'symbol' },
  { id: 'lt', label: '<', detail: 'Menor que', template: ' < ', era: 3, kind: 'symbol' },
];

/** Atajos disponibles hasta cierta era (acumulativos). */
export const snippetsForEra = (era: number) => SNIPPETS.filter((s) => s.era <= era);
