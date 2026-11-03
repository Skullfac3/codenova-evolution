-- =====================================================================
-- CodeNova Evolution · Migración inicial (Fase 4: cuentas y persistencia)
-- =====================================================================
-- Principios del esquema:
--   1. Cada usuario solo ve y modifica SU partida (Row Level Security).
--   2. El cliente NUNCA escribe XP, NovaCoins, inventario ni eras.
--      Esas tablas solo cambian a través de funciones RPC que validan
--      en el servidor (complete_lesson, purchase_item, unlock_next_era…).
--   3. Las recompensas son idempotentes: cada lección paga una sola vez,
--      aunque el cliente reintente al sincronizar desde modo offline.
--   4. Datos mínimos de menores: solo rango de edad, nunca fecha exacta.
-- =====================================================================

-- ---------------------------------------------------------------------
-- 1. CATÁLOGOS (contenido del juego, de solo lectura para usuarios)
-- ---------------------------------------------------------------------

create table public.eras (
  id          smallint primary key,
  slug        text not null unique,
  name        text not null,
  sort_order  smallint not null unique
);

create table public.lessons (
  id            text primary key,                -- p. ej. 'e1-03-variables'
  era_id        smallint not null references public.eras(id),
  kind          text not null default 'lesson'
                check (kind in ('lesson', 'evaluation', 'project')),
  title         text not null,
  sort_order    smallint not null,
  xp_reward     int not null check (xp_reward between 0 and 500),
  coin_reward   int not null check (coin_reward between 0 and 500),
  pass_score    smallint not null default 60 check (pass_score between 0 and 100),
  is_published  boolean not null default true,
  unique (era_id, sort_order)
);

create table public.items (
  id         text primary key,                   -- p. ej. 'pet-dodo'
  kind       text not null check (kind in ('decoration', 'outfit', 'pet', 'accessory')),
  name       text not null,
  price      int not null check (price >= 0),
  era_id     smallint not null references public.eras(id),
  is_active  boolean not null default true
);

-- ---------------------------------------------------------------------
-- 2. DATOS DEL JUGADOR
-- ---------------------------------------------------------------------

create table public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  explorer_name  text not null default 'Explorador'
                 check (char_length(explorer_name) between 2 and 24),
  avatar         text not null default 'explorer-01'
                 check (avatar ~ '^[a-z0-9-]{1,32}$'),
  age_bracket    text not null default 'unknown'
                 check (age_bracket in ('under_13', '13_17', '18_plus', 'unknown')),
  settings       jsonb not null default '{}'::jsonb
                 check (jsonb_typeof(settings) = 'object' and pg_column_size(settings) < 8192),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

create table public.player_state (
  user_id      uuid primary key references public.profiles(id) on delete cascade,
  xp           int not null default 0 check (xp >= 0),
  level        int not null default 1 check (level >= 1),
  novacoins    int not null default 0 check (novacoins >= 0),
  current_era  smallint not null default 1 references public.eras(id),
  updated_at   timestamptz not null default now()
);

create table public.unlocked_eras (
  user_id      uuid not null references public.profiles(id) on delete cascade,
  era_id       smallint not null references public.eras(id),
  unlocked_at  timestamptz not null default now(),
  primary key (user_id, era_id)
);

create table public.lesson_completions (
  user_id          uuid not null references public.profiles(id) on delete cascade,
  lesson_id        text not null references public.lessons(id),
  score            smallint not null check (score between 0 and 100),
  xp_awarded       int not null,
  coins_awarded    int not null,
  client_event_id  uuid not null,               -- generado en el cliente (offline-safe)
  completed_at     timestamptz not null default now(),
  primary key (user_id, lesson_id),             -- ← una recompensa por lección
  unique (user_id, client_event_id)
);

-- Un mundo por era: la decoración de cada civilización se conserva.
create table public.worlds (
  user_id     uuid not null references public.profiles(id) on delete cascade,
  era_id      smallint not null references public.eras(id),
  layout      jsonb not null default '{"version":1,"objects":[]}'::jsonb
              check (jsonb_typeof(layout) = 'object' and pg_column_size(layout) < 262144),
  revision    int not null default 1,           -- para detectar conflictos entre dispositivos
  updated_at  timestamptz not null default now(),
  primary key (user_id, era_id)
);

create table public.inventory (
  user_id      uuid not null references public.profiles(id) on delete cascade,
  item_id      text not null references public.items(id),
  quantity     int not null default 1 check (quantity > 0),
  acquired_at  timestamptz not null default now(),
  primary key (user_id, item_id)
);

