import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e3-15-evaluacion',
  era: 3,
  order: 19,
  kind: 'evaluation',
  title: 'Evaluación final · JavaScript',
  topics: ['repaso JavaScript · 2ª parte'],

  intro:
    'El consejo de la ciudad se reúne en el anfiteatro. Si resuelves su desafío, ' +
    'las pantallas de la Era digital empezarán a encenderse en el horizonte.',

  concept: `
Esta evaluación tiene **5 preguntas** y **un ejercicio práctico**.

- Preguntas: 60 % de la calificación.
- Ejercicio práctico: 40 % y es **obligatorio** para aprobar.
- Necesitas **60 puntos**. Puedes repetirla las veces que quieras.
`.trim(),

  example: { code: '', output: [] },

  quiz: [
    {
      prompt: '¿Qué muestra este código?  if (5 > 8) { console.log("A") } else { console.log("B") }',
      options: ['A', 'B', 'A y B', 'Nada'],
      correctIndex: 1,
      explanation: '5 > 8 es falso, así que se ejecuta el else y se muestra B.',
    },
    {
      prompt: '¿Cuánto vale true && false?',
      options: ['true', 'false', 'undefined', 'Da error'],
      correctIndex: 1,
      explanation: '&& necesita que las dos sean verdaderas. Como una es false, el resultado es false.',
    },
    {
      prompt: '¿Cuántas veces se repite  for (let i = 0; i < 3; i++)?',
      options: ['2', '3', '4', 'Infinitas'],
      correctIndex: 1,
      explanation: 'i toma los valores 0, 1 y 2. Cuando llega a 3, la condición i < 3 es falsa: 3 vueltas.',
    },
    {
      prompt: 'Si  const letras = ["a", "b", "c"], ¿qué es letras[1]?',
      options: ['"a"', '"b"', '"c"', 'undefined'],
      correctIndex: 1,
      explanation: 'Los índices empiezan en 0: letras[0] es "a" y letras[1] es "b".',
    },
    {
      prompt: '¿Qué hace return dentro de una función?',
      options: [
        'Muestra un valor en la consola',
        'Devuelve un valor y termina la función',
        'Repite la función',
        'Crea una variable nueva',
      ],
      correctIndex: 1,
      explanation: 'return entrega el resultado a quien llamó la función y la termina en ese momento.',
    },
  ],

  exercise: {
    id: 'e3-15-ex-practical',
    prompt:
      'El consejo quiere saber cuántas cosechas superaron la meta.\n' +
      '1. Escribe una función contarMayores(numeros, limite).\n' +
      '2. Recorre el arreglo numeros y cuenta cuántos son MAYORES que limite.\n' +
      '3. Devuelve la cuenta con return.\n' +
      '4. Muestra contarMayores([5, 12, 8, 20], 10).',
    starterCode: `// function contarMayores(numeros, limite) { … }
`,
    solution: `function contarMayores(numeros, limite) {
  let cuenta = 0;
  for (const n of numeros) {
    if (n > limite) {
      cuenta++;
    }
  }
  return cuenta;
}
console.log(contarMayores([5, 12, 8, 20], 10));`,
    checks: [
      {
        type: 'code-matches',
        pattern: String.raw`function\s+contarMayores\s*\(\s*numeros\s*,\s*limite\s*\)`,
        message: 'Crea function contarMayores(numeros, limite).',
      },
      { type: 'code-matches', pattern: String.raw`\breturn\b`, message: 'La función debe devolver la cuenta con return.' },
      { type: 'output-equals', expected: ['2'], message: 'contarMayores([5, 12, 8, 20], 10) debe dar 2.' },
    ],
    tests: [
      {
        code: 'console.log(contarMayores([1, 2, 3], 0)); console.log(contarMayores([], 5)); console.log(contarMayores([10, 10, 11], 10));',
        expected: ['3', '0', '1'],
        message:
          'Funciona con el ejemplo, pero no con otros: probé ([1,2,3], 0), ([], 5) y ([10,10,11], 10). Recuerda: "mayores que" no incluye iguales.',
      },
    ],
    hints: [
      'Empieza con let cuenta = 0; y recorre el arreglo con for...of.',
      'Dentro del ciclo: if (n > limite) { cuenta++; }',
    ],
  },
  extraChallenges: [],

  feedback: {
    success: '¡El consejo aplaude! Dominas las bases de la programación. A lo lejos se oyen las primeras máquinas… ⚙️',
    retry: 'Casi. Repasa ciclos y funciones y vuelve al anfiteatro cuando quieras.',
  },
  reward: { xp: 60, coins: 40 },
  next: null, // la Era 4 aún no tiene lecciones
};
