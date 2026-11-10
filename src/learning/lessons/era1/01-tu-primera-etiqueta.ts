import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e1-01-tu-primera-etiqueta',
  era: 1,
  order: 1,
  kind: 'lesson',
  title: 'Tu primera etiqueta',
  topics: ['HTML', 'etiquetas', 'h1', 'p'],

  intro:
    'Proto-0 acaba de despertar entre las rocas. Todavía no sabe hablar con la tribu: ' +
    'necesita una página para contar quién es. Las páginas web se escriben con HTML, un lenguaje ' +
    'de etiquetas que le dice al navegador qué es cada cosa. ¡Vamos a escribir la primera!',

  concept: `
**HTML es el lenguaje con el que se escriben las páginas web.**

Una página es texto marcado con **etiquetas**. Una etiqueta se abre y se cierra, y lo que queda dentro es su contenido:

\`\`\`html
<h1>Mi refugio</h1>
\`\`\`

- \`<h1>\` es el **título principal** de la página.
- \`<p>\` marca un **párrafo** de texto.
- La etiqueta de cierre lleva una barra: \`</h1>\`.

El navegador lee las etiquetas y muestra la página: el título grande, el párrafo normal. Tú escribes las marcas; el navegador hace el dibujo.
`.trim(),

  example: {
    code: `<h1>Mi refugio</h1>
<p>Un lugar seguro entre las rocas.</p>`,
    output: ['Mi refugio', 'Un lugar seguro entre las rocas.'],
  },

  exercise: {
    id: 'e1-01-ex-main',
    language: 'html',
    prompt:
      'Proto-0 quiere presentarse. Dentro de la etiqueta <h1> escribe el título: Mi refugio',
    starterCode: `<h1>Escribe el título aquí</h1>`,
    solution: `<h1>Mi refugio</h1>`,
    checks: [
      {
        type: 'html-contains',
        selector: 'h1',
        text: 'Mi refugio',
        message: 'El título dentro de <h1> debe decir exactamente "Mi refugio".',
      },
    ],
    hints: [
      'El texto va entre <h1> y </h1>, no fuera de las etiquetas.',
      'Borra "Escribe el título aquí" y escribe "Mi refugio" en su lugar.',
    ],
  },

  extraChallenges: [
    {
      id: 'e1-01-ex-extra-1',
      language: 'html',
      prompt: 'Debajo del título, agrega un párrafo que diga: Aquí vive Proto-0.',
      starterCode: `<h1>Mi refugio</h1>
<!-- Escribe el párrafo debajo -->
`,
      solution: `<h1>Mi refugio</h1>
<p>Aquí vive Proto-0.</p>`,
      checks: [
        {
          type: 'html-contains',
          selector: 'h1',
          text: 'Mi refugio',
          message: 'El título <h1> debe seguir diciendo "Mi refugio".',
        },
        {
          type: 'html-contains',
          selector: 'p',
          text: 'Aquí vive Proto-0.',
          message: 'Falta el párrafo con el texto "Aquí vive Proto-0.".',
        },
      ],
      hints: ['Un párrafo se escribe con <p> y </p>, igual que el título pero con la letra p.'],
    },
    {
      id: 'e1-01-ex-extra-2',
      language: 'html',
      prompt: 'Cambia el título por: Cueva del Alba',
      starterCode: `<h1>Mi refugio</h1>
`,
      solution: `<h1>Cueva del Alba</h1>`,
      checks: [
        {
          type: 'html-contains',
          selector: 'h1',
          text: 'Cueva del Alba',
          message: 'El título debe decir ahora "Cueva del Alba".',
        },
      ],
      hints: ['Solo cambia el texto entre <h1> y </h1>; las etiquetas se quedan.'],
    },
  ],

  feedback: {
    success: '¡Bip-bup! Mi primera etiqueta está en su lugar. Ya sé cómo presentarme en la web. 🏠',
    retry: 'Mmm, el título no quedó como debe. Revisa que el texto esté entre <h1> y </h1>.',
  },
  reward: { xp: 20, coins: 10 },
  next: 'e1-02-esqueleto-pagina',
};
