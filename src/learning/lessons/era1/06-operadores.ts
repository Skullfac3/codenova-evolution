import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e1-06-operadores',
  era: 1,
  order: 6,
  kind: 'lesson',
  title: 'Operadores',
  topics: ['aritméticos', 'módulo', 'asignación compuesta', 'comparación'],

  intro:
    'La tribu recolectó bayas y hay que repartirlas. Proto-0 necesita aprender a calcular: ' +
    'sumar, restar, repartir y comparar.',

  concept: `
**Operadores aritméticos:** \`+\` suma, \`-\` resta, \`*\` multiplica, \`/\` divide,
\`%\` da el **residuo** de una división (lo que sobra).

\`\`\`js
console.log(17 % 5);   // 2  → 17 entre 5 cabe 3 veces y sobran 2
\`\`\`

**Asignación compuesta** (atajos):
\`energia += 10\` es lo mismo que \`energia = energia + 10\`. También existen \`-=\`, \`*=\` y \`/=\`.

**Comparación** (dan \`true\` o \`false\`):
\`>\` mayor, \`<\` menor, \`>=\` mayor o igual, \`<=\` menor o igual,
\`===\` igual, \`!==\` distinto. Usa siempre \`===\` en lugar de \`==\`.

Los paréntesis cambian el orden: \`(2 + 3) * 4\` da 20, pero \`2 + 3 * 4\` da 14.
`.trim(),

  example: {
    code: `let energia = 50;
energia += 10;
console.log(energia);
console.log(energia > 40);
console.log((2 + 3) * 4);`,
    output: ['60', 'true', '20'],
  },

  exercise: {
    id: 'e1-06-ex-main',
    prompt:
      'Hay 17 bayas para 5 exploradores. Muestra primero cuántas bayas enteras le tocan a cada uno ' +
      'y después cuántas sobran. Calcula con las variables y usa el operador %.',
    starterCode: `const bayas = 17;
const exploradores = 5;

// ¿Cuántas sobran? Usa %
// ¿Cuántas le tocan a cada uno? (bayas - sobrantes) / exploradores
`,
    solution: `const bayas = 17;
const exploradores = 5;
const sobrantes = bayas % exploradores;
const porExplorador = (bayas - sobrantes) / exploradores;
console.log(porExplorador);
console.log(sobrantes);`,
    checks: [
      { type: 'code-matches', pattern: '%', message: 'Usa el operador % para saber cuántas sobran.' },
      {
        type: 'code-not-matches',
        pattern: String.raw`console\.log\(\s*[0-9]+\s*\)`,
        message: 'Calcula con las variables bayas y exploradores en lugar de escribir los números a mano.',
      },
      { type: 'output-equals', expected: ['3', '2'], message: 'Deben salir 3 (por explorador) y luego 2 (sobrantes).' },
    ],
    hints: [
      'bayas % exploradores te da las que sobran.',
      'Si quitas las sobrantes, el resto se reparte exacto: (bayas - sobrantes) / exploradores.',
      'Guarda cada resultado en una constante y muéstralas en orden: primero por explorador, luego sobrantes.',
    ],
  },

  extraChallenges: [
    {
      id: 'e1-06-ex-extra-1',
      prompt: 'Proto-0 tiene 50 de energía. Come una baya (+25) y luego camina (−10). Usa += y -= y muestra la energía final.',
      starterCode: `let energia = 50;
// Usa += y -=
`,
      solution: `let energia = 50;
energia += 25;
energia -= 10;
console.log(energia);`,
      checks: [
        { type: 'code-matches', pattern: String.raw`\+=`, message: 'Usa += para sumar la energía de la baya.' },
        { type: 'code-matches', pattern: '-=', message: 'Usa -= para restar la energía de la caminata.' },
        { type: 'output-equals', expected: ['65'], message: 'La energía final debe ser 65.' },
      ],
      hints: ['energia += 25; suma 25 a lo que ya tenía.'],
    },
    {
      id: 'e1-06-ex-extra-2',
      prompt: 'La batería de Proto-0 está en 42. Muestra si es mayor o igual a 50, y después si es exactamente 42.',
      starterCode: `const bateria = 42;
// Muestra dos comparaciones
`,
      solution: `const bateria = 42;
console.log(bateria >= 50);
console.log(bateria === 42);`,
      checks: [
        { type: 'code-matches', pattern: '>=', message: 'Usa >= para "mayor o igual".' },
        { type: 'code-matches', pattern: '===', message: 'Usa === para comparar si es exactamente igual.' },
        { type: 'output-equals', expected: ['false', 'true'], message: 'Deben salir false y luego true.' },
      ],
      hints: ['Una comparación dentro de console.log muestra true o false.'],
    },
  ],

  feedback: {
    success: '¡Cálculos perfectos! Nadie se quedó sin bayas. 🫐',
    retry: 'Mis números no cuadran. Revisa qué operador usaste y en qué orden se calcula.',
  },
  reward: { xp: 20, coins: 10 },
  next: 'e1-07-evaluacion',
};
