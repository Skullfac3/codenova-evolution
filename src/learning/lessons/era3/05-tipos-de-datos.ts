import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e3-05-tipos-de-datos',
  era: 3,
  order: 5,
  kind: 'lesson',
  title: 'Tipos de datos',
  topics: ['string', 'number', 'boolean', 'undefined', 'null', 'typeof'],

  intro:
    'Proto-0 clasifica lo que encuentra: piedras, bayas, plumas… ' +
    'Los programas también clasifican sus datos, y cada tipo se comporta distinto.',

  concept: `
**Cada valor tiene un tipo.** Los básicos son:

| Tipo | Ejemplo | Para qué sirve |
|---|---|---|
| \`string\` (texto) | \`"Proto-0"\` | nombres, mensajes |
| \`number\` (número) | \`42\`, \`3.5\` | cantidades, cálculos |
| \`boolean\` (verdadero/falso) | \`true\`, \`false\` | preguntas de sí o no |
| \`undefined\` | variable sin valor | "todavía no tiene nada" |
| \`null\` | \`null\` | "vacío a propósito" |

\`typeof\` te dice el tipo de un valor: \`typeof 42\` da \`"number"\`.

**¡Cuidado!** \`"5"\` (texto) no es lo mismo que \`5\` (número). \`"5" + 5\` da \`"55"\` porque une textos.
Para convertir texto en número usa \`Number("5")\`.
`.trim(),

  example: {
    code: `let pluma = "azul";
let cantidad = 3;
let esRara = true;
console.log(typeof pluma);
console.log(typeof cantidad);
console.log(typeof esRara);`,
    output: ['string', 'number', 'boolean'],
  },

  exercise: {
    id: 'e3-05-ex-main',
    prompt:
      'Crea tres variables: nombre con el texto "Proto-0", bateria con el número 42 y encendido con true. ' +
      'Luego muestra el typeof de cada una, en ese orden.',
    starterCode: `// Crea las tres variables

// Muestra el tipo de cada una con typeof
`,
    solution: `let nombre = "Proto-0";
let bateria = 42;
let encendido = true;
console.log(typeof nombre);
console.log(typeof bateria);
console.log(typeof encendido);`,
    checks: [
      {
        type: 'code-matches',
        pattern: String.raw`(let|const)\s+nombre\s*=\s*["'\`]Proto-0["'\`]`,
        message: 'nombre debe guardar el texto "Proto-0" (con comillas).',
      },
      {
        type: 'code-matches',
        pattern: String.raw`(let|const)\s+bateria\s*=\s*42\b`,
        message: 'bateria debe guardar el número 42 (sin comillas).',
      },
      {
        type: 'code-matches',
        pattern: String.raw`(let|const)\s+encendido\s*=\s*true\b`,
        message: 'encendido debe guardar true (sin comillas).',
      },
      {
        type: 'code-matches',
        pattern: String.raw`typeof\s+\w+`,
        message: 'Usa typeof para obtener el tipo, no escribas el resultado a mano.',
      },
      {
        type: 'output-equals',
        expected: ['string', 'number', 'boolean'],
        message: 'La consola debe mostrar string, number y boolean.',
      },
    ],
    hints: [
      'Solo los textos llevan comillas. 42 y true van sin comillas.',
      'console.log(typeof nombre);',
    ],
  },

  extraChallenges: [
    {
      id: 'e3-05-ex-extra-1',
      prompt: 'Proto-0 sumó mal: obtuvo 55 en lugar de 10. Arregla el código para que muestre 10 usando Number().',
      starterCode: `let piedras = "5";
let nuevas = 5;
console.log(piedras + nuevas);`,
      solution: `let piedras = "5";
let nuevas = 5;
console.log(Number(piedras) + nuevas);`,
      checks: [
        { type: 'code-matches', pattern: String.raw`Number\(`, message: 'Convierte el texto a número con Number().' },
        { type: 'code-matches', pattern: String.raw`let\s+piedras\s*=\s*["']5["']`, message: 'Deja piedras como el texto "5"; conviértelo al sumar.' },
        { type: 'output-equals', expected: ['10'], message: 'El resultado debe ser 10.' },
      ],
      hints: ['Number(piedras) convierte "5" en 5.'],
    },
    {
      id: 'e3-05-ex-extra-2',
      prompt: 'Crea una variable mascota sin asignarle valor. Muestra su valor y luego su tipo.',
      starterCode: `// let mascota;  ← crea la variable sin usar =
`,
      solution: `let mascota;
console.log(mascota);
console.log(typeof mascota);`,
      checks: [
        { type: 'code-matches', pattern: String.raw`let\s+mascota\s*;`, message: 'Crea la variable sin valor: let mascota;' },
        { type: 'output-equals', expected: ['undefined', 'undefined'], message: 'Deben salir dos líneas: undefined y undefined.' },
      ],
      hints: ['Una variable sin valor vale undefined, y su tipo también se llama "undefined".'],
    },
  ],

  feedback: {
    success: '¡Clasificación completa! Ya distingues textos, números y booleanos. 🧩',
    retry: 'Algo quedó en la caja equivocada. Revisa las comillas: deciden si algo es texto.',
  },
  reward: { xp: 20, coins: 10 },
  next: 'e3-06-operadores',
};
