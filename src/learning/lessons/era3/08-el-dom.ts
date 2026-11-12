import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e3-16-el-dom',
  era: 3,
  order: 17,
  kind: 'lesson',
  title: 'El DOM: la página como un árbol',
  topics: ['DOM', 'document', 'querySelector', 'textContent'],

  intro:
    'Las máquinas de la fábrica no se mueven solas: alguien tiene que tocar sus controles. ' +
    'En una página web, JavaScript toca los controles a través del DOM.',

  concept: `
**El DOM es la página convertida en un árbol de elementos que JavaScript puede tocar.**

Cada etiqueta de tu HTML es un elemento del árbol: el \`h1\`, los párrafos, los botones…

\`\`\`js
// document es la página entera
const titulo = document.querySelector("#titulo");
titulo.textContent = "Taller abierto";
\`\`\`

- **document**: la página entera, el punto de partida.
- **querySelector(selector)**: busca el PRIMER elemento que coincida con el selector.
- Los selectores son los mismos de CSS: \`"#titulo"\` por id, \`".oferta"\` por clase, \`"p"\` por etiqueta.
- **textContent**: el texto visible del elemento. Leerlo te dice qué dice; cambiarlo cambia lo que se ve.

> En el laboratorio no hay una página real, así que practicamos con una
> mini-página llamada \`documento\` que funciona igual: \`documento.querySelector(...)\`.
> En tu propia página, es \`document\` a secas.
`.trim(),

  example: {
    code: `const documento = {
  elementos: {
    "#titulo": { textContent: "Taller" },
    "#aviso": { textContent: "Cerrado" },
  },
  querySelector(selector) {
    return this.elementos[selector];
  },
};

const titulo = documento.querySelector("#titulo");
titulo.textContent = "Taller abierto";
console.log(titulo.textContent);`,
    output: ['Taller abierto'],
  },

  exercise: {
    id: 'e3-16-ex-main',
    prompt:
      'Cambia el título (#titulo) a "Taller abierto" y el aviso (#aviso) a "Pasa, explorador". ' +
      'Luego muestra el título nuevo.',
    starterCode: `// La página del taller (mini-DOM de práctica).
// En una página real esto es \`document\`: aquí lo imitamos
// porque el laboratorio no tiene una página real.
const documento = {
  elementos: {
    "#titulo": { textContent: "Taller" },
    "#aviso": { textContent: "Cerrado" },
  },
  querySelector(selector) {
    return this.elementos[selector];
  },
};

// Cambia el título y el aviso. Muestra el título nuevo.
`,
    solution: `const documento = {
  elementos: {
    "#titulo": { textContent: "Taller" },
    "#aviso": { textContent: "Cerrado" },
  },
  querySelector(selector) {
    return this.elementos[selector];
  },
};

documento.querySelector("#titulo").textContent = "Taller abierto";
documento.querySelector("#aviso").textContent = "Pasa, explorador";
console.log(documento.querySelector("#titulo").textContent);`,
    checks: [
      { type: 'code-matches', pattern: String.raw`querySelector\s*\(\s*["']#titulo["']`, message: 'Busca el título con documento.querySelector("#titulo").' },
      { type: 'code-matches', pattern: String.raw`querySelector\s*\(\s*["']#aviso["']`, message: 'Busca el aviso con documento.querySelector("#aviso").' },
      { type: 'code-matches', pattern: String.raw`textContent\s*=`, message: 'Cambia el texto con .textContent = "...".' },
      { type: 'output-equals', expected: ['Taller abierto'], message: 'Debe mostrarse "Taller abierto".' },
    ],
    tests: [
      {
        code: 'console.log(documento.querySelector("#aviso").textContent);',
        expected: ['Pasa, explorador'],
        message: 'El título cambió, pero el aviso no: revisa documento.querySelector("#aviso").textContent.',
      },
    ],
    hints: [
      'documento.querySelector("#titulo") te devuelve el elemento del título.',
      'Para cambiar lo que dice: elemento.textContent = "nuevo texto";',
    ],
  },

  extraChallenges: [
    {
      id: 'e3-16-ex-extra-1',
      prompt: 'El cartel de ofertas (.oferta) dice "Oferta". Cámbialo a "Oferta: 2x1 en cinceles" y muéstralo.',
      starterCode: `const documento = {
  elementos: {
    "#titulo": { textContent: "Taller" },
    ".oferta": { textContent: "Oferta" },
  },
  querySelector(selector) {
    return this.elementos[selector];
  },
};

// Cambia el cartel de ofertas (.oferta) y muéstralo.
`,
      solution: `const documento = {
  elementos: {
    "#titulo": { textContent: "Taller" },
    ".oferta": { textContent: "Oferta" },
  },
  querySelector(selector) {
    return this.elementos[selector];
  },
};

documento.querySelector(".oferta").textContent = "Oferta: 2x1 en cinceles";
console.log(documento.querySelector(".oferta").textContent);`,
      checks: [
        { type: 'code-matches', pattern: String.raw`querySelector\s*\(\s*["']\.oferta["']`, message: 'Busca el cartel con documento.querySelector(".oferta").' },
        { type: 'code-matches', pattern: String.raw`textContent\s*=`, message: 'Cambia el texto con .textContent = "...".' },
        { type: 'output-equals', expected: ['Oferta: 2x1 en cinceles'], message: 'Debe mostrarse "Oferta: 2x1 en cinceles".' },
      ],
      tests: [
        {
          code: 'console.log(documento.querySelector(".oferta").textContent);',
          expected: ['Oferta: 2x1 en cinceles'],
          message: 'El cartel no cambió: revisa que uses .textContent = "..." con el selector ".oferta".',
        },
      ],
      hints: ['Los selectores de clase empiezan con punto: ".oferta".'],
    },
    {
      id: 'e3-16-ex-extra-2',
      prompt: 'Escribe una función cambiarTexto(selector, nuevoTexto) que cambie el texto del elemento y devuelva el texto nuevo. Muestra cambiarTexto("#titulo", "Taller del Sol").',
      starterCode: `const documento = {
  elementos: {
    "#titulo": { textContent: "Taller" },
    "#aviso": { textContent: "Cerrado" },
  },
  querySelector(selector) {
    return this.elementos[selector];
  },
};

// function cambiarTexto(selector, nuevoTexto) { … }
`,
      solution: `const documento = {
  elementos: {
    "#titulo": { textContent: "Taller" },
    "#aviso": { textContent: "Cerrado" },
  },
  querySelector(selector) {
    return this.elementos[selector];
  },
};

function cambiarTexto(selector, nuevoTexto) {
  const elemento = documento.querySelector(selector);
  elemento.textContent = nuevoTexto;
  return elemento.textContent;
}
console.log(cambiarTexto("#titulo", "Taller del Sol"));`,
      checks: [
        { type: 'code-matches', pattern: String.raw`function\s+cambiarTexto\s*\(\s*selector\s*,\s*nuevoTexto\s*\)`, message: 'Crea function cambiarTexto(selector, nuevoTexto).' },
        { type: 'code-matches', pattern: String.raw`querySelector\s*\(\s*selector\s*\)`, message: 'Dentro de la función busca con documento.querySelector(selector).' },
        { type: 'output-equals', expected: ['Taller del Sol'], message: 'Debe mostrarse "Taller del Sol".' },
      ],
      tests: [
        {
          code: 'console.log(cambiarTexto("#aviso", "Abierto"));',
          expected: ['Abierto'],
          message: 'Funciona con el título, pero no con otro selector: usa el parámetro selector dentro de la función.',
        },
      ],
      hints: ['Dentro de la función: documento.querySelector(selector).textContent = nuevoTexto;'],
    },
  ],

  feedback: {
    success: '¡La página te obedece! Ya sabes encontrar elementos con querySelector y cambiar lo que dicen. 🔧',
    retry: 'El texto no cambió. Revisa el selector ("#titulo") y que uses .textContent = "...".',
  },
  reward: { xp: 20, coins: 10 },
  next: 'e3-17-eventos',
};
