import type { EraId, LessonKind } from '../types/lesson';

/**
 * Catálogo ligero de eras y lecciones: SOLO los metadatos que necesitan
 * el mapa, el refugio, la tienda, los perfiles y el progreso guardado
 * (título, temas, recompensa, orden, siguiente lección).
 *
 * El contenido completo de cada lección (intro, concepto, ejercicios,
 * quiz) vive en src/learning/lessons/era{N}/ y se carga bajo demanda
 * con loadLesson() — así la primera pantalla no tiene que bajar las
 * 34 lecciones a la vez. Este archivo es la única parte de las
 * lecciones que viaja en el paquete inicial.
 *
 * Para no duplicar datos a mano, el catálogo se generó a partir de las
 * lecciones completas y src/learning/catalog.test.ts comprueba en cada
 * cambio que los metadatos sigan siendo idénticos a las lecciones.
 */
export interface LessonMeta {
  id: string;
  era: EraId;
  order: number;
  kind: LessonKind;
  title: string;
  /** Conceptos que cubre (para el mapa de aprendizaje). */
  topics: string[];
  reward: { xp: number; coins: number };
  /** Siguiente desafío. */
  next: string | null;
}

export interface EraMeta {
  id: EraId;
  name: string;
  icon: string;
  /** Lecciones publicadas. Vacío = era anunciada pero sin contenido aún. */
  lessons: LessonMeta[];
  /** Qué viene en esta era, mientras no tiene lecciones. */
  teaser?: string;
}

