import { useEffect, useMemo, useRef, useState } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { javascript, javascriptLanguage } from '@codemirror/lang-javascript';
import { html, htmlLanguage } from '@codemirror/lang-html';
import { syntaxHighlighting, defaultHighlightStyle, indentUnit } from '@codemirror/language';
import {
  autocompletion,
  completionKeymap,
  snippet,
  snippetCompletion,
  type CompletionContext,
} from '@codemirror/autocomplete';
import { snippetsFor, type Snippet } from '../learning/snippets';
import type { Lesson } from '../types/lesson';
import { play } from '../game/sound';

/**
 * Precalienta el editor y los lenguajes que usa una lección, para
 * llamarlo mientras el estudiante lee la introducción (LessonPlayer).
 * Los lenguajes se resuelven por importación dinámica y quedan en
 * caché del navegador; el editor los reutiliza al montarse.
 */
export function preloadEditorLanguages(lesson: Lesson) {
  const languages = new Set<'js' | 'html'>([lesson.exercise.language ?? 'js']);
  for (const ex of lesson.extraChallenges) languages.add(ex.language ?? 'js');
  for (const language of languages) {
    if (language === 'html') void import('@codemirror/lang-html');
    else void import('@codemirror/lang-javascript');
  }
}

interface Props {
  value: string;
  onChange: (code: string) => void;
  /** Cambia la key para forzar un reinicio del contenido. */
  resetKey: string;
  onRun?: () => void;
  /** Era de la lección: decide qué atajos se ofrecen. */
  era: number;
  /** Lenguaje del ejercicio: decide el resaltado y los atajos. Por defecto 'js'. */
  language?: 'js' | 'html';
}

/**
 * Editor del laboratorio con:
 *  - barra de atajos (código y símbolos) según la era,
 *  - autocompletado al escribir (p. ej. "log" → console.log),
 *  - campos editables: Tab salta al siguiente.
 */
