import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e3-25-proyecto-final',
  era: 3,
  order: 24,
  kind: 'lesson',
  title: 'Proyecto final: tu mini app',
  topics: ['proyecto-final', 'html', 'css', 'javascript', 'integradora'],

  intro:
    'Llegó el momento de juntarlo todo: HTML da la estructura, CSS el estilo ' +
    'y JavaScript el comportamiento. Tu primera mini app completa nace aquí.',

  concept: `
**Una página web tiene tres capas que trabajan juntas.**

\`\`\`html
<article class="tarjeta">
  <h2 id="nombre">Ashwagandha</h2>
  <p id="detalle">180 cápsulas</p>
  <button id="btn">Agregar</button>
</article>
\`\`\`

\`\`\`css
.tarjeta { border: 1px solid #ccc; padding: 16px; }
\`\`\`

\`\`\`js
const nombre = document.querySelector("#nombre");
document.querySelector("#btn").addEventListener("click", function () {
  nombre.textContent = "Agregado: " + nombre.textContent;
});
\`\`\`

- **HTML**: la estructura (qué hay en la página).
- **CSS**: el estilo (cómo se ve).
- **JavaScript**: el comportamiento (qué pasa cuando interactúas: clics, datos, esperas, errores).

En el laboratorio practicamos la lógica de la mini app con funciones: una
\`tarjeta(producto)\` arma el texto visible y un \`clic(producto)\` describe
lo que pasa al hacer clic. En tu propia página, esas funciones se conectan
al DOM real con \`querySelector\` y \`addEventListener\`.
`.trim(),

  example: {
    code: `const producto = { nombre: "Ashwagandha", capsulas: 180 };

function tarjeta(p) {
  return p.nombre + " · " + p.capsulas + " cápsulas";
}
function clic(p) {
  return "Agregado: " + p.nombre;
}

console.log(tarjeta(producto));
console.log(clic(producto));`,
    output: ['Ashwagandha · 180 cápsulas', 'Agregado: Ashwagandha'],
  },

  exercise: {
    id: 'e3-25-ex-main',
    prompt:
      'Arma la lógica de tu mini app con el producto { nombre: "Ashwagandha", capsulas: 180 }:\n' +
      '1. tarjeta(p) devuelve p.nombre + " · " + p.capsulas + " cápsulas".\n' +
      '2. clic(p) devuelve "Agregado: " + p.nombre.\n' +
      'Muestra tarjeta(producto) y luego clic(producto).',
    starterCode: `const producto = { nombre: "Ashwagandha", capsulas: 180 };

// function tarjeta(p) { … }
// function clic(p) { … }
// Muestra tarjeta(producto) y clic(producto).
`,
    solution: `const producto = { nombre: "Ashwagandha", capsulas: 180 };

function tarjeta(p) {
  return p.nombre + " · " + p.capsulas + " cápsulas";
}
function clic(p) {
  return "Agregado: " + p.nombre;
}

console.log(tarjeta(producto));
console.log(clic(producto));`,
    checks: [
      { type: 'code-matches', pattern: String.raw`function\s+tarjeta\s*\(\s*p\s*\)`, message: 'Crea function tarjeta(p) { … }.' },
      { type: 'code-matches', pattern: String.raw`function\s+clic\s*\(\s*p\s*\)`, message: 'Crea function clic(p) { … }.' },
      { type: 'output-equals', expected: ['Ashwagandha · 180 cápsulas', 'Agregado: Ashwagandha'], message: 'Deben mostrarse la tarjeta y el mensaje de agregado.' },
    ],
    tests: [
      {
        code: 'console.log(tarjeta({ nombre: "Maca Negra", capsulas: 30 })); console.log(clic({ nombre: "Maca Negra" }));',
        expected: ['Maca Negra · 30 cápsulas', 'Agregado: Maca Negra'],
        message: 'Funciona con Ashwagandha, pero no con otro producto: usa los parámetros p.nombre y p.capsulas.',
      },
    ],
    hints: [
      'tarjeta(p) { return p.nombre + " · " + p.capsulas + " cápsulas"; }',
      'clic(p) { return "Agregado: " + p.nombre; }',
    ],
  },

  extraChallenges: [
    {
      id: 'e3-25-ex-extra-1',
      prompt: 'Añade un segundo botón: clicOferta(p) devuelve "Oferta: " + p.nombre + " con envío gratis". Muéstralo con el producto Ashwagandha.',
      starterCode: `const producto = { nombre: "Ashwagandha", capsulas: 180 };

// function clicOferta(p) { … }
// Muestra clicOferta(producto).
`,
      solution: `const producto = { nombre: "Ashwagandha", capsulas: 180 };

function clicOferta(p) {
  return "Oferta: " + p.nombre + " con envío gratis";
}

console.log(clicOferta(producto));`,
      checks: [
        { type: 'code-matches', pattern: String.raw`function\s+clicOferta\s*\(\s*p\s*\)`, message: 'Crea function clicOferta(p) { … }.' },
        { type: 'output-equals', expected: ['Oferta: Ashwagandha con envío gratis'], message: 'Debe mostrarse la oferta de Ashwagandha.' },
      ],
      tests: [
        {
          code: 'console.log(clicOferta({ nombre: "Cúrcuma" }));',
          expected: ['Oferta: Cúrcuma con envío gratis'],
          message: 'La oferta debe usar p.nombre, no un nombre escrito a mano.',
        },
      ],
      hints: ['return "Oferta: " + p.nombre + " con envío gratis";'],
    },
    {
      id: 'e3-25-ex-extra-2',
      prompt: 'Guarda un mensaje de bienvenida en una variable y muéstralo junto a la tarjeta de Ashwagandha: "Bienvenido a JOY NATURA — Ashwagandha · 180 cápsulas".',
      starterCode: `const producto = { nombre: "Ashwagandha", capsulas: 180 };

// Guarda "Bienvenido a JOY NATURA" en una variable y muéstralo junto a la tarjeta.
`,
      solution: `const producto = { nombre: "Ashwagandha", capsulas: 180 };

function tarjeta(p) {
  return p.nombre + " · " + p.capsulas + " cápsulas";
}

const bienvenida = "Bienvenido a JOY NATURA";
console.log(bienvenida + " — " + tarjeta(producto));`,
      checks: [
        { type: 'code-matches', pattern: String.raw`const\s+bienvenida\s*=\s*["']Bienvenido a JOY NATURA["']`, message: 'Guarda el mensaje en const bienvenida = "Bienvenido a JOY NATURA".' },
        { type: 'output-equals', expected: ['Bienvenido a JOY NATURA — Ashwagandha · 180 cápsulas'], message: 'Debe mostrarse la bienvenida junto a la tarjeta.' },
      ],
      tests: [
        {
          code: 'console.log(bienvenida + " — " + tarjeta({ nombre: "Moringa", capsulas: 30 }));',
          expected: ['Bienvenido a JOY NATURA — Moringa · 30 cápsulas'],
          message: 'La tarjeta debe armarse con el producto que recibe, no con un texto fijo.',
        },
      ],
      hints: ['bienvenida + " — " + tarjeta(producto) junta el mensaje guardado con la tarjeta.'],
    },
  ],

  feedback: {
    success: '¡Tu mini app está viva! Estructura, estilo y comportamiento ya trabajan juntos. 🎉',
    retry: 'La mini app no armó bien. Revisa tarjeta(p) y clic(p): deben usar p.nombre y p.capsulas.',
  },
  reward: { xp: 20, coins: 10 },
  next: 'e3-15-evaluacion',
};
