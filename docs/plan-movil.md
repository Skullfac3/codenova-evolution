# Plan móvil: CodeNova en Android e iOS con Capacitor

> Estado: plan, sin implementar. La web actual ya es una PWA instalable;
> este plan la empaqueta como app nativa sin reescribirla.

## Idea en una línea

Reutilizar la web actual (React + Vite, ya PWA) con **Capacitor**: la app
móvil es la misma web corriendo dentro de un WebView nativo, con acceso a
funciones del teléfono cuando haga falta. No se reescribe nada: se añade
una capa nativa fina encima del build de producción.

## Por qué Capacitor y no otra cosa

- La app ya es PWA: `manifest`, iconos, service worker y modo offline
  existen. Capacitor aprovecha todo eso.
- Un solo código web para Android e iOS; los proyectos nativos
  (`android/`, `ios/`) solo se generan una vez y se versionan.
- El progreso vive en `localStorage` y seguirá vivo dentro del WebView.
- Alternativas descartadas: reescribir en React Native o Flutter (meses de
  trabajo para el mismo juego), y quedarse solo en PWA (en iPhone la PWA
  instalada tiene límites: sin notificaciones push y el sistema puede
  borrar su almacenamiento si no se usa).

## Fases

### Fase 1 — Preparación web (base para todo lo demás)

- Dejar la web lista para vivir dentro de un WebView:
  - Comprobar que nada dependa de `window` del navegador de escritorio
    (ya está: no hay `localStorage` fuera del `save`, ni APIs de escritorio).
  - `viewport-fit=cover` y áreas seguras ya están en CSS.
  - La leyenda de versión (`CodeNova vX.Y.Z`, desde v0.4.0) permite saber
    qué build corre cada instalación.
- Salida: la web en `main` sin cambios de funcionalidad.

**Esfuerzo:** 0,5 días.

### Fase 2 — Capacitor y proyecto Android

```bash
npm install @capacitor/core @capacitor/cli
npx cap init "CodeNova Evolution" com.joyNatura.codenova --web-dir=dist
npx cap add android
npm run build && npx cap sync android
npx cap open android   # abre Android Studio
```

- Genera `android/` (proyecto nativo) y `capacitor.config.ts`.
- Iconos y splash: generar desde el icono 512 existente
  (`public/icons/icon-512.png`) con `@capacitor/assets`:
  ```bash
  npm install -D @capacitor/assets
  npx @capacitor/assets generate --iconBackgroundColor '#1b1325' --splashBackgroundColor '#1b1325'
  ```
- Probar en emulador y en un teléfono Android real por USB
  (`npx cap run android` o "Run" en Android Studio).
- Salida: APK/AAB de depuración instalable en un teléfono.

**Esfuerzo:** 1–2 días.

### Fase 3 — Proyecto iOS

```bash
npx cap add ios
npm run build && npx cap sync ios
npx cap open ios   # abre Xcode (solo en una Mac)
```

- Requiere una **Mac con Xcode** (no se puede compilar iOS en Windows/Linux).
- Iconos y splash se generan con el mismo comando de la Fase 2.
- Probar en simulador y en un iPhone real (con cuenta de desarrollador).
- Salida: app corriendo en iPhone.

**Esfuerzo:** 1–2 días (con Mac disponible; sin Mac, esta fase se bloquea).

### Fase 4 — Pruebas en dispositivo y ajustes móviles

- Recorrido completo en teléfono real: 15 lecciones, tienda, perfiles,
  Proto-0, modo offline (avión) y actualización de versión.
- Ajustes típicos que salen aquí: teclado que tapa el editor, tamaño de
  toque de los botones, scroll dentro del WebView, y el aviso de
  actualización (el banner de v0.4.0) funcionando tras una actualización.
- Salida: lista de errores corregidos y build candidata a tienda.

**Esfuerzo:** 2–3 días.

### Fase 5 — Cuentas de las tiendas y publicación

- **Google Play Console:** registro de desarrollador, subir el AAB
  (`android/app/build/outputs/bundle/release/`), ficha de la tienda
  (descripción, capturas, icono), revisión de Google y publicación.
