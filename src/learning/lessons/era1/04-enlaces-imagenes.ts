import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e1-04-enlaces-imagenes',
  era: 1,
  order: 4,
  kind: 'lesson',
  title: 'Enlaces e imágenes',
  topics: ['a', 'href', 'img', 'src', 'alt'],

  intro:
    'Mi página ya tiene palabras, pero está sola en la cueva. ' +
    'Los enlaces conectan mi página con otros lugares de la web, y las imágenes la llenan de color.',

  concept: `
**Los enlaces y las imágenes necesitan atributos.**

Los **atributos** son datos extra dentro de la etiqueta de apertura:

\`\`\`html
<a href="mapa.html">Ver el mapa</a>
<img src="fogata.png" alt="Fogata encendida">
\`\`\`

- \`<a href="...">\` crea un **enlace**. \`href\` dice **a dónde** lleva; el texto entre las etiquetas es lo que se ve y se puede pulsar.
- \`<img src="..." alt="...">\` muestra una **imagen**. \`src\` dice **dónde está** la imagen y \`alt\` describe lo que se ve: lo leen las personas que no pueden ver la imagen y aparece si la imagen no carga.
- \`<img>\` **no tiene etiqueta de cierre**: se cierra sola.

Un enlace sin \`href\` no lleva a ningún lado, y una imagen sin \`alt\` deja fuera a quien no la ve.
`.trim(),

  example: {
    code: `<a href="mapa.html">Cómo hacer una fogata</a>
<img src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64'%3E%3Ccircle cx='32' cy='32' r='28' fill='%23ff8a3d'/%3E%3C/svg%3E" alt="Fogata encendida">`,
    output: ['Cómo hacer una fogata'],
  },

  exercise: {
    id: 'e1-04-ex-main',
    language: 'html',
    prompt:
      'Conecta la página: ponle al enlace la dirección "mapa.html" ' +
      'y a la imagen el texto alternativo "Mi refugio".',
    starterCode: `<a href="">Visita el mapa</a>
<img src="refugio.png" alt="">`,
    solution: `<a href="mapa.html">Visita el mapa</a>
<img src="refugio.png" alt="Mi refugio">`,
    checks: [
      {
        type: 'html-contains',
        selector: 'a',
        attr: { name: 'href', value: 'mapa.html' },
        message: 'El enlace debe llevar a "mapa.html" (revisa el atributo href).',
      },
      {
        type: 'html-contains',
        selector: 'img',
        attr: { name: 'alt', value: 'Mi refugio' },
        message: 'La imagen debe tener alt="Mi refugio" (revisa el atributo alt).',
      },
    ],
    hints: [
      'Los atributos van dentro de la etiqueta: <a href="mapa.html">.',
      'alt es el texto que describe la imagen: alt="Mi refugio".',
    ],
  },

  extraChallenges: [
    {
      id: 'e1-04-ex-extra-1',
      language: 'html',
      prompt: 'Haz que el enlace se abra en una pestaña nueva: agrega target="_blank" al enlace.',
      starterCode: `<a href="mapa.html">Visita el mapa</a>
`,
      solution: `<a href="mapa.html" target="_blank">Visita el mapa</a>`,
      checks: [
        {
          type: 'html-contains',
          selector: 'a',
          attr: { name: 'target', value: '_blank' },
          message: 'El enlace debe tener target="_blank" para abrirse en una pestaña nueva.',
        },
      ],
      hints: ['target es otro atributo: va junto a href, dentro de la etiqueta <a>.'],
    },
    {
      id: 'e1-04-ex-extra-2',
      language: 'html',
      prompt: 'Agrega una segunda imagen: src="fogata.png" con alt "Fogata encendida".',
      starterCode: `<a href="mapa.html">Visita el mapa</a>
<img src="refugio.png" alt="Mi refugio">
<!-- Agrega la segunda imagen aquí -->
`,
      solution: `<a href="mapa.html">Visita el mapa</a>
<img src="refugio.png" alt="Mi refugio">
<img src="fogata.png" alt="Fogata encendida">`,
      checks: [
        {
          type: 'html-contains',
          selector: 'img',
          attr: { name: 'src', value: 'fogata.png' },
          message: 'Falta la imagen con src="fogata.png".',
        },
        {
          type: 'html-contains',
          selector: 'img',
          attr: { name: 'alt', value: 'Fogata encendida' },
          message: 'La segunda imagen debe tener alt="Fogata encendida".',
        },
      ],
      hints: ['Copia la línea de la primera imagen y cambia src y alt.'],
    },
  ],

  feedback: {
    success: '¡Mi página ya no está sola! Ahora conecta con el mapa y muestra imágenes. 🔗🖼️',
    retry: 'Revisa los atributos: href en el enlace, src y alt en la imagen.',
  },
  reward: { xp: 20, coins: 10 },
  next: 'e1-05-listas',
};
