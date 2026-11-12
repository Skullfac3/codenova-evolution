import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e3-17-eventos',
  era: 3,
  order: 18,
  kind: 'lesson',
  title: 'Eventos: la página te escucha',
  topics: ['eventos', 'addEventListener', 'clic', 'teclado'],

  intro:
    'Una máquina no trabaja hasta que alguien aprieta su botón. Las páginas son igual: ' +
    'esperan a que pase algo — un clic, una tecla — y entonces reaccionan.',

  concept: `
**Un evento es algo que pasa en la página: un clic, una tecla, el movimiento del ratón.**

Con **addEventListener** le dices a un elemento: "cuando pase ESTO, corre ESTA función".

\`\`\`js
boton.addEventListener("clic", function () {
  console.log("¡Clic! La puerta se abrió");
});
\`\`\`

- El primer dato es el **nombre del evento**: \`"clic"\`, \`"tecla"\`, …
- El segundo es una **función**: no corre ahora, corre CUANDO pase el evento.
  A eso se le llama *callback*: "llámame cuando pase".
- El oyente de tecla recibe la tecla que se presionó: \`function (tecla) { … }\`.
- Un mismo elemento puede tener **varios oyentes**: todos corren cuando pasa el evento.

> En el laboratorio no hay botones reales, así que practicamos con un
> mini-botón: \`boton.pulsar()\` simula un clic y \`teclado.presionar("Enter")\`
> simula una tecla. En tu propia página, los clics y las teclas son de verdad.
`.trim(),

  example: {
    code: `const boton = {
  oyentes: {},
  addEventListener(evento, funcion) {
    if (!this.oyentes[evento]) {
      this.oyentes[evento] = [];
    }
    this.oyentes[evento].push(funcion);
  },
  pulsar() {
    const lista = this.oyentes["clic"] || [];
    for (const f of lista) {
      f();
    }
  },
};

boton.addEventListener("clic", function () {
  console.log("¡Clic! La puerta se abrió");
});
boton.pulsar();`,
    output: ['¡Clic! La puerta se abrió'],
  },

  exercise: {
    id: 'e3-17-ex-main',
    prompt:
      'Registra un oyente de "clic" que sume 1 a clics y muestre "Clics: N". ' +
      'Luego pulsa el botón 2 veces.',
    starterCode: `let clics = 0;

// Botón del taller (mini-DOM): en una página real es un <button>.
// addEventListener guarda tu función; pulsar() la ejecuta, como un clic real.
const boton = {
  oyentes: {},
  addEventListener(evento, funcion) {
    if (!this.oyentes[evento]) {
      this.oyentes[evento] = [];
    }
    this.oyentes[evento].push(funcion);
  },
  pulsar() {
    const lista = this.oyentes["clic"] || [];
    for (const f of lista) {
      f();
    }
  },
};

// Registra un oyente de "clic" que sume 1 a clics y lo muestre.
// Luego pulsa el botón 2 veces.
`,
    solution: `let clics = 0;

const boton = {
  oyentes: {},
  addEventListener(evento, funcion) {
    if (!this.oyentes[evento]) {
      this.oyentes[evento] = [];
    }
    this.oyentes[evento].push(funcion);
  },
  pulsar() {
    const lista = this.oyentes["clic"] || [];
    for (const f of lista) {
      f();
    }
  },
};

boton.addEventListener("clic", function () {
  clics += 1;
  console.log("Clics: " + clics);
});
boton.pulsar();
boton.pulsar();`,
    checks: [
      { type: 'code-matches', pattern: String.raw`addEventListener\s*\(\s*["']clic["']`, message: 'Registra el oyente con boton.addEventListener("clic", function () { … }).' },
      { type: 'code-matches', pattern: String.raw`pulsar\s*\(\s*\)`, message: 'Pulsa el botón con boton.pulsar(); para probar tu oyente.' },
      { type: 'output-equals', expected: ['Clics: 1', 'Clics: 2'], message: 'Deben salir "Clics: 1" y "Clics: 2".' },
    ],
    tests: [
      {
        code: 'boton.pulsar();',
        expected: ['Clics: 3'],
        message: 'Funciona 2 veces, pero al pulsar una tercera no contó: el oyente debe sumar 1 a clics cada vez.',
      },
    ],
    hints: [
      'boton.addEventListener("clic", function () { … });',
      'La función solo corre cuando se pulsa el botón: regístrala antes de pulsar.',
    ],
  },

  extraChallenges: [
    {
      id: 'e3-17-ex-extra-1',
      prompt: 'Registra un oyente de "tecla" que muestre "Tecla: " + la tecla que se presionó. Luego presiona "Enter".',
      starterCode: `// Teclado del taller (mini-DOM): presionar(tecla) simula una tecla.
// El oyente recibe la tecla que se presionó.
const teclado = {
  oyentes: {},
  addEventListener(evento, funcion) {
    if (!this.oyentes[evento]) {
      this.oyentes[evento] = [];
    }
    this.oyentes[evento].push(funcion);
  },
  presionar(tecla) {
    const lista = this.oyentes["tecla"] || [];
    for (const f of lista) {
      f(tecla);
    }
  },
};

// Registra un oyente de "tecla" que muestre "Tecla: " + la tecla.
// Luego presiona "Enter".
`,
      solution: `const teclado = {
  oyentes: {},
  addEventListener(evento, funcion) {
    if (!this.oyentes[evento]) {
      this.oyentes[evento] = [];
    }
    this.oyentes[evento].push(funcion);
  },
  presionar(tecla) {
    const lista = this.oyentes["tecla"] || [];
    for (const f of lista) {
      f(tecla);
    }
  },
};

teclado.addEventListener("tecla", function (tecla) {
  console.log("Tecla: " + tecla);
});
teclado.presionar("Enter");`,
      checks: [
        { type: 'code-matches', pattern: String.raw`addEventListener\s*\(\s*["']tecla["']`, message: 'Registra el oyente con teclado.addEventListener("tecla", function (tecla) { … }).' },
        { type: 'output-equals', expected: ['Tecla: Enter'], message: 'Debe mostrarse "Tecla: Enter".' },
      ],
      tests: [
        {
          code: 'teclado.presionar("Escape");',
          expected: ['Tecla: Escape'],
          message: 'Funciona con "Enter", pero no con otra tecla: usa el parámetro tecla dentro de la función.',
        },
      ],
      hints: ['El oyente de tecla recibe la tecla como parámetro: function (tecla) { … }'],
    },
    {
      id: 'e3-17-ex-extra-2',
      prompt: 'Registra DOS oyentes de "clic": uno que cuente y muestre "Clics: N", y otro que muestre "La lámpara se encendió". Luego pulsa el botón 1 vez.',
      starterCode: `let clics = 0;

const boton = {
  oyentes: {},
  addEventListener(evento, funcion) {
    if (!this.oyentes[evento]) {
      this.oyentes[evento] = [];
    }
    this.oyentes[evento].push(funcion);
  },
  pulsar() {
    const lista = this.oyentes["clic"] || [];
    for (const f of lista) {
      f();
    }
  },
};

// Registra DOS oyentes de "clic": uno que cuente y otro que encienda la lámpara.
// Luego pulsa el botón 1 vez.
`,
      solution: `let clics = 0;

const boton = {
  oyentes: {},
  addEventListener(evento, funcion) {
    if (!this.oyentes[evento]) {
      this.oyentes[evento] = [];
    }
    this.oyentes[evento].push(funcion);
  },
  pulsar() {
    const lista = this.oyentes["clic"] || [];
    for (const f of lista) {
      f();
    }
  },
};

boton.addEventListener("clic", function () {
  clics += 1;
  console.log("Clics: " + clics);
});
boton.addEventListener("clic", function () {
  console.log("La lámpara se encendió");
});
boton.pulsar();`,
      checks: [
        { type: 'code-matches', pattern: String.raw`addEventListener\s*\(\s*["']clic["']`, message: 'Registra los oyentes con boton.addEventListener("clic", function () { … }).' },
        { type: 'code-matches', pattern: String.raw`clics\s*\+=\s*1`, message: 'Un oyente debe sumar 1 a clics.' },
        { type: 'output-equals', expected: ['Clics: 1', 'La lámpara se encendió'], message: 'Deben salir "Clics: 1" y "La lámpara se encendió".' },
      ],
      tests: [
        {
          code: 'boton.pulsar();',
          expected: ['Clics: 2', 'La lámpara se encendió'],
          message: 'Al pulsar de nuevo deben correr LOS DOS oyentes: revisa que registraste los dos.',
        },
      ],
      hints: ['Un mismo botón puede tener varios oyentes: regístralos uno por uno.'],
    },
  ],

  feedback: {
    success: '¡La página ya te escucha! Un clic, una tecla… y tu código responde. 👂',
    retry: 'Nada reaccionó. ¿Registraste el oyente con addEventListener antes de pulsar?',
  },
  reward: { xp: 20, coins: 10 },
  next: 'e3-18-json-fetch',
};
