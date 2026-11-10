import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e3-14-objetos',
  era: 3,
  order: 14,
  kind: 'lesson',
  title: 'Objetos: fichas con propiedades',
  topics: ['objetos', 'propiedades', 'notación de punto', 'arreglos de objetos'],

  intro:
    'Los escribas registran cada edificio en una ficha: nombre, columnas, si está terminado… ' +
    'En JavaScript, una ficha así es un objeto.',

  concept: `
**Un objeto agrupa datos relacionados con nombre (propiedades).**

\`\`\`js
const mascota = {
  nombre: "Dodo",
  edad: 2,
  vuela: false,
};

console.log(mascota.nombre);  // "Dodo"
mascota.edad += 1;            // cambiar una propiedad
mascota.color = "gris";       // agregar una nueva
\`\`\`

- Se escriben con llaves \`{ }\` y pares \`clave: valor\` separados por comas.
- Se leen y se cambian con **notación de punto**: \`objeto.propiedad\`.
- Un \`const\` con un objeto no se puede reasignar, pero **sus propiedades sí pueden cambiar**.
- Puedes tener **arreglos de objetos**: una lista de fichas.
`.trim(),

  example: {
    code: `const herramienta = { nombre: "Cincel", usos: 3 };
herramienta.usos += 1;
console.log(herramienta.nombre + ": " + herramienta.usos + " usos");`,
    output: ['Cincel: 4 usos'],
  },

  exercise: {
    id: 'e3-14-ex-main',
    prompt:
      'Crea el objeto templo con nombre "Templo del Sol", columnas 8 y terminado false. Muestra su nombre. ' +
      'Luego agrégale 4 columnas, márcalo como terminado y muestra columnas y terminado.',
    starterCode: `// const templo = { … };
`,
    solution: `const templo = {
  nombre: "Templo del Sol",
  columnas: 8,
  terminado: false,
};
console.log(templo.nombre);
templo.columnas += 4;
templo.terminado = true;
console.log(templo.columnas);
console.log(templo.terminado);`,
    checks: [
      { type: 'code-matches', pattern: String.raw`const\s+templo\s*=\s*\{`, message: 'Crea el objeto: const templo = { … };' },
      { type: 'code-matches', pattern: String.raw`columnas\s*:\s*8`, message: 'El templo empieza con columnas: 8.' },
      { type: 'code-matches', pattern: String.raw`terminado\s*:\s*false`, message: 'El templo empieza con terminado: false.' },
      { type: 'code-matches', pattern: String.raw`templo\.columnas\s*(\+=|=)`, message: 'Cambia las columnas con templo.columnas += 4.' },
      { type: 'code-matches', pattern: String.raw`templo\.terminado\s*=\s*true`, message: 'Marca el templo con templo.terminado = true.' },
      { type: 'output-equals', expected: ['Templo del Sol', '12', 'true'], message: 'Deben salir "Templo del Sol", 12 y true.' },
    ],
    hints: [
      'Las propiedades van separadas por comas: { nombre: "…", columnas: 8, terminado: false }',
      'Para leer: templo.nombre. Para cambiar: templo.columnas += 4;',
    ],
  },

  extraChallenges: [
    {
      id: 'e3-14-ex-extra-1',
      prompt: 'Recorre la lista de mercaderes con for...of y muestra para cada uno: "<nombre> tiene <monedas> monedas".',
      starterCode: `const mercaderes = [
  { nombre: "Iri", monedas: 30 },
  { nombre: "Tamo", monedas: 45 },
];
`,
      solution: `const mercaderes = [
  { nombre: "Iri", monedas: 30 },
  { nombre: "Tamo", monedas: 45 },
];
for (const m of mercaderes) {
  console.log(m.nombre + " tiene " + m.monedas + " monedas");
}`,
      checks: [
        { type: 'code-matches', pattern: String.raw`for\s*\(`, message: 'Recorre la lista con un ciclo.' },
        { type: 'code-matches', pattern: String.raw`\.nombre`, message: 'Usa la propiedad .nombre de cada mercader.' },
        { type: 'code-not-matches', pattern: String.raw`["'\`]Tamo tiene`, message: 'No escribas los mensajes a mano: usa las propiedades.' },
        { type: 'output-equals', expected: ['Iri tiene 30 monedas', 'Tamo tiene 45 monedas'], message: 'Revisa el formato: "Iri tiene 30 monedas".' },
      ],
      hints: ['m.nombre + " tiene " + m.monedas + " monedas"'],
    },
    {
      id: 'e3-14-ex-extra-2',
      prompt: 'Escribe una función describir(animal) que devuelva "<nombre> es un <especie>". Muestra describir con el búho.',
      starterCode: `const buho = { nombre: "Sabio", especie: "búho" };
// function describir(animal) { … }
`,
      solution: `const buho = { nombre: "Sabio", especie: "búho" };
function describir(animal) {
  return animal.nombre + " es un " + animal.especie;
}
console.log(describir(buho));`,
      checks: [
        { type: 'code-matches', pattern: String.raw`function\s+describir\s*\(\s*animal\s*\)`, message: 'Crea function describir(animal).' },
        { type: 'output-equals', expected: ['Sabio es un búho'], message: 'Debe mostrarse "Sabio es un búho".' },
      ],
      tests: [
        {
          code: 'console.log(describir({ nombre: "Pip", especie: "gato" }));',
          expected: ['Pip es un gato'],
          message: 'Probé con otro animal ({ nombre: "Pip", especie: "gato" }) y falló. Usa animal.nombre y animal.especie.',
        },
      ],
      hints: ['return animal.nombre + " es un " + animal.especie;'],
    },
  ],

  feedback: {
    success: '¡Fichas completas! Los escribas están impresionados con tu registro. 📜',
    retry: 'La ficha tiene un error. Revisa las comas entre propiedades y la notación de punto.',
  },
  reward: { xp: 25, coins: 15 },
  next: 'e3-16-el-dom',
};
