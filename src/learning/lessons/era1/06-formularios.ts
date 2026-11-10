import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e1-06-formularios',
  era: 1,
  order: 6,
  kind: 'lesson',
  title: 'Tu primer formulario',
  topics: ['form', 'input', 'button', 'placeholder'],

  intro:
    'La tribu quiere unirse a mi página: necesitan decirme su nombre. ' +
    'Para eso existen los formularios: la forma en que una página escucha a quien la visita.',

  concept: `
**Un formulario recoge datos de quien visita la página.**

\`\`\`html
<form>
  <input type="text" placeholder="Tu nombre">
  <button>Enviar</button>
</form>
\`\`\`

- \`<form>\` agrupa todo lo que el visitante va a llenar.
- \`<input type="text">\` es un **campo para escribir**. \`placeholder\` es el texto gris de ayuda que se ve antes de escribir (no es el valor, solo una pista).
- \`<button>\` es el **botón** para enviar el formulario. El texto entre las etiquetas es lo que se lee en el botón.

Por ahora el formulario no envía nada a ningún lado: estamos construyendo la puerta; en JavaScript y en PHP aprenderás a abrirla.
`.trim(),

  example: {
    code: `<form>
  <input type="text" placeholder="Tu nombre">
  <button>Enviar</button>
</form>`,
    output: ['Enviar'],
  },

  exercise: {
    id: 'e1-06-ex-main',
    language: 'html',
    prompt:
      'Arma el formulario de la tribu: agrega un campo de texto con placeholder "Tu nombre" ' +
      'y un botón que diga "Enviar".',
    starterCode: `<form>
  <!-- agrega aquí el campo y el botón -->
</form>`,
    solution: `<form>
  <input type="text" placeholder="Tu nombre">
  <button>Enviar</button>
</form>`,
    checks: [
      {
        type: 'html-contains',
        selector: 'form input',
        attr: { name: 'type', value: 'text' },
        message: 'Falta el campo de texto: un <input type="text"> dentro del formulario.',
      },
      {
        type: 'html-contains',
        selector: 'form input',
        attr: { name: 'placeholder', value: 'Tu nombre' },
        message: 'El campo debe tener placeholder="Tu nombre".',
      },
      {
        type: 'html-contains',
        selector: 'form button',
        text: 'Enviar',
        message: 'Falta el botón que diga "Enviar".',
      },
    ],
    hints: [
      'El campo se escribe <input type="text" placeholder="Tu nombre"> y no lleva cierre.',
      'El botón se escribe <button>Enviar</button>, dentro del formulario.',
    ],
  },

  extraChallenges: [
    {
      id: 'e1-06-ex-extra-1',
      language: 'html',
      prompt: 'Agrega un segundo campo para el correo: type="email" con placeholder "Tu correo".',
      starterCode: `<form>
  <input type="text" placeholder="Tu nombre">
  <button>Enviar</button>
</form>`,
      solution: `<form>
  <input type="text" placeholder="Tu nombre">
  <input type="email" placeholder="Tu correo">
  <button>Enviar</button>
</form>`,
      checks: [
        {
          type: 'html-contains',
          selector: 'form input',
          attr: { name: 'type', value: 'email' },
          message: 'Falta el campo de correo: un <input type="email">.',
        },
        {
          type: 'html-contains',
          selector: 'form input',
          attr: { name: 'placeholder', value: 'Tu correo' },
          message: 'El campo de correo debe tener placeholder="Tu correo".',
        },
      ],
      hints: ['Copia la línea del primer campo y cambia type a "email" y el placeholder a "Tu correo".'],
    },
    {
      id: 'e1-06-ex-extra-2',
      language: 'html',
      prompt: 'Ponle una etiqueta al campo del nombre: un <label> que diga "Nombre:".',
      starterCode: `<form>
  <input type="text" placeholder="Tu nombre">
  <button>Enviar</button>
</form>`,
      solution: `<form>
  <label>Nombre:</label>
  <input type="text" placeholder="Tu nombre">
  <button>Enviar</button>
</form>`,
      checks: [
        {
          type: 'html-contains',
          selector: 'form label',
          text: 'Nombre:',
          message: 'Falta la etiqueta <label> con el texto "Nombre:".',
        },
      ],
      hints: ['Un <label> es como un párrafo corto: <label>Nombre:</label>, antes del campo.'],
    },
  ],

  feedback: {
    success: '¡Formulario listo! Ahora la tribu puede presentarse. La puerta está construida. 📝',
    retry: 'Revisa el formulario: el campo va con <input>, el botón con <button>, todo dentro de <form>.',
  },
  reward: { xp: 20, coins: 10 },
  next: 'e1-07-evaluacion',
};
