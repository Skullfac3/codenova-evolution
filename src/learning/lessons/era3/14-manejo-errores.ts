import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e3-22-manejo-errores',
  era: 3,
  order: 21,
  kind: 'lesson',
  title: 'Manejo de errores: que nada se rompa',
  topics: ['errores', 'try-catch', 'throw', 'depuracion'],

  intro:
    'Un puente con barandilla no evita las caídas: avisa a tiempo para que nadie se lastime. ' +
    'try/catch es la barandilla de tu programa: cuando algo falla, avisa y sigue en vez de romperse.',

  concept: `
**Un error no tiene por qué tumbar todo el programa: puedes atraparlo y decidir qué hacer.**

\`\`\`js
try {
  const datos = JSON.parse(texto);
} catch (e) {
  console.log("Texto inválido");
}
\`\`\`

- **try { … }**: intenta ejecutar algo que puede fallar (por ejemplo, leer un texto JSON roto).
- **catch (e) { … }**: si falló, entra aquí. \`e\` tiene el error, y \`e.message\` su explicación.
- **throw**: lanza tú mismo un error cuando un dato no vale: \`throw new Error("…")\`.
- Si no hay barandilla, un error detiene el programa en ese punto. Con try/catch, el programa sigue.

`.trim(),

  example: {
    code: `function dividir(a, b) {
  if (b === 0) {
    throw new Error("No se puede dividir entre cero");
  }
  return a / b;
}

try {
  console.log(dividir(6, 0));
} catch (e) {
  console.log(e.message);
}
console.log("El programa sigue");`,
    output: ['No se puede dividir entre cero', 'El programa sigue'],
  },

  exercise: {
    id: 'e3-22-ex-main',
    prompt:
      'Escribe leer(texto): intenta convertir el texto con JSON.parse y devolver la propiedad nombre. ' +
      'Si el texto no es JSON válido, devuelve "Texto inválido" en vez de romper. ' +
      'Muestra leer(\'{"nombre": "Proto-0"}\').',
    starterCode: `// Escribe leer(texto): intenta JSON.parse(texto) y devuelve .nombre.
// Si falla, devuelve "Texto inválido".
function leer(texto) {
  // tu código aquí
}

console.log(leer('{"nombre": "Proto-0"}'));
`,
    solution: `function leer(texto) {
  try {
    const datos = JSON.parse(texto);
    return datos.nombre;
  } catch (e) {
    return "Texto inválido";
  }
}

console.log(leer('{"nombre": "Proto-0"}'));`,
    checks: [
      { type: 'code-matches', pattern: String.raw`\btry\s*\{`, message: 'Envuelve el JSON.parse en try { … }.' },
      { type: 'code-matches', pattern: String.raw`\bcatch\s*\(\s*e\s*\)`, message: 'Atrapa el error con catch (e) { … }.' },
      { type: 'code-matches', pattern: String.raw`JSON\.parse\s*\(\s*texto\s*\)`, message: 'Convierte el parámetro texto con JSON.parse(texto).' },
      { type: 'output-equals', expected: ['Proto-0'], message: 'Debe mostrarse "Proto-0".' },
    ],
    tests: [
      {
        code: 'console.log(leer("esto no es json")); console.log(leer(\'{"nombre": "Nova"}\'));',
        expected: ['Texto inválido', 'Nova'],
        message: 'Funciona con Proto-0, pero no con otros textos: usa JSON.parse(texto) dentro del try y devuelve "Texto inválido" en el catch.',
      },
    ],
    hints: [
      'try { return JSON.parse(texto).nombre; } catch (e) { return "Texto inválido"; }',
      'El catch devuelve el mensaje amable en lugar de dejar que el error rompa el programa.',
    ],
  },

  extraChallenges: [
    {
      id: 'e3-22-ex-extra-1',
      prompt: 'Escribe validarEdad(edad): si la edad es negativa, lanza throw new Error("Edad inválida"); si no, devuelve la edad. Luego intenta validarEdad(-1) dentro de un try/catch y muestra el mensaje del error.',
      starterCode: `// function validarEdad(edad) { … }
`,
      solution: `function validarEdad(edad) {
  if (edad < 0) {
    throw new Error("Edad inválida");
  }
  return edad;
}

try {
  validarEdad(-1);
} catch (e) {
  console.log(e.message);
}`,
      checks: [
        { type: 'code-matches', pattern: String.raw`\bthrow\b`, message: 'Lanza el error con throw new Error("Edad inválida").' },
        { type: 'code-matches', pattern: String.raw`\btry\s*\{`, message: 'Intenta validarEdad(-1) dentro de try { … }.' },
        { type: 'output-equals', expected: ['Edad inválida'], message: 'Debe mostrarse "Edad inválida".' },
      ],
      tests: [
        {
          code: 'console.log(validarEdad(10));',
          expected: ['10'],
          message: 'Con una edad válida debe devolver la edad, no lanzar el error.',
        },
      ],
      hints: ['if (edad < 0) { throw new Error("Edad inválida"); }'],
    },
    {
      id: 'e3-22-ex-extra-2',
      prompt: 'Escribe probar(): una función async que espera con await una llamada que falla (falla() devuelve una promesa rechazada) dentro de try/catch y muestra "No se pudo cargar" si falla. Luego llámala.',
      starterCode: `function falla() {
  return Promise.reject(new Error("sin señal"));
}

// async function probar() { try { await falla(); … } catch (e) { … } }
// probar();
`,
      solution: `function falla() {
  return Promise.reject(new Error("sin señal"));
}

async function probar() {
  try {
    await falla();
    console.log("Cargó");
  } catch (e) {
    console.log("No se pudo cargar");
  }
}
probar();`,
      checks: [
        { type: 'code-matches', pattern: String.raw`async\s+function\s+probar\s*\(\s*\)`, message: 'Crea async function probar() { … }.' },
        { type: 'code-matches', pattern: String.raw`await\s+falla\s*\(\s*\)`, message: 'Espera la llamada con await falla(); dentro del try.' },
        { type: 'output-equals', expected: ['No se pudo cargar'], message: 'Debe mostrarse "No se pudo cargar".' },
      ],
      tests: [
        {
          code: 'probar().then(function () { console.log("Fin"); });',
          expected: ['Fin'],
          message: 'probar() debe seguir siendo una función async: su promesa se cumple aunque la espera falle.',
        },
      ],
      hints: ['Poner await dentro del try hace que el catch atrape también los fallos asíncronos.'],
    },
  ],

  feedback: {
    success: '¡Nada se rompió! Ya sabes poner barandillas con try/catch y lanzar errores con throw. 🛡️',
    retry: 'El error se escapó. Revisa que JSON.parse esté dentro del try y que el catch devuelva el mensaje.',
  },
  reward: { xp: 20, coins: 10 },
  next: 'e3-23-clases',
};
