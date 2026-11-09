import { useCallback, useState } from 'react';
import type { Exercise, RunResult } from '../types/lesson';
import { validateWithTests, type ValidationResult } from '../learning/validate';
import { CodeSandbox } from '../editor/sandbox';
import { CodeEditor } from './CodeEditor';
import { protoSay } from '../store/proto';

const sandbox = new CodeSandbox({ timeoutMs: 2000 });

interface Props {
  exercise: Exercise;
  label: string;
  /** Era de la lección (decide los atajos del editor). */
  era: number;
  messages: { success: string; retry: string };
  /** Recompensa que se suma al completar la lección (se muestra al aprobar). */
  rewardLabel?: string;
  onPassed: (hintsUsed: number) => void;
}

export function ExerciseRunner({ exercise, label, era, messages, rewardLabel, onPassed }: Props) {
  const [code, setCode] = useState(exercise.starterCode);
  const [resetCount, setResetCount] = useState(0);
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<RunResult | null>(null);
  const [validation, setValidation] = useState<ValidationResult | null>(null);
  const [hintsShown, setHintsShown] = useState(0);

  const run = useCallback(async () => {
    setRunning(true);
    protoSay('Procesando…', 'thinking', 10000);
    const r = await sandbox.run(code);
    setResult(r);
    const v = await validateWithTests(exercise, code, r, (c) => sandbox.run(c));
    setValidation(v);
    if (v.passed) protoSay('¡Funciona! 🎉', 'happy', 3000);
    else protoSay(r.error || r.timedOut ? '¡Uy! Hubo un error. Lee la explicación.' : 'Casi… revisa lo que te marqué.', 'sad', 3500);
    setRunning(false);
  }, [code, exercise]);

  const reset = () => {
    setCode(exercise.starterCode);
    setResetCount((n) => n + 1);
    setResult(null);
    setValidation(null);
  };

  return (
    <section className="exercise" data-testid={`exercise-${exercise.id}`}>
      <p className="eyebrow">{label}</p>
      <p className="prompt" style={{ whiteSpace: 'pre-line' }}>{exercise.prompt}</p>

      <CodeEditor value={code} onChange={setCode} resetKey={`${exercise.id}-${resetCount}`} onRun={run} era={era} />

      <div className="row">
        <button className="btn primary" onClick={run} disabled={running} data-testid="btn-run">
          {running ? 'Ejecutando…' : '▶ Ejecutar'}
        </button>
        <button
          className="btn"
          onClick={() => {
            const n = Math.min(hintsShown + 1, exercise.hints.length);
            setHintsShown(n);
            protoSay(exercise.hints[n - 1]!, 'talking', 7000);
          }}
          disabled={hintsShown >= exercise.hints.length}
          data-testid="btn-hint"
        >
          💡 Pista ({exercise.hints.length - hintsShown})
        </button>
        <button className="btn ghost" onClick={reset} data-testid="btn-reset">↺ Reiniciar</button>
      </div>

      {hintsShown > 0 && (
        <ul className="hints" data-testid="hints">
          {exercise.hints.slice(0, hintsShown).map((h, i) => (
            <li key={i}>🤖 {h}</li>
          ))}
        </ul>
      )}

      <div className="console" data-testid="console" aria-live="polite">
        <span className="console-title">Consola</span>
        {result === null && <span className="muted">Ejecuta tu código para ver el resultado.</span>}
        {result?.logs.map((line, i) => (
          <div key={i} className="console-line">{line}</div>
        ))}
        {result?.error && <div className="console-line error">{result.error.name}: {result.error.message}</div>}
        {result?.timedOut && <div className="console-line error">⏱ Tiempo agotado</div>}
      </div>

      {validation && (
        <div className={`feedback ${validation.passed ? 'pass' : 'fail'}`} data-testid="feedback" data-status={validation.passed ? 'pass' : 'fail'}>
          <div className="proto" aria-hidden>🤖</div>
          <div>
            <p>
              <strong>Proto-0:</strong>{' '}
              {validation.passed
                ? messages.success
                : result?.error || result?.timedOut
                  ? '¡Uy! Tu programa se detuvo antes de terminar. Mira:'
                  : messages.retry}
            </p>
            {!validation.passed && (
              <ul>{validation.failures.map((f, i) => <li key={i}>{f}</li>)}</ul>
            )}
            {validation.passed && (
              <>
                {rewardLabel && <p className="muted">Recompensa al completar la lección: {rewardLabel}.</p>}
                <button className="btn primary" onClick={() => onPassed(hintsShown)} data-testid="btn-continue">
                  Continuar →
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
