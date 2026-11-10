import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e2-04-texto-tipografia',
  era: 2,
  order: 4,
  kind: 'lesson',
  title: 'Texto y tipografía',
  topics: ['texto', 'tipografía', 'font-size'],

  intro:
    'En la plaza hay un letrero que nadie lee: las letras son pequeñas y están ' +
    'pegadas a la izquierda. El escriba de la ciudad te enseña a vestir el ' +
    'texto: hacerlo grande, centrarlo y ponerlo en negrita.',

  concept: `
**Cuatro propiedades visten el texto:**

- \`font-size\` — el tamaño de la letra (en \`px\`).
- \`font-family\` — el tipo de letra (\`sans-serif\` es una letra sin adornos).
- \`font-weight\` — el grosor: \`bold\` es negrita.
- \`text-align\` — la alineación: \`left\`, \`center\` o \`right\`.

\`\`\`css
h1 {
  font-size: 32px;
  text-align: center;
}
p {
  font-weight: bold;
}
\`\`\`

- El tamaño se mide en \`px\` (píxeles): un título suele llevar 28px o más.
- \`text-align: center\` centra el texto dentro de su caja.
`.trim(),

  example: {
    code: `<style>
  h1 {
    font-size: 32px;
    text-align: center;
  }
</style>
<h1>Gran Mercado</h1>
<p>Abierto al amanecer.</p>`,
    output: ['Gran Mercado', 'Abierto al amanecer.'],
  },

  exercise: {
    id: 'e2-04-ex-main',
    language: 'html',
    prompt:
      'Haz el título grande y centrado: font-size: 32px; y text-align: center; en la regla h1.',
    starterCode: `<style>
  h1 {
  }
</style>
<h1>Gran Mercado</h1>
<p>Abierto al amanecer.</p>`,
    solution: `<style>
  h1 {
    font-size: 32px;
    text-align: center;
  }
</style>
<h1>Gran Mercado</h1>
<p>Abierto al amanecer.</p>`,
    checks: [
      {
        type: 'style-contains',
        pattern: 'h1\\s*\\{[^}]*font-size\\s*:\\s*32px',
        message: 'El título debe tener font-size: 32px;.',
      },
      {
        type: 'style-contains',
        pattern: 'h1\\s*\\{[^}]*text-align\\s*:\\s*center',
        message: 'El título debe tener text-align: center;.',
      },
      {
        type: 'html-contains',
        selector: 'h1',
        text: 'Gran Mercado',
        message: 'El título debe seguir diciendo "Gran Mercado".',
      },
    ],
    hints: [
      'El tamaño lleva su unidad: 32px, no solo 32.',
      'text-align: center; centra el texto dentro de su caja.',
    ],
  },

  extraChallenges: [
    {
      id: 'e2-04-ex-extra-1',
      language: 'html',
      prompt: 'Pon el párrafo en negrita: p { font-weight: bold; }.',
      starterCode: `<style>
  h1 {
    font-size: 32px;
    text-align: center;
  }
</style>
<h1>Gran Mercado</h1>
<p>Abierto al amanecer.</p>
`,
      solution: `<style>
  h1 {
    font-size: 32px;
    text-align: center;
  }
  p {
    font-weight: bold;
  }
</style>
<h1>Gran Mercado</h1>
<p>Abierto al amanecer.</p>`,
      checks: [
        {
          type: 'style-contains',
          pattern: 'p\\s*\\{[^}]*font-weight\\s*:\\s*bold',
          message: 'El párrafo debe tener font-weight: bold;.',
        },
      ],
      hints: ['font-weight: bold; es la negrita. Va en su propia regla para p.'],
    },
    {
      id: 'e2-04-ex-extra-2',
      language: 'html',
      prompt: 'Cambia la letra del título a una sin adornos: font-family: sans-serif;.',
      starterCode: `<style>
  h1 {
    font-size: 32px;
    text-align: center;
  }
</style>
<h1>Gran Mercado</h1>
`,
      solution: `<style>
  h1 {
    font-size: 32px;
    text-align: center;
    font-family: sans-serif;
  }
</style>
<h1>Gran Mercado</h1>`,
      checks: [
        {
          type: 'style-contains',
          pattern: 'h1\\s*\\{[^}]*font-family\\s*:\\s*sans-serif',
          message: 'El título debe tener font-family: sans-serif;.',
        },
      ],
      hints: ['sans-serif significa "sin adornos": las letras quedan limpias y modernas.'],
    },
  ],

  feedback: {
    success: '¡Ahora sí se lee! Grande, centrado y con presencia: un letrero digno de la plaza. 📜',
    retry: 'Mmm, el texto no cambió como debía. Revisa la propiedad, el valor y que todo esté dentro de la regla h1.',
  },
  reward: { xp: 20, coins: 10 },
  next: 'e2-05-modelo-caja',
};
