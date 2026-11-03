-- =====================================================================
-- CodeNova Evolution · Lecciones y objetos de la Era 2
-- Deben coincidir con src/learning/lessons/era2/*.ts
-- =====================================================================

insert into public.lessons (id, era_id, kind, title, sort_order, xp_reward, coin_reward) values
  ('e2-01-condicionales',      2, 'lesson',     'Condicionales: el camino se divide',          1, 25, 15),
  ('e2-02-operadores-logicos', 2, 'lesson',     'Más caminos: else if y operadores lógicos',   2, 25, 15),
  ('e2-03-ciclo-for',          2, 'lesson',     'Ciclo for: construir sin cansarse',           3, 25, 15),
  ('e2-04-ciclo-while',        2, 'lesson',     'Ciclo while: mientras sea necesario',         4, 25, 15),
  ('e2-05-funciones',          2, 'lesson',     'Funciones: recetas reutilizables',            5, 25, 15),
  ('e2-06-arreglos',           2, 'lesson',     'Arreglos: el almacén ordenado',               6, 25, 15),
  ('e2-07-objetos',            2, 'lesson',     'Objetos: fichas con propiedades',             7, 25, 15),
  ('e2-08-evaluacion',         2, 'evaluation', 'Evaluación de las Civilizaciones antiguas',   8, 60, 40);

insert into public.items (id, kind, name, price, era_id) values
  ('deco-anfora',     'decoration', 'Ánfora pintada',      15, 2),
  ('deco-fuente',     'decoration', 'Fuente de piedra',    35, 2),
  ('outfit-toga',     'outfit',     'Túnica de escriba',   45, 2),
  ('pet-gato-sagrado','pet',        'Gato del templo',     60, 2);
