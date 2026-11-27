import React, { useEffect, useMemo, useState } from 'react';
import { Play, Pause, RotateCcw, Shuffle, Trophy, Swords, Crosshair } from 'lucide-react';
import { SEARCH_ALGORITHMS, SEARCH_ALGORITHM_ORDER } from '../data/searchAlgorithms';
import { generateSearchArray, generateSearchSteps } from '../algorithms/searchGenerators';
import { SearchAlgorithmId } from '../types/searching';
import { SearchStage } from './SearchStage';

export const SearchRaceMode: React.FC = () => {
  const [algoA, setAlgoA] = useState<SearchAlgorithmId>('linear');
  const [algoB, setAlgoB] = useState<SearchAlgorithmId>('binary');
  const [arraySize, setArraySize] = useState<number>(15);
  const [values, setValues] = useState<number[]>(() => generateSearchArray(15, true));
  const [target, setTarget] = useState<number>(() => values[Math.floor(values.length * 0.75)] ?? 50);
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const stepsA = useMemo(
    () => generateSearchSteps(algoA, values, target),
    [algoA, values, target]
  );
  const stepsB = useMemo(
    () => generateSearchSteps(algoB, values, target),
    [algoB, values, target]
  );

  const maxSteps = Math.max(stepsA.length, stepsB.length);
  const currentA = stepsA[Math.min(stepIdx, stepsA.length - 1)];
  const currentB = stepsB[Math.min(stepIdx, stepsB.length - 1)];

  const bothDone =
    stepIdx >= stepsA.length - 1 && stepIdx >= stepsB.length - 1;

  useEffect(() => {
    if (!isPlaying) return;
    if (bothDone) {
      setIsPlaying(false);
      return;
    }
    const timer = window.setTimeout(() => {
      setStepIdx((prev) => Math.min(prev + 1, maxSteps - 1));
    }, 380);
    return () => window.clearTimeout(timer);
  }, [isPlaying, stepIdx, bothDone, maxSteps]);

  const handleNewData = (newSize: number = arraySize) => {
    setIsPlaying(false);
    setArraySize(newSize);
    const nextVals = generateSearchArray(newSize, true);
    setValues(nextVals);
    setTarget(nextVals[Math.floor(Math.random() * nextVals.length)]);
    setStepIdx(0);
  };

  const checksA = stepsA[stepsA.length - 1]?.checks ?? 0;
  const checksB = stepsB[stepsB.length - 1]?.checks ?? 0;

  const winner =
    bothDone && checksA !== checksB
      ? checksA < checksB
        ? SEARCH_ALGORITHMS[algoA].name
        : SEARCH_ALGORITHMS[algoB].name
      : null;

  return (
    <div className="flex-1 min-h-0 flex flex-col gap-3 lg:gap-3.5">
      {/* Top Horizontal Bento Deck */}
      <div className="shrink-0 rounded-2xl border border-[#E7E5E0] dark:border-[#2A2A26] bg-white dark:bg-[#1A1A18] p-3.5 sm:p-4 shadow-xs space-y-3">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <Swords className="w-4 h-4 text-[#2563EB]" />
              <h2 className="font-display font-bold text-base sm:text-lg text-[#141413] dark:text-[#F4F4F0]">
                Mode Duel Pencarian
              </h2>
            </div>
            <p className="text-xs text-[#575651] dark:text-[#A6A49C]">
              Adu dua algoritma pencarian pada data terurut & target yang <strong>persis sama</strong>!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={algoA}
              onChange={(e) => {
                setIsPlaying(false);
                setStepIdx(0);
                setAlgoA(e.target.value as SearchAlgorithmId);
              }}
              aria-label="Pilih Algoritma Pencarian Kiri"
              className="px-3 py-1.5 rounded-xl border border-[#D8D5CD] dark:border-[#34342F] bg-[#FAF9F6] dark:bg-[#22221F] text-[#141413] dark:text-[#F4F4F0] text-xs font-semibold"
            >
              {SEARCH_ALGORITHM_ORDER.map((id) => (
                <option key={id} value={id}>
                  Kiri: {SEARCH_ALGORITHMS[id].name}
                </option>
              ))}
            </select>

            <span className="text-xs font-bold text-[#6B6A65] dark:text-[#A6A49C]">VS</span>

            <select
              value={algoB}
              onChange={(e) => {
                setIsPlaying(false);
                setStepIdx(0);
                setAlgoB(e.target.value as SearchAlgorithmId);
              }}
              aria-label="Pilih Algoritma Pencarian Kanan"
              className="px-3 py-1.5 rounded-xl border border-[#D8D5CD] dark:border-[#34342F] bg-[#FAF9F6] dark:bg-[#22221F] text-[#141413] dark:text-[#F4F4F0] text-xs font-semibold"
            >
              {SEARCH_ALGORITHM_ORDER.map((id) => (
                <option key={id} value={id}>
                  Kanan: {SEARCH_ALGORITHMS[id].name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                if (bothDone) setStepIdx(0);
                setIsPlaying((p) => !p);
              }}
              className="tactile-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#141413] dark:bg-[#F4F4F0] text-white dark:text-[#141413] text-xs font-semibold"
            >
              {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{isPlaying ? 'Jeda' : bothDone ? 'Duel Ulang' : 'Mulai Duel'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setStepIdx(0);
              }}
              title="Reset langkah"
              className="tactile-btn p-1.5 rounded-xl border border-[#E7E5E0] dark:border-[#2E2E2A] bg-white dark:bg-[#22221F] text-[#141413] dark:text-[#F4F4F0]"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleNewData(arraySize)}
              className="tactile-btn flex items-center gap-1 px-2.5 py-1.5 rounded-xl border border-[#E7E5E0] dark:border-[#2E2E2A] bg-[#FAF9F6] dark:bg-[#22221F] text-[#141413] dark:text-[#F4F4F0] text-xs font-semibold"
            >
              <Shuffle className="w-3.5 h-3.5" />
              Data Baru
            </button>
          </div>
        </div>

        {/* Row 2: Jumlah Data & Target */}
        <div className="pt-2.5 border-t border-[#EFECE6] dark:border-[#2A2A26] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-medium text-[#6B6A65] dark:text-[#A6A49C]">
              Jumlah Data:
            </span>
            <input
              type="range"
              min={6}
              max={28}
              value={arraySize}
              onChange={(e) => handleNewData(Number(e.target.value))}
              aria-label="Jumlah elemen array duel pencarian"
              className="studio-slider w-28"
            />
            <span className="font-mono text-xs font-semibold text-[#141413] dark:text-[#F4F4F0] tabular-nums w-6">
              {arraySize}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-[#6B6A65] dark:text-[#A6A49C]">
              <Crosshair className="w-3.5 h-3.5 text-[#2563EB]" />
              Target:
            </span>
            <input
              type="number"
              value={target}
              onChange={(e) => {
                setIsPlaying(false);
                setStepIdx(0);
                setTarget(Number(e.target.value));
              }}
              className="w-20 px-2.5 py-1 rounded-lg border border-[#D8D5CD] dark:border-[#34342F] bg-[#FAF9F6] dark:bg-[#141413] text-[#141413] dark:text-[#F4F4F0] font-mono text-xs font-bold tabular-nums"
            />
            <button
              type="button"
              onClick={() => {
                setIsPlaying(false);
                setStepIdx(0);
                setTarget(999);
              }}
              className="tactile-btn px-2.5 py-1 rounded-lg border border-[#E7E5E0] dark:border-[#2E2E2A] bg-[#FAF9F6] dark:bg-[#22221F] text-xs font-medium text-[#575651] dark:text-[#A6A49C]"
            >
              Target Tidak Ada
            </button>
          </div>
        </div>
      </div>

      {bothDone && (
        <div className="shrink-0 rounded-2xl border border-[#10B981]/30 bg-[#10B981]/10 dark:bg-[#10B981]/15 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#065F46] dark:text-[#6EE7B7]">
            <Trophy className="w-4 h-4 text-[#10B981]" />
            <span className="font-display font-bold text-xs sm:text-sm">
              {winner
                ? `Pemenang Duel: ${winner} butuh pengecekan lebih sedikit!`
                : 'Hasil Seri! Kedua algoritma melakukan jumlah pengecekan yang sama.'}
            </span>
          </div>
          <span className="font-mono text-xs text-[#065F46] dark:text-[#6EE7B7] tabular-nums">
            {SEARCH_ALGORITHMS[algoA].shortName}: {checksA}x cek • {SEARCH_ALGORITHMS[algoB].shortName}: {checksB}x cek
          </span>
        </div>
      )}

      {/* Side-by-side Horizontal Bento Arenas */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-3.5">
        <SearchStage
          step={currentA}
          compact
          title={SEARCH_ALGORITHMS[algoA].name}
          onSelectTarget={(v) => {
            setIsPlaying(false);
            setStepIdx(0);
            setTarget(v);
          }}
        />
        <SearchStage
          step={currentB}
          compact
          title={SEARCH_ALGORITHMS[algoB].name}
          onSelectTarget={(v) => {
            setIsPlaying(false);
            setStepIdx(0);
            setTarget(v);
          }}
        />
      </div>
    </div>
  );
};
