import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e3-18-json-fetch',
  era: 3,
  order: 19,
  kind: 'lesson',
  title: 'JSON y fetch: traer datos de internet',
  topics: ['JSON', 'JSON.parse', 'JSON.stringify', 'fetch', 'promesas'],

  intro:
    'El mercado recibe cada mañana una lista de precios escrita en un papel. ' +
    'En internet, ese papel es JSON, y fetch es el mensajero que lo trae.',

  concept: `
**JSON es el formato en el que viajan los datos por internet: texto con forma de objeto.**

\`\`\`js
const texto = '{"producto": "Cincel", "precio": 30}';
const datos = JSON.parse(texto);
console.log(datos.producto);  // "Cincel"
\`\`\`

- **JSON.parse(texto)**: convierte el texto JSON en un objeto que ya puedes usar.
- **JSON.stringify(objeto)**: hace lo contrario, convierte un objeto en texto JSON.
- **fetch(url)**: pide datos a esa dirección y devuelve una **promesa**:
  un "te aviso cuando esté". Todavía no hay datos: hay que esperarlos.
- **.then(...)**: encadena lo que pasa cuando la promesa se cumple.
- **respuesta.json()**: lee el cuerpo de la respuesta como JSON (también devuelve una promesa).

\`\`\`js
fetch("https://mercado/api/producto")
  .then(function (respuesta) { return respuesta.json(); })
  .then(function (datos) { console.log(datos.producto); });
\`\`\`

> En el laboratorio no hay internet: el ejercicio trae una \`fetch\` que imita
> a la real y se comporta igual. En tu propia página, \`fetch\` habla de verdad
> con el servidor.
`.trim(),

  example: {
    code: `const texto = '{"producto": "Cincel", "precio": 30}';
const datos = JSON.parse(texto);
console.log(datos.producto + ": " + datos.precio + " monedas");`,
    output: ['Cincel: 30 monedas'],
  },

  exercise: {
    id: 'e3-18-ex-main',
    prompt: 'Trae el producto del mercado con fetch y muestra "Cincel: 30 monedas".',
    starterCode: `// En el laboratorio no hay internet: esta fetch imita a la real.
// Devuelve una promesa: .then recibe la respuesta y .json() lee los datos.
function fetch(url) {
  const datos = { producto: "Cincel", precio: 30, stock: 12 };
  return Promise.resolve({
    json: function () {
      return Promise.resolve(datos);
    },
  });
}

// Trae el producto del mercado y muestra "Cincel: 30 monedas".
`,
    solution: `function fetch(url) {
  const datos = { producto: "Cincel", precio: 30, stock: 12 };
  return Promise.resolve({
    json: function () {
      return Promise.resolve(datos);
    },
  });
}

fetch("https://mercado/api/producto")
  .then(function (respuesta) {
    return respuesta.json();
  })
  .then(function (datos) {
    console.log(datos.producto + ": " + datos.precio + " monedas");
  });`,
    checks: [
      { type: 'code-matches', pattern: String.raw`fetch\s*\(\s*["']https://mercado/api/producto["']`, message: 'Pide los datos con fetch("https://mercado/api/producto").' },
      { type: 'code-matches', pattern: String.raw`\.json\s*\(\s*\)`, message: 'Lee los datos con respuesta.json().' },
      { type: 'output-equals', expected: ['Cincel: 30 monedas'], message: 'Debe mostrarse "Cincel: 30 monedas".' },
    ],
    tests: [
      {
        code: 'fetch("https://mercado/api/producto").then(function (r) { return r.json(); }).then(function (d) { console.log("Stock: " + d.stock); });',
        expected: ['Stock: 12'],
        message: 'Llegó el producto, pero no lees todos sus datos: el objeto también trae stock.',
      },
    ],
    hints: [
      'fetch(url) devuelve una promesa: .then(function (respuesta) { … })',
      'respuesta.json() también devuelve una promesa: encadena otro .then.',
    ],
  },

  extraChallenges: [
    {
      id: 'e3-18-ex-extra-1',
      prompt: 'El mercado te pasa este texto JSON: \'{"nombre": "Tamo", "monedas": 45}\'. Conviértelo con JSON.parse y muestra "Tamo tiene 45 monedas".',
      starterCode: `const texto = '{"nombre": "Tamo", "monedas": 45}';
// const datos = JSON.parse(texto);
// Muestra "Tamo tiene 45 monedas".
`,
      solution: `const texto = '{"nombre": "Tamo", "monedas": 45}';
const datos = JSON.parse(texto);
console.log(datos.nombre + " tiene " + datos.monedas + " monedas");`,
      checks: [
        { type: 'code-matches', pattern: String.raw`JSON\.parse\s*\(`, message: 'Convierte el texto con JSON.parse(texto).' },
        { type: 'output-equals', expected: ['Tamo tiene 45 monedas'], message: 'Debe mostrarse "Tamo tiene 45 monedas".' },
      ],
      tests: [
        {
          code: 'const otro = JSON.parse(\'{"nombre": "Iri", "monedas": 30}\');\nconsole.log(otro.nombre + " tiene " + otro.monedas + " monedas");',
          expected: ['Iri tiene 30 monedas'],
          message: 'Funciona con Tamo, pero no con otro texto JSON: usa las propiedades del objeto que devuelve JSON.parse.',
        },
      ],
      hints: ['JSON.parse(texto) convierte el texto en un objeto que ya puedes usar.'],
    },
    {
      id: 'e3-18-ex-extra-2',
      prompt: 'Escribe una función aTexto(producto) que devuelva el JSON del producto con JSON.stringify. Muestra aTexto({ producto: "Martillo", precio: 25 }).',
      starterCode: `// function aTexto(producto) { … }
`,
      solution: `function aTexto(producto) {
  return JSON.stringify(producto);
}
console.log(aTexto({ producto: "Martillo", precio: 25 }));`,
      checks: [
        { type: 'code-matches', pattern: String.raw`function\s+aTexto\s*\(\s*producto\s*\)`, message: 'Crea function aTexto(producto).' },
        { type: 'code-matches', pattern: String.raw`JSON\.stringify\s*\(`, message: 'Dentro de la función usa JSON.stringify(producto).' },
        { type: 'output-equals', expected: ['{"producto":"Martillo","precio":25}'], message: 'Debe mostrarse {"producto":"Martillo","precio":25}.' },
      ],
      tests: [
        {
          code: 'console.log(aTexto({ producto: "Sierra", precio: 40 }));',
          expected: ['{"producto":"Sierra","precio":40}'],
          message: 'Funciona con el martillo, pero no con otro producto: devuelve JSON.stringify(producto) con el parámetro.',
        },
      ],
      hints: ['return JSON.stringify(producto);'],
    },
  ],

  feedback: {
    success: '¡Datos traídos del otro lado de la red! Ya sabes leer JSON y pedir datos con fetch. 📦',
    retry: 'No llegaron los datos. Revisa el .then de la respuesta y que .json() lea los datos.',
  },
  reward: { xp: 20, coins: 10 },
  next: 'e3-19-promesas-async',
};
