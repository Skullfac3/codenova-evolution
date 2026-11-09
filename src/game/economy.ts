/**
 * Reglas de la economía y del refugio como funciones puras sobre la partida.
 * Son las mismas reglas que las funciones de Supabase (purchase_item,
 * transfer_pet): cuando haya cuentas, el servidor tendrá la última palabra.
 */
import type { Save } from '../services/storage/save';
import { COLS, ROWS, isLandmarkTile, itemById } from './items';

export type Result = { ok: true; save: Save } | { ok: false; reason: string };

const fail = (reason: string): Result => ({ ok: false, reason });

export function placedCount(save: Save, itemId: string): number {
  return Object.values(save.worlds).reduce((n, w) => n + w.objects.filter((o) => o.id === itemId).length, 0);
}

export function availableCount(save: Save, itemId: string): number {
  return (save.inventory[itemId] ?? 0) - placedCount(save, itemId);
}

export function buyItem(save: Save, itemId: string, newId: () => string = () => crypto.randomUUID()): Result {
  const item = itemById(itemId);
  if (!item) return fail('Ese objeto no existe.');
  if (!save.unlockedEras.includes(item.era)) return fail(`Se desbloquea en la Era ${item.era}.`);
  if (item.kind === 'outfit' && (save.inventory[itemId] ?? 0) > 0) return fail('Ya tienes este atuendo.');
  if (save.novacoins < item.price) return fail(`Te faltan ${item.price - save.novacoins} NovaCoins.`);

  const purchaseId = newId();
  const next: Save = {
    ...save,
    novacoins: save.novacoins - item.price,
    purchases: [
      ...(save.purchases ?? []),
      { id: purchaseId, itemId, price: item.price, at: new Date().toISOString() },
    ],
  };
  if (item.kind === 'pet') {
    next.pets = [...save.pets, { id: purchaseId, itemId, originEra: item.era, currentEra: item.era }];
  } else {
    next.inventory = { ...save.inventory, [itemId]: (save.inventory[itemId] ?? 0) + 1 };
  }
  return { ok: true, save: next };
}

export function placeObject(save: Save, era: number, itemId: string, x: number, y: number): Result {
  const item = itemById(itemId);
  if (!item || item.kind !== 'decoration') return fail('Solo se pueden colocar adornos.');
  if (!save.unlockedEras.includes(era)) return fail('Esa era aún no está desbloqueada.');
  if (x < 0 || y < 0 || x >= COLS || y >= ROWS || isLandmarkTile(x, y)) return fail('No se puede colocar ahí.');
  if (availableCount(save, itemId) <= 0) return fail('Ya colocaste todos los que tienes. Compra otro en la tienda.');
  const world = save.worlds[era] ?? { objects: [] };
  if (world.objects.some((o) => o.x === x && o.y === y)) return fail('Esa casilla ya está ocupada.');
  return {
    ok: true,
    save: { ...save, worlds: { ...save.worlds, [era]: { objects: [...world.objects, { id: itemId, x, y }] } } },
  };
}

export function removeObjectAt(save: Save, era: number, x: number, y: number): Result {
  const world = save.worlds[era];
  if (!world || !world.objects.some((o) => o.x === x && o.y === y)) return fail('No hay nada que quitar ahí.');
  return {
    ok: true,
    save: { ...save, worlds: { ...save.worlds, [era]: { objects: world.objects.filter((o) => !(o.x === x && o.y === y)) } } },
  };
}

export function equipOutfit(save: Save, outfitId: string | null): Result {
  if (outfitId === null) {
    const { equippedOutfit: _drop, ...rest } = save;
    return { ok: true, save: rest };
  }
  if ((save.inventory[outfitId] ?? 0) <= 0) return fail('Primero compra ese atuendo.');
  return { ok: true, save: { ...save, equippedOutfit: outfitId } };
}

/** Igual que transfer_pet(): solo UNA mascota puede llegar a cada era desde otra. */
export function transferPet(save: Save, petId: string, toEra: number): Result {
  const pet = save.pets.find((p) => p.id === petId);
  if (!pet) return fail('Esa mascota no existe.');
  if (!save.unlockedEras.includes(toEra)) return fail('Esa era aún no está desbloqueada.');
  const alreadyTransferred = save.pets.some((p) => p.currentEra === toEra && p.originEra !== toEra && p.id !== petId);
  if (toEra !== pet.originEra && alreadyTransferred) return fail('Ya llevaste una mascota a esta era.');
  return { ok: true, save: { ...save, pets: save.pets.map((p) => (p.id === petId ? { ...p, currentEra: toEra } : p)) } };
}

/** Mascotas que se pueden traer a una era (vienen de otra y aún no hay una transferida). */
export function transferablePets(save: Save, toEra: number) {
  const already = save.pets.some((p) => p.currentEra === toEra && p.originEra !== toEra);
  if (already) return [];
  return save.pets.filter((p) => p.currentEra !== toEra && p.originEra < toEra);
}
