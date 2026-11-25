import React, { useState } from 'react';
import { CheckCircle2, XCircle, Flame, RotateCcw, ArrowRight } from 'lucide-react';
import { ALGORITHMS, QUIZ_QUESTIONS } from '../data/algorithms';

export const QuizMode: React.FC = () => {
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [finished, setFinished] = useState(false);

  const q = QUIZ_QUESTIONS[index];
  const algo = ALGORITHMS[q.algorithmId];
  const hasAnswered = selected !== null;
  const isCorrect = selected === q.correctIndex;

  const handleSelect = (optIdx: number) => {
    if (hasAnswered) return;
    setSelected(optIdx);
    if (optIdx === q.correctIndex) {
      setScore((s) => s + 1);
      setStreak((st) => st + 1);
    } else {
      setStreak(0);
    }
  };

  const handleNext = () => {
    if (index + 1 >= QUIZ_QUESTIONS.length) {
      setFinished(true);
    } else {
      setIndex((i) => i + 1);
      setSelected(null);
    }
  };

  const handleRestart = () => {
    setIndex(0);
    setSelected(null);
    setScore(0);
    setStreak(0);
    setFinished(false);
  };

  if (finished) {
    return (
      <div className="max-w-2xl mx-auto rounded-2xl border border-[#E7E5E0] bg-white p-8 text-center shadow-xs space-y-5">
        <div className="w-16 h-16 rounded-2xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-9 h-9" />
        </div>
        <div className="space-y-1">
          <h2 className="font-display font-bold text-2xl text-[#141413]">
            Kuis Selesai!
          </h2>
          <p className="text-sm text-[#575651]">
            Kamu menjawab benar <strong className="text-[#141413]">{score}</strong> dari{' '}
            <strong className="text-[#141413]">{QUIZ_QUESTIONS.length}</strong> pertanyaan.
          </p>
        </div>
        <button
          type="button"
          onClick={handleRestart}
          className="tactile-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#141413] text-white text-sm font-semibold"
        >
          <RotateCcw className="w-4 h-4" />
          Ulangi Kuis
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto rounded-2xl border border-[#E7E5E0] bg-white shadow-xs overflow-hidden">
      {/* Header */}
      <div className="px-5 py-3.5 border-b border-[#EFECE6] bg-[#FAF9F6] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ backgroundColor: algo.accentColor }}
          />
          <span className="font-display font-bold text-sm text-[#141413]">
            Topik: {algo.name}
          </span>
        </div>

        <div className="flex items-center gap-3 text-xs font-mono tabular-nums">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-[#F59E0B]/15 text-[#92400E] font-semibold">
            <Flame className="w-3.5 h-3.5 text-[#F59E0B]" />
            Streak: {streak}
          </span>
          <span className="text-[#6B6A65]">
            Soal {index + 1} / {QUIZ_QUESTIONS.length}
          </span>
        </div>
      </div>

      {/* Question Body */}
      <div className="p-5 sm:p-6 space-y-5">
        <h3 className="font-display font-bold text-base sm:text-lg text-[#141413] leading-snug">
          {q.question}
        </h3>

        <div className="space-y-2.5">
          {q.options.map((opt, idx) => {
            const isThisSelected = selected === idx;
            const isThisCorrect = idx === q.correctIndex;

            let style =
              'border-[#E7E5E0] bg-white hover:border-[#C9C5BC] hover:bg-[#FAF9F6] text-[#141413]';
            if (hasAnswered) {
              if (isThisCorrect) {
                style = 'border-[#10B981] bg-[#10B981]/10 text-[#065F46]';
              } else if (isThisSelected) {
                style = 'border-[#FF5A36] bg-[#FF5A36]/10 text-[#9A3412]';
              } else {
                style = 'border-[#EFECE6] bg-[#FAF9F6] text-[#8E8C84] opacity-70';
              }
            }

            return (
              <button
                key={idx}
                type="button"
                disabled={hasAnswered}
                onClick={() => handleSelect(idx)}
                className={`tactile-btn w-full text-left px-4 py-3 rounded-xl border text-sm font-medium flex items-center justify-between gap-3 ${style}`}
              >
                <span>{opt}</span>
                {hasAnswered && isThisCorrect && (
                  <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
                )}
                {hasAnswered && isThisSelected && !isThisCorrect && (
                  <XCircle className="w-4 h-4 text-[#FF5A36] shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Instant Explanation */}
        {hasAnswered && (
          <div
            className={`p-4 rounded-xl border text-xs sm:text-sm leading-relaxed flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
              isCorrect
                ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#065F46]'
                : 'bg-[#FF5A36]/10 border-[#FF5A36]/30 text-[#7C2D12]'
            }`}
          >
            <p>
              <strong>{isCorrect ? 'Tepat sekali! ' : 'Belum tepat. '}</strong>
              {q.explanation}
            </p>
            <button
              type="button"
              onClick={handleNext}
              className="tactile-btn shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#141413] text-white text-xs font-semibold"
            >
              <span>{index + 1 >= QUIZ_QUESTIONS.length ? 'Lihat Hasil' : 'Lanjut'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
