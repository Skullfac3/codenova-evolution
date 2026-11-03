/**
 * Sandbox del laboratorio de CodeNova.
 *
 * Dos capas de aislamiento:
 *
 *  1. <iframe sandbox="allow-scripts"> SIN allow-same-origin
 *     → el iframe tiene un origen opaco: no puede leer el DOM, las cookies,
 *       localStorage ni la sesión de Supabase de la app.
 *     → una CSP dentro del iframe bloquea toda conexión de red.
 *
 *  2. Un Web Worker creado DENTRO del iframe ejecuta el código.
 *     → corre en otro hilo: un `while (true) {}` no congela la app,
 *       y el iframe lo detiene con worker.terminate() al vencer el tiempo.
 *     → cada ejecución usa un worker nuevo (estado limpio).
 *
 * Además, la app tiene un temporizador de respaldo: si el iframe deja de
 * responder, se destruye y se crea uno nuevo.
 */
import type { RunResult } from '../types/lesson';

export interface SandboxOptions {
  /** Tiempo máximo de ejecución en ms. */
  timeoutMs?: number;
  /** Máximo de líneas de consola capturadas. */
  maxLogs?: number;
}

/** Código que corre dentro del worker. Se serializa como texto. */
function workerMain() {
  const MAX_LINE = 2000;
  let maxLogs = 200;
  let count = 0;

  const fmt = (v: unknown): string => {
    if (typeof v === 'string') return v;
    if (v === undefined) return 'undefined';
    if (typeof v === 'function') return `[función ${(v as { name?: string }).name || 'anónima'}]`;
    if (typeof v === 'object' && v !== null) {
      try {
        return JSON.stringify(v);
      } catch {
        return String(v);
      }
    }
    return String(v);
  };
  const log = (...args: unknown[]) => {
    count++;
    if (count > maxLogs) return;
    const text = args.map(fmt).join(' ').slice(0, MAX_LINE);
    postMessage({ type: 'log', text });
  };

  const g = self as unknown as Record<string, unknown>;
  g.console = { log, info: log, warn: log, error: log };
  // Defensa extra (la CSP ya bloquea la red):
  for (const name of ['fetch', 'XMLHttpRequest', 'WebSocket', 'EventSource', 'importScripts', 'indexedDB', 'caches']) {
    try {
      g[name] = undefined;
    } catch {
      /* algunas propiedades no son configurables */
    }
  }

  self.onmessage = (event: MessageEvent<{ code: string; maxLogs: number }>) => {
    maxLogs = event.data.maxLogs;
    try {
      // eslint-disable-next-line @typescript-eslint/no-implied-eval
      new Function('"use strict";\n' + event.data.code)();
      postMessage({ type: 'done', truncated: count > maxLogs });
    } catch (e) {
      const err = e as Error;
      postMessage({
        type: 'done',
        truncated: count > maxLogs,
        error: { name: String(err?.name ?? 'Error'), message: String(err?.message ?? err) },
      });
    }
  };
}

/** Página del iframe: recibe código de la app, lo corre en un worker y devuelve resultados. */
const RUNNER_HTML = `<!doctype html>
<meta charset="utf-8">
<meta http-equiv="Content-Security-Policy"
      content="default-src 'none'; script-src 'unsafe-inline' 'unsafe-eval' blob:; worker-src blob:; connect-src 'none'">
<script>
  const workerSource = '(' + ${JSON.stringify(workerMain.toString())} + ')()';
  const workerUrl = URL.createObjectURL(new Blob([workerSource], { type: 'text/javascript' }));

  window.addEventListener('message', (event) => {
    if (event.source !== parent) return;
    const { id, code, timeoutMs, maxLogs } = event.data || {};
    if (typeof code !== 'string') return;

    const worker = new Worker(workerUrl);
    const reply = (msg) => parent.postMessage({ id, ...msg }, '*');
    const timer = setTimeout(() => {
      worker.terminate();
      reply({ type: 'done', timedOut: true });
    }, timeoutMs);

    worker.onmessage = (e) => {
      if (e.data.type === 'done') {
        clearTimeout(timer);
        worker.terminate();
      }
      reply(e.data);
    };
    worker.onerror = (e) => {
      e.preventDefault();
      clearTimeout(timer);
      worker.terminate();
      reply({ type: 'done', error: { name: 'Error', message: e.message || 'Error desconocido' } });
    };
    worker.postMessage({ code, maxLogs });
  });

  parent.postMessage({ type: 'ready' }, '*');
</script>`;

export class CodeSandbox {
  private iframe: HTMLIFrameElement | null = null;
  private ready: Promise<void> | null = null;
  private nextId = 1;
  private readonly timeoutMs: number;
  private readonly maxLogs: number;

  constructor(options: SandboxOptions = {}) {
    this.timeoutMs = options.timeoutMs ?? 2000;
    this.maxLogs = options.maxLogs ?? 200;
  }

  private mount(): Promise<void> {
    if (this.ready) return this.ready;
    const iframe = document.createElement('iframe');
    iframe.setAttribute('sandbox', 'allow-scripts'); // ← nunca agregar allow-same-origin
    iframe.setAttribute('referrerpolicy', 'no-referrer');
    iframe.setAttribute('aria-hidden', 'true');
    iframe.tabIndex = -1;
    iframe.style.cssText = 'position:absolute;width:0;height:0;border:0;visibility:hidden';
    iframe.srcdoc = RUNNER_HTML;

    this.ready = new Promise((resolve) => {
      const onReady = (e: MessageEvent) => {
        if (e.source === iframe.contentWindow && e.data?.type === 'ready') {
          window.removeEventListener('message', onReady);
          resolve();
        }
      };
      window.addEventListener('message', onReady);
    });
    document.body.appendChild(iframe);
    this.iframe = iframe;
    return this.ready;
  }

  /** Ejecuta código del estudiante y devuelve su salida. Nunca lanza excepciones. */
  async run(code: string): Promise<RunResult> {
    await this.mount();
    const iframe = this.iframe!;
    const id = this.nextId++;
    const logs: string[] = [];

    return new Promise<RunResult>((resolve) => {
      const finish = (result: RunResult) => {
        window.removeEventListener('message', onMessage);
        clearTimeout(backstop);
        resolve(result);
      };
      const onMessage = (e: MessageEvent) => {
        if (e.source !== iframe.contentWindow || e.data?.id !== id) return;
        const msg = e.data;
        if (msg.type === 'log' && logs.length < this.maxLogs) logs.push(String(msg.text));
        if (msg.type === 'done') {
          if (msg.truncated) logs.push(`… salida recortada a ${this.maxLogs} líneas`);
          finish({ logs, error: msg.error, timedOut: msg.timedOut });
        }
      };
      // Respaldo: si el iframe no responde, se reinicia.
      const backstop = setTimeout(() => {
        this.destroy();
        finish({ logs, timedOut: true });
      }, this.timeoutMs + 1000);

      window.addEventListener('message', onMessage);
      iframe.contentWindow!.postMessage({ id, code, timeoutMs: this.timeoutMs, maxLogs: this.maxLogs }, '*');
    });
  }

  destroy(): void {
    this.iframe?.remove();
    this.iframe = null;
    this.ready = null;
  }
}