export function CodeEditor({ value, onChange, resetKey, onRun, era, language = 'js' }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const onRunRef = useRef(onRun);
  onChangeRef.current = onChange;
  onRunRef.current = onRun;

  const snippets = useMemo(() => snippetsFor(era, language), [era, language]);
  const codeSnippets = snippets.filter((s) => s.kind === 'code');
  const symbols = snippets.filter((s) => s.kind === 'symbol');

  useEffect(() => {
    const completions = codeSnippets.map((s) =>
      snippetCompletion(s.template, { label: s.label.replace(/^\./, ''), detail: s.detail, type: 'keyword' }),
    );
    const source = (ctx: CompletionContext) => {
      const word = ctx.matchBefore(/[\w.]+/);
      if (!word || (word.from === word.to && !ctx.explicit)) return null;
      return { from: word.from, options: completions, validFor: /^[\w.]*$/ };
    };

    const editor = new EditorView({
      parent: host.current!,
      state: EditorState.create({
        doc: value,
        extensions: [
          lineNumbers(),
          highlightActiveLine(),
          history(),
          language === 'html' ? html() : javascript(),
          (language === 'html' ? htmlLanguage : javascriptLanguage).data.of({ autocomplete: source }),
          autocompletion({ icons: false }),
          indentUnit.of('  '),
          syntaxHighlighting(defaultHighlightStyle),
          keymap.of([
            { key: 'Mod-Enter', run: () => (onRunRef.current?.(), true) },
            ...completionKeymap,
            indentWithTab,
            ...defaultKeymap,
            ...historyKeymap,
          ]),
          EditorView.lineWrapping,
          EditorView.contentAttributes.of({
            'aria-label': 'Editor de código',
            autocapitalize: 'off',
            autocorrect: 'off',
            spellcheck: 'false',
          }),
          EditorView.updateListener.of((u) => u.docChanged && onChangeRef.current(u.state.doc.toString())),
        ],
      }),
    });
    view.current = editor;
    return () => {
      editor.destroy();
      view.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey, era, language]);

  // ── Modo escritura en el celular ──
  // Mientras el editor tiene el foco: se ocultan las pestañas y el pie, el
  // encabezado deja de quedarse fijo, Proto-0 se encoge, la barra de atajos
  // se pega justo encima del teclado y el editor ocupa el espacio que queda.
  const wrap = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    if (!typing) return;
    const root = document.documentElement;
    const vv = window.visualViewport;
    document.body.classList.add('typing');
    const sync = () => {
      const h = vv?.height ?? window.innerHeight;
      const kb = vv ? Math.max(0, window.innerHeight - vv.height - vv.offsetTop) : 0;
      root.style.setProperty('--vvh', `${Math.round(h)}px`);
      root.style.setProperty('--kb-offset', `${Math.round(kb)}px`);
      root.style.setProperty('--snip-h', `${bar.current?.offsetHeight ?? 0}px`);
    };
    sync();
    // Cuando el teclado termina de abrir, el editor sube al borde superior.
    const toTop = setTimeout(() => { sync(); host.current?.scrollIntoView({ block: 'start' }); }, 350);
    vv?.addEventListener('resize', sync);
    vv?.addEventListener('scroll', sync);
    window.addEventListener('resize', sync);
    return () => {
      clearTimeout(toTop);
      vv?.removeEventListener('resize', sync);
      vv?.removeEventListener('scroll', sync);
      window.removeEventListener('resize', sync);
      document.body.classList.remove('typing');
      for (const v of ['--vvh', '--kb-offset', '--snip-h']) root.style.removeProperty(v);
    };
  }, [typing]);

  // Solo en pantallas táctiles: en computadora no hay teclado en pantalla que tape nada.
  const onFocusIn = () => setTyping(window.matchMedia('(pointer: coarse)').matches);
  // Al tocar un atajo el foco no se pierde. Si se va a otro lado (p. ej. «Ejecutar»),
  // se sale del modo DESPUÉS de que ese toque termine: si la pantalla cambiara a
  // mitad del toque, el clic caería en otro elemento y se perdería.
  const onFocusOut = (e: React.FocusEvent) => {
    if (wrap.current?.contains(e.relatedTarget as Node | null)) return;
    let done = false;
    const exit = () => {
      if (done) return;
      done = true;
      window.removeEventListener('click', afterClick, true);
      clearTimeout(fallback);
      requestAnimationFrame(() => {
        if (!wrap.current?.contains(document.activeElement)) setTyping(false);
      });
    };
    const afterClick = () => setTimeout(exit, 0);
    window.addEventListener('click', afterClick, true);
    const fallback = setTimeout(exit, 400); // salió sin tocar nada (p. ej. con Tab)
  };

  const insert = (s: Snippet) => {
    const v = view.current;
    if (!v) return;
    const { from, to } = v.state.selection.main;
    snippet(s.template)(v, null, from, to);
    play('tick');
    v.focus();
  };

  /**
   * Un toque real, no un desplazamiento: en táctil, pointerdown se dispara
   * al empezar CUALQUIER gesto sobre el botón, incluido desplazar la cinta
   * para ver más atajos. Antes eso insertaba el atajo aunque el usuario
   * solo estuviera recorriendo la cinta.
   *
   * Se guarda la posición al presionar y solo se inserta al soltar si el
   * dedo apenas se movió (umbral ~10px); si el navegador toma el gesto
   * para desplazar, llega pointercancel y no se inserta nada.
   */
  const pressRef = useRef<{ x: number; y: number; snippet: Snippet } | null>(null);
  const TAP_SLOP_PX = 10;

  // pointerdown + preventDefault: el editor no pierde el foco y el teclado del celular no se cierra.
  const chip = (s: Snippet) => (
    <button
      key={s.id}
      type="button"
      className={`snip ${s.kind}`}
      title={s.detail}
      aria-label={`Insertar ${s.detail}`}
      data-testid={`snip-${s.id}`}
      onPointerDown={(e) => {
        e.preventDefault();
        pressRef.current = { x: e.clientX, y: e.clientY, snippet: s };
      }}
      onPointerUp={(e) => {
        const press = pressRef.current;
        pressRef.current = null;
        if (!press) return;
        const moved = Math.hypot(e.clientX - press.x, e.clientY - press.y);
        if (moved <= TAP_SLOP_PX) insert(press.snippet);
      }}
      onPointerCancel={() => {
        pressRef.current = null;
      }}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          insert(s);
        }
      }}
    >
      {s.label}
    </button>
  );

  return (
    <div className="editor-wrap" ref={wrap} onFocus={onFocusIn} onBlur={onFocusOut} data-typing={typing}>
      <div className="snip-bar" ref={bar} role="toolbar" aria-label="Atajos de código" data-testid="snip-bar">
        <div className="snip-row">
          {onRun && (
            <button
              type="button"
              className="snip run"
              aria-label="Ejecutar código"
              data-testid="snip-run"
              onPointerDown={(e) => e.preventDefault()}
              onClick={() => onRunRef.current?.()}
            >
              ▶
            </button>
          )}
          {codeSnippets.map(chip)}
        </div>
        <div className="snip-row">{symbols.map(chip)}</div>
      </div>
      <div className="editor" ref={host} data-testid="editor" />
      <p className="snip-tip">
        {language === 'html'
          ? <>Tip: toca un atajo o escribe <code>h1</code> y elige de la lista. <kbd>Tab</kbd> salta al siguiente campo.</>
          : <>Tip: toca un atajo o escribe <code>log</code> y elige de la lista. <kbd>Tab</kbd> salta al siguiente campo.</>}
      </p>
    </div>
  );
}
