import type { Lesson } from '../../../types/lesson';

export const lesson: Lesson = {
  id: 'e1-02-esqueleto-pagina',
  era: 1,
  order: 2,
  kind: 'lesson',
  title: 'El esqueleto de la página',
  topics: ['documento HTML', 'html', 'head', 'body', 'title'],

  intro:
    'Ya tenemos un título, pero una página necesita un esqueleto completo. ' +
    'Como el refugio, que tiene cimientos, paredes y techo: cada parte del documento tiene su lugar.',

  concept: `
**Toda página HTML tiene la misma estructura.**

\`\`\`html
<!DOCTYPE html>
<html>
  <head>
    <title>Mi refugio</title>
  </head>
  <body>
    <h1>Bienvenido</h1>
  </body>
</html>
\`\`\`

- \`<!DOCTYPE html>\` avisa que esto es una página web moderna.
- \`<html>\` envuelve **todo** el documento.
- \`<head>\` guarda datos que no se ven, como el \`<title>\` que aparece en la pestaña del navegador.
- \`<body>\` guarda **todo lo que sí se ve**: títulos, párrafos, imágenes y enlaces.

Si algo va fuera de \`<body>\`, el navegador no lo muestra. El esqueleto primero, el contenido después.
`.trim(),

  example: {
    code: `<!DOCTYPE html>
<html>
  <head>
    <title>Mi refugio</title>
  </head>
  <body>
    <h1>Mi refugio</h1>
    <p>Bienvenido a mi cueva.</p>
  </body>
</html>`,
    output: ['Mi refugio', 'Bienvenido a mi cueva.'],
  },

  exercise: {
    id: 'e1-02-ex-main',
    language: 'html',
    prompt:
      'Completa el esqueleto: ponle al documento el título "Mi refugio" ' +
      'y escribe dentro del cuerpo un título que diga "Bienvenido".',
    starterCode: `<!DOCTYPE html>
<html>
  <head>
    <title></title>
  </head>
  <body>
    <h1></h1>
  </body>
</html>`,
    solution: `<!DOCTYPE html>
<html>
  <head>
    <title>Mi refugio</title>
  </head>
  <body>
    <h1>Bienvenido</h1>
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
        text: 'Bienvenido',
        message: 'Dentro de <body> debe haber un <h1> que diga "Bienvenido".',
      },
    ],
    hints: [
      'El título del documento va entre <title> y </title>, dentro de <head>.',
      'El título visible va entre <h1> y </h1>, dentro de <body>.',
    ],
  },

  extraChallenges: [
    {
      id: 'e1-02-ex-extra-1',
      language: 'html',
      prompt: 'Dile al navegador que la página está en español: agrega lang="es" a la etiqueta <html>.',
      starterCode: `<!DOCTYPE html>
<html>
  <head>
    <title>Mi refugio</title>
  </head>
  <body>
    <h1>Bienvenido</h1>
  </body>
</html>`,
      solution: `<!DOCTYPE html>
<html lang="es">
  <head>
    <title>Mi refugio</title>
  </head>
  <body>
    <h1>Bienvenido</h1>
  </body>
</html>`,
      checks: [
        {
          type: 'html-contains',
          selector: 'html',
          attr: { name: 'lang', value: 'es' },
          message: 'La etiqueta <html> debe tener el atributo lang="es".',
        },
      ],
      hints: ['Los atributos van dentro de la etiqueta de apertura: <html lang="es">.'],
    },
    {
      id: 'e1-02-ex-extra-2',
      language: 'html',
      prompt: 'Agrega debajo del título un párrafo que diga: Aquí empieza mi página.',
      starterCode: `<!DOCTYPE html>
<html lang="es">
  <head>
    <title>Mi refugio</title>
  </head>
  <body>
    <h1>Bienvenido</h1>
  </body>
</html>`,
      solution: `<!DOCTYPE html>
<html lang="es">
  <head>
    <title>Mi refugio</title>
  </head>
  <body>
    <h1>Bienvenido</h1>
    <p>Aquí empieza mi página.</p>
  </body>
</html>`,
      checks: [
        {
          type: 'html-contains',
          selector: 'body p',
          text: 'Aquí empieza mi página.',
          message: 'Falta el párrafo "Aquí empieza mi página." dentro de <body>.',
        },
      ],
      hints: ['El párrafo va después de </h1>, pero antes de </body>.'],
    },
  ],

  feedback: {
    success: '¡El esqueleto está completo! Ahora mi página tiene cabeza, cuerpo y nombre propio. 🦴',
    retry: 'Revisa el esqueleto: el <title> va en <head> y lo visible va en <body>.',
  },
  reward: { xp: 20, coins: 10 },
  next: 'e1-03-titulos-parrafos',
};
