-- =====================================================================
-- CodeNova Evolution · Objetos de la Era 3 (Era industrial)
-- Deben coincidir con src/game/items.ts
-- =====================================================================

insert into public.items (id, kind, name, price, era_id) values
  ('deco-farol',     'decoration', 'Farol de gas',        25, 3),
  ('deco-engrane',   'decoration', 'Engrane gigante',     30, 3),
  ('deco-yunque',    'decoration', 'Yunque y martillo',   40, 3),
  ('outfit-overol',  'outfit',     'Overol de mecánico',  55, 3),
  ('pet-paloma',     'pet',        'Paloma mensajera',    70, 3),
  ('pet-perro',      'pet',        'Perro de taller',     90, 3)
on conflict (id) do nothing;
