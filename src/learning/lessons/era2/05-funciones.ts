import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e2-05-funciones',
  era: 2,
  order: 5,
  kind: 'lesson',
  title: 'Funciones: recetas reutilizables',
  topics: ['function', 'parámetros', 'return'],

  intro:
    'Los arquitectos de la ciudad calculan áreas todo el día. En lugar de repetir la cuenta, ' +
    'escriben la receta una vez y la usan cuantas veces quieran. Eso es una función.',

  concept: `
**Una función es un bloque de código con nombre que puedes usar muchas veces.**

\`\`\`js
function doble(numero) {
  return numero * 2;
}

console.log(doble(4));  // 8
console.log(doble(10)); // 20
\`\`\`

- \`numero\` es un **parámetro**: el dato que recibe la función.
- \`return\` **devuelve** un resultado y termina la función.
- Al **llamarla** (\`doble(4)\`), el valor \`4\` entra como \`numero\`.

Una función puede tener varios parámetros separados por comas: \`function sumar(a, b)\`.
`.trim(),

  example: {
    code: `function saludo(nombre) {
  return "Hola, " + nombre;
}
console.log(saludo("Proto-0"));`,
    output: ['Hola, Proto-0'],
  },

  exercise: {
    id: 'e2-05-ex-main',
    prompt:
      'Escribe una función area que reciba base y altura y DEVUELVA base × altura. Luego muestra area(4, 5).',
    starterCode: `function area(base, altura) {
  // devuelve el resultado con return
}

console.log(area(4, 5));`,
    solution: `function area(base, altura) {
  return base * altura;
}

console.log(area(4, 5));`,
    checks: [
      { type: 'code-matches', pattern: String.raw`function\s+area\s*\(\s*base\s*,\s*altura\s*\)`, message: 'La función debe llamarse area y recibir (base, altura).' },
      { type: 'code-matches', pattern: String.raw`\breturn\b`, message: 'Usa return para devolver el resultado.' },
      { type: 'output-equals', expected: ['20'], message: 'area(4, 5) debe dar 20.' },
    ],
    tests: [
      {
        code: 'console.log(area(2, 3)); console.log(area(10, 1));',
        expected: ['6', '10'],
        message: 'Tu función da bien 20, pero falla con otros valores: probé area(2, 3) y area(10, 1). ¿Usas base y altura?',
      },
    ],
    hints: [
      'Dentro de la función: return base * altura;',
      'Si ves "undefined", te falta el return.',
    ],
  },

  extraChallenges: [
    {
      id: 'e2-05-ex-extra-1',
      prompt: 'Escribe una función saludar(nombre) que devuelva "Salve, " + nombre + "!". Muestra saludar("Nefer").',
      starterCode: `// function saludar(nombre) { … }
`,
      solution: `function saludar(nombre) {
  return "Salve, " + nombre + "!";
}
console.log(saludar("Nefer"));`,
      checks: [
        { type: 'code-matches', pattern: String.raw`function\s+saludar\s*\(\s*nombre\s*\)`, message: 'Crea function saludar(nombre).' },
        { type: 'output-equals', expected: ['Salve, Nefer!'], message: 'Debe mostrarse "Salve, Nefer!".' },
      ],
      tests: [
        {
          code: 'console.log(saludar("Ana"));',
          expected: ['Salve, Ana!'],
          message: 'Probé saludar("Ana") y no dio "Salve, Ana!". Usa el parámetro nombre en lugar de escribir "Nefer".',
        },
      ],
      hints: ['return "Salve, " + nombre + "!";'],
    },
    {
      id: 'e2-05-ex-extra-2',
      prompt: 'Escribe una función esPar(n) que devuelva true si n es par y false si no. Muestra esPar(4) y esPar(7).',
      starterCode: `// Pista: un número es par si n % 2 === 0
`,
      solution: `function esPar(n) {
  return n % 2 === 0;
}
console.log(esPar(4));
console.log(esPar(7));`,
      checks: [
        { type: 'code-matches', pattern: String.raw`function\s+esPar\s*\(\s*n\s*\)`, message: 'Crea function esPar(n).' },
        { type: 'output-equals', expected: ['true', 'false'], message: 'Deben salir true y false.' },
      ],
      tests: [
        {
          code: 'console.log(esPar(0)); console.log(esPar(11)); console.log(esPar(100));',
          expected: ['true', 'false', 'true'],
          message: 'Probé esPar(0), esPar(11) y esPar(100) y algo no cuadró. Revisa la condición con %.',
        },
      ],
      hints: ['La comparación n % 2 === 0 ya es true o false: puedes devolverla directamente.'],
    },
  ],

  feedback: {
    success: '¡Receta guardada! Ahora puedo calcular áreas para toda la ciudad. 📐',
    retry: 'Mi receta salió mal. Revisa que la función use sus parámetros y que tenga return.',
  },
  reward: { xp: 25, coins: 15 },
  next: 'e2-06-arreglos',
};
