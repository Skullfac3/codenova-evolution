import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e3-08-condicionales',
  era: 3,
  order: 8,
  kind: 'lesson',
  title: 'Condicionales: el camino se divide',
  topics: ['if', 'else', 'decisiones'],

  intro:
    'Llegaste a la ciudad de piedra. En la entrada, el camino se divide en dos. ' +
    'Proto-0 descubre que los programas también pueden elegir qué camino tomar.',

  concept: `
**Un condicional ejecuta código solo si algo es verdadero.**

\`\`\`js
if (condición) {
  // se ejecuta si la condición es true
} else {
  // se ejecuta si la condición es false
}
\`\`\`

- La condición va entre paréntesis y da \`true\` o \`false\` (usa los operadores de comparación que ya conoces: \`>\`, \`>=\`, \`===\`…).
- El código de cada camino va entre llaves \`{ }\`.
- \`else\` es opcional: si no lo pones y la condición es falsa, simplemente no pasa nada.
`.trim(),

  example: {
    code: `const energia = 30;
if (energia >= 50) {
  console.log("Proto-0 puede viajar");
} else {
  console.log("Proto-0 necesita recargar");
}`,
    output: ['Proto-0 necesita recargar'],
  },

  exercise: {
    id: 'e3-08-ex-main',
    prompt:
      'La cueva necesita al menos 2 antorchas para estar iluminada. Usa if/else: si antorchas es mayor o igual a 2, ' +
      'muestra "La cueva está iluminada"; si no, muestra "Está muy oscuro".',
    starterCode: `const antorchas = 3;

// Escribe tu if / else aquí
`,
    solution: `const antorchas = 3;
if (antorchas >= 2) {
  console.log("La cueva está iluminada");
} else {
  console.log("Está muy oscuro");
}`,
    checks: [
      { type: 'code-matches', pattern: String.raw`if\s*\(`, message: 'Usa un if para tomar la decisión.' },
      { type: 'code-matches', pattern: String.raw`\belse\b`, message: 'Agrega un else para el caso contrario.' },
      { type: 'code-matches', pattern: String.raw`antorchas\s*>=\s*2`, message: 'La condición debe comparar antorchas >= 2.' },
      { type: 'code-matches', pattern: 'Está muy oscuro', message: 'El else debe mostrar "Está muy oscuro".' },
      { type: 'output-equals', expected: ['La cueva está iluminada'], message: 'Con 3 antorchas debe mostrarse "La cueva está iluminada".' },
    ],
    hints: [
      'La estructura es: if (condición) { … } else { … }',
      'La condición es antorchas >= 2.',
    ],
  },

  extraChallenges: [
    {
      id: 'e3-08-ex-extra-1',
      prompt:
        'Al templo solo entran sin guía quienes tienen 13 años o más. Si edad >= 13 muestra "Puede entrar al templo", si no "Necesita un guía".',
      starterCode: `const edad = 12;
`,
      solution: `const edad = 12;
if (edad >= 13) {
  console.log("Puede entrar al templo");
} else {
  console.log("Necesita un guía");
}`,
      checks: [
        { type: 'code-matches', pattern: String.raw`if\s*\(\s*edad\s*>=\s*13\s*\)`, message: 'La condición debe ser edad >= 13.' },
        { type: 'code-matches', pattern: 'Puede entrar al templo', message: 'Falta el mensaje "Puede entrar al templo" para el caso verdadero.' },
        { type: 'output-equals', expected: ['Necesita un guía'], message: 'Con 12 años debe mostrarse "Necesita un guía".' },
      ],
      hints: ['Con 12 años la condición es false, así que se ejecuta el else.'],
    },
    {
      id: 'e3-08-ex-extra-2',
      prompt: 'Si clima es exactamente "lluvia", muestra "Llevar capa"; si no, "Llevar sombrero".',
      starterCode: `const clima = "lluvia";
`,
      solution: `const clima = "lluvia";
if (clima === "lluvia") {
  console.log("Llevar capa");
} else {
  console.log("Llevar sombrero");
}`,
      checks: [
        { type: 'code-matches', pattern: '===', message: 'Compara textos con ===.' },
        { type: 'code-matches', pattern: 'Llevar sombrero', message: 'Falta el mensaje del else: "Llevar sombrero".' },
        { type: 'output-equals', expected: ['Llevar capa'], message: 'Debe mostrarse "Llevar capa".' },
      ],
      hints: ['clima === "lluvia" da true cuando el texto es exactamente igual.'],
    },
  ],

  feedback: {
    success: '¡Bip! Ahora puedo decidir por mí mismo. El camino correcto se ilumina. 🏛️',
    retry: 'Tomé el camino equivocado. Revisa la condición y qué hay dentro de cada llave.',
  },
  reward: { xp: 25, coins: 15 },
  next: 'e3-09-operadores-logicos',
};
