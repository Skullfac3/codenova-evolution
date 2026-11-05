import { useEffect, useMemo, useRef } from 'react';
import { EditorState } from '@codemirror/state';
import { EditorView, keymap, lineNumbers, highlightActiveLine } from '@codemirror/view';
import { defaultKeymap, history, historyKeymap, indentWithTab } from '@codemirror/commands';
import { javascript, javascriptLanguage } from '@codemirror/lang-javascript';
import { syntaxHighlighting, defaultHighlightStyle, indentUnit } from '@codemirror/language';
import {
  autocompletion,
  completionKeymap,
  snippet,
  snippetCompletion,
  type CompletionContext,
} from '@codemirror/autocomplete';
import { snippetsForEra, type Snippet } from '../learning/snippets';

interface Props {
  value: string;
  onChange: (code: string) => void;
  /** Cambia la key para forzar un reinicio del contenido. */
  resetKey: string;
  onRun?: () => void;
  /** Era de la lección: decide qué atajos se ofrecen. */
  era: number;
}

/**
 * Editor del laboratorio con:
 *  - barra de atajos (código y símbolos) según la era,
 *  - autocompletado al escribir (p. ej. "log" → console.log),
 *  - campos editables: Tab salta al siguiente.
 */
export function CodeEditor({ value, onChange, resetKey, onRun, era }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const view = useRef<EditorView | null>(null);
  const onChangeRef = useRef(onChange);
  const onRunRef = useRef(onRun);
  onChangeRef.current = onChange;
  onRunRef.current = onRun;

  const snippets = useMemo(() => snippetsForEra(era), [era]);
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
          javascript(),
          javascriptLanguage.data.of({ autocomplete: source }),
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
  }, [resetKey, era]);

  const insert = (s: Snippet) => {
    const v = view.current;
    if (!v) return;
    const { from, to } = v.state.selection.main;
    snippet(s.template)(v, null, from, to);
    v.focus();
  };

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
        insert(s);
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
    <div className="editor-wrap">
      <div className="snip-bar" role="toolbar" aria-label="Atajos de código">
        <div className="snip-row">{codeSnippets.map(chip)}</div>
        <div className="snip-row">{symbols.map(chip)}</div>
      </div>
      <div className="editor" ref={host} data-testid="editor" />
      <p className="snip-tip">Tip: toca un atajo o escribe <code>log</code> y elige de la lista. <kbd>Tab</kbd> salta al siguiente campo.</p>
    </div>
  );
}
