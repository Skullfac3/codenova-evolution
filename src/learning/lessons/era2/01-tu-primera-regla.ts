import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e2-01-tu-primera-regla',
  era: 2,
  order: 1,
  kind: 'lesson',
  title: 'Tu primera regla',
  topics: ['CSS', 'reglas', 'color'],

  intro:
    'La tribu levantó la ciudad: templos de piedra, plazas y mercados. ' +
    'Pero todo se ve gris. Proto-0 encontró pintura: CSS, el lenguaje que ' +
    'da color y forma a las páginas. ¡Vamos a pintar el primer templo!',

  concept: `
**CSS es el lenguaje que da estilo a una página web.**

HTML dice *qué* hay en la página; CSS dice *cómo se ve*. Un estilo se escribe con una **regla**: un selector y, entre llaves, las declaraciones:

\`\`\`css
h1 {
  color: red;
}
\`\`\`

- \`h1\` es el **selector**: elige a quién se aplica la regla.
- \`color: red;\` es una **declaración**: propiedad, dos puntos, valor y punto y coma.
- Las reglas viven dentro de \`<style>\`, en el \`<head>\` de la página.

La vista previa te muestra el resultado al instante: pinta, mira y corrige.
`.trim(),

  example: {
    code: `<style>
  h1 {
    color: red;
  }
</style>
<h1>Templo del Sol</h1>
<p>La ciudad por fin tiene color.</p>`,
    output: ['Templo del Sol', 'La ciudad por fin tiene color.'],
  },

  exercise: {
    id: 'e2-01-ex-main',
    language: 'html',
    prompt:
      'Pinta el título de rojo: dentro de <style>, escribe la regla h1 { color: red; }',
    starterCode: `<style>
  h1 {
  }
</style>
<h1>Templo del Sol</h1>`,
    solution: `<style>
  h1 {
    color: red;
  }
</style>
<h1>Templo del Sol</h1>`,
    checks: [
      {
        type: 'style-contains',
        pattern: 'h1\\s*\\{[^}]*color\\s*:\\s*red',
        message: 'La regla h1 debe tener color: red; dentro de <style>.',
      },
      {
        type: 'html-contains',
        selector: 'h1',
        text: 'Templo del Sol',
        message: 'El título <h1> debe seguir diciendo "Templo del Sol".',
      },
    ],
    hints: [
      'La regla va dentro de <style>, entre las llaves de h1.',
      'Escribe color: red; con los dos puntos y el punto y coma.',
    ],
  },

  extraChallenges: [
    {
      id: 'e2-01-ex-extra-1',
      language: 'html',
      prompt: 'Debajo del título, agrega un párrafo que diga "La ciudad por fin tiene color." y píntalo de azul.',
      starterCode: `<style>
  h1 {
    color: red;
  }
</style>
<h1>Templo del Sol</h1>
<!-- Escribe el párrafo debajo -->
`,
      solution: `<style>
  h1 {
    color: red;
  }
  p {
    color: blue;
  }
</style>
<h1>Templo del Sol</h1>
<p>La ciudad por fin tiene color.</p>`,
      checks: [
        {
          type: 'style-contains',
          pattern: 'h1\\s*\\{[^}]*color\\s*:\\s*red',
          message: 'El título debe seguir en rojo.',
        },
        {
          type: 'html-contains',
          selector: 'p',
          text: 'La ciudad por fin tiene color.',
          message: 'Falta el párrafo "La ciudad por fin tiene color.".',
        },
        {
          type: 'style-contains',
          pattern: 'p\\s*\\{[^}]*color\\s*:\\s*blue',
          message: 'La regla p debe tener color: blue;.',
        },
      ],
      hints: ['El párrafo es un elemento nuevo: necesita su propia regla, p { color: blue; }.'],
    },
    {
      id: 'e2-01-ex-extra-2',
      language: 'html',
      prompt: 'Cambia el color del título a verde.',
      starterCode: `<style>
  h1 {
    color: red;
  }
</style>
<h1>Templo del Sol</h1>
`,
      solution: `<style>
  h1 {
    color: green;
  }
</style>
<h1>Templo del Sol</h1>`,
      checks: [
        {
          type: 'style-contains',
          pattern: 'h1\\s*\\{[^}]*color\\s*:\\s*green',
          message: 'La regla h1 debe tener ahora color: green;.',
        },
      ],
      hints: ['Solo cambia el valor: de red a green. La propiedad color se queda.'],
    },
  ],

  feedback: {
    success: '¡Bip-bup! El templo ya no es gris. Una regla y la ciudad empezó a tener color. 🎨',
    retry: 'Mmm, el título sigue gris. Revisa que la regla esté dentro de <style> y que diga color: red;.',
  },
  reward: { xp: 20, coins: 10 },
  next: 'e2-02-selectores',
};
