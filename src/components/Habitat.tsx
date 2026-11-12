import { useEffect, useMemo, useRef, useState } from 'react';
import { useProgress } from '../store/progress';
import { protoSay, useProto } from '../store/proto';
import { PROTO_FUTURE_NOTE, PROTO_STAGES, stageForEra } from '../game/proto';
import { COLS, ITEMS, LANDMARK, ROWS, TILE, WORLD_ERAS, isLandmarkTile, itemById } from '../game/items';
import { OUTFIT_COLORS, drawGrassEdge, drawHut, drawTemple, drawTile, spriteCanvas, type SpriteKey, type TileKind, type TileSide } from '../game/sprites';
import { availableCount, equipOutfit, placeObject, removeObjectAt, transferPet, transferablePets } from '../game/economy';
import { ERAS } from '../learning/catalog';
import { SpriteIcon } from './SpriteIcon';
import { play } from '../game/sound';

const W = COLS * TILE;
const H = ROWS * TILE;

type Mode = 'explorar' | 'decorar';

interface Walker {
  x: number;
  y: number;
  tx: number;
  ty: number;
  speed: number;
  frame: number;
  nextWander: number;
}

/** Terreno de cada era (determinista: siempre se ve igual). */
function terrainFor(era: number): TileKind[][] {
  return Array.from({ length: ROWS }, (_, y) =>
    Array.from({ length: COLS }, (_, x): TileKind => {
      if (era === 1) {
        // Sendero de tierra desde la puerta de la choza hacia abajo y a la derecha.
        if (x === 2 && y >= 3) return 'tierra';
        if (y === 6 && x >= 2) return 'tierra';
        return 'pasto';
      }
      // Era 2: plaza de losas rodeada de pasto.
      if (x >= 1 && x <= 8 && y >= 3 && y <= 7) return 'losa';
      if (x === 2 && y === 3) return 'losa';
      return 'pasto';
    }),
  );
}

function renderBackground(era: number): HTMLCanvasElement {
  const cv = document.createElement('canvas');
  cv.width = W;
  cv.height = H;
  const ctx = cv.getContext('2d')!;
  let seed = 1234 + era * 99;
  const rand = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 2 ** 32);
  const terrain = terrainFor(era);
  terrain.forEach((row, y) => row.forEach((kind, x) => drawTile(ctx, kind, x * TILE, y * TILE, rand)));
  // El pasto invade el borde de los senderos y las losas vecinas.
  const sides: [TileSide, number, number][] = [['N', 0, -1], ['S', 0, 1], ['O', -1, 0], ['E', 1, 0]];
  terrain.forEach((row, y) => row.forEach((kind, x) => {
    if (kind === 'pasto') return;
    for (const [side, dx, dy] of sides) {
      if (terrain[y + dy]?.[x + dx] === 'pasto') drawGrassEdge(ctx, side, x * TILE, y * TILE);
    }
  }));
  if (era === 1) drawHut(ctx, LANDMARK.x * TILE, LANDMARK.y * TILE);
  else drawTemple(ctx, LANDMARK.x * TILE, LANDMARK.y * TILE);
  return cv;
}

