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
  /** Lenguaje del atajo: por defecto 'js'. Los de HTML solo salen en ejercicios HTML. */
  language?: 'js' | 'html';
}

export const SNIPPETS: Snippet[] = [
  // ── Era 1 · HTML ──
  { id: 'h1', label: '<h1>', detail: 'Título principal', template: '<h1>${}</h1>', era: 1, kind: 'code', language: 'html' },
  { id: 'h2', label: '<h2>', detail: 'Subtítulo', template: '<h2>${}</h2>', era: 1, kind: 'code', language: 'html' },
  { id: 'p', label: '<p>', detail: 'Párrafo', template: '<p>${}</p>', era: 1, kind: 'code', language: 'html' },
  { id: 'a', label: '<a>', detail: 'Enlace', template: '<a href="${url}">${texto}</a>', era: 1, kind: 'code', language: 'html' },
  { id: 'img', label: '<img>', detail: 'Imagen', template: '<img src="${url}" alt="${descripción}">', era: 1, kind: 'code', language: 'html' },
  { id: 'ul', label: '<ul>', detail: 'Lista sin orden', template: '<ul>\n\t<li>${}</li>\n</ul>', era: 1, kind: 'code', language: 'html' },
  { id: 'ol', label: '<ol>', detail: 'Lista ordenada', template: '<ol>\n\t<li>${}</li>\n</ol>', era: 1, kind: 'code', language: 'html' },
  { id: 'li', label: '<li>', detail: 'Elemento de lista', template: '<li>${}</li>', era: 1, kind: 'code', language: 'html' },
  { id: 'title', label: '<title>', detail: 'Título del documento', template: '<title>${}</title>', era: 1, kind: 'code', language: 'html' },
  { id: 'form', label: '<form>', detail: 'Formulario', template: '<form>\n\t${}\n</form>', era: 1, kind: 'code', language: 'html' },
  { id: 'input', label: '<input>', detail: 'Campo de texto', template: '<input type="text" placeholder="${}">', era: 1, kind: 'code', language: 'html' },
  { id: 'button', label: '<button>', detail: 'Botón', template: '<button>${}</button>', era: 1, kind: 'code', language: 'html' },
  // ── Símbolos HTML (difíciles de encontrar en el teclado del celular) ──
  { id: 'ltag', label: '<', detail: 'Menor que / abre etiqueta', template: '<', era: 1, kind: 'symbol', language: 'html' },
  { id: 'gtag', label: '>', detail: 'Mayor que / cierra etiqueta', template: '>', era: 1, kind: 'symbol', language: 'html' },
  { id: 'slash', label: '/', detail: 'Barra (cierra etiquetas)', template: '/', era: 1, kind: 'symbol', language: 'html' },
  // ── Era 2 · CSS ──
  { id: 'style', label: '<style>', detail: 'Bloque de reglas CSS', template: '<style>\n\t${}\n</style>', era: 2, kind: 'code', language: 'html' },
  { id: 'cssrule', label: 'regla CSS', detail: 'Selector con una declaración', template: '${selector} {\n\t${propiedad}: ${valor};\n}', era: 2, kind: 'code', language: 'html' },
  { id: 'cssclass', label: '.clase', detail: 'Regla para una clase', template: '.${nombre} {\n\t${propiedad}: ${valor};\n}', era: 2, kind: 'code', language: 'html' },
  { id: 'csscolor', label: 'color:', detail: 'Color del texto', template: 'color: ${};', era: 2, kind: 'code', language: 'html' },
  { id: 'cssbg', label: 'fondo:', detail: 'Color de fondo', template: 'background-color: ${};', era: 2, kind: 'code', language: 'html' },
  { id: 'cssflex', label: 'display: flex', detail: 'Fila flexible', template: 'display: flex;', era: 2, kind: 'code', language: 'html' },
  // ── Símbolos CSS ──
  { id: 'cbrace', label: '{ }', detail: 'Llaves (regla CSS)', template: '{\n\t${}\n}', era: 2, kind: 'symbol', language: 'html' },
  { id: 'colon', label: ':', detail: 'Dos puntos (propiedad: valor)', template: ': ', era: 2, kind: 'symbol', language: 'html' },
  { id: 'csssemi', label: ';', detail: 'Punto y coma (cierra la declaración)', template: ';', era: 2, kind: 'symbol', language: 'html' },
  // ── Era 3 · código ──
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
  // ── Era 3 · Medio avanzado (DOM, eventos, fetch, async) ──
  { id: 'queryselector', label: 'querySelector', detail: 'Buscar un elemento de la página', template: 'document.querySelector("${#id}")', era: 3, kind: 'code' },
  { id: 'addeventlistener', label: 'addEventListener', detail: 'Escuchar un evento', template: '.addEventListener("${evento}", function () {\n\t${}\n})', era: 3, kind: 'code' },
  { id: 'jsonparse', label: 'JSON.parse', detail: 'Convertir texto JSON en datos', template: 'JSON.parse(${texto})', era: 3, kind: 'code' },
  { id: 'fetch', label: 'fetch', detail: 'Pedir datos de internet', template: 'fetch("${url}")\n\t.then(function (respuesta) {\n\t\treturn respuesta.json();\n\t})\n\t.then(function (datos) {\n\t\t${}\n\t})', era: 3, kind: 'code' },
  { id: 'asyncfn', label: 'async', detail: 'Función que puede esperar', template: 'async function ${nombre}() {\n\tawait ${};\n}', era: 3, kind: 'code' },
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

/** Atajos de una era y un lenguaje (acumulativos por era). */
export const snippetsFor = (era: number, language: 'js' | 'html') =>
  SNIPPETS.filter((s) => s.era <= era && (s.language ?? 'js') === language);
