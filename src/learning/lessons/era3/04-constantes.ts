import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e3-04-constantes',
  era: 3,
  order: 4,
  kind: 'lesson',
  title: 'Constantes: grabado en piedra',
  topics: ['constantes', 'const', 'let vs const'],

  intro:
    'En la pared de la cueva hay marcas talladas en piedra que nunca cambian. ' +
    'En programación también hay valores que no deben cambiar: las constantes.',

  concept: `
**Una constante es una variable que no se puede reasignar.** Se crea con \`const\`.

\`\`\`js
const nombreCueva = "Cueva del Alba";
nombreCueva = "Otra";  // ❌ TypeError: Assignment to constant variable.
\`\`\`

¿Cuándo usar cada una?

| Usa | Cuando el valor… |
|---|---|
| \`const\` | no va a cambiar (nombres, reglas, configuraciones) |
| \`let\` | va a cambiar (contadores, puntajes, energía) |

**Buena práctica:** empieza con \`const\` y cambia a \`let\` solo si de verdad necesitas reasignar.
`.trim(),

  example: {
    code: `const piedrasPorFogata = 6;
let fogatas = 2;
console.log(piedrasPorFogata * fogatas);`,
    output: ['12'],
  },

  exercise: {
    id: 'e3-04-ex-main',
    prompt:
      'Este programa se rompe porque intenta cambiar una constante. Arréglalo para que funcione y muestre 3 y luego 3. ' +
      'No cambies la palabra const.',
    starterCode: `const fuegoNecesario = 3;
let madera = 1;
madera = madera + 2;
fuegoNecesario = 5;
console.log(madera);
console.log(fuegoNecesario);`,
    solution: `const fuegoNecesario = 3;
let madera = 1;
madera = madera + 2;
console.log(madera);
console.log(fuegoNecesario);`,
    checks: [
      { type: 'no-error', message: 'El programa todavía tiene un error.' },
      {
        type: 'code-matches',
        pattern: String.raw`const\s+fuegoNecesario\s*=\s*3\b`,
        message: 'fuegoNecesario debe seguir siendo const y valer 3.',
      },
      { type: 'output-equals', expected: ['3', '3'], message: 'La consola debe mostrar 3 y después 3.' },
    ],
    hints: [
      'Ejecuta el código y lee el error: ¿en qué línea se intenta cambiar una constante?',
      'Una constante no se puede reasignar. ¿Qué línea sobra?',
      'Borra la línea fuegoNecesario = 5;',
    ],
  },

  extraChallenges: [
    {
      id: 'e3-04-ex-extra-1',
      prompt: 'Reemplaza cada ??? por let o const según corresponda, para que se muestre: Los del Valle 13',
      starterCode: `??? nombreTribu = "Los del Valle";
??? habitantes = 12;
habitantes = habitantes + 1;
console.log(nombreTribu, habitantes);`,
      solution: `const nombreTribu = "Los del Valle";
let habitantes = 12;
habitantes = habitantes + 1;
console.log(nombreTribu, habitantes);`,
      checks: [
        { type: 'no-error', message: 'Todavía hay un error: ¿quedó algún ??? o elegiste mal let/const?' },
        {
          type: 'code-matches',
          pattern: String.raw`const\s+nombreTribu`,
          message: 'El nombre de la tribu no cambia: ¿no sería mejor una constante?',
        },
        { type: 'code-matches', pattern: String.raw`let\s+habitantes`, message: 'Los habitantes cambian: usa let.' },
        { type: 'output-equals', expected: ['Los del Valle 13'], message: 'Debe mostrar "Los del Valle 13".' },
      ],
      hints: ['¿Cuál de los dos valores cambia más abajo en el código?'],
    },
    {
      id: 'e3-04-ex-extra-2',
      prompt: 'Crea una constante diasPorLuna con el valor 29 y muestra cuántos días hay en 3 lunas.',
      starterCode: `// Crea la constante y multiplica por 3
`,
      solution: `const diasPorLuna = 29;
console.log(diasPorLuna * 3);`,
      checks: [
        {
          type: 'code-matches',
          pattern: String.raw`const\s+diasPorLuna\s*=\s*29\b`,
          message: 'Crea la constante así: const diasPorLuna = 29;',
        },
        {
          type: 'code-not-matches',
          pattern: String.raw`console\.log\(\s*87\s*\)`,
          message: 'Calcula con la constante en lugar de escribir el resultado a mano.',
        },
        { type: 'output-equals', expected: ['87'], message: 'El resultado debe ser 87.' },
      ],
      hints: ['El signo de multiplicar en JavaScript es *.'],
    },
  ],

  feedback: {
    success: '¡Grabado en piedra! Ya sabes qué cosas pueden cambiar y cuáles no. 🪨',
    retry: 'Algo se movió que no debía moverse. Revisa qué valores son const.',
  },
  reward: { xp: 20, coins: 10 },
  next: 'e3-05-tipos-de-datos',
};