create table public.pets (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references public.profiles(id) on delete cascade,
  item_id      text not null references public.items(id),
  nickname     text check (char_length(nickname) between 1 and 20),
  origin_era   smallint not null references public.eras(id),
  current_era  smallint not null references public.eras(id),
  created_at   timestamptz not null default now()
);

create index pets_user_era_idx on public.pets (user_id, current_era);
create index lesson_completions_lesson_idx on public.lesson_completions (lesson_id);

-- ---------------------------------------------------------------------
-- 3. UTILIDADES
-- ---------------------------------------------------------------------

create or replace function public.level_for_xp(p_xp int)
returns int
language sql
immutable
set search_path = ''
as $$
  -- Nivel 1: 0 XP · Nivel 2: 100 · Nivel 3: 400 · Nivel 4: 900 …
  select floor(sqrt(greatest(p_xp, 0) / 100.0))::int + 1;
$$;

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger profiles_touch before update on public.profiles
  for each row execute function public.touch_updated_at();

create or replace function public.worlds_bump_revision()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  new.revision   := old.revision + 1;
  return new;
end;
$$;

create trigger worlds_bump before update on public.worlds
  for each row execute function public.worlds_bump_revision();

-- ---------------------------------------------------------------------
-- 4. ALTA DE USUARIO (trigger sobre auth.users)
-- ---------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_name    text := coalesce(nullif(trim(new.raw_user_meta_data->>'explorer_name'), ''), 'Explorador');
  v_bracket text := coalesce(new.raw_user_meta_data->>'age_bracket', 'unknown');
begin
  if char_length(v_name) not between 2 and 24 then
    v_name := 'Explorador';
  end if;
  if v_bracket not in ('under_13', '13_17', '18_plus') then
    v_bracket := 'unknown';
  end if;

  insert into public.profiles (id, explorer_name, age_bracket)
  values (new.id, v_name, v_bracket);

  insert into public.player_state (user_id) values (new.id);
  insert into public.unlocked_eras (user_id, era_id) values (new.id, 1);
  insert into public.worlds (user_id, era_id) values (new.id, 1);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------
-- 5. FUNCIONES RPC (única vía para modificar progreso y economía)
-- ---------------------------------------------------------------------

