import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e1-03-titulos-parrafos',
  era: 1,
  order: 3,
  kind: 'lesson',
  title: 'Títulos y párrafos',
  topics: ['h1-h6', 'p', 'jerarquía'],

  intro:
    'Una página sin orden es como una cueva sin mapa: nadie encuentra nada. ' +
    'Los títulos le dicen al lector qué es importante y los párrafos cuentan la historia.',

  concept: `
**Los títulos tienen niveles, del más importante al menos importante.**

\`\`\`html
<h1>Mi refugio</h1>
<h2>La fogata</h2>
<h3>Leña</h3>
<p>El fuego nos mantiene calientes.</p>
\`\`\`

- \`<h1>\` es el título principal: **solo debe haber uno por página**.
- \`<h2>\` es un subtítulo, \`<h3>\` un título más pequeño… hasta \`<h6>\`.
- \`<p>\` es un párrafo: un bloque de texto con una idea.

Piensa en un libro: el título del libro es \`<h1>\`, los capítulos son \`<h2>\` y el texto de cada capítulo va en \`<p>\`.
`.trim(),

  example: {
    code: `<h1>Mi refugio</h1>
<h2>La fogata</h2>
<p>El fuego nos mantiene calientes.</p>`,
    output: ['Mi refugio', 'La fogata', 'El fuego nos mantiene calientes.'],
  },

  exercise: {
    id: 'e1-03-ex-main',
    language: 'html',
    prompt:
      'Escribe el subtítulo y el párrafo: un <h2> que diga "La fogata" ' +
      'y un <p> que diga "El fuego nos mantiene calientes."',
    starterCode: `<h1>Mi refugio</h1>
<h2></h2>
<p></p>`,
    solution: `<h1>Mi refugio</h1>
<h2>La fogata</h2>
<p>El fuego nos mantiene calientes.</p>`,
    checks: [
      {
        type: 'html-contains',
        selector: 'h2',
        text: 'La fogata',
        message: 'El subtítulo <h2> debe decir "La fogata".',
      },
      {
        type: 'html-contains',
        selector: 'p',
        text: 'El fuego nos mantiene calientes.',
        message: 'El párrafo debe decir "El fuego nos mantiene calientes.".',
      },
    ],
    hints: [
      'El subtítulo va entre <h2> y </h2>; el párrafo entre <p> y </p>.',
      'Fíjate en el ejemplo: primero el h1, luego el h2, luego el párrafo.',
    ],
  },

  extraChallenges: [
    {
      id: 'e1-03-ex-extra-1',
      language: 'html',
      prompt: 'Agrega un título pequeño <h3> que diga "Leña" y un párrafo que diga: La leña seca arde mejor.',
      starterCode: `<h1>Mi refugio</h1>
<h2>La fogata</h2>
<p>El fuego nos mantiene calientes.</p>
`,
      solution: `<h1>Mi refugio</h1>
<h2>La fogata</h2>
<p>El fuego nos mantiene calientes.</p>
<h3>Leña</h3>
<p>La leña seca arde mejor.</p>`,
      checks: [
        {
          type: 'html-contains',
          selector: 'h3',
          text: 'Leña',
          message: 'Falta el título <h3> con el texto "Leña".',
        },
        {
          type: 'html-contains',
          selector: 'p',
          text: 'La leña seca arde mejor.',
          message: 'Falta el párrafo "La leña seca arde mejor.".',
        },
      ],
      hints: ['El h3 es un título más pequeño que el h2: va después del párrafo de la fogata.'],
    },
    {
      id: 'e1-03-ex-extra-2',
      language: 'html',
      prompt: 'Arma una mini jerarquía desde cero: h1 "Guía de supervivencia", h2 "Agua" y un párrafo "Busca un río cercano.".',
      starterCode: `<!-- Escribe aquí tu jerarquía -->
`,
      solution: `<h1>Guía de supervivencia</h1>
<h2>Agua</h2>
<p>Busca un río cercano.</p>`,
      checks: [
        {
          type: 'html-contains',
          selector: 'h1',
          text: 'Guía de supervivencia',
          message: 'El título principal debe decir "Guía de supervivencia".',
        },
        {
          type: 'html-contains',
          selector: 'h2',
          text: 'Agua',
          message: 'El subtítulo debe decir "Agua".',
        },
        {
          type: 'html-contains',
          selector: 'p',
          text: 'Busca un río cercano.',
          message: 'El párrafo debe decir "Busca un río cercano.".',
        },
      ],
      hints: ['El orden es: h1, luego h2, luego el párrafo. Cada uno con su etiqueta de cierre.'],
    },
  ],

  feedback: {
    success: '¡Ahora mi página se lee como un libro! Título, subtítulos y párrafos en su lugar. 📖',
    retry: 'Revisa los niveles: h1 es el más grande, h2 más pequeño, y el texto va en <p>.',
  },
  reward: { xp: 20, coins: 10 },
  next: 'e1-04-enlaces-imagenes',
};
