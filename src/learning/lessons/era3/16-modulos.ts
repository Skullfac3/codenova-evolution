import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e3-24-modulos',
  era: 3,
  order: 23,
  kind: 'lesson',
  title: 'Módulos: cada pieza en su archivo',
  topics: ['modulos', 'import', 'export', 'modularidad'],

  intro:
    'Un taller ordenado guarda cada herramienta en su cajón, con su etiqueta. ' +
    'Los módulos hacen lo mismo con el código: cada archivo exporta lo suyo ' +
    'y los demás lo importan cuando lo necesitan.',

  concept: `
**Un módulo es un archivo que exporta cosas para que otros archivos las importen.**

En un archivo de utilidades (\`utilidades.js\`):

\`\`\`js
export function doble(n) {
  return n * 2;
}
\`\`\`

En el archivo principal (\`principal.js\`):

\`\`\`js
import { doble } from './utilidades.js';
console.log(doble(21)); // 42
\`\`\`

- **export**: saca una cosa del módulo para que otros la usen. \`export function doble\` exporta la función \`doble\`.
- **import { doble }**: trae solo lo nombrado que necesitas. Las llaves dicen "esto, con este nombre".
- **export default**: exporta una sola cosa principal; se importa sin llaves: \`import saludar from './saludo.js'\`.
- Un módulo se importa una vez y se reutiliza en muchos sitios.

> En el laboratorio todo vive en un solo archivo, así que practicamos con un
> módulo simulado: \`importar("doble")\` trae la función exportada, igual que
> \`import { doble }\` en un proyecto real.
`.trim(),

  example: {
    code: `const moduloUtilidades = {
  doble(n) { return n * 2; },
};
function importar(nombre) {
  return moduloUtilidades[nombre];
}

const doble = importar("doble");
console.log(doble(21));`,
    output: ['42'],
  },

  exercise: {
    id: 'e3-24-ex-main',
    prompt:
      'El módulo utilidades exporta doble. Tráela con importar("doble") y muestra doble(21). ' +
      'En un proyecto real, esto sería: import { doble } from \'./utilidades.js\'.',
    starterCode: `const moduloUtilidades = {
  doble(n) { return n * 2; },
  triple(n) { return n * 3; },
};
function importar(nombre) {
  return moduloUtilidades[nombre];
}

// Trae doble con importar("doble") y muestra doble(21).
`,
    solution: `const moduloUtilidades = {
  doble(n) { return n * 2; },
  triple(n) { return n * 3; },
};
function importar(nombre) {
  return moduloUtilidades[nombre];
}

const doble = importar("doble");
console.log(doble(21));`,
    checks: [
      { type: 'code-matches', pattern: String.raw`importar\s*\(\s*["']doble["']\s*\)`, message: 'Trae la función con importar("doble").' },
      { type: 'output-equals', expected: ['42'], message: 'doble(21) debe mostrar 42.' },
    ],
    tests: [
      {
        code: 'console.log(doble(10));',
        expected: ['20'],
        message: 'doble(21) salió, pero la función importada debe servir para cualquier número: usa la doble importada.',
      },
    ],
    hints: [
      'const doble = importar("doble"); — trae la función exportada y guárdala con su nombre.',
      'Luego úsala como cualquier función: doble(21).',
    ],
  },

  extraChallenges: [
    {
      id: 'e3-24-ex-extra-1',
      prompt: 'El módulo también exporta triple. Importa doble y triple y muestra doble(5) + triple(5).',
      starterCode: `const moduloUtilidades = {
  doble(n) { return n * 2; },
  triple(n) { return n * 3; },
};
function importar(nombre) {
  return moduloUtilidades[nombre];
}

// Importa doble y triple. Muestra doble(5) + triple(5).
`,
      solution: `const moduloUtilidades = {
  doble(n) { return n * 2; },
  triple(n) { return n * 3; },
};
function importar(nombre) {
  return moduloUtilidades[nombre];
}

const doble = importar("doble");
const triple = importar("triple");
console.log(doble(5) + triple(5));`,
      checks: [
        { type: 'code-matches', pattern: String.raw`importar\s*\(\s*["']doble["']\s*\)`, message: 'Importa doble con importar("doble").' },
        { type: 'code-matches', pattern: String.raw`importar\s*\(\s*["']triple["']\s*\)`, message: 'Importa triple con importar("triple").' },
        { type: 'output-equals', expected: ['25'], message: 'doble(5) + triple(5) debe ser 25.' },
      ],
      tests: [
        {
          code: 'console.log(triple(4));',
          expected: ['12'],
          message: 'triple debe ser la función importada del módulo, no un cálculo escrito a mano.',
        },
      ],
      hints: ['Importar dos cosas nombradas son dos importaciones: importar("doble") e importar("triple").'],
    },
    {
      id: 'e3-24-ex-extra-2',
      prompt: 'El módulo saludo exporta por defecto una función. Tráela con importarDefault() (devuelve lo exportado por defecto) y úsala para saludar a "Proto-0".',
      starterCode: `const moduloSaludo = {
  default: function (nombre) { return "¡Hola, " + nombre + "!"; },
};
function importarDefault() {
  return moduloSaludo.default;
}

// Trae lo exportado por defecto y saluda a "Proto-0".
`,
      solution: `const moduloSaludo = {
  default: function (nombre) { return "¡Hola, " + nombre + "!"; },
};
function importarDefault() {
  return moduloSaludo.default;
}

const saludar = importarDefault();
console.log(saludar("Proto-0"));`,
      checks: [
        { type: 'code-matches', pattern: String.raw`importarDefault\s*\(\s*\)`, message: 'Trae lo exportado por defecto con importarDefault().' },
        { type: 'output-equals', expected: ['¡Hola, Proto-0!'], message: 'Debe mostrarse "¡Hola, Proto-0!".' },
      ],
      tests: [
        {
          code: 'console.log(saludar("Nova"));',
          expected: ['¡Hola, Nova!'],
          message: 'El saludo por defecto debe servir para cualquier nombre: usa el parámetro nombre.',
        },
      ],
      hints: ['export default exporta una sola cosa; por eso se importa sin nombre entre llaves.'],
    },
  ],

  feedback: {
    success: '¡Taller ordenado! Ya sabes exportar, importar y reutilizar piezas de código. 🗄️',
    retry: 'La importación no trajo la pieza. Revisa que uses importar("doble") con el nombre exacto.',
  },
  reward: { xp: 20, coins: 10 },
  next: 'e3-25-proyecto-final',
};
