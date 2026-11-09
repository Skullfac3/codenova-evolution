import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e3-01-que-es-programar',
  era: 3,
  order: 1,
  kind: 'lesson',
  title: '¿Qué es programar?',
  topics: ['programación', 'instrucciones', 'orden de ejecución'],

  intro:
    'Proto-0 acaba de despertar entre las rocas. Sus circuitos funcionan, pero no sabe hacer nada por sí mismo: ' +
    'solo obedece instrucciones, una por una y exactamente como se las escribas. ¡Vamos a darle las primeras!',

  concept: `
**Programar es escribir instrucciones para que una computadora las siga.**

La computadora no adivina lo que quieres: hace *exactamente* lo que dices, en el *orden* en que lo dices.
Una lista de instrucciones se llama **programa**.

En JavaScript, esta instrucción muestra un mensaje en la consola:

\`\`\`js
console.log("Hola");
\`\`\`

Las instrucciones se ejecutan **de arriba hacia abajo**. Si cambias el orden de las líneas, cambias el resultado.
`.trim(),

  example: {
    code: `console.log("Juntar piedras");
console.log("Hacer un círculo");
console.log("Encender la fogata");`,
    output: ['Juntar piedras', 'Hacer un círculo', 'Encender la fogata'],
  },

  exercise: {
    id: 'e3-01-ex-main',
    prompt:
      'Proto-0 quiere construir un refugio, pero sus instrucciones están revueltas. ' +
      'Reordena las líneas para que se muestren en orden: 1, 2 y 3.',
    starterCode: `// Reordena estas tres líneas
console.log("3. Poner el techo de hojas");
console.log("1. Juntar ramas");
console.log("2. Levantar las paredes");`,
    solution: `console.log("1. Juntar ramas");
console.log("2. Levantar las paredes");
console.log("3. Poner el techo de hojas");`,
    checks: [
      {
        type: 'output-equals',
        expected: ['1. Juntar ramas', '2. Levantar las paredes', '3. Poner el techo de hojas'],
        message: 'Los pasos todavía no salen en orden 1, 2, 3. Recuerda: el código se ejecuta de arriba hacia abajo.',
      },
    ],
    hints: [
      'La computadora lee la primera línea, luego la segunda, luego la tercera.',
      '¿Qué línea debe ir hasta arriba para que salga primero el paso 1?',
      'Mueve la línea del paso "3." hasta el final.',
    ],
  },

  extraChallenges: [
    {
      id: 'e3-01-ex-extra-1',
      prompt: 'El refugio está listo. Agrega un cuarto paso al final que muestre: 4. Encender la fogata',
      starterCode: `console.log("1. Juntar ramas");
console.log("2. Levantar las paredes");
console.log("3. Poner el techo de hojas");
// Escribe aquí el paso 4
`,
      solution: `console.log("1. Juntar ramas");
console.log("2. Levantar las paredes");
console.log("3. Poner el techo de hojas");
console.log("4. Encender la fogata");`,
      checks: [
        {
          type: 'output-equals',
          expected: ['1. Juntar ramas', '2. Levantar las paredes', '3. Poner el techo de hojas', '4. Encender la fogata'],
          message: 'Falta el paso 4 o no está escrito exactamente como "4. Encender la fogata".',
        },
      ],
      hints: ['Copia la forma de las líneas de arriba y cambia solo el texto entre comillas.'],
    },
    {
      id: 'e3-01-ex-extra-2',
      prompt: 'Haz que Proto-0 se presente. Muestra exactamente: Hola, soy Proto-0',
      starterCode: `// Tu primera instrucción desde cero
`,
      solution: `console.log("Hola, soy Proto-0");`,
      checks: [
        {
          type: 'output-equals',
          expected: ['Hola, soy Proto-0'],
          message: 'El mensaje debe ser exactamente "Hola, soy Proto-0" (revisa la coma y las mayúsculas).',
        },
      ],
      hints: ['Usa console.log("...") y escribe el mensaje entre las comillas.'],
    },
  ],

  feedback: {
    success: '¡Bip-bup! Mis sensores entendieron cada paso. Acabas de escribir tu primer programa. 🔥',
    retry: 'Mmm, algo no salió en orden. Lee tus líneas de arriba hacia abajo como si fueras yo.',
  },
  reward: { xp: 20, coins: 10 },
  next: 'e3-02-la-consola',
};
