import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e3-19-promesas-async',
  era: 3,
  order: 20,
  kind: 'lesson',
  title: 'Promesas y async/await: esperar sin bloquear',
  topics: ['promesas', 'async', 'await', 'then'],

  intro:
    'Hornear pan toma su tiempo, pero el panadero no se queda mirando el horno: ' +
    'sigue amasando y el horno le avisa cuando está listo. Así trabajan las promesas.',

  concept: `
**Algunas cosas toman tiempo: traer datos, esperar un temporizador. JavaScript no se queda parado: usa promesas.**

Una **promesa** es un "te aviso cuando esté". Tiene tres estados: pendiente, cumplida o fallida.

\`\`\`js
esperar(100).then(function () {
  console.log("Listo");
});
\`\`\`

- **.then(...)**: lo que pasa cuando la promesa se cumple. El resto del programa sigue.
- **async**: marca una función que puede esperar. Una función async siempre devuelve una promesa.
- **await**: pausa SOLO esa función hasta que la promesa se cumple. El resto de la página no se congela.

\`\`\`js
async function preparar() {
  console.log("1. Pido los ingredientes...");
  await esperar(100);
  console.log("2. Ingredientes listos");
}
preparar();
\`\`\`

Sin await, el "2." saldría antes de tiempo. Con await, cada paso espera a su turno.
`.trim(),

  example: {
    code: `function esperar(ms) {
  return new Promise(function (resolver) {
    setTimeout(resolver, ms);
  });
}

async function preparar() {
  console.log("1. Pido los ingredientes...");
  await esperar(50);
  console.log("2. Ingredientes listos");
}
preparar();`,
    output: ['1. Pido los ingredientes...', '2. Ingredientes listos'],
  },

  exercise: {
    id: 'e3-19-ex-main',
    prompt:
      'Escribe prepararPedido: una función async que\n' +
      '1. muestre "1. Pido los ingredientes..."\n' +
      '2. espere 100 ms\n' +
      '3. muestre "2. Ingredientes listos"\n' +
      '4. espere 100 ms\n' +
      '5. muestre "3. Pedido listo"\n' +
      'Luego llámala.',
    starterCode: `// esperar(ms) devuelve una promesa que se cumple tras ms milisegundos.
function esperar(ms) {
  return new Promise(function (resolver) {
    setTimeout(resolver, ms);
  });
}

// Escribe prepararPedido: una función async con 3 mensajes y 2 esperas.
// Luego llámala.
`,
    solution: `function esperar(ms) {
  return new Promise(function (resolver) {
    setTimeout(resolver, ms);
  });
}

async function prepararPedido() {
  console.log("1. Pido los ingredientes...");
  await esperar(100);
  console.log("2. Ingredientes listos");
  await esperar(100);
  console.log("3. Pedido listo");
}
prepararPedido();`,
    checks: [
      { type: 'code-matches', pattern: String.raw`async\s+function\s+prepararPedido\s*\(\s*\)`, message: 'Crea async function prepararPedido() { … }.' },
      { type: 'code-matches', pattern: String.raw`await\s+esperar\s*\(`, message: 'Espera con await esperar(100); antes de cada mensaje siguiente.' },
      {
        type: 'output-equals',
        expected: ['1. Pido los ingredientes...', '2. Ingredientes listos', '3. Pedido listo'],
        message: 'Deben salir los 3 mensajes en orden: 1. Pido…, 2. Ingredientes…, 3. Pedido listo.',
      },
    ],
    tests: [
      {
        code: 'prepararPedido().then(function () { console.log("Entregado"); });',
        expected: ['Entregado'],
        message: 'El pedido se prepara, pero no se puede encadenar: una función async devuelve una promesa, así que .then debe funcionar.',
      },
    ],
    hints: [
      'async function prepararPedido() { … } — async marca que la función puede esperar.',
      'await esperar(100); pausa SOLO esta función, el resto sigue.',
    ],
  },

  extraChallenges: [
    {
      id: 'e3-19-ex-extra-1',
      prompt: 'Sin async: usa esperar(100).then(...) para mostrar "Listo" cuando pasen 100 ms.',
      starterCode: `function esperar(ms) {
  return new Promise(function (resolver) {
    setTimeout(resolver, ms);
  });
}

// Usa esperar(100).then(...) para mostrar "Listo".
`,
      solution: `function esperar(ms) {
  return new Promise(function (resolver) {
    setTimeout(resolver, ms);
  });
}

esperar(100).then(function () {
  console.log("Listo");
});`,
      checks: [
        { type: 'code-matches', pattern: String.raw`esperar\s*\(\s*100\s*\)\s*\.then`, message: 'Usa esperar(100).then(function () { … }).' },
        { type: 'output-equals', expected: ['Listo'], message: 'Debe mostrarse "Listo".' },
      ],
      tests: [
        {
          code: 'esperar(150).then(function () { console.log("Ya"); });',
          expected: ['Ya'],
          message: 'Funciona una vez, pero la espera debe ser reutilizable: usa esperar(ms) con el tiempo que te pidan.',
        },
      ],
      hints: ['.then(function () { … }) corre cuando la promesa se cumple.'],
    },
    {
      id: 'e3-19-ex-extra-2',
      prompt: 'Escribe sumar(a, b): async, espera 50 ms y devuelve a + b. Muestra sumar(3, 4) con .then: "Suma: 7".',
      starterCode: `function esperar(ms) {
  return new Promise(function (resolver) {
    setTimeout(resolver, ms);
  });
}

// async function sumar(a, b) { … }
// Muestra sumar(3, 4) con .then: "Suma: 7".
`,
      solution: `function esperar(ms) {
  return new Promise(function (resolver) {
    setTimeout(resolver, ms);
  });
}

async function sumar(a, b) {
  await esperar(50);
  return a + b;
}
sumar(3, 4).then(function (r) {
  console.log("Suma: " + r);
});`,
      checks: [
        { type: 'code-matches', pattern: String.raw`async\s+function\s+sumar\s*\(\s*a\s*,\s*b\s*\)`, message: 'Crea async function sumar(a, b).' },
        { type: 'code-matches', pattern: String.raw`\breturn\b`, message: 'La función debe devolver la suma con return.' },
        { type: 'output-equals', expected: ['Suma: 7'], message: 'Debe mostrarse "Suma: 7".' },
      ],
      tests: [
        {
          code: 'sumar(10, 5).then(function (r) { console.log("Suma: " + r); });',
          expected: ['Suma: 15'],
          message: 'Funciona con 3 y 4, pero no con otros números: devuelve a + b con los parámetros.',
        },
      ],
      hints: ['Una función async devuelve una promesa: por eso se lee con .then.'],
    },
  ],

  feedback: {
    success: '¡Esperaste sin bloquear nada! Las promesas y async/await ya son tuyos. ⏳',
    retry: 'El orden no salió. Revisa que cada await esperar(...) esté antes del mensaje siguiente.',
  },
  reward: { xp: 20, coins: 10 },
  next: 'e3-22-manejo-errores',
};
