import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e2-03-ciclo-for',
  era: 2,
  order: 3,
  kind: 'lesson',
  title: 'Ciclo for: construir sin cansarse',
  topics: ['for', 'repetición', 'contador'],

  intro:
    'Hay que levantar una muralla de ladrillos. Escribir una instrucción por ladrillo sería eterno. ' +
    'Proto-0 aprende a repetir: los ciclos hacen el trabajo pesado.',

  concept: `
**Un ciclo for repite un bloque de código un número de veces.**

\`\`\`js
for (let i = 1; i <= 3; i++) {
  console.log("Vuelta " + i);
}
// Vuelta 1, Vuelta 2, Vuelta 3
\`\`\`

Sus tres partes, separadas por \`;\`:

1. **Inicio:** \`let i = 1\` crea el contador.
2. **Condición:** \`i <= 3\`, el ciclo sigue mientras sea verdadera.
3. **Paso:** \`i++\` suma 1 al contador en cada vuelta (\`i--\` resta 1).

Dentro del ciclo puedes usar \`i\` para saber en qué vuelta vas.
`.trim(),

  example: {
    code: `for (let i = 1; i <= 3; i++) {
  console.log("Columna " + i);
}`,
    output: ['Columna 1', 'Columna 2', 'Columna 3'],
  },

  exercise: {
    id: 'e2-03-ex-main',
    prompt: 'Usa un ciclo for para mostrar "Ladrillo 1", "Ladrillo 2"… hasta "Ladrillo 5".',
    starterCode: `// Un solo console.log dentro de un for
`,
    solution: `for (let i = 1; i <= 5; i++) {
  console.log("Ladrillo " + i);
}`,
    checks: [
      { type: 'code-matches', pattern: String.raw`for\s*\(`, message: 'Usa un ciclo for.' },
      {
        type: 'code-not-matches',
        pattern: String.raw`["'\`]Ladrillo [2-5]`,
        message: 'No escribas cada ladrillo a mano: deja que el ciclo cambie el número.',
      },
      {
        type: 'output-equals',
        expected: ['Ladrillo 1', 'Ladrillo 2', 'Ladrillo 3', 'Ladrillo 4', 'Ladrillo 5'],
        message: 'Deben salir los ladrillos del 1 al 5.',
      },
    ],
    hints: [
      'for (let i = 1; i <= 5; i++) { … }',
      'Dentro: console.log("Ladrillo " + i);',
    ],
  },

  extraChallenges: [
    {
      id: 'e2-03-ex-extra-1',
      prompt: 'Usa un for para sumar todos los números del 1 al 10 en la variable total y muestra el resultado.',
      starterCode: `let total = 0;
// suma con un for
console.log(total);`,
      solution: `let total = 0;
for (let i = 1; i <= 10; i++) {
  total += i;
}
console.log(total);`,
      checks: [
        { type: 'code-matches', pattern: String.raw`for\s*\(`, message: 'Usa un ciclo for.' },
        { type: 'code-matches', pattern: String.raw`total\s*\+=|total\s*=\s*total\s*\+`, message: 'Dentro del ciclo, suma i a total.' },
        { type: 'output-equals', expected: ['55'], message: 'La suma del 1 al 10 es 55.' },
      ],
      hints: ['En cada vuelta: total += i;'],
    },
    {
      id: 'e2-03-ex-extra-2',
      prompt: 'Haz una cuenta regresiva con un for: 3, 2, 1 y después "¡Abran las puertas!".',
      starterCode: `// Cuenta hacia atrás con i--
`,
      solution: `for (let i = 3; i >= 1; i--) {
  console.log(i);
}
console.log("¡Abran las puertas!");`,
      checks: [
        { type: 'code-matches', pattern: String.raw`for\s*\(`, message: 'Usa un ciclo for.' },
        { type: 'code-matches', pattern: String.raw`i--|i\s*-=\s*1`, message: 'Para contar hacia atrás, usa i--.' },
        { type: 'output-equals', expected: ['3', '2', '1', '¡Abran las puertas!'], message: 'Deben salir 3, 2, 1 y "¡Abran las puertas!".' },
      ],
      hints: ['Empieza en 3, sigue mientras i >= 1 y resta 1 en cada vuelta.', 'El mensaje final va DESPUÉS del ciclo.'],
    },
  ],

  feedback: {
    success: '¡La muralla está en pie! Con un ciclo hiciste en segundos lo que tomaría horas. 🧱',
    retry: 'La muralla quedó chueca. Revisa dónde empieza el contador, cuándo termina y cuánto avanza.',
  },
  reward: { xp: 25, coins: 15 },
  next: 'e2-04-ciclo-while',
};
