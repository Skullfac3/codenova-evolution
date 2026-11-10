import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e2-05-modelo-caja',
  era: 2,
  order: 5,
  kind: 'lesson',
  title: 'El modelo de caja',
  topics: ['modelo de caja', 'margin', 'padding'],

  intro:
    'Cada puesto del mercado es una caja: el panadero guarda sus panes dentro, ' +
    'con aire alrededor para que no se aplasten, y deja espacio con el puesto ' +
    'de al lado. En CSS, cada elemento también es una caja. Y tú decides ' +
    'cuánto aire lleva dentro y cuánto espacio deja fuera.',

  concept: `
**Cada elemento es una caja con cuatro capas:**

- **Contenido** — el texto o la imagen de dentro.
- **padding** — el aire *dentro* de la caja, entre el contenido y el borde.
- **border** — el borde que rodea la caja.
- **margin** — la separación *fuera* de la caja, con sus vecinas.

\`\`\`css
.caja {
  border: 2px solid black;
  padding: 16px;
  margin: 12px;
}
\`\`\`

- \`border: 2px solid black;\` es grosor, estilo y color en una sola línea.
- \`padding: 16px;\` deja aire por los cuatro lados.
- \`margin-top: 24px;\` separa solo por arriba.
- \`border-radius: 8px;\` redondea las esquinas.
`.trim(),

  example: {
    code: `<style>
  .caja {
    border: 2px solid black;
    padding: 16px;
    margin: 12px;
  }
</style>
<div class="caja">
  <p>Una caja con aire.</p>
</div>`,
    output: ['Una caja con aire.'],
  },

  exercise: {
    id: 'e2-05-ex-main',
    language: 'html',
    prompt:
      'Dale a la caja un borde de 2px sólido negro, 16px de aire dentro (padding) y 12px de separación fuera (margin).',
    starterCode: `<style>
  .caja {
  }
</style>
<div class="caja">
  <p>Una caja con aire.</p>
</div>`,
    solution: `<style>
  .caja {
    border: 2px solid black;
    padding: 16px;
    margin: 12px;
  }
</style>
<div class="caja">
  <p>Una caja con aire.</p>
</div>`,
    checks: [
      {
        type: 'style-contains',
        pattern: '\\.caja\\s*\\{[^}]*border\\s*:\\s*2px\\s+solid\\s+black',
        message: 'La caja debe tener border: 2px solid black;.',
      },
      {
        type: 'style-contains',
        pattern: '\\.caja\\s*\\{[^}]*padding\\s*:\\s*16px',
        message: 'La caja debe tener padding: 16px;.',
      },
      {
        type: 'style-contains',
        pattern: '\\.caja\\s*\\{[^}]*margin\\s*:\\s*12px',
        message: 'La caja debe tener margin: 12px;.',
      },
      {
        type: 'html-contains',
        selector: '.caja p',
        text: 'Una caja con aire.',
        message: 'La caja debe contener el texto "Una caja con aire.".',
      },
    ],
    hints: [
      'Son tres declaraciones en la misma regla: border, padding y margin.',
      'El borde se escribe en una línea: border: 2px solid black;.',
    ],
  },

  extraChallenges: [
    {
      id: 'e2-05-ex-extra-1',
      language: 'html',
      prompt: 'Separa la caja 24px por arriba: agrega margin-top: 24px; a la regla .caja.',
      starterCode: `<style>
  .caja {
    border: 2px solid black;
    padding: 16px;
    margin: 12px;
  }
</style>
<div class="caja">
  <p>Una caja con aire.</p>
</div>
`,
      solution: `<style>
  .caja {
    border: 2px solid black;
    padding: 16px;
    margin: 12px;
    margin-top: 24px;
  }
</style>
<div class="caja">
  <p>Una caja con aire.</p>
</div>`,
      checks: [
        {
          type: 'style-contains',
          pattern: '\\.caja\\s*\\{[^}]*margin-top\\s*:\\s*24px',
          message: 'La caja debe tener margin-top: 24px;.',
        },
      ],
      hints: ['margin-top solo separa por arriba; margin ya separa por todos lados.'],
    },
    {
      id: 'e2-05-ex-extra-2',
      language: 'html',
      prompt: 'Redondea las esquinas de la caja: agrega border-radius: 8px; a la regla .caja.',
      starterCode: `<style>
  .caja {
    border: 2px solid black;
    padding: 16px;
    margin: 12px;
  }
</style>
<div class="caja">
  <p>Una caja con aire.</p>
</div>
`,
      solution: `<style>
  .caja {
    border: 2px solid black;
    padding: 16px;
    margin: 12px;
    border-radius: 8px;
  }
</style>
<div class="caja">
  <p>Una caja con aire.</p>
</div>`,
      checks: [
        {
          type: 'style-contains',
          pattern: '\\.caja\\s*\\{[^}]*border-radius\\s*:\\s*8px',
          message: 'La caja debe tener border-radius: 8px;.',
        },
      ],
      hints: ['border-radius redondea las esquinas: a más píxeles, más redonda la caja.'],
    },
  ],

  feedback: {
    success: '¡Caja perfecta! Con borde, aire dentro y espacio fuera: nada se aplasta en tu mercado. 📦',
    retry: 'Mmm, la caja no quedó como debe. Revisa: border es el borde, padding es el aire dentro y margin es la separación fuera.',
  },
  reward: { xp: 20, coins: 10 },
  next: 'e2-06-flexbox',
};
