import React, { useState } from 'react';
import {
  CheckCircle2,
  XCircle,
  Flame,
  RotateCcw,
  ArrowRight,
  Trophy,
  Sparkles,
} from 'lucide-react';
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
  const progressPct = Math.round(((index + (hasAnswered ? 1 : 0)) / QUIZ_QUESTIONS.length) * 100);

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
      <div className="flex-1 min-h-0 flex items-center justify-center">
        <div className="max-w-xl w-full rounded-2xl border border-[#E7E5E0] dark:border-[#2A2A26] bg-white dark:bg-[#1A1A18] p-8 text-center shadow-xs space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-[#10B981]/15 text-[#10B981] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-9 h-9" />
          </div>
          <div className="space-y-1">
            <h2 className="font-display font-bold text-2xl text-[#141413] dark:text-[#F4F4F0]">
              Kuis Sorting Selesai!
            </h2>
            <p className="text-sm text-[#575651] dark:text-[#A6A49C]">
              Kamu menjawab benar{' '}
              <strong className="text-[#141413] dark:text-[#F4F4F0]">{score}</strong> dari{' '}
              <strong className="text-[#141413] dark:text-[#F4F4F0]">
                {QUIZ_QUESTIONS.length}
              </strong>{' '}
              pertanyaan.
            </p>
          </div>
          <button
            type="button"
            onClick={handleRestart}
            className="tactile-btn inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#141413] dark:bg-[#F4F4F0] text-white dark:text-[#141413] text-sm font-semibold"
          >
            <RotateCcw className="w-4 h-4" />
            Ulangi Kuis
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-3.5">
      {/* Left Bento Tile: Quiz Progress, Score & Topic Brief */}
      <div className="lg:col-span-4 rounded-2xl border border-[#E7E5E0] dark:border-[#2A2A26] bg-white dark:bg-[#1A1A18] p-4 sm:p-5 shadow-xs flex flex-col justify-between gap-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#6B6A65] dark:text-[#A6A49C]">
              Kuis Sorting
            </span>
            <span className="font-mono text-xs font-bold text-[#141413] dark:text-[#F4F4F0] tabular-nums">
              Soal {index + 1} / {QUIZ_QUESTIONS.length}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-1.5">
            <div className="h-2 w-full rounded-full bg-[#EFECE6] dark:bg-[#252522] overflow-hidden">
              <div
                className="h-full rounded-full bg-[#FF5A36] transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-[#6B6A65] dark:text-[#A6A49C] font-mono tabular-nums">
              <span>Progres</span>
              <span>{progressPct}%</span>
            </div>
          </div>

          {/* Score & Streak Bento Mini Cards */}
          <div className="grid grid-cols-2 gap-2.5">
            <div className="p-3 rounded-xl bg-[#FAF9F6] dark:bg-[#22221F] border border-[#EFECE6] dark:border-[#2E2E2A]">
              <div className="flex items-center gap-1.5 text-xs text-[#6B6A65] dark:text-[#A6A49C] mb-1">
                <Trophy className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Skor Benar</span>
              </div>
              <span className="font-display font-bold text-xl text-[#141413] dark:text-[#F4F4F0] tabular-nums">
                {score}
              </span>
            </div>
            <div className="p-3 rounded-xl bg-[#FAF9F6] dark:bg-[#22221F] border border-[#EFECE6] dark:border-[#2E2E2A]">
              <div className="flex items-center gap-1.5 text-xs text-[#6B6A65] dark:text-[#A6A49C] mb-1">
                <Flame className="w-3.5 h-3.5 text-[#F59E0B]" />
                <span>Streak</span>
              </div>
              <span className="font-display font-bold text-xl text-[#F59E0B] tabular-nums">
                {streak}x
              </span>
            </div>
          </div>

          {/* Topic Context Card */}
          <div className="p-3.5 rounded-xl bg-[#FAF9F6] dark:bg-[#22221F] border border-[#EFECE6] dark:border-[#2E2E2A] space-y-1.5">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: algo.accentColor }}
              />
              <span className="font-display font-bold text-sm text-[#141413] dark:text-[#F4F4F0]">
                {algo.name}
              </span>
            </div>
            <p className="text-xs text-[#575651] dark:text-[#A6A49C] leading-relaxed">
              {algo.tagline}
            </p>
            <div className="pt-1 flex items-center gap-2 text-[11px] font-mono text-[#6B6A65] dark:text-[#A6A49C]">
              <span>Level: {algo.difficulty}</span>
              <span>•</span>
              <span>Space: {algo.complexity.space}</span>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-2 text-xs text-[#6B6A65] dark:text-[#A6A49C] pt-3 border-t border-[#EFECE6] dark:border-[#2A2A26]">
          <Sparkles className="w-3.5 h-3.5 text-[#FF5A36] shrink-0" />
          <span>Pilih jawaban di panel kanan untuk melihat pembahasan langsung.</span>
        </div>
      </div>

      {/* Right Bento Tile: Question & Options */}
      <div className="lg:col-span-8 rounded-2xl border border-[#E7E5E0] dark:border-[#2A2A26] bg-white dark:bg-[#1A1A18] shadow-xs flex flex-col justify-between overflow-hidden">
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto bento-scroll">
          <div className="space-y-1.5">
            <span
              className="inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold text-white"
              style={{ backgroundColor: algo.accentColor }}
            >
              Pertanyaan #{index + 1} • {algo.name}
            </span>
            <h3 className="font-display font-bold text-lg sm:text-xl text-[#141413] dark:text-[#F4F4F0] leading-snug">
              {q.question}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {q.options.map((opt, idx) => {
              const isThisSelected = selected === idx;
              const isThisCorrect = idx === q.correctIndex;

              let style =
                'border-[#E7E5E0] dark:border-[#2E2E2A] bg-[#FAF9F6] dark:bg-[#22221F] hover:border-[#C9C5BC] dark:hover:border-[#42423D] hover:bg-white dark:hover:bg-[#2A2A26] text-[#141413] dark:text-[#F4F4F0]';
              if (hasAnswered) {
                if (isThisCorrect) {
                  style =
                    'border-[#10B981] bg-[#10B981]/10 text-[#065F46] dark:text-[#6EE7B7]';
                } else if (isThisSelected) {
                  style =
                    'border-[#FF5A36] bg-[#FF5A36]/10 text-[#9A3412] dark:text-[#FDBA74]';
                } else {
                  style =
                    'border-[#EFECE6] dark:border-[#262622] bg-[#FAF9F6] dark:bg-[#171715] text-[#8E8C84] opacity-65';
                }
              }

              return (
                <button
                  key={idx}
                  type="button"
                  disabled={hasAnswered}
                  onClick={() => handleSelect(idx)}
                  className={`tactile-btn w-full text-left p-4 rounded-xl border text-sm font-medium flex items-start justify-between gap-3 ${style}`}
                >
                  <div className="flex items-start gap-2.5">
                    <span className="w-6 h-6 rounded-lg bg-white dark:bg-[#1A1A18] border border-[#E7E5E0] dark:border-[#2E2E2A] font-mono text-xs font-bold flex items-center justify-center shrink-0">
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </div>
                  {hasAnswered && isThisCorrect && (
                    <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  )}
                  {hasAnswered && isThisSelected && !isThisCorrect && (
                    <XCircle className="w-4 h-4 text-[#FF5A36] shrink-0 mt-0.5" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Instant Explanation Footer */}
        <div className="shrink-0 p-4 sm:px-6 border-t border-[#EFECE6] dark:border-[#2A2A26] bg-[#FAF9F6] dark:bg-[#151513]">
          {hasAnswered ? (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p
                className={`text-xs sm:text-sm leading-relaxed ${
                  isCorrect
                    ? 'text-[#065F46] dark:text-[#6EE7B7]'
                    : 'text-[#9A3412] dark:text-[#FDBA74]'
                }`}
              >
                <strong>{isCorrect ? 'Tepat sekali! ' : 'Belum tepat. '}</strong>
                {q.explanation}
              </p>
              <button
                type="button"
                onClick={handleNext}
                className="tactile-btn shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#141413] dark:bg-[#F4F4F0] text-white dark:text-[#141413] text-xs font-semibold"
              >
                <span>{index + 1 >= QUIZ_QUESTIONS.length ? 'Lihat Hasil' : 'Soal Berikutnya'}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <p className="text-xs text-[#6B6A65] dark:text-[#A6A49C]">
              Klik salah satu dari 4 opsi jawaban (A, B, C, atau D) di atas.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
