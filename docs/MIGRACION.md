# Plan de migración: prototipo HTML → React + Vite + TypeScript

> **Objetivo:** llegar al **MVP educativo** (Era 1 completa, jugable en móvil, progreso local, sin cuenta) sin perder el progreso de quienes ya probaron el prototipo y sin detener las demos en GitHub Pages.

**Estrategia:** migración incremental. El prototipo se mueve a `legacy/` y sigue publicado mientras la nueva app crece módulo por módulo. No se reescribe todo de golpe.

---

## Índice

1. [Decisiones técnicas](#1-decisiones-técnicas)
2. [Preparación del proyecto](#2-preparación-del-proyecto)
3. [Inventario del prototipo](#3-inventario-del-prototipo)
4. [Orden de migración](#4-orden-de-migración)
5. [Laboratorio: sandbox seguro](#5-laboratorio-sandbox-seguro)
6. [Guardado versionado y sincronización](#6-guardado-versionado-y-sincronización)
7. [Integración con Supabase (Fase 4)](#7-integración-con-supabase-fase-4)
8. [Pruebas](#8-pruebas)
9. [Despliegue](#9-despliegue)
10. [Riesgos](#10-riesgos)

---

## 1. Decisiones técnicas

| Tema | Decisión | Por qué |
|---|---|---|
| Framework de UI | React 18 + TypeScript (`strict`) | Componentes reutilizables y tipado para un proyecto que va a crecer |
| Compilación | Vite | Arranque instantáneo, sitio estático compatible con GitHub Pages |
| Estado global | Zustand | Más ligero que Redux; el estado del juego se lee fuera de React (en el loop del canvas) |
| Juego | Canvas 2D propio con `requestAnimationFrame` | Pixel Art nítido (`imageSmoothingEnabled = false`), sin el peso de un motor completo. Revisar Phaser si llega la vista lateral con física |
| Editor | CodeMirror 6 | Ligero, accesible, buen soporte móvil (Monaco no funciona bien en móvil) |
| Lecciones | Archivos TS de **datos** (`src/learning/lessons/`) | Docentes pueden revisarlas; se validan con pruebas automáticas |
| Ejecución de código | iframe con `sandbox` + Web Worker | Ver [sección 5](#5-laboratorio-sandbox-seguro) |
| Guardado local | `localStorage` versionado → IndexedDB en Fase 5 | Ver [sección 6](#6-guardado-versionado-y-sincronización) |
| Rutas | React Router con `HashRouter` | GitHub Pages no reescribe rutas; el hash evita errores 404 |
| Pruebas | Vitest (unidad) + Playwright (navegador) | Mismo ecosistema que Vite |

> **Next.js** no se usa como framework de la app (GitHub Pages solo sirve sitios estáticos). Es un **tema de estudio** de la Era 5.

## 2. Preparación del proyecto

```bash
# 1. Mover el prototipo actual a legacy/ (se sigue publicando)
git checkout -b migracion/react
mkdir legacy && git mv index.html *.css *.js assets legacy/  # ajusta a tus archivos reales

# 2. Crear la base con Vite
npm create vite@latest . -- --template react-ts

# 3. Dependencias
npm i zustand react-router-dom @supabase/supabase-js \
      @codemirror/state @codemirror/view @codemirror/lang-javascript @codemirror/commands
npm i -D vitest @types/node playwright @playwright/test vite-plugin-pwa
```

Archivos ya incluidos en este repositorio:

| Archivo | Contenido |
|---|---|
| `vite.config.ts` | `base` para GitHub Pages, PWA, configuración de Vitest |
| `tsconfig.json` | Modo `strict` + `noUncheckedIndexedAccess` |
| `.github/workflows/deploy.yml` | Tipos → pruebas → build → despliegue |
| `.env.example` | Variables de Supabase |
| `src/types/lesson.ts` | Modelo de datos de las lecciones |
| `src/learning/validate.ts` | Validación de ejercicios y mensajes de error de Proto-0 |
| `src/learning/lessons/era1/` | 7 microlecciones de la Era 1 |
| `src/editor/sandbox.ts` | Ejecución aislada del código del estudiante |
| `src/services/storage/save.ts` | Guardado versionado con migración desde el prototipo |
| `supabase/migrations/0001_init.sql` | Base de datos, RLS y funciones de recompensa |

## 3. Inventario del prototipo

Antes de escribir código nuevo, completa esta tabla revisando el HTML actual. Cada fila es una tarea de migración y nada se pierde por olvido.

| Funcionalidad del prototipo | Dónde vive hoy | Módulo destino | Estado |
|---|---|---|---|
| Movimiento del explorador | `script.js` → `move()` *(ejemplo)* | `src/game/movement/` | ⬜ |
| Animación de Proto-0 | | `src/components/Robot/` | ⬜ |
| Decoración del refugio | | `src/game/worlds/` + `src/game/inventory/` | ⬜ |
| XP y NovaCoins | | `src/store/progress.ts` | ⬜ |
| Editor JavaScript | | `src/editor/` | ⬜ |
| Lecciones introductorias | | `src/learning/lessons/` | ⬜ |
| Cambio de época | | `src/game/worlds/` | ⬜ |
| Transferencia de mascota | | `src/game/inventory/pets.ts` | ⬜ |
| Guardado local (clave y formato) | `localStorage['…']` | `src/services/storage/save.ts` | ⬜ |

> ⚠️ El último renglón es crítico: abre las DevTools del prototipo → *Application → Local Storage*, copia la clave y un ejemplo del JSON, y ajusta `LEGACY_KEY` y `migrateFromLegacy()` en `save.ts`.

## 4. Orden de migración

Cada paso termina con algo que funciona y se puede publicar.

### Paso 1 — Esqueleto y tipos (1–2 días)
- Vite + React + TS funcionando, publicado en `/codenova-evolution/` con el workflow.
- `src/types/` con los tipos del juego: `Save`, `Lesson`, `WorldObject`, `Pet`.
- Pantalla vacía con navegación: **Mundo · Laboratorio · Lecciones · Perfil**.
- ✅ *Hecho cuando:* `npm run build` pasa en CI y la página carga en el móvil.

### Paso 2 — Estado y guardado (2 días)
- Store de Zustand con el progreso, inicializado con `loadSave()`.
- Guardado automático con `writeSave()` (con *debounce* de 1 s) y al cerrar la pestaña (`visibilitychange`).
- ✅ *Hecho cuando:* una partida del prototipo se carga en la app nueva con su XP y monedas.

```ts
// src/store/progress.ts (esbozo)
import { create } from 'zustand';
import { loadSave, writeSave, type Save } from '../services/storage/save';

interface ProgressStore {
  save: Save;
  completeLesson: (lessonId: string, score: number, reward: { xp: number; coins: number }) => boolean;
}

export const useProgress = create<ProgressStore>((set, get) => ({
  save: loadSave(),
  completeLesson: (lessonId, score, reward) => {
    const { save } = get();
    if (save.completedLessons[lessonId]) return false; // nunca se paga dos veces
    const eventId = crypto.randomUUID();
    const next: Save = {
      ...save,
      xp: save.xp + reward.xp,
      novacoins: save.novacoins + reward.coins,
      completedLessons: { ...save.completedLessons, [lessonId]: { score, completedAt: new Date().toISOString(), eventId } },
      pendingSync: [...save.pendingSync, { lessonId, score, eventId }],
    };
    set({ save: next });
    writeSave(next);
    return true;
  },
}));
```

### Paso 3 — Laboratorio y lecciones (3–4 días) ⭐ *corazón del MVP*
- Componente `<CodeEditor>` con CodeMirror.
- `<LessonPlayer>` que recorre los 7 pasos de cada lección: intro → concepto → ejemplo → ejercicio → retroalimentación → recompensa → siguiente.
- Selector de duración (5 / 10 / 15 min) usando `exercisesFor()`.
- Ejecución con `CodeSandbox` y validación con `validate()`.
- Pistas progresivas de Proto-0; cada pista usada baja 10 puntos (`scoreLesson()`).
- ✅ *Hecho cuando:* las 7 lecciones de la Era 1 se completan de principio a fin en un teléfono.

### Paso 4 — Mundo y juego (4–5 días)
- `<GameCanvas>`: el loop vive en un `useEffect` y lee el estado con `useProgress.getState()` (sin re-renderizar React 60 veces por segundo).
- Movimiento con teclado **y controles táctiles** (D-pad en pantalla).
- Modo construcción: cuadrícula, colocar/quitar objetos del inventario, guardado en `save.worlds[era]`.
- Escalado entero del canvas (×2, ×3, ×4) para que el Pixel Art no se vea borroso.
- ✅ *Hecho cuando:* el refugio del prototipo se ve y se decora igual o mejor.

### Paso 5 — Eras, mascotas y tienda (2–3 días)
- Desbloqueo de la Era 2 al completar todas las lecciones de la Era 1 (misma regla que `unlock_next_era()` en el servidor).
- Selector para visitar eras anteriores.
- Tienda de NovaCoins y transferencia de **una** mascota por era.
- ✅ *Hecho cuando:* coinciden las reglas locales con las del servidor (mismas pruebas).

### Paso 6 — Pulido del MVP (2–3 días)
- Accesibilidad: foco visible, contraste, `aria-live` en la consola, textos mínimos de 16 px.
- Pruebas en Chrome Android, Safari iOS y Firefox de escritorio.
- Retirar `legacy/` del menú principal (se conserva el código como referencia).

**Total estimado:** 3 a 4 semanas a tiempo parcial.

## 5. Laboratorio: sandbox seguro

Implementado en `src/editor/sandbox.ts`.

```
┌──────────────── App (tu origen) ────────────────┐
│  sesión Supabase · localStorage · DOM           │
│        │ postMessage (solo texto)               │
│  ┌─────▼──── iframe sandbox="allow-scripts" ──┐ │
│  │  origen opaco · CSP sin red               │ │
│  │      │                                     │ │
│  │  ┌───▼─── Web Worker ───────────────┐      │ │
│  │  │  código del estudiante           │      │ │
│  │  │  terminate() al vencer el tiempo │      │ │
│  │  └──────────────────────────────────┘      │ │
│  └────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────┘
```

| Amenaza | Defensa |
|---|---|
| Robar la sesión o leer `localStorage` | El iframe **no** tiene `allow-same-origin`: origen opaco, sin acceso a la app |
| Enviar datos a otro sitio | CSP `connect-src 'none'`, y `fetch`/`XMLHttpRequest`/`WebSocket` eliminados en el worker |
| Ciclo infinito que congela la app | El código corre en un worker (otro hilo) y se termina a los 2 s |
| Iframe colgado | Temporizador de respaldo en la app: destruye y recrea el iframe |
| Inundar la consola | Máximo 200 líneas de 2000 caracteres |
| Estado entre ejecuciones | Un worker nuevo para cada ejecución |

**Verificado en Chromium:** `while (true) {}` se detiene en 1.5 s mientras la app sigue respondiendo; `localStorage`, `document`, `parent` y `fetch` aparecen como `undefined`; un ciclo de 100 000 `console.log` se recorta a 50 líneas en la prueba.

**Reglas que no se rompen:**
1. Nunca agregar `allow-same-origin` al iframe.
2. Nunca usar `eval` del código del estudiante en la ventana principal.
3. El resultado del sandbox solo decide la retroalimentación; **las recompensas reales las asigna el servidor**.

> Para Python (Era 5) se usará Pyodide dentro del mismo esquema iframe + worker.

## 6. Guardado versionado y sincronización

Implementado en `src/services/storage/save.ts` (con pruebas en `save.test.ts`).

- Cada partida tiene `version`. `migrate()` aplica los cambios en cadena: legacy → v1 → v2 → …
- La partida del prototipo se **respalda** en `codenova-save:backup` antes de convertirla.
- Si llega una partida de una versión más nueva que la app, se rechaza en lugar de dañarla.

**Para agregar una versión futura (v3):**
1. Crea `SaveV3` y la función `migrateV2toV3()`.
2. Súmala al final de `migrate()` y sube `CURRENT_VERSION`.
3. Agrega una prueba con una partida v2 real.

**Cola de sincronización (offline):** cada lección completada genera un `eventId` (UUID) y se agrega a `pendingSync`. Al recuperar conexión, se envía a `complete_lesson(lesson_id, score, event_id)`. Como el servidor paga una sola vez por lección, reintentar es seguro: nunca se duplican recompensas.

## 7. Integración con Supabase (Fase 4)

1. Crear el proyecto en Supabase (región más cercana a tus usuarios).
2. Aplicar `supabase/migrations/0001_init.sql` (`supabase db push` o desde el editor SQL).
3. Ejecutar *Advisors → Security* en el panel y resolver avisos.
4. Activar proveedores en *Authentication*: Email, Google y GitHub. Configurar la URL de redirección de GitHub Pages.
5. Al registrarse, enviar los metadatos que lee el trigger:
   ```ts
   await supabase.auth.signUp({ email, password, options: { data: { explorer_name: 'Ana', age_bracket: '13_17' } } });
   ```
6. **Primer inicio de sesión con partida local:** enviar `pendingSync` y todas las lecciones completadas mediante `complete_lesson()`; después, leer el estado del servidor como fuente de verdad.

**Qué protege el esquema (probado en PostgreSQL 16):**

| Intento | Resultado |
|---|---|
| `update player_state set xp = 99999` desde el cliente | ❌ permiso denegado |
| Cambiar `age_bracket` desde el cliente | ❌ permiso denegado |
| Completar la misma lección dos veces | ✅ se registra, ❌ no se paga de nuevo |
| Comprar sin NovaCoins suficientes | ❌ `insufficient_coins` |
| Desbloquear la Era 2 sin terminar la Era 1 | ❌ devuelve las lecciones pendientes |
| Un usuario lee o mueve la mascota de otro | ❌ no ve nada / `pet_not_found` |
| Visitante anónimo | ✅ ve el catálogo, ❌ no ve partidas ni ejecuta funciones |

> **Límite conocido:** el servidor confía en que el cliente realmente resolvió el ejercicio. Para evaluaciones con valor externo (certificados, instituciones), validar el código en una Edge Function antes de llamar a `complete_lesson`.

## 8. Pruebas

| Tipo | Herramienta | Qué cubre | Estado |
|---|---|---|---|
| Lecciones | Vitest | Cada solución aprueba, cada código inicial reprueba, los ejemplos dan la salida documentada | ✅ 44 pruebas |
| Guardado | Vitest | Migración del prototipo, datos corruptos, versiones futuras | ✅ 5 pruebas |
| Sandbox | Playwright | Aislamiento, tiempo límite, recorte de salida | ⬜ pasar a `e2e/` |
| Flujo MVP | Playwright (móvil emulado) | Completar la Era 1 de principio a fin | ⬜ |
| Base de datos | SQL / pgTAP | RLS y funciones RPC | ⬜ automatizar en CI |

**Regla para quienes escriban lecciones:** una lección nueva no entra si `npm test` falla. La prueba detecta soluciones que no pasan y ejercicios que se aprueban sin hacer nada.

## 9. Despliegue

- `.github/workflows/deploy.yml`: en cada *push* a `main` se ejecutan tipos, pruebas y build, y se publica en GitHub Pages.
- En el repositorio: *Settings → Pages → Source: GitHub Actions*.
- Variables `VITE_SUPABASE_URL` y `VITE_SUPABASE_ANON_KEY` en *Settings → Secrets and variables → Actions → Variables*.
- Los *pull requests* ejecutan las pruebas sin publicar.

## 10. Riesgos

| Riesgo | Impacto | Mitigación |
|---|---|---|
| Formato real del guardado del prototipo distinto al supuesto | Alto | Inventario del paso 3 antes de escribir código; respaldo automático |
| Rendimiento del canvas en móviles de gama baja | Medio | Resolución interna fija (p. ej. 320×180) escalada; limitar a 30 FPS si hace falta |
| Teclado virtual tapa el editor en móvil | Medio | Diseño con el editor arriba y la consola plegable; probar en el paso 6 |
| Alcance: querer migrar el juego completo antes que las lecciones | Alto | El orden del plan prioriza el laboratorio (paso 3) sobre el mundo (paso 4) |
| Seguridad del sandbox debilitada por un cambio futuro | Alto | Prueba de Playwright en CI que falle si `localStorage` es accesible |
