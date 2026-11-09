import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e3-13-arreglos',
  era: 3,
  order: 13,
  kind: 'lesson',
  title: 'Arreglos: el almacén ordenado',
  topics: ['arreglos', 'índices', 'length', 'push', 'for...of'],

  intro:
    'El almacén del templo guarda las ofrendas en fila. Para no crear una variable por cada una, ' +
    'Proto-0 aprende a guardar muchas cosas en una sola lista.',

  concept: `
**Un arreglo guarda varios valores en orden.**

\`\`\`js
const frutas = ["higo", "uva", "dátil"];
console.log(frutas[0]);      // "higo"  ← ¡se cuenta desde 0!
console.log(frutas.length);  // 3
frutas.push("granada");      // agrega al final
\`\`\`

- Cada valor tiene un **índice**: la posición, empezando en **0**.
- El último elemento está en \`arreglo.length - 1\`.
- Para recorrer todos, usa \`for...of\`:

\`\`\`js
for (const fruta of frutas) {
  console.log(fruta);
}
\`\`\`
`.trim(),

  example: {
    code: `const columnas = ["norte", "sur"];
columnas.push("este");
console.log(columnas.length);
console.log(columnas[2]);`,
    output: ['3', 'este'],
  },

  exercise: {
    id: 'e3-13-ex-main',
    prompt:
      'Agrega "higos" a las ofrendas con push. Luego muestra cuántas ofrendas hay (length), la primera y la última (usa length - 1).',
    starterCode: `const ofrendas = ["trigo", "aceite", "miel"];

// 1. Agrega "higos"
// 2. Muestra la cantidad
// 3. Muestra la primera
// 4. Muestra la última
`,
    solution: `const ofrendas = ["trigo", "aceite", "miel"];
ofrendas.push("higos");
console.log(ofrendas.length);
console.log(ofrendas[0]);
console.log(ofrendas[ofrendas.length - 1]);`,
    checks: [
      { type: 'code-matches', pattern: String.raw`ofrendas\.push\(\s*["'\`]higos["'\`]\s*\)`, message: 'Agrega "higos" con ofrendas.push("higos").' },
      { type: 'code-matches', pattern: String.raw`ofrendas\.length`, message: 'Usa ofrendas.length para la cantidad.' },
      { type: 'code-matches', pattern: String.raw`ofrendas\[\s*0\s*\]`, message: 'La primera ofrenda está en ofrendas[0].' },
      { type: 'code-matches', pattern: String.raw`length\s*-\s*1`, message: 'Para la última usa ofrendas[ofrendas.length - 1].' },
      { type: 'output-equals', expected: ['4', 'trigo', 'higos'], message: 'Deben salir 4, trigo y higos.' },
    ],
    hints: [
      'ofrendas.push("higos") agrega al final.',
      'El primer índice es 0, no 1.',
      'La última está en ofrendas[ofrendas.length - 1].',
    ],
  },

  extraChallenges: [
    {
      id: 'e3-13-ex-extra-1',
      prompt: 'Suma todas las cosechas con un ciclo for...of y muestra el total.',
      starterCode: `const cosechas = [12, 7, 20, 5];
let total = 0;
// recorre cosechas
console.log(total);`,
      solution: `const cosechas = [12, 7, 20, 5];
let total = 0;
for (const c of cosechas) {
  total += c;
}
console.log(total);`,
      checks: [
        { type: 'code-matches', pattern: String.raw`for\s*\(`, message: 'Recorre el arreglo con un ciclo.' },
        { type: 'code-not-matches', pattern: String.raw`console\.log\(\s*44\s*\)`, message: 'Calcula el total con el ciclo en lugar de escribir 44.' },
        { type: 'output-equals', expected: ['44'], message: 'El total debe ser 44.' },
      ],
      hints: ['for (const c of cosechas) { total += c; }'],
    },
    {
      id: 'e3-13-ex-extra-2',
      prompt: 'Encuentra la piedra más grande recorriendo el arreglo y muéstrala.',
      starterCode: `const piedras = [3, 9, 4, 15, 6];
let mayor = piedras[0];
// recorre y actualiza mayor si encuentras una más grande
console.log(mayor);`,
      solution: `const piedras = [3, 9, 4, 15, 6];
let mayor = piedras[0];
for (const p of piedras) {
  if (p > mayor) {
    mayor = p;
  }
}
console.log(mayor);`,
      checks: [
        { type: 'code-matches', pattern: String.raw`for\s*\(`, message: 'Recorre el arreglo con un ciclo.' },
        { type: 'code-matches', pattern: String.raw`if\s*\(`, message: 'Usa un if para comparar cada piedra con la mayor.' },
        { type: 'output-equals', expected: ['15'], message: 'La piedra más grande es 15.' },
      ],
      hints: ['Si p > mayor, entonces mayor = p.'],
    },
  ],

  feedback: {
    success: '¡Almacén en orden! Ya puedo guardar y recorrer listas enteras. 🏺',
    retry: 'Algo se desacomodó en el almacén. Recuerda: los índices empiezan en 0.',
  },
  reward: { xp: 25, coins: 15 },
  next: 'e3-14-objetos',
};