export const ERAS: EraMeta[] = [
  {
    id: 1,
    name: "Prehistoria",
    icon: "🪨",
        lessons: [
      {
        id: "e1-01-tu-primera-etiqueta",
        era: 1,
        order: 1,
        kind: "lesson",
        title: "Tu primera etiqueta",
        topics: [
          "HTML",
          "etiquetas",
          "h1",
          "p"
        ],
        reward: {
          xp: 20,
          coins: 10
        },
        next: "e1-02-esqueleto-pagina"
      },
      {
        id: "e1-02-esqueleto-pagina",
        era: 1,
        order: 2,
        kind: "lesson",
        title: "El esqueleto de la página",
        topics: [
          "documento HTML",
          "html",
          "head",
          "body",
          "title"
        ],
        reward: {
          xp: 20,
          coins: 10
        },
        next: "e1-03-titulos-parrafos"
      },
      {
        id: "e1-03-titulos-parrafos",
        era: 1,
        order: 3,
        kind: "lesson",
        title: "Títulos y párrafos",
        topics: [
          "h1-h6",
          "p",
          "jerarquía"
        ],
        reward: {
          xp: 20,
          coins: 10
        },
        next: "e1-04-enlaces-imagenes"
      },
      {
        id: "e1-04-enlaces-imagenes",
        era: 1,
        order: 4,
        kind: "lesson",
        title: "Enlaces e imágenes",
        topics: [
          "a",
          "href",
          "img",
          "src",
          "alt"
        ],
        reward: {
          xp: 20,
          coins: 10
        },
        next: "e1-05-listas"
      },
      {
        id: "e1-05-listas",
        era: 1,
        order: 5,
        kind: "lesson",
        title: "Listas",
        topics: [
          "ul",
          "ol",
          "li"
        ],
        reward: {
          xp: 20,
          coins: 10
        },
        next: "e1-06-formularios"
      },
      {
        id: "e1-06-formularios",
        era: 1,
        order: 6,
        kind: "lesson",
        title: "Tu primer formulario",
        topics: [
          "form",
          "input",
          "button",
          "placeholder"
        ],
        reward: {
          xp: 20,
          coins: 10
        },
        next: "e1-07-evaluacion"
      },
      {
        id: "e1-07-evaluacion",
        era: 1,
        order: 7,
        kind: "evaluation",
        title: "Evaluación · HTML",
        topics: [
          "repaso HTML"
        ],
        reward: {
          xp: 50,
          coins: 30
        },
        next: "e2-01-tu-primera-regla"
      }
    ]
  },
  {
    id: 2,
    name: "Civilizaciones antiguas",
    icon: "🏛️",
        lessons: [
      {
        id: "e2-01-tu-primera-regla",
        era: 2,
        order: 1,
        kind: "lesson",
        title: "Tu primera regla",
        topics: [
          "CSS",
          "reglas",
          "color"
        ],
        reward: {
          xp: 20,
          coins: 10
        },
        next: "e2-02-selectores"
      },
      {
        id: "e2-02-selectores",
        era: 2,
        order: 2,
        kind: "lesson",
        title: "Selectores",
        topics: [
          "selectores",
          "clases",
          "id"
        ],
        reward: {
          xp: 20,
          coins: 10
        },
        next: "e2-03-colores-fondos"
      },
      {
        id: "e2-03-colores-fondos",
        era: 2,
        order: 3,
        kind: "lesson",
        title: "Colores y fondos",
        topics: [
          "colores",
          "fondos",
          "hex"
        ],
        reward: {
          xp: 20,
          coins: 10
        },
        next: "e2-04-texto-tipografia"
      },
      {
        id: "e2-04-texto-tipografia",
        era: 2,
        order: 4,
        kind: "lesson",
        title: "Texto y tipografía",
        topics: [
          "texto",
          "tipografía",
          "font-size"
        ],
        reward: {
          xp: 20,
          coins: 10
        },
        next: "e2-05-modelo-caja"
      },
      {
        id: "e2-05-modelo-caja",
        era: 2,
        order: 5,
        kind: "lesson",
        title: "El modelo de caja",
        topics: [
          "modelo de caja",
          "margin",
          "padding"
        ],
        reward: {
          xp: 20,
          coins: 10
        },
        next: "e2-06-flexbox"
      },
      {
        id: "e2-06-flexbox",
        era: 2,
        order: 6,
        kind: "lesson",
        title: "Flexbox",
        topics: [
          "flexbox",
          "display",
          "justify-content"
        ],
        reward: {
          xp: 20,
          coins: 10
        },
        next: "e2-07-tailwind"
      },
      {
        id: "e2-07-tailwind",
        era: 2,
        order: 7,
        kind: "lesson",
        title: "Tailwind CSS",
        topics: [
          "Tailwind",
          "clases de utilidad"
        ],
        reward: {
          xp: 20,
          coins: 10
        },
        next: "e2-08-evaluacion"
      },
      {
        id: "e2-08-evaluacion",
        era: 2,
        order: 8,
        kind: "evaluation",
        title: "Evaluación · CSS y Tailwind",
        topics: [
          "repaso CSS"
        ],
        reward: {
          xp: 50,
          coins: 30
        },
        next: "e3-01-que-es-programar"
      }
    ]
  },
  {
    id: 3,
    name: "Era industrial",
    icon: "⚙️",
        lessons: [
      {
        id: "e3-01-que-es-programar",
        era: 3,
        order: 1,
        kind: "lesson",
        title: "¿Qué es programar?",
        topics: [
          "programación",
          "instrucciones",
          "orden de ejecución"
        ],
        reward: {
          xp: 20,
          coins: 10
        },
        next: "e3-02-la-consola"
      },
      {
        id: "e3-02-la-consola",
        era: 3,
        order: 2,
        kind: "lesson",
        title: "La consola: la voz de tu código",
        topics: [
          "consola",
          "texto",
          "números",
          "comentarios"
        ],
        reward: {
          xp: 20,
          coins: 10
        },
        next: "e3-03-variables"
      },
      {
        id: "e3-03-variables",
        era: 3,
        order: 3,
        kind: "lesson",
        title: "Variables: cajas con nombre",
        topics: [
          "variables",
          "let",
          "reasignación",
          "nombres"
        ],
        reward: {
          xp: 20,
          coins: 10
        },
        next: "e3-04-constantes"
      },
      {
        id: "e3-04-constantes",
        era: 3,
        order: 4,
        kind: "lesson",
        title: "Constantes: grabado en piedra",
        topics: [
          "constantes",
          "const",
          "let vs const"
        ],
        reward: {
          xp: 20,
          coins: 10
        },
        next: "e3-05-tipos-de-datos"
      },
      {
        id: "e3-05-tipos-de-datos",
        era: 3,
        order: 5,
        kind: "lesson",
        title: "Tipos de datos",
        topics: [
          "string",
          "number",
          "boolean",
          "undefined",
          "null",
          "typeof"
        ],
        reward: {
          xp: 20,
          coins: 10
        },
        next: "e3-06-operadores"
      },
      {
        id: "e3-06-operadores",
        era: 3,
        order: 6,
        kind: "lesson",
        title: "Operadores",
        topics: [
          "aritméticos",
          "módulo",
          "asignación compuesta",
          "comparación"
        ],
        reward: {
          xp: 20,
          coins: 10
        },
        next: "e3-07-evaluacion"
      },
      {
        id: "e3-07-evaluacion",
        era: 3,
        order: 7,
        kind: "evaluation",
        title: "Evaluación intermedia · JavaScript",
        topics: [
          "repaso JavaScript · 1ª parte"
        ],
        reward: {
          xp: 50,
          coins: 30
        },
        next: "e3-08-condicionales"
      },
      {
        id: "e3-08-condicionales",
        era: 3,
        order: 8,
        kind: "lesson",
        title: "Condicionales: el camino se divide",
        topics: [
          "if",
          "else",
          "decisiones"
        ],
        reward: {
          xp: 25,
          coins: 15
        },
        next: "e3-09-operadores-logicos"
      },
      {
        id: "e3-09-operadores-logicos",
        era: 3,
        order: 9,
        kind: "lesson",
        title: "Más caminos: else if y operadores lógicos",
        topics: [
          "else if",
          "&&",
          "||",
          "!"
        ],
        reward: {
          xp: 25,
          coins: 15
        },
        next: "e3-10-ciclo-for"
      },
      {
        id: "e3-10-ciclo-for",
        era: 3,
        order: 10,
        kind: "lesson",
        title: "Ciclo for: construir sin cansarse",
        topics: [
          "for",
          "repetición",
          "contador"
        ],
        reward: {
          xp: 25,
          coins: 15
        },
        next: "e3-11-ciclo-while"
      },
      {
        id: "e3-11-ciclo-while",
        era: 3,
        order: 11,
        kind: "lesson",
        title: "Ciclo while: mientras sea necesario",
        topics: [
          "while",
          "ciclo infinito",
          "acumuladores"
        ],
        reward: {
          xp: 25,
          coins: 15
        },
        next: "e3-12-funciones"
      },
      {
        id: "e3-12-funciones",
        era: 3,
        order: 12,
        kind: "lesson",
        title: "Funciones: recetas reutilizables",
        topics: [
          "function",
          "parámetros",
          "return"
        ],
        reward: {
          xp: 25,
          coins: 15
        },
        next: "e3-13-arreglos"
      },
      {
        id: "e3-13-arreglos",
        era: 3,
        order: 13,
        kind: "lesson",
        title: "Arreglos: el almacén ordenado",
        topics: [
          "arreglos",
          "índices",
          "length",
          "push",
          "for...of"
        ],
        reward: {
          xp: 25,
          coins: 15
        },
        next: "e3-14-objetos"
      },
      {
        id: "e3-14-objetos",
        era: 3,
        order: 14,
        kind: "lesson",
        title: "Objetos: fichas con propiedades",
        topics: [
          "objetos",
          "propiedades",
          "notación de punto",
          "arreglos de objetos"
        ],
        reward: {
          xp: 25,
          coins: 15
        },
        next: "e3-20-metodos-arreglos"
      },
      {
        id: "e3-20-metodos-arreglos",
        era: 3,
        order: 15,
        kind: "lesson",
        title: "Métodos de arreglos: transformar sin repetir",
        topics: [
          "arreglos",
          "map",
          "filter",
          "forEach",
          "reduce"
        ],
        reward: {
          xp: 20,
          coins: 10
        },
        next: "e3-21-desestructuracion"
      },
      {
        id: "e3-21-desestructuracion",
        era: 3,
        order: 16,
        kind: "lesson",
        title: "Desestructuración: sacar valores sin rodeos",
        topics: [
          "desestructuracion",
          "arreglos",
          "objetos",
          "parametros"
        ],
        reward: {
          xp: 20,
          coins: 10
        },
        next: "e3-16-el-dom"
      },
      {
        id: "e3-16-el-dom",
        era: 3,
        order: 17,
        kind: "lesson",
        title: "El DOM: la página como un árbol",
        topics: [
          "DOM",
          "document",
          "querySelector",
          "textContent"
        ],
        reward: {
          xp: 20,
          coins: 10
        },
        next: "e3-17-eventos"
      },
      {
        id: "e3-17-eventos",
        era: 3,
        order: 18,
        kind: "lesson",
        title: "Eventos: la página te escucha",
        topics: [
          "eventos",
          "addEventListener",
          "clic",
          "teclado"
        ],
        reward: {
          xp: 20,
          coins: 10
        },
        next: "e3-18-json-fetch"
      },
      {
        id: "e3-18-json-fetch",
        era: 3,
        order: 19,
        kind: "lesson",
        title: "JSON y fetch: traer datos de internet",
        topics: [
          "JSON",
          "JSON.parse",
          "JSON.stringify",
          "fetch",
          "promesas"
        ],
        reward: {
          xp: 20,
          coins: 10
        },
        next: "e3-19-promesas-async"
      },
      {
        id: "e3-19-promesas-async",
        era: 3,
        order: 20,
        kind: "lesson",
        title: "Promesas y async/await: esperar sin bloquear",
        topics: [
          "promesas",
          "async",
          "await",
          "then"
        ],
        reward: {
          xp: 20,
          coins: 10
        },
        next: "e3-22-manejo-errores"
      },
      {
        id: "e3-22-manejo-errores",
        era: 3,
        order: 21,
        kind: "lesson",
        title: "Manejo de errores: que nada se rompa",
        topics: [
          "errores",
          "try-catch",
          "throw",
          "depuracion"
        ],
        reward: {
          xp: 20,
          coins: 10
        },
        next: "e3-23-clases"
      },
      {
        id: "e3-23-clases",
        era: 3,
        order: 22,
        kind: "lesson",
        title: "Clases: moldes para objetos",
        topics: [
          "clases",
          "constructor",
          "metodos",
          "this"
        ],
        reward: {
          xp: 20,
          coins: 10
        },
        next: "e3-24-modulos"
      },
      {
        id: "e3-24-modulos",
        era: 3,
        order: 23,
        kind: "lesson",
        title: "Módulos: cada pieza en su archivo",
        topics: [
          "modulos",
          "import",
          "export",
          "modularidad"
        ],
        reward: {
          xp: 20,
          coins: 10
        },
        next: "e3-25-proyecto-final"
      },
      {
        id: "e3-25-proyecto-final",
        era: 3,
        order: 24,
        kind: "lesson",
        title: "Proyecto final: tu mini app",
        topics: [
          "proyecto-final",
          "html",
          "css",
          "javascript",
          "integradora"
        ],
        reward: {
          xp: 20,
          coins: 10
        },
        next: "e3-15-evaluacion"
      },
      {
        id: "e3-15-evaluacion",
        era: 3,
        order: 25,
        kind: "evaluation",
        title: "Evaluación final · JavaScript",
        topics: [
          "repaso JavaScript · 2ª parte"
        ],
        reward: {
          xp: 60,
          coins: 40
        },
        next: null
      }
    ]
  },
  {
    id: 4,
    name: "Era digital",
    icon: "💻",
    teaser: "React: componentes e interfaces",
    lessons: []
  },
  {
    id: 5,
    name: "Era futurista",
    icon: "🚀",
    teaser: "TypeScript y Next.js: la web profesional",
    lessons: []
  }
];

export const allLessons: LessonMeta[] = ERAS.flatMap((e) => e.lessons);

export const findLesson = (id: string) => allLessons.find((l) => l.id === id);
export const lessonsOfEra = (era: number) => ERAS.find((e) => e.id === era)?.lessons ?? [];
export const eraById = (era: number) => ERAS.find((e) => e.id === era);