export function Habitat({ onGoToLessons, onGoToShop }: { onGoToLessons: () => void; onGoToShop: () => void }) {
  const save = useProgress((s) => s.save);
  const act = useProgress((s) => s.act);
  const worldEras = WORLD_ERAS.filter((e) => save.unlockedEras.includes(e));
  const [era, setEra] = useState<number>(() => Math.max(...worldEras));
  const [mode, setMode] = useState<Mode>('explorar');
  const [selected, setSelected] = useState<string | null>(null);

  // Proto-0 toma el aspecto de la era que se está viendo.
  const setViewEra = useProto((s) => s.setViewEra);
  useEffect(() => { setViewEra(era); }, [era, setViewEra]);

  const canvas = useRef<HTMLCanvasElement>(null);
  const background = useMemo(() => renderBackground(era), [era]);
  const saveRef = useRef(save);
  saveRef.current = save;
  const modeRef = useRef(mode);
  modeRef.current = mode;

  const explorer = useRef<Walker>({ x: 4 * TILE, y: 4 * TILE, tx: 4 * TILE, ty: 4 * TILE, speed: 96, frame: 0, nextWander: Infinity });
  const pets = useRef(new Map<string, Walker>());

  const petsHere = save.pets.filter((p) => p.currentEra === era);
  const objects = save.worlds[era]?.objects ?? [];
  const decorations = ITEMS.filter((i) => i.kind === 'decoration' && (save.inventory[i.id] ?? 0) > 0);
  const outfits = ITEMS.filter((i) => i.kind === 'outfit' && (save.inventory[i.id] ?? 0) > 0);
  const incoming = transferablePets(save, era);

  // Bucle del juego: dibuja a ~30 fps sin re-renderizar React.
  useEffect(() => {
    const ctx = canvas.current!.getContext('2d')!;
    ctx.imageSmoothingEnabled = false;
    let raf = 0;
    let last = performance.now();

    const step = (w: Walker, dt: number) => {
      const dx = w.tx - w.x;
      const dy = w.ty - w.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 0.5) return false;
      const move = Math.min(dist, w.speed * dt);
      w.x += (dx / dist) * move;
      w.y += (dy / dist) * move;
      return true;
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      const s = saveRef.current;
      const here = s.pets.filter((p) => p.currentEra === era);

      // Mascotas: aparecen al azar y pasean solas.
      for (const p of here) {
        if (!pets.current.has(p.id)) {
          const x = (4 + Math.floor(Math.random() * 5)) * TILE;
          const y = (3 + Math.floor(Math.random() * 5)) * TILE;
          pets.current.set(p.id, { x, y, tx: x, ty: y, speed: 36, frame: 0, nextWander: now + 500 });
        }
        const w = pets.current.get(p.id)!;
        if (now > w.nextWander) {
          let tx: number, ty: number;
          do {
            tx = Math.floor(Math.random() * COLS);
            ty = 3 + Math.floor(Math.random() * (ROWS - 3));
          } while (isLandmarkTile(tx, ty));
          w.tx = tx * TILE;
          w.ty = ty * TILE;
          w.nextWander = now + 2500 + Math.random() * 3500;
        }
        if (step(w, dt)) w.frame += dt * 6;
      }

      const me = explorer.current;
      const walking = step(me, dt);
      if (walking) me.frame += dt * 8;

      // Dibujo
      ctx.drawImage(background, 0, 0);
      if (modeRef.current === 'decorar') {
        ctx.strokeStyle = 'rgba(255,255,255,.18)';
        ctx.lineWidth = 1;
        for (let x = 1; x < COLS; x++) { ctx.beginPath(); ctx.moveTo(x * TILE + 0.5, 0); ctx.lineTo(x * TILE + 0.5, H); ctx.stroke(); }
        for (let y = 1; y < ROWS; y++) { ctx.beginPath(); ctx.moveTo(0, y * TILE + 0.5); ctx.lineTo(W, y * TILE + 0.5); ctx.stroke(); }
      }

      const flicker = Math.floor(now / 220) % 2 === 0;
      // Sombra pixelada bajo cada objeto: lo separa del suelo.
      const shadow = (x: number, y: number) => {
        ctx.fillStyle = 'rgba(20,10,30,.28)';
        ctx.fillRect(x + 8, y + 27, 16, 5);
        ctx.fillRect(x + 6, y + 28, 20, 3);
        ctx.fillRect(x + 10, y + 26, 12, 1);
      };
      type Drawable = { y: number; draw: () => void };
      const list: Drawable[] = [];
      for (const o of s.worlds[era]?.objects ?? []) {
        const item = itemById(o.id);
        if (!item) continue;
        const key: SpriteKey = item.sprite === 'fogata1' && !flicker ? 'fogata2' : item.sprite;
        list.push({ y: o.y * TILE, draw: () => { shadow(o.x * TILE, o.y * TILE); ctx.drawImage(spriteCanvas(key), o.x * TILE, o.y * TILE); } });
      }
      for (const p of here) {
        const w = pets.current.get(p.id)!;
        const item = itemById(p.itemId);
        if (!item) continue;
        const bob = Math.floor(w.frame) % 2;
        list.push({ y: w.y, draw: () => { shadow(Math.round(w.x), Math.round(w.y)); ctx.drawImage(spriteCanvas(item.sprite), Math.round(w.x), Math.round(w.y) - bob); } });
      }
      const outfit = s.equippedOutfit ? OUTFIT_COLORS[s.equippedOutfit] : undefined;
      const sprite: SpriteKey = walking && Math.floor(me.frame) % 2 ? 'explorador2' : 'explorador1';
      list.push({ y: me.y + 1, draw: () => { shadow(Math.round(me.x), Math.round(me.y)); ctx.drawImage(spriteCanvas(sprite, outfit), Math.round(me.x), Math.round(me.y)); } });
      list.sort((a, b) => a.y - b.y).forEach((d) => d.draw());

      const el = canvas.current;
      if (el) {
        el.dataset.explorer = `${Math.round(me.x / TILE)},${Math.round(me.y / TILE)}`;
      }
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [era, background]);

  const tileFromEvent = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * COLS);
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * ROWS);
    return { x: Math.max(0, Math.min(COLS - 1, x)), y: Math.max(0, Math.min(ROWS - 1, y)) };
  };

  const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const { x, y } = tileFromEvent(e);
    if (mode === 'explorar') {
      if (isLandmarkTile(x, y)) {
        protoSay(era === 1 ? 'Nuestra choza. Aquí empezó todo.' : 'El templo de la ciudad. ¡Qué columnas!', 'talking', 3000);
        return;
      }
      explorer.current.tx = x * TILE;
      explorer.current.ty = y * TILE;
      return;
    }
    // Modo decorar: tocar un adorno lo quita; tocar una casilla vacía coloca el seleccionado.
    const occupied = objects.some((o) => o.x === x && o.y === y);
    if (occupied) {
      const r = act((s) => removeObjectAt(s, era, x, y));
      if (r.ok) {
        play('remove');
        protoSay('Lo guardé en tu inventario.', 'talking', 2200);
      }
      return;
    }
    if (!selected) {
      play('hint');
      protoSay('Elige un adorno de tu inventario y toca una casilla.', 'talking', 3500);
      return;
    }
    const r = act((s) => placeObject(s, era, selected, x, y));
    play(r.ok ? 'place' : 'alert');
    if (r.ok) protoSay(`¡${itemById(selected)?.name} colocado!`, 'happy', 2200);
    else protoSay(r.reason, 'sad', 3000);
  };

  const eraInfo = ERAS.find((e) => e.id === era)!;
  const nextLessonEra = Math.max(...save.unlockedEras);
  // Era que ve Proto-0: solo 1 y 2 tienen etapa (las eras 3-5 no existen aún).
  const protoEra = Math.max(...save.unlockedEras.filter((e) => e <= 3));

  return (
    <section className="habitat" data-testid="habitat" data-era={era} data-mode={mode} data-objects={objects.length} data-pets={petsHere.length} data-outfit={save.equippedOutfit ?? ''}>
      <div className="habitat-head">
        <h1>{eraInfo.icon} Mi refugio</h1>
        {worldEras.length > 1 && (
          <div className="era-switch" role="tablist" aria-label="Elegir era">
            {worldEras.map((e) => (
              <button key={e} role="tab" aria-selected={e === era} className={`chip ${e === era ? 'on' : ''}`} onClick={() => { setEra(e); pets.current.clear(); }} data-testid={`world-era-${e}`}>
                Era {e}
              </button>
            ))}
          </div>
        )}
      </div>
      <p className="muted habitat-sub">{eraInfo.name}{nextLessonEra > 2 ? ' · La Era digital llega pronto.' : ''}</p>

      <div className="world-frame">
        <canvas
          ref={canvas}
          width={W}
          height={H}
          className="world"
          data-testid="world"
          aria-label={`Refugio de la era ${eraInfo.name}. ${objects.length} adornos y ${petsHere.length} mascotas.`}
          role="img"
          onPointerDown={onPointerDown}
        />
      </div>

      <div className="mode-switch" role="tablist" aria-label="Modo">
        <button role="tab" aria-selected={mode === 'explorar'} className={`chip ${mode === 'explorar' ? 'on' : ''}`} onClick={() => setMode('explorar')} data-testid="mode-explorar">
          🚶 Explorar
        </button>
        <button role="tab" aria-selected={mode === 'decorar'} className={`chip ${mode === 'decorar' ? 'on' : ''}`} onClick={() => setMode('decorar')} data-testid="mode-decorar">
          🪵 Decorar
        </button>
      </div>
      <p className="muted hint-line">
        {mode === 'explorar' ? 'Toca el mapa para caminar.' : selected ? `Toca una casilla para colocar: ${itemById(selected)?.name}. Toca un adorno para quitarlo.` : 'Elige un adorno abajo. Toca un adorno del mapa para quitarlo.'}
      </p>

      {mode === 'decorar' && (
        <div className="panel" data-testid="inventory">
          <h2>Inventario</h2>
          {decorations.length === 0 ? (
            <p className="muted">
              Aún no tienes adornos. <button className="linkish" onClick={onGoToShop}>Ve a la tienda</button>.
            </p>
          ) : (
            <div className="inv-grid">
              {decorations.map((item) => {
                const left = availableCount(save, item.id);
                return (
                  <button key={item.id} className={`inv-item ${selected === item.id ? 'on' : ''}`} onClick={() => setSelected(item.id)} disabled={left <= 0 && selected !== item.id} data-testid={`inv-${item.id}`} aria-pressed={selected === item.id}>
                    <SpriteIcon sprite={item.sprite} size={40} />
                    <span>{item.name}</span>
                    <small>{left} disponible{left === 1 ? '' : 's'}</small>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      )}

      <div className="panel">
        <h2>Atuendo</h2>
        <div className="inv-grid">
          <button className={`inv-item ${!save.equippedOutfit ? 'on' : ''}`} onClick={() => { const r = act((s) => equipOutfit(s, null)); if (r.ok) protoSay(save.equippedOutfit ? 'Ropa de inicio puesta.' : 'Ya llevas la ropa de inicio.', 'talking', 2200); }} data-testid="outfit-none">
            <SpriteIcon sprite="explorador1" size={40} />
            <span>Ropa de inicio</span>
          </button>
          {outfits.map((o) => (
            <button key={o.id} className={`inv-item ${save.equippedOutfit === o.id ? 'on' : ''}`} onClick={() => { act((s) => equipOutfit(s, o.id)); play('place'); protoSay('¡Te queda muy bien!', 'happy', 2200); }} data-testid={`outfit-${o.id}`}>
              <SpriteIcon sprite="explorador1" overrides={OUTFIT_COLORS[o.id]} size={40} />
              <span>{o.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="panel" data-testid="proto-evolution">
        <h2>Evolución de Proto-0</h2>
        <ul className="proto-stages">
          {PROTO_STAGES.map((stage) => {
            // La etapa actual es la más alta desbloqueada (stageForEra):
            // con protoEra 3 la etapa actual sigue siendo v2 Guardián.
            const current = stage.era === stageForEra(protoEra).era;
            const unlocked = stage.era <= protoEra;
            const shown = stage.era === stageForEra(Math.min(era, protoEra)).era;
            return (
              <li key={stage.era} data-testid={`proto-stage-${stage.era}`} data-state={current ? 'current' : unlocked ? 'unlocked' : 'locked'} data-shown={shown}>
                <strong>{stage.name}</strong>
                {current ? ' · etapa actual' : unlocked ? '' : ' · llega pronto'}
                {shown && !current ? ' · así se ve en esta era' : ''}
                <small>{stage.description}</small>
              </li>
            );
          })}
        </ul>
        <p className="muted">{PROTO_FUTURE_NOTE}</p>
      </div>

      <div className="panel">
        <h2>Mascotas en esta era</h2>
        {petsHere.length === 0 && <p className="muted">Ninguna todavía. Las encuentras en la tienda.</p>}
        <ul className="pet-list">
          {petsHere.map((p) => {
            const item = itemById(p.itemId)!;
            return (
              <li key={p.id}>
                <SpriteIcon sprite={item.sprite} size={32} /> {item.name}
                {p.originEra !== era && <small className="muted"> · viene de la Era {p.originEra}</small>}
              </li>
            );
          })}
        </ul>
        {incoming.length > 0 && (
          <div className="transfer">
            <p>Puedes traer <strong>una</strong> mascota de una era anterior:</p>
            {incoming.map((p) => (
              <button key={p.id} className="btn small" onClick={() => { const r = act((s) => transferPet(s, p.id, era)); if (r.ok) play('evolve'); if (r.ok) protoSay(`¡${itemById(p.itemId)?.name} viajó contigo!`, 'surprised', 3000); }} data-testid={`transfer-${p.id}`}>
                Traer a {itemById(p.itemId)?.name}
              </button>
            ))}
          </div>
        )}
      </div>

      <button className="btn primary big" onClick={onGoToLessons} data-testid="btn-continue-learning">
        📚 Seguir aprendiendo
      </button>
    </section>
  );
}