-- Completar una lección. Idempotente: reintentos no duplican recompensas.
create or replace function public.complete_lesson(
  p_lesson_id        text,
  p_score            smallint,
  p_client_event_id  uuid
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid     uuid := auth.uid();
  v_lesson  public.lessons%rowtype;
  v_rows    int;
  v_state   public.player_state%rowtype;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if p_score is null or p_score not between 0 and 100 then
    raise exception 'invalid_score' using errcode = '22023';
  end if;

  select * into v_lesson from public.lessons
   where id = p_lesson_id and is_published;
  if not found then
    raise exception 'lesson_not_found' using errcode = 'P0002';
  end if;

  if not exists (select 1 from public.unlocked_eras
                  where user_id = v_uid and era_id = v_lesson.era_id) then
    raise exception 'era_locked' using errcode = '42501';
  end if;

  if p_score < v_lesson.pass_score then
    return jsonb_build_object('passed', false, 'awarded', false,
                              'pass_score', v_lesson.pass_score);
  end if;

  -- Bloquea la fila del jugador para evitar carreras entre dispositivos.
  select * into v_state from public.player_state where user_id = v_uid for update;

  insert into public.lesson_completions
         (user_id, lesson_id, score, xp_awarded, coins_awarded, client_event_id)
  values (v_uid, v_lesson.id, p_score, v_lesson.xp_reward, v_lesson.coin_reward, p_client_event_id)
  on conflict do nothing;
  get diagnostics v_rows = row_count;

  if v_rows = 1 then
    update public.player_state
       set xp         = xp + v_lesson.xp_reward,
           novacoins  = novacoins + v_lesson.coin_reward,
           level      = public.level_for_xp(xp + v_lesson.xp_reward),
           updated_at = now()
     where user_id = v_uid
    returning * into v_state;
  end if;

  return jsonb_build_object(
    'passed',    true,
    'awarded',   v_rows = 1,
    'xp',        v_state.xp,
    'level',     v_state.level,
    'novacoins', v_state.novacoins
  );
end;
$$;

-- Comprar un objeto cosmético con NovaCoins.
create or replace function public.purchase_item(p_item_id text)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid    uuid := auth.uid();
  v_item   public.items%rowtype;
  v_state  public.player_state%rowtype;
  v_pet_id uuid;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  select * into v_item from public.items where id = p_item_id and is_active;
  if not found then
    raise exception 'item_not_found' using errcode = 'P0002';
  end if;

  if not exists (select 1 from public.unlocked_eras
                  where user_id = v_uid and era_id = v_item.era_id) then
    raise exception 'era_locked' using errcode = '42501';
  end if;

  select * into v_state from public.player_state where user_id = v_uid for update;
  if v_state.novacoins < v_item.price then
    raise exception 'insufficient_coins' using errcode = 'P0001';
  end if;

  update public.player_state
     set novacoins = novacoins - v_item.price, updated_at = now()
   where user_id = v_uid
  returning * into v_state;

  if v_item.kind = 'pet' then
    insert into public.pets (user_id, item_id, origin_era, current_era)
    values (v_uid, v_item.id, v_item.era_id, v_item.era_id)
    returning id into v_pet_id;
  else
    insert into public.inventory (user_id, item_id) values (v_uid, v_item.id)
    on conflict (user_id, item_id) do update
      set quantity = public.inventory.quantity + 1;
  end if;

  return jsonb_build_object('novacoins', v_state.novacoins, 'pet_id', v_pet_id);
end;
$$;

-- Desbloquear la siguiente era: requiere completar TODO lo publicado
-- en la era más alta desbloqueada (lecciones + evaluación).
create or replace function public.unlock_next_era()
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid      uuid := auth.uid();
  v_max_era  smallint;
  v_next     smallint;
  v_pending  int;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  perform 1 from public.player_state where user_id = v_uid for update;

  select max(era_id) into v_max_era from public.unlocked_eras where user_id = v_uid;

  select e.id into v_next from public.eras e
   where e.sort_order > (select sort_order from public.eras where id = v_max_era)
   order by e.sort_order limit 1;
  if v_next is null then
    raise exception 'no_more_eras' using errcode = 'P0002';
  end if;

  select count(*) into v_pending
    from public.lessons l
   where l.era_id = v_max_era and l.is_published
     and not exists (select 1 from public.lesson_completions c
                      where c.user_id = v_uid and c.lesson_id = l.id);
  if v_pending > 0 then
    return jsonb_build_object('unlocked', false, 'pending_lessons', v_pending);
  end if;

  insert into public.unlocked_eras (user_id, era_id) values (v_uid, v_next)
  on conflict do nothing;
  insert into public.worlds (user_id, era_id) values (v_uid, v_next)
  on conflict do nothing;
  update public.player_state set current_era = v_next, updated_at = now()
   where user_id = v_uid;

  return jsonb_build_object('unlocked', true, 'era_id', v_next);
end;
$$;

-- Visitar una civilización anterior (o volver a la actual).
create or replace function public.set_current_era(p_era_id smallint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;
  if not exists (select 1 from public.unlocked_eras
                  where user_id = auth.uid() and era_id = p_era_id) then
    raise exception 'era_locked' using errcode = '42501';
  end if;
  update public.player_state set current_era = p_era_id, updated_at = now()
   where user_id = auth.uid();
end;
$$;

-- Llevar una mascota a otra era. Regla: solo UNA mascota puede llegar
-- transferida a cada era desde una era anterior.
create or replace function public.transfer_pet(p_pet_id uuid, p_to_era smallint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_uid  uuid := auth.uid();
  v_pet  public.pets%rowtype;
begin
  if v_uid is null then
    raise exception 'not_authenticated' using errcode = '28000';
  end if;

  perform 1 from public.player_state where user_id = v_uid for update;

  select * into v_pet from public.pets where id = p_pet_id and user_id = v_uid;
  if not found then
    raise exception 'pet_not_found' using errcode = 'P0002';
  end if;

  if not exists (select 1 from public.unlocked_eras
                  where user_id = v_uid and era_id = p_to_era) then
    raise exception 'era_locked' using errcode = '42501';
  end if;

  if p_to_era <> v_pet.origin_era and exists (
       select 1 from public.pets
        where user_id = v_uid and current_era = p_to_era
          and origin_era <> p_to_era and id <> p_pet_id) then
    raise exception 'era_already_has_transferred_pet' using errcode = 'P0001';
  end if;

  update public.pets set current_era = p_to_era where id = p_pet_id;
end;
$$;

-- ---------------------------------------------------------------------
-- 6. ROW LEVEL SECURITY
-- ---------------------------------------------------------------------

alter table public.eras               enable row level security;
alter table public.lessons            enable row level security;
alter table public.items              enable row level security;
alter table public.profiles           enable row level security;
alter table public.player_state       enable row level security;
alter table public.unlocked_eras      enable row level security;
alter table public.lesson_completions enable row level security;
alter table public.worlds             enable row level security;
alter table public.inventory          enable row level security;
alter table public.pets               enable row level security;

-- Catálogos: lectura pública (permite el modo invitado sin cuenta).
create policy "eras: lectura pública"    on public.eras    for select to anon, authenticated using (true);
create policy "lessons: lectura pública" on public.lessons for select to anon, authenticated using (is_published);
create policy "items: lectura pública"   on public.items   for select to anon, authenticated using (is_active);

-- Perfil: ver y editar solo el propio.
create policy "profiles: ver propio" on public.profiles
  for select to authenticated using ((select auth.uid()) = id);
create policy "profiles: editar propio" on public.profiles
  for update to authenticated
  using ((select auth.uid()) = id) with check ((select auth.uid()) = id);

-- Progreso y economía: SOLO lectura. Las escrituras pasan por RPC.
create policy "player_state: ver propio" on public.player_state
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "unlocked_eras: ver propias" on public.unlocked_eras
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "lesson_completions: ver propias" on public.lesson_completions
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "inventory: ver propio" on public.inventory
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "pets: ver propias" on public.pets
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "pets: renombrar propias" on public.pets
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- Mundos: el usuario decora libremente sus mundos de eras desbloqueadas.
create policy "worlds: ver propios" on public.worlds
  for select to authenticated using ((select auth.uid()) = user_id);
create policy "worlds: editar propios" on public.worlds
  for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);

-- ---------------------------------------------------------------------
-- 7. PERMISOS POR COLUMNA Y EJECUCIÓN
-- ---------------------------------------------------------------------
-- RLS decide QUÉ filas; los GRANT deciden QUÉ columnas.

revoke insert, update, delete on all tables in schema public from anon, authenticated;
grant select on all tables in schema public to anon, authenticated;

grant update (explorer_name, avatar, settings) on public.profiles to authenticated;
grant update (layout)                          on public.worlds   to authenticated;
grant update (nickname)                        on public.pets     to authenticated;

revoke execute on all functions in schema public from public, anon;
grant execute on function public.complete_lesson(text, smallint, uuid) to authenticated;
grant execute on function public.purchase_item(text)                   to authenticated;
grant execute on function public.unlock_next_era()                     to authenticated;
grant execute on function public.set_current_era(smallint)             to authenticated;
grant execute on function public.transfer_pet(uuid, smallint)          to authenticated;
grant execute on function public.level_for_xp(int)                     to anon, authenticated;

-- ---------------------------------------------------------------------
-- 8. DATOS INICIALES
-- ---------------------------------------------------------------------

insert into public.eras (id, slug, name, sort_order) values
  (1, 'prehistoria',   'Prehistoria',              1),
  (2, 'antigua',       'Civilizaciones antiguas',  2),
  (3, 'industrial',    'Era industrial',           3),
  (4, 'digital',       'Era digital',              4),
  (5, 'futurista',     'Era futurista',            5);

-- Deben coincidir con src/learning/lessons/era1/*.ts
insert into public.lessons (id, era_id, kind, title, sort_order, xp_reward, coin_reward) values
  ('e1-01-que-es-programar', 1, 'lesson',     '¿Qué es programar?',       1, 20, 10),
  ('e1-02-la-consola',       1, 'lesson',     'La consola: la voz de tu código', 2, 20, 10),
  ('e1-03-variables',        1, 'lesson',     'Variables: cajas con nombre', 3, 20, 10),
  ('e1-04-constantes',       1, 'lesson',     'Constantes: grabado en piedra', 4, 20, 10),
  ('e1-05-tipos-de-datos',   1, 'lesson',     'Tipos de datos',           5, 20, 10),
  ('e1-06-operadores',       1, 'lesson',     'Operadores',               6, 20, 10),
  ('e1-07-evaluacion',       1, 'evaluation', 'Evaluación de la Prehistoria', 7, 50, 30);

insert into public.items (id, kind, name, price, era_id) values
  ('deco-fogata',      'decoration', 'Fogata',             10, 1),
  ('deco-roca-musgo',  'decoration', 'Roca con musgo',      5, 1),
  ('deco-helecho',     'decoration', 'Helecho gigante',     8, 1),
  ('outfit-piel',      'outfit',     'Túnica de piel',     25, 1),
  ('pet-dodo',         'pet',        'Dodo curioso',       40, 1),
  ('pet-lagartija',    'pet',        'Lagartija solar',    40, 1),
  ('deco-columna',     'decoration', 'Columna antigua',    20, 2),
  ('pet-buho',         'pet',        'Búho sabio',         60, 2);
