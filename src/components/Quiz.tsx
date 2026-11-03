import { useState } from 'react';
import type { QuizQuestion } from '../types/lesson';

export function Quiz({ questions, onDone }: { questions: QuizQuestion[]; onDone: (correct: number) => void }) {
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [correct, setCorrect] = useState(0);
  const q = questions[index]!;
  const isLast = index === questions.length - 1;

  const pick = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    if (i === q.correctIndex) setCorrect((c) => c + 1);
  };

  const next = () => {
    if (isLast) return onDone(correct);
    setIndex(index + 1);
    setPicked(null);
  };

  return (
    <section className="quiz" data-testid="quiz">
      <p className="eyebrow">Pregunta {index + 1} de {questions.length}</p>
      <p className="prompt">{q.prompt}</p>
      <div className="options">
        {q.options.map((opt, i) => {
          const state = picked === null ? '' : i === q.correctIndex ? 'right' : i === picked ? 'wrong' : 'dim';
          return (
            <button key={i} className={`option ${state}`} onClick={() => pick(i)} data-testid={`quiz-option-${i}`} disabled={picked !== null}>
              <code>{opt}</code>
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <div className={`feedback ${picked === q.correctIndex ? 'pass' : 'fail'}`} data-testid="quiz-feedback">
          <div className="proto" aria-hidden>🤖</div>
          <div>
            <p><strong>{picked === q.correctIndex ? '¡Correcto!' : 'No exactamente.'}</strong> {q.explanation}</p>
            <button className="btn primary" onClick={next} data-testid="btn-next-question">
              {isLast ? 'Ir al ejercicio práctico →' : 'Siguiente →'}
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
