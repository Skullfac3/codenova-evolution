import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e1-07-evaluacion',
  era: 1,
  order: 7,
  kind: 'evaluation',
  title: 'Evaluación de la Prehistoria',
  topics: ['repaso Era 1'],

  intro:
    'El gran fuego del consejo está encendido. Si demuestras lo que aprendiste, ' +
    'la tribu abrirá el camino hacia las Civilizaciones antiguas.',

  concept: `
Esta evaluación tiene **5 preguntas** y **un ejercicio práctico**.

- Preguntas: 60 % de la calificación.
- Ejercicio práctico: 40 % y es **obligatorio** para aprobar.
- Necesitas **60 puntos** para desbloquear la Era 2. Puedes repetirla las veces que quieras.
`.trim(),

  example: { code: '', output: [] },

  quiz: [
    {
      prompt: '¿Qué hace console.log("Hola")?',
      options: ['Guarda "Hola" en una variable', 'Muestra Hola en la consola', 'Crea una constante', 'Borra la consola'],
      correctIndex: 1,
      explanation: 'console.log muestra en la consola lo que pongas entre los paréntesis.',
    },
    {
      prompt: '¿Cuál de estas variables se puede reasignar más adelante?',
      options: ['const fogata = 1;', 'let fogata = 1;', 'Ninguna de las dos', 'Las dos'],
      correctIndex: 1,
      explanation: 'let permite cambiar el valor; const no.',
    },
    {
      prompt: '¿Qué muestra console.log(typeof 42)?',
      options: ['"42"', 'string', 'number', 'boolean'],
      correctIndex: 2,
      explanation: '42 sin comillas es un número, así que su tipo es number.',
    },
    {
      prompt: '¿Qué muestra console.log("3" + 4)?',
      options: ['7', '34', 'Error', '"3 + 4"'],
      correctIndex: 1,
      explanation: 'Si uno de los dos es texto, + une los textos: "3" + 4 da "34".',
    },
    {
      prompt: '¿Cuánto es 10 % 3?',
      options: ['3', '1', '0', '3.33'],
      correctIndex: 1,
      explanation: '10 entre 3 cabe 3 veces (9) y sobra 1. El operador % da lo que sobra.',
    },
  ],

  exercise: {
    id: 'e1-07-ex-practical',
    prompt:
      'Haz el inventario del refugio:\n' +
      '1. Crea una constante nombreRefugio con "Cueva del Alba".\n' +
      '2. Crea una variable ramas con 10 y súmale 5 usando +=.\n' +
      '3. Crea una variable recursos que valga ramas multiplicado por 2.\n' +
      '4. Muestra "Refugio: " + nombreRefugio y en otra línea "Recursos: " + recursos.',
    starterCode: `// Inventario del refugio
`,
    solution: `const nombreRefugio = "Cueva del Alba";
let ramas = 10;
ramas += 5;
let recursos = ramas * 2;
console.log("Refugio: " + nombreRefugio);
console.log("Recursos: " + recursos);`,
    checks: [
      {
        type: 'code-matches',
        pattern: String.raw`const\s+nombreRefugio\s*=\s*["'\`]Cueva del Alba["'\`]`,
        message: 'nombreRefugio debe ser una constante con el texto "Cueva del Alba".',
      },
      { type: 'code-matches', pattern: String.raw`let\s+ramas\s*=\s*10\b`, message: 'ramas debe empezar en 10 y crearse con let.' },
      { type: 'code-matches', pattern: String.raw`ramas\s*\+=\s*5`, message: 'Suma 5 a ramas usando +=.' },
      { type: 'code-matches', pattern: String.raw`ramas\s*\*\s*2`, message: 'Calcula recursos multiplicando ramas por 2.' },
      {
        type: 'output-equals',
        expected: ['Refugio: Cueva del Alba', 'Recursos: 30'],
        message: 'La consola debe mostrar "Refugio: Cueva del Alba" y "Recursos: 30".',
      },
    ],
    hints: [
      'Ve paso por paso, en el mismo orden de las instrucciones.',
      'Después de ramas += 5, ramas vale 15.',
    ],
  },
  extraChallenges: [],

  feedback: {
    success: '¡Lo lograste! La tribu celebra y el camino hacia la Era 2 se abre. Mis engranajes ya no rechinan. ⚙️✨',
    retry: 'Casi. Repasa las lecciones marcadas y vuelve al fuego del consejo cuando quieras.',
  },
  reward: { xp: 50, coins: 30 },
  next: 'e2-01-condicionales',
};
