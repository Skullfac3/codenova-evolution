import type { Lesson } from '../../../types/lesson';

/**
 * Mini Tailwind: un puñado de clases de utilidad ya definidas en <style>.
 * La vista previa no carga internet (el iframe tiene sandbox sin permisos),
 * así que el Tailwind real no puede descargarse: estas reglas imitan las
 * utilidades que se enseñan, con los mismos nombres y valores.
 */
const MINI_TAILWIND = `  /* Mini Tailwind: estas clases ya existen. Solo úsalas en class="...". */
  .bg-amber-600 { background-color: #d97706; }
  .bg-stone-100 { background-color: #f5f5f4; }
  .text-white { color: #ffffff; }
  .text-stone-800 { color: #292524; }
  .p-4 { padding: 16px; }
  .p-2 { padding: 8px; }
  .rounded { border-radius: 8px; }
  .text-center { text-align: center; }
  .font-bold { font-weight: bold; }
  .text-lg { font-size: 20px; }`;

export const lesson: Lesson = {
  id: 'e2-07-tailwind',
  era: 2,
  order: 7,
  kind: 'lesson',
  title: 'Tailwind CSS',
  topics: ['Tailwind', 'clases de utilidad'],

  intro:
    'Escribir reglas una por una es lento cuando la ciudad crece. Los ' +
    'constructores modernos usan **Tailwind CSS**: en vez de inventar ' +
    'reglas, visten cada elemento con **clases de utilidad** que ya existen. ' +
    'Un título con fondo ámbar, letras blancas y aire se viste en una sola línea.',

  concept: `
**Tailwind pone el estilo en el atributo class, no en <style>.**

Cada clase es una utilidad con un solo trabajo:

- \`bg-amber-600\` — fondo ámbar.
- \`text-white\` — texto blanco.
- \`p-4\` — aire de 16px dentro.
- \`rounded\` — esquinas redondeadas.
- \`text-center\` — texto centrado.
- \`font-bold\` — negrita.

\`\`\`html
<h1 class="bg-amber-600 text-white p-4 rounded">Mercado Central</h1>
\`\`\`

- Las clases se separan con **espacios** dentro de \`class="..."\`.
- \`bg-\` es fondo, \`text-\` es color de texto, \`p-\` es aire.
- Aquí usamos un **mini Tailwind**: unas reglas ya escritas en \`<style>\` que definen estas clases, porque la vista previa no carga internet y el Tailwind real no puede descargarse. Los nombres y los valores son los mismos.
`.trim(),

  example: {
    code: `<style>
${MINI_TAILWIND}
</style>
<h1 class="bg-amber-600 text-white p-4 rounded">Mercado Central</h1>`,
    output: ['Mercado Central'],
  },

  exercise: {
    id: 'e2-07-ex-main',
    language: 'html',
    prompt:
      'Viste el título con Tailwind: en class="" escribe bg-amber-600 text-white p-4 rounded.',
    starterCode: `<style>
${MINI_TAILWIND}
</style>
<h1 class="">Mercado Central</h1>
<p>Abierto al amanecer.</p>`,
    solution: `<style>
${MINI_TAILWIND}
</style>
<h1 class="bg-amber-600 text-white p-4 rounded">Mercado Central</h1>
<p>Abierto al amanecer.</p>`,
    checks: [
      {
        type: 'code-matches',
        pattern: 'class="[^"]*bg-amber-600',
        message: 'El título debe llevar la clase bg-amber-600 en su class="...".',
      },
      {
        type: 'code-matches',
        pattern: 'class="[^"]*text-white',
        message: 'El título debe llevar la clase text-white en su class="...".',
      },
      {
        type: 'code-matches',
        pattern: 'class="[^"]*p-4',
        message: 'El título debe llevar la clase p-4 en su class="...".',
      },
      {
        type: 'code-matches',
        pattern: 'class="[^"]*rounded',
        message: 'El título debe llevar la clase rounded en su class="...".',
      },
      {
        type: 'html-contains',
        selector: 'h1',
        text: 'Mercado Central',
        message: 'El título debe seguir diciendo "Mercado Central".',
      },
    ],
    hints: [
      'Las clases van dentro de class="", separadas con espacios.',
      'El orden no importa: bg-amber-600 text-white p-4 rounded.',
    ],
  },

  extraChallenges: [
    {
      id: 'e2-07-ex-extra-1',
      language: 'html',
      prompt: 'Viste la tarjeta con Tailwind: en class="" escribe bg-stone-100 p-4 rounded.',
      starterCode: `<style>
${MINI_TAILWIND}
</style>
<h1 class="bg-amber-600 text-white p-4 rounded">Mercado Central</h1>
<div class="">
  <p>Pan fresco todos los días.</p>
</div>
`,
      solution: `<style>
${MINI_TAILWIND}
</style>
<h1 class="bg-amber-600 text-white p-4 rounded">Mercado Central</h1>
<div class="bg-stone-100 p-4 rounded">
  <p>Pan fresco todos los días.</p>
</div>`,
      checks: [
        {
          type: 'code-matches',
          pattern: 'class="[^"]*bg-stone-100',
          message: 'La tarjeta debe llevar la clase bg-stone-100.',
        },
        {
          type: 'code-matches',
          pattern: 'class="[^"]*p-4',
          message: 'La tarjeta debe llevar la clase p-4.',
        },
        {
          type: 'code-matches',
          pattern: 'class="[^"]*rounded',
          message: 'La tarjeta debe llevar la clase rounded.',
        },
        {
          type: 'html-contains',
          selector: 'div p',
          text: 'Pan fresco todos los días.',
          message: 'La tarjeta debe contener el texto "Pan fresco todos los días.".',
        },
      ],
      hints: ['bg-stone-100 es el fondo piedra clara. La tarjeta ya tiene class="": solo faltan las clases.'],
    },
    {
      id: 'e2-07-ex-extra-2',
      language: 'html',
      prompt: 'Centra el título y ponlo en negrita: agrega text-center font-bold a su class.',
      starterCode: `<style>
${MINI_TAILWIND}
</style>
<h1 class="bg-amber-600 text-white p-4 rounded">Mercado Central</h1>
`,
      solution: `<style>
${MINI_TAILWIND}
</style>
<h1 class="bg-amber-600 text-white p-4 rounded text-center font-bold">Mercado Central</h1>`,
      checks: [
        {
          type: 'code-matches',
          pattern: 'class="[^"]*text-center',
          message: 'El título debe llevar la clase text-center.',
        },
        {
          type: 'code-matches',
          pattern: 'class="[^"]*font-bold',
          message: 'El título debe llevar la clase font-bold.',
        },
      ],
      hints: ['Las clases viejas se quedan: solo agrega text-center y font-bold al final.'],
    },
  ],

  feedback: {
    success: '¡Qué velocidad! Un título vestido con cuatro clases y sin escribir una sola regla. Así construyen los profesionales. ⚡',
    retry: 'Mmm, el título no se vistió. Revisa que las clases estén dentro de class="" y separadas con espacios.',
  },
  reward: { xp: 20, coins: 10 },
  next: 'e2-08-evaluacion',
};
