import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e2-03-colores-fondos',
  era: 2,
  order: 3,
  kind: 'lesson',
  title: 'Colores y fondos',
  topics: ['colores', 'fondos', 'hex'],

  intro:
    'Los pintores de la ciudad guardan sus colores en dos frascos: uno para ' +
    'el texto y otro para el fondo. Proto-0 quiere una tarjeta que se vea ' +
    'desde la plaza: fondo dorado y letras blancas. ¿Cuál frasco es cuál?',

  concept: `
**Hay dos propiedades de color y no son lo mismo:**

- \`color\` pinta el **texto** del elemento.
- \`background-color\` pinta su **fondo**.

\`\`\`css
.tarjeta {
  background-color: gold;
  color: white;
}
\`\`\`

Los colores se escriben por **nombre** (\`red\`, \`gold\`, \`white\`) o en **hexadecimal** (\`#f59e0b\`, \`#ffffff\`): una almohadilla y 6 cifras que mezclan rojo, verde y azul.

- El fondo cubre toda la caja del elemento, no solo las letras.
- \`background-color\` en \`body\` pinta el fondo de toda la página.
`.trim(),

  example: {
    code: `<style>
  .tarjeta {
    background-color: gold;
    color: white;
  }
</style>
<div class="tarjeta">
  <p>Tarjeta del mercado</p>
</div>`,
    output: ['Tarjeta del mercado'],
  },

  exercise: {
    id: 'e2-03-ex-main',
    language: 'html',
    prompt:
      'Dale a la tarjeta fondo dorado y texto blanco: background-color: gold; y color: white; en la regla .tarjeta.',
    starterCode: `<style>
  .tarjeta {
  }
</style>
<div class="tarjeta">
  <p>Tarjeta del mercado</p>
</div>`,
    solution: `<style>
  .tarjeta {
    background-color: gold;
    color: white;
  }
</style>
<div class="tarjeta">
  <p>Tarjeta del mercado</p>
</div>`,
    checks: [
      {
        type: 'style-contains',
        pattern: '\\.tarjeta\\s*\\{[^}]*background-color\\s*:\\s*gold',
        message: 'La tarjeta debe tener background-color: gold;.',
      },
      {
        type: 'style-contains',
        pattern: '\\.tarjeta\\s*\\{[^}]*color\\s*:\\s*white',
        message: 'La tarjeta debe tener color: white; para que se lean las letras.',
      },
      {
        type: 'html-contains',
        selector: '.tarjeta p',
        text: 'Tarjeta del mercado',
        message: 'La tarjeta debe contener el texto "Tarjeta del mercado".',
      },
    ],
    hints: [
      'background-color es el fondo; color es el texto. La tarjeta necesita las dos.',
      'El orden no importa: primero el fondo, luego el texto, o al revés.',
    ],
  },

  extraChallenges: [
    {
      id: 'e2-03-ex-extra-1',
      language: 'html',
      prompt: 'Pinta el fondo de toda la página de color piedra clara: body { background-color: #f5f5f4; }.',
      starterCode: `<style>
  /* Escribe aquí la regla para el fondo de la página */
</style>
<h1>Plaza Mayor</h1>
<p>El centro de la ciudad.</p>
`,
      solution: `<style>
  body {
    background-color: #f5f5f4;
  }
</style>
<h1>Plaza Mayor</h1>
<p>El centro de la ciudad.</p>`,
      checks: [
        {
          type: 'style-contains',
          pattern: 'body\\s*\\{[^}]*background-color\\s*:\\s*#f5f5f4',
          message: 'La regla body debe tener background-color: #f5f5f4;.',
        },
      ],
      hints: ['El selector body elige la página entera. El color va en hexadecimal, con su almohadilla.'],
    },
    {
      id: 'e2-03-ex-extra-2',
      language: 'html',
      prompt: 'Pinta el título con el color ámbar en hexadecimal: #d97706.',
      starterCode: `<style>
  h1 {
  }
</style>
<h1>Atardecer en la plaza</h1>
`,
      solution: `<style>
  h1 {
    color: #d97706;
  }
</style>
<h1>Atardecer en la plaza</h1>`,
      checks: [
        {
          type: 'style-contains',
          pattern: 'h1\\s*\\{[^}]*color\\s*:\\s*#d97706',
          message: 'El título debe tener color: #d97706;.',
        },
      ],
      hints: ['En hexadecimal el color empieza con # y lleva 6 cifras: #d97706.'],
    },
  ],

  feedback: {
    success: '¡Qué tarjeta! Dorada por fuera, letras blancas por dentro: se ve desde la plaza. 🌅',
    retry: 'Mmm, el fondo o el texto no quedaron. Recuerda: background-color es el fondo y color es el texto.',
  },
  reward: { xp: 20, coins: 10 },
  next: 'e2-04-texto-tipografia',
};
