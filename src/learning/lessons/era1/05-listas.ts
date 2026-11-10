import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e1-05-listas',
  era: 1,
  order: 5,
  kind: 'lesson',
  title: 'Listas',
  topics: ['ul', 'ol', 'li'],

  intro:
    'Para encender la fogata necesito varias cosas y no quiero olvidar ninguna. ' +
    'Las listas ordenan la información: cada cosa en su renglón, sin que se pierda nada.',

  concept: `
**Hay dos tipos de listas.**

\`\`\`html
<ul>
  <li>Ramas</li>
  <li>Piedras</li>
</ul>

<ol>
  <li>Juntar leña</li>
  <li>Encender la fogata</li>
</ol>
\`\`\`

- \`<ul>\` es una lista **sin orden** (con viñetas •). Úsala cuando el orden no importa: la lista del mercado, tus materiales.
- \`<ol>\` es una lista **ordenada** (con números 1, 2, 3). Úsala cuando hay pasos: primero esto, luego aquello.
- Cada elemento va dentro de \`<li>\`. Sin \`<li>\`, la lista está vacía.

El tipo de lista ya dice algo: viñetas = "estas cosas", números = "en este orden".
`.trim(),

  example: {
    code: `<ul>
  <li>Ramas</li>
  <li>Piedras</li>
  <li>Hojas</li>
</ul>`,
    output: ['Ramas', 'Piedras', 'Hojas'],
  },

  exercise: {
    id: 'e1-05-ex-main',
    language: 'html',
    prompt:
      'Completa la lista de materiales: agrega "Piedras" y "Hojas" ' +
      'para que la lista tenga 3 elementos.',
    starterCode: `<ul>
  <li>Ramas</li>
  <!-- agrega dos elementos más -->
</ul>`,
    solution: `<ul>
  <li>Ramas</li>
  <li>Piedras</li>
  <li>Hojas</li>
</ul>`,
    checks: [
      {
        type: 'html-contains',
        selector: 'ul li',
        count: 3,
        message: 'La lista debe tener exactamente 3 elementos.',
      },
      {
        type: 'html-contains',
        selector: 'ul li',
        text: 'Piedras',
        message: 'Falta el elemento "Piedras" en la lista.',
      },
      {
        type: 'html-contains',
        selector: 'ul li',
        text: 'Hojas',
        message: 'Falta el elemento "Hojas" en la lista.',
      },
    ],
    hints: [
      'Cada elemento es un <li> entre <ul> y </ul>.',
      'Copia la línea de "Ramas" y cambia solo el texto.',
    ],
  },

  extraChallenges: [
    {
      id: 'e1-05-ex-extra-1',
      language: 'html',
      prompt: 'Ahora los pasos para la fogata, en orden: 1. Juntar leña, 2. Hacer un círculo de piedras, 3. Encender la fogata. Usa una lista ordenada.',
      starterCode: `<!-- Escribe aquí la lista ordenada -->
`,
      solution: `<ol>
  <li>Juntar leña</li>
  <li>Hacer un círculo de piedras</li>
  <li>Encender la fogata</li>
</ol>`,
      checks: [
        {
          type: 'html-contains',
          selector: 'ol li',
          count: 3,
          message: 'La lista ordenada debe tener 3 pasos.',
        },
        {
          type: 'html-contains',
          selector: 'ol li',
          text: 'Encender la fogata',
          message: 'El último paso debe ser "Encender la fogata".',
        },
      ],
      hints: ['Las listas ordenadas usan <ol> en lugar de <ul>, pero los elementos siguen siendo <li>.'],
    },
    {
      id: 'e1-05-ex-extra-2',
      language: 'html',
      prompt: 'Agrega un cuarto material a la lista: "Leña".',
      starterCode: `<ul>
  <li>Ramas</li>
  <li>Piedras</li>
  <li>Hojas</li>
</ul>`,
      solution: `<ul>
  <li>Ramas</li>
  <li>Piedras</li>
  <li>Hojas</li>
  <li>Leña</li>
</ul>`,
      checks: [
        {
          type: 'html-contains',
          selector: 'ul li',
          count: 4,
          message: 'La lista debe tener ahora 4 elementos.',
        },
        {
          type: 'html-contains',
          selector: 'ul li',
          text: 'Leña',
          message: 'Falta el elemento "Leña".',
        },
      ],
      hints: ['Agrega otro <li> antes de </ul>.'],
    },
  ],

  feedback: {
    success: '¡Lista completa! Con orden, nada se olvida: ni las ramas ni los pasos. ✅',
    retry: 'Cuenta los elementos: cada cosa necesita su propio <li> dentro de la lista.',
  },
  reward: { xp: 20, coins: 10 },
  next: 'e1-06-formularios',
};