- **App Store Connect:** subir con Xcode, ficha de la tienda, TestFlight
  para probar con usuarios reales antes de publicar, revisión de Apple y
  publicación.
- Salida: CodeNova descargable en Google Play y App Store.

**Esfuerzo:** 2–4 días (la mayor parte es esperar revisiones y corregir
lo que pidan).

### Fase 6 — Después del lanzamiento (opcional)

- Notificaciones push (Capacitor PushNotifications + un backend mínimo;
  hoy no hay backend: el progreso es local).
- Compras dentro de la app solo si algún día se vende algo digital
  (hoy todo es gratis y con NovaCoins del juego).
- Analítica de uso (opcional, con consentimiento).

## Cuentas y costos (verificar al registrarse)

Precios consultados en noviembre de 2026 en varias fuentes que citan la
documentación oficial de Apple y Google. **Verificar al registrarse**:
las tiendas cambian precios y reglas sin aviso.

| Cuenta | Costo | Frecuencia |
| --- | --- | --- |
| Apple Developer Program | US$99 | Cada año (se cobra en moneda local donde aplica) |
| Google Play Console | US$25 | Una sola vez, al registrarse |

- Primer año en ambas tiendas: **US$124** aprox. A partir del segundo
  año: **US$99/año** (solo Apple se renueva).
- CodeNova es gratis y no vende nada digital, así que no hay comisiones
  de las tiendas. Si algún día vende contenido digital dentro de la app,
  Apple y Google cobran comisión (15–30% según el programa y la región):
  revisar en ese momento.
- Apple exige la membresía también para probar en iPhone real y para
  TestFlight. Google pide verificar identidad al registrarse.

## Riesgos y decisiones

1. **La PWA instalada en iPhone y el service worker.** Hoy la app
   instalada en iPhone ya funciona, pero iOS puede borrar el
   almacenamiento de una PWA que no se abre en mucho tiempo (y con él, el
   progreso local). La app nativa con Capacitor guarda el progreso dentro
   de la app, no en el navegador: es la razón principal de este plan.
   Mientras tanto, el aviso de actualización (v0.4.0) mitiga el problema
   de quedarse en una versión vieja.
2. **Actualizar la app instalada.** Con Capacitor, cada `npm run build &&
   npx cap sync` genera una versión nueva que se distribuye por las
   tiendas; el usuario la actualiza como cualquier app. El service worker
   sigue existiendo dentro del WebView, pero la actualización la manda la
   tienda, no el SW.
3. **Se necesita una Mac para iOS.** Sin Mac no hay build de iOS ni
   publicación en App Store. Opciones: pedir prestada una Mac, alquilar
   una en la nube para compilar, o lanzar primero solo Android.
4. **Revisión de las tiendas.** Apple revisa cada envío a mano y puede
   rechazarlo (p. ej. si la app parece solo una web empaquetada: hay que
   cuidar que se sienta app — navegación, iconos, splash y que funcione
   offline). Reservar tiempo para una o dos rondas de correcciones.
5. **El progreso no viaja entre dispositivos.** Sin cuentas (Fase 4 del
   README, Supabase), cada instalación tiene su propio progreso. Eso no
   cambia con Capacitor: sigue siendo local por dispositivo.

## Resumen de esfuerzo

| Fase | Esfuerzo estimado |
| --- | --- |
| 1. Preparación web | 0,5 días |
| 2. Capacitor + Android | 1–2 días |
| 3. Proyecto iOS (con Mac) | 1–2 días |
| 4. Pruebas en dispositivo | 2–3 días |
| 5. Cuentas y publicación | 2–4 días |
| **Total** | **7–12 días de trabajo** (+ esperas de revisión) |

## Comandos de referencia (cuando se ejecute el plan)

```bash
npm run build && npx cap sync        # rebuild web + copiar a android/ios
npx cap run android                  # probar en teléfono/emulador Android
npx cap run ios                      # probar en simulador/iPhone (Mac)
npx cap open android                 # abrir en Android Studio
npx cap open ios                     # abrir en Xcode
```
