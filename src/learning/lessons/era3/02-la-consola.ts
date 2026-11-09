import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e3-02-la-consola',
  era: 3,
  order: 2,
  kind: 'lesson',
  title: 'La consola: la voz de tu código',
  topics: ['consola', 'texto', 'números', 'comentarios'],

  intro:
    'Proto-0 no tiene boca, pero tiene una pantallita en el pecho: la consola. ' +
    'Todo lo que le pidas mostrar con console.log aparece ahí.',

  concept: `
**La consola** es el lugar donde tu programa muestra mensajes.

- El **texto** va entre comillas: \`console.log("Hola")\`.
- Los **números** van sin comillas: \`console.log(7)\`.
- Puedes mostrar varias cosas a la vez separándolas con comas: \`console.log("Rocas:", 12)\` muestra \`Rocas: 12\`.
- Las líneas que empiezan con \`//\` son **comentarios**: notas para personas que la computadora ignora.

Si olvidas las comillas en un texto, JavaScript creerá que es el nombre de algo que no existe y mostrará un error.
`.trim(),

  example: {
    code: `// Esto es un comentario: no se ejecuta
console.log("Inventario de la cueva");
console.log("Rocas:", 12);
console.log(3);`,
    output: ['Inventario de la cueva', 'Rocas: 12', '3'],
  },

  exercise: {
    id: 'e3-02-ex-main',
    prompt:
      'Enciende la pantalla de Proto-0. Muestra el texto "Proto-0 en línea" y, en la siguiente línea, ' +
      'el número 3 (su número de piezas) escrito SIN comillas.',
    starterCode: `// Muestra el texto y luego el número
`,
    solution: `console.log("Proto-0 en línea");
console.log(3);`,
    checks: [
      {
        type: 'output-equals',
        expected: ['Proto-0 en línea', '3'],
        message: 'La consola debe mostrar "Proto-0 en línea" y después 3, cada uno en su línea.',
      },
      {
        type: 'code-matches',
        pattern: String.raw`console\.log\(\s*3\s*\)`,
        message: 'El 3 es un número: escríbelo sin comillas, así: console.log(3).',
      },
    ],
    hints: [
      'Necesitas dos instrucciones console.log, una por línea.',
      'El texto lleva comillas; el número no.',
    ],
  },

  extraChallenges: [
    {
      id: 'e3-02-ex-extra-1',
      prompt: 'Muestra en UNA sola instrucción el texto "Ramas:" y el número 8, para que salga: Ramas: 8',
      starterCode: `// Usa una coma para separar el texto del número
`,
      solution: `console.log("Ramas:", 8);`,
      checks: [
        { type: 'output-equals', expected: ['Ramas: 8'], message: 'Debe salir exactamente "Ramas: 8".' },
        {
          type: 'code-matches',
          pattern: String.raw`console\.log\(\s*["'\`]Ramas:["'\`]\s*,\s*8\s*\)`,
          message: 'Intenta separar el texto y el número con una coma dentro del mismo console.log.',
        },
      ],
      hints: ['console.log acepta varias cosas separadas por comas y las une con un espacio.'],
    },
    {
      id: 'e3-02-ex-extra-2',
      prompt: 'Proto-0 tiene un fallo: este código da error. Arréglalo para que muestre: Hola fogata',
      starterCode: `console.log(Hola fogata);`,
      solution: `console.log("Hola fogata");`,
      checks: [
        { type: 'no-error', message: 'El programa todavía tiene un error.' },
        { type: 'output-equals', expected: ['Hola fogata'], message: 'Debe mostrar "Hola fogata".' },
      ],
      hints: ['¿Es texto o es un número? Si es texto, ¿qué le falta?'],
    },
  ],

  feedback: {
    success: '¡Pantalla encendida! Ahora puedo hablar contigo. 📟',
    retry: 'Mi pantalla muestra algo raro. Revisa las comillas: el texto las necesita, los números no.',
  },
  reward: { xp: 20, coins: 10 },
  next: 'e3-03-variables',
};
