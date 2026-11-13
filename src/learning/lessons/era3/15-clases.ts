import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e3-23-clases',
  era: 3,
  order: 22,
  kind: 'lesson',
  title: 'Clases: moldes para objetos',
  topics: ['clases', 'constructor', 'metodos', 'this'],

  intro:
    'Un objeto es una ficha llena: nombre, nivel, energía. Hacer fichas a mano funciona, ' +
    'pero un molde las produce todas iguales. Ese molde es una clase.',

  concept: `
**Una clase es un molde para crear muchos objetos con la misma forma.**

\`\`\`js
class Robot {
  constructor(nombre, nivel) {
    this.nombre = nombre;
    this.nivel = nivel;
  }
  saludar() {
    return "Hola, soy " + this.nombre;
  }
}

const proto = new Robot("Proto-0", 3);
console.log(proto.saludar());
\`\`\`

- **class Robot { … }**: define el molde.
- **constructor(...)**: corre al crear un objeto y guarda los datos con \`this\`.
- **this**: "este objeto". \`this.nombre\` es el nombre guardado en el objeto que se está creando.
- **new Robot(...)**: fabrica una instancia (un objeto) a partir del molde.
- **Métodos**: funciones dentro de la clase, como \`saludar()\`. Se llaman con \`objeto.saludar()\`.

`.trim(),

  example: {
    code: `class Proto {
  constructor(nombre, nivel) {
    this.nombre = nombre;
    this.nivel = nivel;
  }
  saludar() {
    return "Hola, soy " + this.nombre + " (nivel " + this.nivel + ")";
  }
}

const p = new Proto("Proto-0", 3);
console.log(p.saludar());`,
    output: ['Hola, soy Proto-0 (nivel 3)'],
  },

  exercise: {
    id: 'e3-23-ex-main',
    prompt:
      'Crea la clase Robot: su constructor recibe nombre y nivel y los guarda con this. ' +
      'Su método presentarse() devuelve "Soy " + nombre + " y estoy en nivel " + nivel. ' +
      'Muestra new Robot("Proto-0", 3).presentarse().',
    starterCode: `// class Robot { constructor(nombre, nivel) { … } presentarse() { … } }
// Muestra new Robot("Proto-0", 3).presentarse().
`,
    solution: `class Robot {
  constructor(nombre, nivel) {
    this.nombre = nombre;
    this.nivel = nivel;
  }
  presentarse() {
    return "Soy " + this.nombre + " y estoy en nivel " + this.nivel;
  }
}

console.log(new Robot("Proto-0", 3).presentarse());`,
    checks: [
      { type: 'code-matches', pattern: String.raw`class\s+Robot\b`, message: 'Define class Robot { … }.' },
      { type: 'code-matches', pattern: String.raw`constructor\s*\(\s*nombre\s*,\s*nivel\s*\)`, message: 'El constructor recibe (nombre, nivel).' },
      { type: 'code-matches', pattern: String.raw`this\.nombre\s*=`, message: 'Guarda el nombre con this.nombre = nombre.' },
      { type: 'output-equals', expected: ['Soy Proto-0 y estoy en nivel 3'], message: 'Debe mostrarse "Soy Proto-0 y estoy en nivel 3".' },
    ],
    tests: [
      {
        code: 'console.log(new Robot("Nova", 7).presentarse());',
        expected: ['Soy Nova y estoy en nivel 7'],
        message: 'Funciona con Proto-0, pero no con otros datos: usa this.nombre y this.nivel en el método.',
      },
    ],
    hints: [
      'constructor(nombre, nivel) { this.nombre = nombre; this.nivel = nivel; }',
      'presentarse() { return "Soy " + this.nombre + " y estoy en nivel " + this.nivel; }',
    ],
  },

  extraChallenges: [
    {
      id: 'e3-23-ex-extra-1',
      prompt: 'Crea la clase Contador: empieza en 0 (this.cuenta = 0) y su método incrementar() suma 1 y devuelve la cuenta. Crea un contador, increméntalo dos veces y muestra el resultado.',
      starterCode: `// class Contador { constructor() { … } incrementar() { … } }
`,
      solution: `class Contador {
  constructor() {
    this.cuenta = 0;
  }
  incrementar() {
    this.cuenta++;
    return this.cuenta;
  }
}

const c = new Contador();
c.incrementar();
console.log(c.incrementar());`,
      checks: [
        { type: 'code-matches', pattern: String.raw`this\.cuenta\+\+`, message: 'El método suma con this.cuenta++.' },
        { type: 'output-equals', expected: ['2'], message: 'Tras dos incrementos debe mostrarse 2.' },
      ],
      tests: [
        {
          code: 'const otro = new Contador(); otro.incrementar(); console.log(otro.incrementar());',
          expected: ['2'],
          message: 'Cada contador lleva su propia cuenta: un contador nuevo debe empezar desde 0.',
        },
      ],
      hints: ['this.cuenta++ suma 1 a la cuenta guardada en este objeto.'],
    },
    {
      id: 'e3-23-ex-extra-2',
      prompt: 'Crea la clase Ficha: constructor(nombre) guarda this.nombre y saludo() devuelve "¡Hola, " + nombre + "!". Crea dos fichas distintas y muestra el saludo de cada una.',
      starterCode: `// class Ficha { constructor(nombre) { … } saludo() { … } }
`,
      solution: `class Ficha {
  constructor(nombre) {
    this.nombre = nombre;
  }
  saludo() {
    return "¡Hola, " + this.nombre + "!";
  }
}

const a = new Ficha("Proto-0");
const b = new Ficha("Nova");
console.log(a.saludo());
console.log(b.saludo());`,
      checks: [
        { type: 'code-matches', pattern: String.raw`new\s+Ficha\s*\(`, message: 'Crea las fichas con new Ficha("…").' },
        { type: 'output-equals', expected: ['¡Hola, Proto-0!', '¡Hola, Nova!'], message: 'Deben mostrarse los dos saludos, uno por ficha.' },
      ],
      tests: [
        {
          code: 'console.log(new Ficha("Iri").saludo());',
          expected: ['¡Hola, Iri!'],
          message: 'Cada ficha saluda con su propio nombre: usa this.nombre, no un texto fijo.',
        },
      ],
      hints: ['Dos instancias del mismo molde guardan datos distintos: a.nombre y b.nombre no son lo mismo.'],
    },
  ],

  feedback: {
    success: '¡Moldes listos! Ya sabes fabricar objetos con clases, constructor y this. 🏭',
    retry: 'El molde no fabricó bien. Revisa el constructor, que guarde this.nombre y this.nivel.',
  },
  reward: { xp: 20, coins: 10 },
  next: 'e3-24-modulos',
};
