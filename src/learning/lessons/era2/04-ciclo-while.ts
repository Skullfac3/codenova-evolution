import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e2-04-ciclo-while',
  era: 2,
  order: 4,
  kind: 'lesson',
  title: 'Ciclo while: mientras sea necesario',
  topics: ['while', 'ciclo infinito', 'acumuladores'],

  intro:
    'El acueducto lleva agua a la ciudad, pero nadie sabe cuántos viajes harán falta para llenar el cántaro. ' +
    'Cuando no sabes cuántas vueltas habrá, usas while.',

  concept: `
**while repite mientras la condición sea verdadera.**

\`\`\`js
let agua = 0;
while (agua < 6) {
  agua += 2;
}
console.log(agua); // 6
\`\`\`

- Usa \`for\` cuando sabes cuántas vueltas habrá; usa \`while\` cuando depende de lo que pase dentro.
- **¡Cuidado!** Si dentro del ciclo nada cambia la condición, nunca termina: es un **ciclo infinito**.
  Proto-0 lo detiene a los 2 segundos, pero en un programa real congelaría todo.
`.trim(),

  example: {
    code: `let piedras = 10;
while (piedras > 0) {
  piedras -= 4;
  console.log(piedras);
}`,
    output: ['6', '2', '-2'],
  },

  exercise: {
    id: 'e2-04-ex-main',
    prompt:
      'Llena el cántaro de 3 en 3 litros MIENTRAS tenga menos de 10. Muestra el nivel después de cada viaje.',
    starterCode: `let agua = 0;
// while (…) { … }
`,
    solution: `let agua = 0;
while (agua < 10) {
  agua += 3;
  console.log(agua);
}`,
    checks: [
      { type: 'code-matches', pattern: String.raw`while\s*\(`, message: 'Usa un ciclo while.' },
      { type: 'code-matches', pattern: String.raw`agua\s*<\s*10`, message: 'La condición debe ser agua < 10.' },
      { type: 'output-equals', expected: ['3', '6', '9', '12'], message: 'Deben salir 3, 6, 9 y 12.' },
    ],
    hints: [
      'while (agua < 10) { … }',
      'Dentro: suma 3 y muestra agua. ¿Por qué sale 12? Porque 9 < 10 todavía es verdadero.',
    ],
  },

  extraChallenges: [
    {
      id: 'e2-04-ex-extra-1',
      prompt:
        'Un mercader duplica sus monedas cada día. Empieza con 1. Usa while para contar cuántos días tarda en tener 100 o más, y muestra los días.',
      starterCode: `let monedas = 1;
let dias = 0;
// mientras monedas < 100: duplica y cuenta un día
console.log(dias);`,
      solution: `let monedas = 1;
let dias = 0;
while (monedas < 100) {
  monedas *= 2;
  dias++;
}
console.log(dias);`,
      checks: [
        { type: 'code-matches', pattern: String.raw`while\s*\(`, message: 'Usa un ciclo while.' },
        { type: 'code-not-matches', pattern: String.raw`console\.log\(\s*7\s*\)`, message: 'Deja que el ciclo cuente los días: no escribas 7 a mano.' },
        { type: 'output-equals', expected: ['7'], message: 'Deben ser 7 días (1→2→4→8→16→32→64→128).' },
      ],
      hints: ['Dentro del ciclo: monedas *= 2; y dias++;'],
    },
    {
      id: 'e2-04-ex-extra-2',
      prompt: 'Este ciclo nunca termina. Arréglalo para que muestre "Paso 0", "Paso 1" y "Paso 2".',
      starterCode: `let i = 0;
while (i < 3) {
  console.log("Paso " + i);
}`,
      solution: `let i = 0;
while (i < 3) {
  console.log("Paso " + i);
  i++;
}`,
      checks: [
        { type: 'no-error', message: 'El ciclo todavía no termina.' },
        { type: 'output-equals', expected: ['Paso 0', 'Paso 1', 'Paso 2'], message: 'Deben salir Paso 0, Paso 1 y Paso 2.' },
      ],
      hints: ['¿Qué tiene que cambiar dentro del ciclo para que algún día i < 3 sea falso?'],
    },
  ],

  feedback: {
    success: '¡El cántaro está lleno! Ya sabes repetir hasta que el trabajo esté hecho. 💧',
    retry: 'El agua no llegó como esperaba. Revisa la condición y qué cambia en cada vuelta.',
  },
  reward: { xp: 25, coins: 15 },
  next: 'e2-05-funciones',
};
