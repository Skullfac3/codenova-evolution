import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e3-20-metodos-arreglos',
  era: 3,
  order: 15,
  kind: 'lesson',
  title: 'Métodos de arreglos: transformar sin repetir',
  topics: ['arreglos', 'map', 'filter', 'forEach', 'reduce'],

  intro:
    'El almacén ordenado guarda las ofrendas en fila, pero copiarlas una por una cansa. ' +
    'Proto-0 aprende métodos que recorren, transforman y filtran el arreglo por él.',

  concept: `
**Los métodos de arreglos hacen el trabajo pesado por ti: recorren, transforman y filtran sin escribir el ciclo a mano.**

\`\`\`js
const precios = [10, 20, 30];
const preciosConIva = precios.map(function (p) { return p * 1.16; });
console.log(preciosConIva); // [11.6,23.2,34.8]
\`\`\`

- **.forEach(...)**: recorre y hace algo con cada elemento. No devuelve nada nuevo.
- **.map(...)**: transforma cada elemento y devuelve un arreglo NUEVO. El original no cambia.
- **.filter(...)**: devuelve un arreglo nuevo solo con los elementos que cumplen la condición.
- Se pueden **encadenar**: primero filtras, luego transformas, en una sola línea.
- **reduce** junta todos los elementos en un solo valor (lo verás más adelante).

Con un \`for\` que modifica el arreglo original, corres el riesgo de saltarte elementos; con estos métodos trabajas sobre copias nuevas.
`.trim(),

  example: {
    code: `const precios = [10, 20, 30];
const preciosConIva = precios.map(function (p) { return p * 1.16; });
console.log(preciosConIva);`,
    output: ['[11.6,23.2,34.8]'],
  },

  exercise: {
    id: 'e3-20-ex-main',
    prompt:
      'Escribe mayoresDeEdad(edades): devuelve solo las edades mayores o iguales a 18 usando .filter. ' +
      'Luego muéstrala con [15, 22, 17, 30].',
    starterCode: `// Escribe mayoresDeEdad(edades): devuelve solo las edades >= 18 con .filter.
function mayoresDeEdad(edades) {
  // tu código aquí
}

console.log(mayoresDeEdad([15, 22, 17, 30]));
`,
    solution: `function mayoresDeEdad(edades) {
  return edades.filter(function (e) { return e >= 18; });
}
console.log(mayoresDeEdad([15, 22, 17, 30]));`,
    checks: [
      { type: 'code-matches', pattern: String.raw`function\s+mayoresDeEdad\s*\(\s*edades\s*\)`, message: 'Crea function mayoresDeEdad(edades) { … }.' },
      { type: 'code-matches', pattern: String.raw`\.filter\s*\(`, message: 'Quédate con los mayores de edad usando .filter(...).' },
      { type: 'output-equals', expected: ['[22,30]'], message: 'Deben salir solo las edades mayores o iguales a 18: [22,30].' },
    ],
    tests: [
      {
        code: 'console.log(mayoresDeEdad([10, 18, 12]));',
        expected: ['[18]'],
        message: 'Funciona con [15, 22, 17, 30], pero no con otros datos: usa .filter con la condición e >= 18 dentro de la función.',
      },
    ],
    hints: [
      'edades.filter(function (e) { return e >= 18; }) devuelve un arreglo nuevo.',
      'La función recibe el arreglo como parámetro: úsala con cualquier lista.',
    ],
  },

  extraChallenges: [
    {
      id: 'e3-20-ex-extra-1',
      prompt: 'Escribe aFahrenheit(celsius): con .map convierte cada temperatura de [0, 20, 100] de °C a °F (F = C * 9 / 5 + 32) y muestra el resultado.',
      starterCode: `// Escribe aFahrenheit(celsius) con .map y muéstrala con [0, 20, 100].
function aFahrenheit(celsius) {
  // tu código aquí
}

console.log(aFahrenheit([0, 20, 100]));
`,
      solution: `function aFahrenheit(celsius) {
  return celsius.map(function (c) { return c * 9 / 5 + 32; });
}
console.log(aFahrenheit([0, 20, 100]));`,
      checks: [
        { type: 'code-matches', pattern: String.raw`function\s+aFahrenheit\s*\(\s*celsius\s*\)`, message: 'Crea function aFahrenheit(celsius) { … }.' },
        { type: 'code-matches', pattern: String.raw`\.map\s*\(`, message: 'Transforma cada temperatura con .map(...).' },
        { type: 'output-equals', expected: ['[32,68,212]'], message: 'Deben salir las temperaturas en °F: [32,68,212].' },
      ],
      tests: [
        {
          code: 'console.log(aFahrenheit([10]));',
          expected: ['[50]'],
          message: 'Convierte [0, 20, 100], pero no otros datos: aplica la fórmula C * 9 / 5 + 32 a cada elemento.',
        },
      ],
      hints: ['celsius.map(function (c) { return c * 9 / 5 + 32; })'],
    },
    {
      id: 'e3-20-ex-extra-2',
      prompt: 'Con los precios [10, 25, 40, 8], quédate solo con los mayores de 15 y a cada uno súmale 10 con .filter(...).map(...) encadenados, sin variables intermedias. Muestra el resultado.',
      starterCode: `// Encadena .filter(...) y .map(...) en una sola línea, sin variables intermedias.
// precios: [10, 25, 40, 8] → mayores de 15, cada uno + 10
`,
      solution: `console.log([10, 25, 40, 8].filter(function (p) { return p > 15; }).map(function (p) { return p + 10; }));`,
      checks: [
        { type: 'code-matches', pattern: String.raw`\.filter\s*\([\s\S]*?\)\s*\.map\s*\(`, message: 'Encadena .filter(...).map(...) en la misma línea.' },
        { type: 'code-not-matches', pattern: String.raw`\[35,\s*50\]`, message: 'Calcula el resultado con filter y map en lugar de escribir [35,50].' },
        { type: 'output-equals', expected: ['[35,50]'], message: 'Deben salir los precios filtrados y transformados: [35,50].' },
      ],
      hints: ['[10, 25, 40, 8].filter(...).map(...) — primero filtra, luego transforma.'],
    },
  ],

  feedback: {
    success: '¡Transformaste sin repetir! map, filter y forEach ya son tus herramientas. 🧰',
    retry: 'Algo no salió. Recuerda: .filter se queda con algunos y .map transforma cada uno.',
  },
  reward: { xp: 20, coins: 10 },
  next: 'e3-21-desestructuracion',
};
