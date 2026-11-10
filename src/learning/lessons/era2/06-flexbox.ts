import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e2-06-flexbox',
  era: 2,
  order: 6,
  kind: 'lesson',
  title: 'Flexbox',
  topics: ['flexbox', 'display', 'justify-content'],

  intro:
    'Los puestos del mercado se ponen uno debajo del otro y la plaza se ve ' +
    'desordenada. La arquitecta de la ciudad tiene un truco: una fila flexible ' +
    'que alinea los puestos sola. Se llama **flexbox**, y es la forma favorita ' +
    'de ordenar elementos en la web.',

  concept: `
**Flexbox ordena los hijos de un contenedor en fila.**

- \`display: flex;\` en el contenedor convierte a sus hijos en una fila flexible.
- \`justify-content\` alinea en horizontal: \`center\` los centra, \`space-between\` los reparte.
- \`align-items\` alinea en vertical: \`center\` los centra en alto.
- \`gap\` deja espacio entre los hijos.
- \`flex-direction: column;\` cambia la fila por una columna.

\`\`\`css
.fila {
  display: flex;
  justify-content: center;
  gap: 8px;
}
\`\`\`

- Las reglas van en el **contenedor** (.fila), no en cada puesto.
- Sin flexbox, los bloques se apilan uno debajo del otro; con flexbox, se ponen en fila.
`.trim(),

  example: {
    code: `<style>
  .fila {
    display: flex;
    justify-content: center;
    gap: 8px;
  }
  .puesto {
    background-color: gold;
    padding: 8px;
  }
</style>
<div class="fila">
  <div class="puesto"><p>Pan</p></div>
  <div class="puesto"><p>Fruta</p></div>
  <div class="puesto"><p>Flores</p></div>
</div>`,
    output: ['Pan', 'Fruta', 'Flores'],
  },

  exercise: {
    id: 'e2-06-ex-main',
    language: 'html',
    prompt:
      'Pon los puestos en fila y centrados: display: flex; y justify-content: center; en la regla .fila.',
    starterCode: `<style>
  .fila {
  }
  .puesto {
    background-color: gold;
    padding: 8px;
  }
</style>
<div class="fila">
  <div class="puesto"><p>Pan</p></div>
  <div class="puesto"><p>Fruta</p></div>
  <div class="puesto"><p>Flores</p></div>
</div>`,
    solution: `<style>
  .fila {
    display: flex;
    justify-content: center;
  }
  .puesto {
    background-color: gold;
    padding: 8px;
  }
</style>
<div class="fila">
  <div class="puesto"><p>Pan</p></div>
  <div class="puesto"><p>Fruta</p></div>
  <div class="puesto"><p>Flores</p></div>
</div>`,
    checks: [
      {
        type: 'style-contains',
        pattern: '\\.fila\\s*\\{[^}]*display\\s*:\\s*flex',
        message: 'La fila debe tener display: flex;.',
      },
      {
        type: 'style-contains',
        pattern: '\\.fila\\s*\\{[^}]*justify-content\\s*:\\s*center',
        message: 'La fila debe tener justify-content: center;.',
      },
      {
        type: 'html-contains',
        selector: '.fila .puesto',
        count: 3,
        message: 'La fila debe tener 3 puestos.',
      },
    ],
    hints: [
      'display: flex; va en el contenedor (.fila), no en cada puesto.',
      'justify-content: center; centra la fila en horizontal.',
    ],
  },

  extraChallenges: [
    {
      id: 'e2-06-ex-extra-1',
      language: 'html',
      prompt: 'Separa los puestos con 8px: agrega gap: 8px; a la regla .fila.',
      starterCode: `<style>
  .fila {
    display: flex;
    justify-content: center;
  }
  .puesto {
    background-color: gold;
    padding: 8px;
  }
</style>
<div class="fila">
  <div class="puesto"><p>Pan</p></div>
  <div class="puesto"><p>Fruta</p></div>
  <div class="puesto"><p>Flores</p></div>
</div>
`,
      solution: `<style>
  .fila {
    display: flex;
    justify-content: center;
    gap: 8px;
  }
  .puesto {
    background-color: gold;
    padding: 8px;
  }
</style>
<div class="fila">
  <div class="puesto"><p>Pan</p></div>
  <div class="puesto"><p>Fruta</p></div>
  <div class="puesto"><p>Flores</p></div>
</div>`,
      checks: [
        {
          type: 'style-contains',
          pattern: '\\.fila\\s*\\{[^}]*gap\\s*:\\s*8px',
          message: 'La fila debe tener gap: 8px;.',
        },
      ],
      hints: ['gap deja el mismo espacio entre todos los hijos de la fila.'],
    },
    {
      id: 'e2-06-ex-extra-2',
      language: 'html',
      prompt: 'Cambia la fila a columna: agrega flex-direction: column; a la regla .fila.',
      starterCode: `<style>
  .fila {
    display: flex;
    justify-content: center;
  }
  .puesto {
    background-color: gold;
    padding: 8px;
  }
</style>
<div class="fila">
  <div class="puesto"><p>Pan</p></div>
  <div class="puesto"><p>Fruta</p></div>
  <div class="puesto"><p>Flores</p></div>
</div>
`,
      solution: `<style>
  .fila {
    display: flex;
    justify-content: center;
    flex-direction: column;
  }
  .puesto {
    background-color: gold;
    padding: 8px;
  }
</style>
<div class="fila">
  <div class="puesto"><p>Pan</p></div>
  <div class="puesto"><p>Fruta</p></div>
  <div class="puesto"><p>Flores</p></div>
</div>`,
      checks: [
        {
          type: 'style-contains',
          pattern: '\\.fila\\s*\\{[^}]*flex-direction\\s*:\\s*column',
          message: 'La fila debe tener flex-direction: column;.',
        },
      ],
      hints: ['flex-direction: column; apila los puestos de arriba a abajo.'],
    },
  ],

  feedback: {
    success: '¡La plaza quedó ordenada! Los puestos en fila, centrados y con espacio: la ciudad respira. 🏛️',
    retry: 'Mmm, los puestos siguen apilados. Revisa que display: flex; esté en la regla .fila, la del contenedor.',
  },
  reward: { xp: 20, coins: 10 },
  next: 'e2-07-tailwind',
};
