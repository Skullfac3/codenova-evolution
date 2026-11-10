#!/usr/bin/env node
/**
 * Descarga las fuentes de CodeNova (OFL) en `src/assets/fonts/`.
 *
 * Por qué existe este script: las fuentes se alojan en el propio sitio
 * (nada de Google Fonts en tiempo de ejecución: Brave las frena y
 * Safari suma una ida y vuelta), pero los woff2 son binarios y no se
 * guardan en el repo. El build las descarga de Google Fonts con las
 * URLs y los hashes SHA-256 fijados aquí, así que el resultado es
 * determinista: si Google cambiara un byte, el build falla en vez de
 * publicar una fuente distinta sin avisar.
 *
 * Origen de las URLs: la hoja css2 de Google Fonts pedida con un
 * User-Agent de Chrome (para obtener woff2), subconjunto `latin`
 * (cubre el español: á é í ó ú ñ ¿ ¡). Las tres son variables salvo
 * Press Start 2P:
 *   - Nunito: variable wght 200-1000 (un solo archivo para 400/700/800)
 *   - JetBrains Mono: variable wght 400-800 (un solo archivo para 400/600)
 *   - Press Start 2P: estática, peso 400
 * Licencias: las tres son OFL (SIL Open Font License), se pueden alojar.
 *
 * Si los archivos ya existen y su hash coincide, no toca la red: los
 * rebuilds sin conexión funcionan.
 */
import { createHash } from 'node:crypto';
import { mkdir, readFile, rename, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const dir = join(dirname(fileURLToPath(import.meta.url)), '..', 'src', 'assets', 'fonts');

/** nombre de archivo -> { url, sha256 } */
const FONTS = {
  'nunito.woff2': {
    url: 'https://fonts.gstatic.com/s/nunito/v32/XRXV3I6Li01BKofINeaB.woff2',
    sha256: 'ba344451eab25b217a165363b1982048a5e5830a0daf36577973955a04cac793',
  },
  'jetbrains-mono.woff2': {
    url: 'https://fonts.gstatic.com/s/jetbrainsmono/v24/tDbv2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKwBNntkaToggR7BYRbKPxDcwg.woff2',
    sha256: '83c005d49d8a6a50474c73a5a36ac0468076e9c4a29da7bdb14995d80560a5be',
  },
  'press-start-2p.woff2': {
    url: 'https://fonts.gstatic.com/s/pressstart2p/v16/e3t4euO8T-267oIAQAu6jDQyK3nVivM.woff2',
    sha256: 'afec86997fdaf54af1f59358fa2c1e2a0f1d04146edad18e5cd141d0384a7548',
  },
};

const sha256 = (buf) => createHash('sha256').update(buf).digest('hex');

let failed = false;
await mkdir(dir, { recursive: true });
for (const [name, { url, sha256: expected }] of Object.entries(FONTS)) {
  const path = join(dir, name);
  try {
    const existing = await readFile(path);
    if (sha256(existing) === expected) {
      console.log(`fuentes: ${name} ya está (hash ok)`);
      continue;
    }
    console.log(`fuentes: ${name} existe pero su hash no coincide, se vuelve a descargar`);
  } catch {
    // No existe: se descarga.
  }
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (sha256(buf) !== expected) {
      throw new Error(`hash no coincide: esperado ${expected}, obtenido ${sha256(buf)}`);
    }
    const tmp = `${path}.tmp-${process.pid}`;
    await writeFile(tmp, buf);
    await rename(tmp, path);
    console.log(`fuentes: ${name} descargado (${buf.length} bytes, hash ok)`);
  } catch (e) {
    console.error(`fuentes: NO se pudo obtener ${name} de ${url}: ${e.message}`);
    failed = true;
  }
}
if (failed) {
  console.error('fuentes: faltan archivos de fuentes; el build no puede continuar sin ellos.');
  process.exit(1);
}
