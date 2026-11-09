import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e3-03-variables',
  era: 3,
  order: 3,
  kind: 'lesson',
  title: 'Variables: cajas con nombre',
  topics: ['variables', 'let', 'reasignación', 'nombres'],

  intro:
    'Proto-0 encontró ramas en el bosque, pero se le olvida cuántas lleva. ' +
    'Necesita un lugar para recordar datos: una variable.',

  concept: `
**Una variable es una caja con nombre donde guardas un valor.**

\`\`\`js
let ramas = 5;     // crea la caja "ramas" y guarda 5
ramas = 8;         // cambia lo que hay dentro
\`\`\`

- \`let\` crea una variable que **puede cambiar**.
- El \`=\` significa "guarda esto aquí", no "es igual".
- Para usar el valor, escribe el nombre **sin comillas**: \`console.log(ramas)\`.

**Reglas para los nombres:** sin espacios, no pueden empezar con número y distinguen mayúsculas.
Se acostumbra escribir \`asíLasPalabrasJuntas\` (camelCase): \`ramasRecolectadas\`, \`nombreExplorador\`.
`.trim(),

  example: {
    code: `let piedras = 2;
console.log(piedras);
piedras = piedras + 1;
console.log(piedras);`,
    output: ['2', '3'],
  },

  exercise: {
    id: 'e3-03-ex-main',
    prompt:
      'Crea una variable llamada ramas con el valor 3 y muéstrala. ' +
      'Luego Proto-0 encuentra 4 ramas más: suma 4 a la variable y muéstrala de nuevo.',
    starterCode: `// 1. Crea la variable ramas con 3
// 2. Muéstrala
// 3. Súmale 4
// 4. Muéstrala otra vez
`,
    solution: `let ramas = 3;
console.log(ramas);
ramas = ramas + 4;
console.log(ramas);`,
    checks: [
      {
        type: 'code-matches',
        pattern: String.raw`let\s+ramas\s*=\s*3\b`,
        message: 'Crea la variable con let y el nombre exacto "ramas": let ramas = 3;',
      },
      {
        type: 'code-not-matches',
        pattern: String.raw`console\.log\(\s*7\s*\)`,
        message: '¡Buen intento! Pero no escribas el 7 a mano: haz que la variable cambie y muestra la variable.',
      },
      { type: 'output-equals', expected: ['3', '7'], message: 'La consola debe mostrar 3 y después 7.' },
    ],
    hints: [
      'Primero: let ramas = 3;',
      'Para sumar, guarda en la misma variable su valor más 4.',
      'ramas = ramas + 4;',
    ],
  },

  extraChallenges: [
    {
      id: 'e3-03-ex-extra-1',
      prompt:
        'Crea una variable nombreExplorador con tu nombre (entre comillas) y muestra un saludo que empiece con "Hola, " seguido de la variable.',
      starterCode: `// Pista: puedes unir textos con +
`,
      solution: `let nombreExplorador = "Kai";
console.log("Hola, " + nombreExplorador);`,
      checks: [
        {
          type: 'code-matches',
          pattern: String.raw`let\s+nombreExplorador\s*=\s*["'\`][^"'\`]+["'\`]`,
          message: 'Crea la variable nombreExplorador con un texto entre comillas.',
        },
        {
          type: 'code-matches',
          pattern: String.raw`console\.log\([^)]*nombreExplorador`,
          message: 'Usa la variable dentro de console.log, no escribas tu nombre otra vez.',
        },
        { type: 'output-matches', line: 0, pattern: '^Hola, .+$', message: 'El saludo debe empezar con "Hola, ".' },
      ],
      hints: ['"Hola, " + nombreExplorador une los dos textos.'],
    },
    {
      id: 'e3-03-ex-extra-2',
      prompt: 'Este código tiene un nombre de variable mal escrito. Arréglalo para que muestre 10.',
      starterCode: `let bayasRojas = 10;
console.log(bayasrojas);`,
      solution: `let bayasRojas = 10;
console.log(bayasRojas);`,
      checks: [
        { type: 'no-error', message: 'Todavía hay un error.' },
        { type: 'output-equals', expected: ['10'], message: 'Debe mostrar 10.' },
      ],
      hints: ['Compara letra por letra los dos nombres. ¿Mayúsculas?'],
    },
  ],

  feedback: {
    success: '¡Memoria instalada! Ahora puedo recordar cuántas ramas llevamos. 🌿',
    retry: 'Mi memoria no guardó lo correcto. Revisa el nombre de la variable y el valor.',
  },
  reward: { xp: 20, coins: 10 },
  next: 'e3-04-constantes',
};
