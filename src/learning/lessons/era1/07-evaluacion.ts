import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e1-07-evaluacion',
  era: 1,
  order: 7,
  kind: 'evaluation',
  title: 'Evaluación · HTML',
  topics: ['repaso HTML'],

  intro:
    'El gran fuego del consejo está encendido. Si demuestras lo que aprendiste, ' +
    'seguirás hacia la Era 2, donde tu página ganará colores y estilo con CSS.',

  concept: `
Esta evaluación tiene **5 preguntas** y **un ejercicio práctico**.

- Preguntas: 60 % de la calificación.
- Ejercicio práctico: 40 % y es **obligatorio** para aprobar.
- Necesitas **60 puntos** para seguir. Puedes repetirla las veces que quieras.
`.trim(),

  example: { code: '', output: [] },

  quiz: [
    {
      prompt: '¿Qué es HTML?',
      options: [
        'El lenguaje de marcas para escribir páginas web',
        'Un lenguaje para programar servidores',
        'Una hoja de estilos',
        'Una base de datos',
      ],
      correctIndex: 0,
      explanation: 'HTML son las marcas (etiquetas) con las que se escribe la estructura de una página web.',
    },
    {
      prompt: '¿Qué etiqueta es el título principal de una página?',
      options: ['<h1>', '<h2>', '<p>', '<title>'],
      correctIndex: 0,
      explanation: 'El título principal es <h1> y solo debe haber uno por página.',
    },
    {
      prompt: '¿Dónde vive todo lo que se ve en una página?',
      options: ['En <body>', 'En <head>', 'En <title>', 'En <html lang>'],
      correctIndex: 0,
      explanation: 'Todo lo visible va dentro de <body>; <head> guarda datos que no se ven.',
    },
    {
      prompt: '¿Qué atributo lleva la dirección de un enlace?',
      options: ['href', 'src', 'alt', 'class'],
      correctIndex: 0,
      explanation: 'href dice a dónde lleva el enlace; src es para imágenes y alt las describe.',
    },
    {
      prompt: '¿Cómo se escribe un elemento de una lista?',
      options: ['<li>texto</li>', '<ul>texto</ul>', '<ol>texto</ol>', '<list>texto</list>'],
      correctIndex: 0,
      explanation: 'Cada elemento de una lista va en <li>; <ul> y <ol> son la lista completa.',
    },
  ],

  exercise: {
    id: 'e1-07-ex-practical',
    language: 'html',
    prompt:
      'Arma la mini página de tu refugio:\n' +
      '1. El documento se titula "Mi refugio" (el <title>).\n' +
      '2. Un título principal <h1> que diga "Mi refugio".\n' +
      '3. Un párrafo que diga "Un lugar seguro entre las rocas.".\n' +
      '4. Una lista con 3 materiales: Ramas, Piedras y Hojas.\n' +
      '5. Un enlace a "mapa.html" con el texto "Ver el mapa".',
    starterCode: `<!DOCTYPE html>
<html lang="es">
  <head>
    <title></title>
  </head>
  <body>
    <!-- Arma aquí tu página -->
  </body>
</html>`,
    solution: `<!DOCTYPE html>
<html lang="es">
  <head>
    <title>Mi refugio</title>
  </head>
  <body>
    <h1>Mi refugio</h1>
    <p>Un lugar seguro entre las rocas.</p>
    <ul>
      <li>Ramas</li>
      <li>Piedras</li>
      <li>Hojas</li>
    </ul>
    <a href="mapa.html">Ver el mapa</a>
  </body>
</html>`,
    checks: [
      {
        type: 'html-contains',
        selector: 'title',
        text: 'Mi refugio',
        message: 'El <title> del documento debe decir "Mi refugio".',
      },
      {
        type: 'html-contains',
        selector: 'body h1',
        text: 'Mi refugio',
        message: 'El título principal <h1> debe decir "Mi refugio".',
      },
      {
        type: 'html-contains',
        selector: 'body p',
        text: 'Un lugar seguro entre las rocas.',
        message: 'Falta el párrafo "Un lugar seguro entre las rocas.".',
      },
      {
        type: 'html-contains',
        selector: 'ul li',
        count: 3,
        message: 'La lista debe tener exactamente 3 materiales.',
      },
      {
        type: 'html-contains',
        selector: 'a',
        attr: { name: 'href', value: 'mapa.html' },
        message: 'El enlace debe llevar a "mapa.html".',
      },
      {
        type: 'html-contains',
        selector: 'a',
        text: 'Ver el mapa',
        message: 'El enlace debe decir "Ver el mapa".',
      },
    ],
    hints: [
      'Ve paso por paso, en el mismo orden de las instrucciones.',
      'El título del documento va en <head>; todo lo demás, en <body>.',
    ],
  },
  extraChallenges: [],

  feedback: {
    success: '¡Lo lograste! Tu primera página está completa y el camino a la Era 2 se abre. La tribu celebra. 🏕️✨',
    retry: 'Casi. Repasa las lecciones marcadas y vuelve al fuego del consejo cuando quieras.',
  },
  reward: { xp: 50, coins: 30 },
  // La Era 2 aún no tiene lecciones: cuando las tenga, esta evaluación
  // apuntará a su primera lección (mismo patrón que la Era 3).
  next: null,
};
