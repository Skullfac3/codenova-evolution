import { useMemo, useState } from 'react';
import type { DurationMinutes, Lesson } from '../types/lesson';
import { exercisesFor, scoreEvaluation, scoreLesson } from '../learning/validate';
import { useProgress, type CompletionOutcome } from '../store/progress';
import { ERAS } from '../learning/lessons';
import { ExerciseRunner } from './ExerciseRunner';
import { Markdown } from './Markdown';
import { Quiz } from './Quiz';

type Step =
  | { kind: 'intro' }
  | { kind: 'quiz' }
  | { kind: 'exercise'; index: number }
  | { kind: 'failed'; score: number }
  | { kind: 'reward'; score: number; outcome: CompletionOutcome };

interface Props {
  lesson: Lesson;
  onExit: () => void;
  onNext: (nextId: string | null) => void;
}

export function LessonPlayer({ lesson, onExit, onNext }: Props) {
  const completeLesson = useProgress((s) => s.completeLesson);
  const [step, setStep] = useState<Step>({ kind: 'intro' });
  const [duration, setDuration] = useState<DurationMinutes>(5);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [quizCorrect, setQuizCorrect] = useState(0);
  const isEval = lesson.kind === 'evaluation';
  const exercises = useMemo(() => (isEval ? [lesson.exercise] : exercisesFor(lesson, duration)), [lesson, duration, isEval]);

  const finish = (totalHints: number) => {
    const score = isEval ? scoreEvaluation(quizCorrect, lesson.quiz?.length ?? 0, true) : scoreLesson(true, totalHints);
    if (score < 60) return setStep({ kind: 'failed', score });
    const outcome = completeLesson(lesson.id, score, lesson.reward);
    setStep({ kind: 'reward', score, outcome });
  };

  const start = () => {
    setHintsUsed(0);
    setQuizCorrect(0);
    setStep(isEval ? { kind: 'quiz' } : { kind: 'exercise', index: 0 });
  };

  return (
    <article className="player" data-testid="player" data-lesson={lesson.id}>
      <header className="player-head">
        <button className="btn ghost small" onClick={onExit} data-testid="btn-exit">← Mapa</button>
        <h2>{lesson.title}</h2>
      </header>

      {step.kind === 'intro' && (
        <>
          <div className="speech">
            <div className="proto" aria-hidden>🤖</div>
            <p>{lesson.intro}</p>
          </div>
          <Markdown text={lesson.concept} />
          {lesson.example.code && (
            <div className="example">
              <p className="eyebrow">Ejemplo</p>
              <pre><code>{lesson.example.code}</code></pre>
              <p className="eyebrow">Resultado</p>
              <pre className="out">{lesson.example.output.join('\n')}</pre>
            </div>
          )}
          {!isEval && (
            <fieldset className="durations">
              <legend>¿Cuánto tiempo tienes?</legend>
              {([5, 10, 15] as const).map((m) => (
                <button key={m} className={`chip ${duration === m ? 'on' : ''}`} onClick={() => setDuration(m)} data-testid={`duration-${m}`} aria-pressed={duration === m}>
                  {m} min · {exercisesFor(lesson, m).length} {exercisesFor(lesson, m).length === 1 ? 'reto' : 'retos'}
                </button>
              ))}
            </fieldset>
          )}
          <button className="btn primary big" onClick={start} data-testid="btn-start">
            {isEval ? 'Comenzar evaluación' : '¡A practicar!'}
          </button>
        </>
      )}

      {step.kind === 'quiz' && lesson.quiz && (
        <Quiz
          questions={lesson.quiz}
          onDone={(c) => {
            setQuizCorrect(c);
            setStep({ kind: 'exercise', index: 0 });
          }}
        />
      )}

      {step.kind === 'exercise' && (
        <>
          <div className="progressbar" aria-label={`Reto ${step.index + 1} de ${exercises.length}`}>
            {exercises.map((_, i) => <span key={i} className={i < step.index ? 'done' : i === step.index ? 'now' : ''} />)}
          </div>
          <ExerciseRunner
            key={exercises[step.index]!.id}
            exercise={exercises[step.index]!}
            label={isEval ? 'Ejercicio práctico' : step.index === 0 ? 'Reto principal' : `Reto extra ${step.index}`}
            messages={lesson.feedback}
            onPassed={(h) => {
              const total = hintsUsed + h;
              setHintsUsed(total);
              if (step.index + 1 < exercises.length) setStep({ kind: 'exercise', index: step.index + 1 });
              else finish(total);
            }}
          />
        </>
      )}

      {step.kind === 'failed' && (
        <section className="reward fail" data-testid="eval-failed">
          <p className="big-emoji">🔥</p>
          <h3>Calificación: {step.score} / 100</h3>
          <p>{lesson.feedback.retry}</p>
          <p className="muted">Necesitas 60 puntos. Respondiste bien {quizCorrect} de {lesson.quiz?.length} preguntas.</p>
          <button className="btn primary" onClick={() => setStep({ kind: 'intro' })} data-testid="btn-retry">Intentar de nuevo</button>
        </section>
      )}

      {step.kind === 'reward' && (
        <section className="reward" data-testid="reward" data-awarded={step.outcome.awarded}>
          <p className="big-emoji">{step.outcome.eraUnlocked ? ERAS.find((e) => e.id === step.outcome.eraUnlocked)?.icon : '⭐'}</p>
          <h3>{isEval ? '¡Evaluación aprobada!' : '¡Lección completada!'}</h3>
          <p>Calificación: <strong data-testid="reward-score">{step.score}</strong> / 100</p>
          {step.outcome.awarded ? (
            <p className="loot">+{lesson.reward.xp} XP · +{lesson.reward.coins} NovaCoins</p>
          ) : (
            <p className="muted">Ya habías completado esta lección: practicar de nuevo no da recompensa extra.</p>
          )}
          {step.outcome.eraUnlocked !== null && (
            <p className="unlock" data-testid="era-unlocked" data-era={step.outcome.eraUnlocked}>
              ¡Desbloqueaste la Era {step.outcome.eraUnlocked}: {ERAS.find((e) => e.id === step.outcome.eraUnlocked)?.name}!
            </p>
          )}
          <button className="btn primary big" onClick={() => onNext(lesson.next)} data-testid="btn-next-lesson">
            {lesson.next ? 'Siguiente lección →' : 'Volver al mapa'}
          </button>
        </section>
      )}
    </article>
  );
}
