import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e2-02-selectores',
  era: 2,
  order: 2,
  kind: 'lesson',
  title: 'Selectores',
  topics: ['selectores', 'clases', 'id'],

  intro:
    'La ciudad tiene muchos avisos, pero no todos deben verse igual: el aviso ' +
    'importante va en azul y los demás en gris. ¿Cómo le dices a CSS a cuál ' +
    'pintar? Con un **selector**: la forma de elegir exactamente a quién se ' +
    'aplica cada regla.',

  concept: `
**Un selector elige a qué elemento se aplica una regla.**

Hay tres selectores básicos:

- **Etiqueta**: \`p\` pinta *todos* los párrafos.
- **Clase**: \`.destacado\` pinta solo los elementos con \`class="destacado"\`.
- **Id**: \`#titulo\` pinta solo el elemento con \`id="titulo"\` (debe ser único).

\`\`\`css
p { color: gray; }
.destacado { color: blue; }
#titulo { color: gold; }
\`\`\`

- La clase lleva un **punto** delante: \`.destacado\`.
- El id lleva una **almohadilla**: \`#titulo\`.
- Una clase se puede reutilizar en muchos elementos; un id, solo en uno.
`.trim(),

  example: {
    code: `<style>
  .destacado {
    color: blue;
  }
</style>
<p>Un aviso normal.</p>
<p class="destacado">Un aviso importante.</p>`,
    output: ['Un aviso normal.', 'Un aviso importante.'],
  },

  exercise: {
    id: 'e2-02-ex-main',
    language: 'html',
    prompt:
      'Pinta de azul solo el aviso importante: escribe la regla .destacado { color: blue; }',
    starterCode: `<style>
  /* Escribe aquí la regla para la clase destacado */
</style>
<p>Un aviso normal.</p>
<p class="destacado">Un aviso importante.</p>`,
    solution: `<style>
  .destacado {
    color: blue;
  }
</style>
<p>Un aviso normal.</p>
<p class="destacado">Un aviso importante.</p>`,
    checks: [
      {
        type: 'style-contains',
        pattern: '\\.destacado\\s*\\{[^}]*color\\s*:\\s*blue',
        message: 'La regla .destacado debe tener color: blue;.',
      },
      {
        type: 'html-contains',
        selector: '.destacado',
        text: 'Un aviso importante.',
        message: 'El aviso importante debe tener la clase "destacado".',
      },
    ],
    hints: [
      'La clase se escribe con un punto delante: .destacado.',
      'El aviso normal no tiene clase, así que no se pinta: solo el importante.',
    ],
  },

  extraChallenges: [
    {
      id: 'e2-02-ex-extra-1',
      language: 'html',
      prompt: 'El nombre del mercado es único: pinta el título con id="titulo" de color dorado (gold).',
      starterCode: `<style>
  /* Escribe aquí la regla para el id titulo */
</style>
<h1 id="titulo">Mercado Central</h1>
<p>Abierto al amanecer.</p>
`,
      solution: `<style>
  #titulo {
    color: gold;
  }
</style>
<h1 id="titulo">Mercado Central</h1>
<p>Abierto al amanecer.</p>`,
      checks: [
        {
          type: 'style-contains',
          pattern: '#titulo\\s*\\{[^}]*color\\s*:\\s*gold',
          message: 'La regla #titulo debe tener color: gold;.',
        },
        {
          type: 'html-contains',
          selector: '#titulo',
          text: 'Mercado Central',
          message: 'El título debe tener id="titulo".',
        },
      ],
      hints: ['El id se escribe con una almohadilla delante: #titulo.'],
    },
    {
      id: 'e2-02-ex-extra-2',
      language: 'html',
      prompt: 'Pinta todos los párrafos de gris con el selector de etiqueta p.',
      starterCode: `<style>
  /* Escribe aquí la regla para todos los párrafos */
</style>
<p>Pan fresco.</p>
<p>Fruta del valle.</p>
`,
      solution: `<style>
  p {
    color: gray;
  }
</style>
<p>Pan fresco.</p>
<p>Fruta del valle.</p>`,
      checks: [
        {
          type: 'style-contains',
          pattern: 'p\\s*\\{[^}]*color\\s*:\\s*gray',
          message: 'La regla p debe tener color: gray;.',
        },
        {
          type: 'html-contains',
          selector: 'p',
          count: 2,
          message: 'Debe haber 2 párrafos.',
        },
      ],
      hints: ['El selector de etiqueta es solo la letra: p, sin punto ni almohadilla.'],
    },
  ],

  feedback: {
    success: '¡Exacto! El aviso importante brilla en azul y los demás se quedan tranquilos. 🎯',
    retry: 'Mmm, no se pintó lo que debía. Revisa el selector: punto para clase, almohadilla para id, nada para etiqueta.',
  },
  reward: { xp: 20, coins: 10 },
  next: 'e2-03-colores-fondos',
};
