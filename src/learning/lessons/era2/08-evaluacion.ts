import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e2-08-evaluacion',
  era: 2,
  order: 8,
  kind: 'evaluation',
  title: 'Evaluación · CSS y Tailwind',
  topics: ['repaso CSS'],

  intro:
    'El templo está pintado y la plaza ordenada. Si demuestras lo que ' +
    'aprendiste, seguirás hacia la Era 3, donde tu página cobrará vida con JavaScript.',

  concept: `
Esta evaluación tiene **5 preguntas** y **un ejercicio práctico**.

- Preguntas: 60 % de la calificación.
- Ejercicio práctico: 40 % y es **obligatorio** para aprobar.
- Necesitas **60 puntos** para seguir. Puedes repetirla las veces que quieras.
`.trim(),

  example: { code: '', output: [] },

  quiz: [
    {
      prompt: '¿Qué es CSS?',
      options: [
        'El lenguaje que da estilo a las páginas web',
        'El lenguaje de marcas para escribir páginas',
        'Un lenguaje para programar servidores',
        'Una base de datos',
      ],
      correctIndex: 0,
      explanation: 'CSS da estilo: colores, tamaños y diseño. HTML es el que escribe la estructura.',
    },
    {
      prompt: '¿Qué selector elige a los elementos con class="titulo"?',
      options: ['.titulo', 'titulo', '#titulo', '<titulo>'],
      correctIndex: 0,
      explanation: 'La clase lleva un punto delante: .titulo. La almohadilla es para id.',
    },
    {
      prompt: '¿Qué propiedad cambia el color de fondo de un elemento?',
      options: ['background-color', 'color', 'font-size', 'margin'],
      correctIndex: 0,
      explanation: 'background-color pinta el fondo; color pinta el texto.',
    },
    {
      prompt: '¿Qué separa un elemento de sus vecinos por fuera?',
      options: ['margin', 'padding', 'border', 'gap'],
      correctIndex: 0,
      explanation: 'margin separa por fuera; padding deja aire por dentro.',
    },
    {
      prompt: 'En Tailwind, ¿cómo se pone un fondo ámbar a un título?',
      options: ['class="bg-amber-600"', 'style="bg-amber-600"', '<bg-amber-600>', '.bg-amber-600 { } en el HTML'],
      correctIndex: 0,
      explanation: 'En Tailwind el estilo va en el atributo class, con las clases separadas por espacios.',
    },
  ],

  exercise: {
    id: 'e2-08-ex-practical',
    language: 'html',
    prompt:
      'Da estilo a la página del mercado:\n' +
      '1. El título <h1> en rojo, con una regla CSS.\n' +
      '2. La tarjeta .tarjeta con fondo dorado y 16px de aire (padding).\n' +
      '3. El botón vestido con Tailwind: bg-amber-600 text-white p-2 rounded.',
    starterCode: `<style>
  /* Mini Tailwind: estas clases ya existen. Solo úsalas en class="...". */
  .bg-amber-600 { background-color: #d97706; }
  .text-white { color: #ffffff; }
  .p-2 { padding: 8px; }
  .rounded { border-radius: 8px; }
</style>
<h1>Mercado Central</h1>
<div class="tarjeta">
  <p>Pan fresco todos los días.</p>
</div>
<button class="">Comprar pan</button>`,
    solution: `<style>
  /* Mini Tailwind: estas clases ya existen. Solo úsalas en class="...". */
  .bg-amber-600 { background-color: #d97706; }
  .text-white { color: #ffffff; }
  .p-2 { padding: 8px; }
  .rounded { border-radius: 8px; }
  h1 {
    color: red;
  }
  .tarjeta {
    background-color: gold;
    padding: 16px;
  }
</style>
<h1>Mercado Central</h1>
<div class="tarjeta">
  <p>Pan fresco todos los días.</p>
</div>
<button class="bg-amber-600 text-white p-2 rounded">Comprar pan</button>`,
    checks: [
      {
        type: 'style-contains',
        pattern: 'h1\\s*\\{[^}]*color\\s*:\\s*red',
        message: 'El título debe tener la regla h1 con color: red;.',
      },
      {
        type: 'style-contains',
        pattern: '\\.tarjeta\\s*\\{[^}]*background-color\\s*:\\s*gold',
        message: 'La tarjeta debe tener background-color: gold;.',
      },
      {
        type: 'style-contains',
        pattern: '\\.tarjeta\\s*\\{[^}]*padding\\s*:\\s*16px',
        message: 'La tarjeta debe tener padding: 16px;.',
      },
      {
        type: 'code-matches',
        pattern: 'class="[^"]*bg-amber-600',
        message: 'El botón debe llevar la clase bg-amber-600.',
      },
      {
        type: 'code-matches',
        pattern: 'class="[^"]*text-white',
        message: 'El botón debe llevar la clase text-white.',
      },
      {
        type: 'code-matches',
        pattern: 'class="[^"]*p-2',
        message: 'El botón debe llevar la clase p-2.',
      },
      {
        type: 'code-matches',
        pattern: 'class="[^"]*rounded',
        message: 'El botón debe llevar la clase rounded.',
      },
      {
        type: 'html-contains',
        selector: 'h1',
        text: 'Mercado Central',
        message: 'El título debe seguir diciendo "Mercado Central".',
      },
      {
        type: 'html-contains',
        selector: 'button',
        text: 'Comprar pan',
        message: 'El botón debe decir "Comprar pan".',
      },
    ],
    hints: [
      'Ve paso por paso, en el mismo orden de las instrucciones.',
      'El título y la tarjeta usan reglas en <style>; el botón usa clases en class="...".',
    ],
  },
  extraChallenges: [],

  feedback: {
    success: '¡Lo lograste! Tu página tiene color, orden y estilo. La Era 3 te espera: ahí tu página cobrará vida. 🏛️✨',
    retry: 'Casi. Repasa las lecciones marcadas y vuelve al templo cuando quieras.',
  },
  reward: { xp: 50, coins: 30 },
  // La Era 3 ya tiene lecciones: la evaluación apunta a su primera lección,
  // mismo patrón que la evaluación de la Era 1 apunta a la Era 2.
  next: 'e3-01-que-es-programar',
};
