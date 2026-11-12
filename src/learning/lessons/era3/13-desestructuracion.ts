import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e3-21-desestructuracion',
  era: 3,
  order: 16,
  kind: 'lesson',
  title: 'Desestructuración: sacar valores sin rodeos',
  topics: ['desestructuracion', 'arreglos', 'objetos', 'parametros'],

  intro:
    'La ficha de Proto-0 guarda nombre, nivel y energía como propiedades. ' +
    'Para no escribir proto.nombre una y otra vez, la desestructuración saca los valores directo a variables.',

  concept: `
**Desestructurar es sacar valores de un arreglo u objeto y guardarlos en variables, en una sola línea.**

\`\`\`js
const proto = { nombre: "Proto-0", nivel: 3 };
const { nombre, nivel } = proto;
console.log(nombre); // "Proto-0"
\`\`\`

- Arreglos: el orden manda. \`const [a, b] = par;\` — la primera variable toma el primer elemento.
- Objetos: el nombre manda. \`const { nombre, nivel } = proto;\`
- Renombrar: \`const { nombre: n } = proto;\` guarda el valor en \`n\`.
- Valor por defecto: \`const { nivel = 1 } = proto;\` — si falta la propiedad, usa 1.
- En parámetros: \`function saludar({ nombre }) { ... }\` — la función recibe el objeto ya desestructurado.
`.trim(),

  example: {
    code: `const proto = { nombre: "Proto-0", nivel: 3 };
const { nombre, nivel } = proto;
console.log(nombre + " está en nivel " + nivel);`,
    output: ['Proto-0 está en nivel 3'],
  },

  exercise: {
    id: 'e3-21-ex-main',
    prompt:
      'Escribe ficha({ nombre, nivel }): recibe un objeto desestructurado en el parámetro y devuelve "nombre está en nivel nivel". ' +
      'Luego muéstrala con proto.',
    starterCode: `const proto = { nombre: "Proto-0", nivel: 3 };

// Escribe ficha({ nombre, nivel }): devuelve nombre + " está en nivel " + nivel.
function ficha({ nombre, nivel }) {
  // tu código aquí
}

console.log(ficha(proto));
`,
    solution: `const proto = { nombre: "Proto-0", nivel: 3 };

function ficha({ nombre, nivel }) {
  return nombre + " está en nivel " + nivel;
}

console.log(ficha(proto));`,
    checks: [
      { type: 'code-matches', pattern: String.raw`function\s+ficha\s*\(\s*\{\s*nombre\s*,\s*nivel\s*\}\s*\)`, message: 'Desestructura en el parámetro: function ficha({ nombre, nivel }) { … }.' },
      { type: 'output-equals', expected: ['Proto-0 está en nivel 3'], message: 'Debe mostrarse "Proto-0 está en nivel 3".' },
    ],
    tests: [
      {
        code: 'console.log(ficha({ nombre: "Nova", nivel: 7 }));',
        expected: ['Nova está en nivel 7'],
        message: 'Funciona con proto, pero no con otro objeto: usa los parámetros nombre y nivel, no escribas el texto a mano.',
      },
    ],
    hints: [
      'Entre llaves en el parámetro van los nombres: { nombre, nivel }.',
      'Devuelve nombre + " está en nivel " + nivel.',
    ],
  },

  extraChallenges: [
    {
      id: 'e3-21-ex-extra-1',
      prompt: 'Desestructura el arreglo [10, 20] en dos variables y muestra su suma.',
      starterCode: `const par = [10, 20];
// desestructura par en dos variables y muestra la suma
`,
      solution: `const par = [10, 20];
const [a, b] = par;
console.log(a + b);`,
      checks: [
        { type: 'code-matches', pattern: String.raw`const\s*\[\s*a\s*,\s*b\s*\]\s*=\s*par`, message: 'Desestructura con const [a, b] = par;' },
        { type: 'code-not-matches', pattern: String.raw`console\.log\(\s*30\s*\)`, message: 'Calcula la suma con a + b en lugar de escribir 30.' },
        { type: 'output-equals', expected: ['30'], message: 'La suma debe ser 30.' },
      ],
      hints: ['const [a, b] = par; — a toma el 10 y b toma el 20.'],
    },
    {
      id: 'e3-21-ex-extra-2',
      prompt: 'Escribe saludar({ nombre }): recibe el objeto desestructurado en el parámetro y devuelve "¡Hola, nombre!". Muéstrala con proto.',
      starterCode: `const proto = { nombre: "Proto-0", nivel: 3 };

// Escribe saludar({ nombre }): devuelve "¡Hola, " + nombre + "!".
function saludar({ nombre }) {
  // tu código aquí
}

console.log(saludar(proto));
`,
      solution: `const proto = { nombre: "Proto-0", nivel: 3 };

function saludar({ nombre }) {
  return "¡Hola, " + nombre + "!";
}

console.log(saludar(proto));`,
      checks: [
        { type: 'code-matches', pattern: String.raw`function\s+saludar\s*\(\s*\{\s*nombre\s*\}\s*\)`, message: 'Desestructura en el parámetro: function saludar({ nombre }) { … }.' },
        { type: 'output-equals', expected: ['¡Hola, Proto-0!'], message: 'Debe mostrarse "¡Hola, Proto-0!".' },
      ],
      tests: [
        {
          code: 'console.log(saludar({ nombre: "Nova" }));',
          expected: ['¡Hola, Nova!'],
          message: 'Saluda a proto, pero no a otro nombre: usa el parámetro nombre.',
        },
      ],
      hints: ['En el parámetro va { nombre } entre llaves.', 'Devuelve "¡Hola, " + nombre + "!".'],
    },
  ],

  feedback: {
    success: '¡Valores al instante! Desestructurar ya es parte de tu caja de herramientas. 🃏',
    retry: 'Algo se trabó al sacar los valores. Recuerda: en arreglos manda el orden; en objetos, el nombre.',
  },
  reward: { xp: 20, coins: 10 },
  next: 'e3-16-el-dom',
};
