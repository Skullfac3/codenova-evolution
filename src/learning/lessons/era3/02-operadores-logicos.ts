import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e3-09-operadores-logicos',
  era: 3,
  order: 9,
  kind: 'lesson',
  title: 'Más caminos: else if y operadores lógicos',
  topics: ['else if', '&&', '||', '!'],

  intro:
    'En el mercado de la ciudad, los mercaderes premian a los mejores artesanos con medallas de oro, plata o bronce. ' +
    'A veces hay más de dos caminos, y a veces hay que revisar dos condiciones a la vez.',

  concept: `
**else if** agrega más caminos. Se revisan en orden y se ejecuta **solo el primero** que sea verdadero:

\`\`\`js
if (puntos >= 90) {
  console.log("Oro");
} else if (puntos >= 70) {
  console.log("Plata");
} else {
  console.log("Bronce");
}
\`\`\`

**Operadores lógicos** combinan condiciones:

| Operador | Significa | Ejemplo |
|---|---|---|
| \`&&\` | Y: las dos deben ser verdaderas | \`tieneLlave && esDeDia\` |
| \`\\|\\|\` | O: basta con que una sea verdadera | \`esFestivo \\|\\| esDomingo\` |
| \`!\` | NO: invierte el valor | \`!estaCerrado\` |
`.trim(),

  example: {
    code: `const tieneMapa = true;
const tieneAgua = false;
console.log(tieneMapa && tieneAgua);
console.log(tieneMapa || tieneAgua);
console.log(!tieneAgua);`,
    output: ['false', 'true', 'true'],
  },

  exercise: {
    id: 'e3-09-ex-main',
    prompt:
      'Asigna la medalla según el puntaje: 90 o más es "Oro", 70 o más es "Plata" y cualquier otro es "Bronce". Usa if, else if y else.',
    starterCode: `const puntaje = 85;

// if / else if / else
`,
    solution: `const puntaje = 85;
if (puntaje >= 90) {
  console.log("Oro");
} else if (puntaje >= 70) {
  console.log("Plata");
} else {
  console.log("Bronce");
}`,
    checks: [
      { type: 'code-matches', pattern: String.raw`else\s+if\s*\(`, message: 'Usa else if para el segundo camino.' },
      { type: 'code-matches', pattern: String.raw`puntaje\s*>=\s*90`, message: 'La primera condición debe ser puntaje >= 90.' },
      { type: 'code-matches', pattern: String.raw`puntaje\s*>=\s*70`, message: 'La segunda condición debe ser puntaje >= 70.' },
      { type: 'code-matches', pattern: 'Oro', message: 'Falta el camino de "Oro".' },
      { type: 'code-matches', pattern: 'Bronce', message: 'Falta el camino de "Bronce".' },
      { type: 'output-equals', expected: ['Plata'], message: 'Con 85 puntos debe mostrarse "Plata".' },
    ],
    hints: [
      'Primero revisa el caso más alto (90), luego el siguiente (70).',
      'El else final atrapa todo lo demás: ahí va "Bronce".',
    ],
  },

  extraChallenges: [
    {
      id: 'e3-09-ex-extra-1',
      prompt: 'La puerta del almacén se abre solo si tienes la llave Y es de día. Si ambas son verdaderas muestra "Abrir la puerta"; si no, "Esperar".',
      starterCode: `const tieneLlave = true;
const esDeDia = true;
`,
      solution: `const tieneLlave = true;
const esDeDia = true;
if (tieneLlave && esDeDia) {
  console.log("Abrir la puerta");
} else {
  console.log("Esperar");
}`,
      checks: [
        { type: 'code-matches', pattern: '&&', message: 'Usa && para exigir las dos condiciones.' },
        { type: 'code-matches', pattern: 'Esperar', message: 'Falta el mensaje "Esperar" para el else.' },
        { type: 'output-equals', expected: ['Abrir la puerta'], message: 'Debe mostrarse "Abrir la puerta".' },
      ],
      hints: ['if (tieneLlave && esDeDia) { … }'],
    },
    {
      id: 'e3-09-ex-extra-2',
      prompt: 'El mercado cierra si es festivo O si es domingo. Muestra "El mercado está cerrado" o "El mercado está abierto".',
      starterCode: `const esFestivo = false;
const esDomingo = true;
`,
      solution: `const esFestivo = false;
const esDomingo = true;
if (esFestivo || esDomingo) {
  console.log("El mercado está cerrado");
} else {
  console.log("El mercado está abierto");
}`,
      checks: [
        { type: 'code-matches', pattern: String.raw`\|\|`, message: 'Usa || para "una u otra".' },
        { type: 'code-matches', pattern: 'El mercado está abierto', message: 'Falta el mensaje del else.' },
        { type: 'output-equals', expected: ['El mercado está cerrado'], message: 'Debe mostrarse "El mercado está cerrado".' },
      ],
      hints: ['Con || basta con que una condición sea verdadera.'],
    },
  ],

  feedback: {
    success: '¡Medalla entregada! Ya manejas varios caminos a la vez. 🥈',
    retry: 'Algo se cruzó en el camino. Revisa el orden de las condiciones: se revisan de arriba hacia abajo.',
  },
  reward: { xp: 25, coins: 15 },
  next: 'e3-10-ciclo-for',
};
