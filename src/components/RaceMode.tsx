import React, { useEffect, useMemo, useState } from 'react';
import { Play, Pause, RotateCcw, Shuffle, Trophy, Swords } from 'lucide-react';
import { ALGORITHMS, ALGORITHM_ORDER } from '../data/algorithms';
import {
  createArrayFromValues,
  generatePresetValues,
  generateSortSteps,
} from '../algorithms/generators';
import { AlgorithmId, PresetType } from '../types/sorting';
import { SortingStage } from './SortingStage';

export const RaceMode: React.FC = () => {
  const [algoA, setAlgoA] = useState<AlgorithmId>('bubble');
  const [algoB, setAlgoB] = useState<AlgorithmId>('quick');
  const [arraySize, setArraySize] = useState<number>(14);
  const [preset, setPreset] = useState<PresetType>('reversed');
  const [baseValues, setBaseValues] = useState<number[]>(() =>
    generatePresetValues('reversed', 14)
  );
  const [stepIdx, setStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  const presets: { id: PresetType; label: string }[] = [
    { id: 'random', label: 'Acak' },
    { id: 'nearly-sorted', label: 'Hampir Urut' },
    { id: 'reversed', label: 'Terbalik' },
    { id: 'few-unique', label: 'Banyak Kembar' },
  ];

  const stepsA = useMemo(
    () => generateSortSteps(algoA, createArrayFromValues(baseValues)),
    [algoA, baseValues]
  );
  const stepsB = useMemo(
    () => generateSortSteps(algoB, createArrayFromValues(baseValues)),
    [algoB, baseValues]
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
    }, 140);
    return () => window.clearTimeout(timer);
  }, [isPlaying, stepIdx, bothDone, maxSteps]);

  const handleNewData = (newPreset: PresetType = preset, newSize: number = arraySize) => {
    setIsPlaying(false);
    setPreset(newPreset);
    setArraySize(newSize);
    setBaseValues(generatePresetValues(newPreset, newSize));
    setStepIdx(0);
  };

  const winner =
    bothDone && stepsA.length !== stepsB.length
      ? stepsA.length < stepsB.length
        ? ALGORITHMS[algoA].name
        : ALGORITHMS[algoB].name
      : null;

  return (
    <div className="space-y-5">
      {/* Race Header & Controls */}
      <div className="rounded-2xl border border-[#E7E5E0] dark:border-[#2A2A26] bg-white dark:bg-[#1A1A18] p-4 sm:p-5 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Swords className="w-5 h-5 text-[#FF5A36]" />
              <h2 className="font-display font-bold text-lg text-[#141413] dark:text-[#F4F4F0]">
                Mode Duel Algoritma
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-[#575651] dark:text-[#A6A49C]">
              Bandingkan dua algoritma pada data yang <strong>persis sama</strong> untuk merasakan perbedaan efisiensi O(n²) vs O(n log n).
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={algoA}
              onChange={(e) => {
                setIsPlaying(false);
                setStepIdx(0);
                setAlgoA(e.target.value as AlgorithmId);
              }}
              aria-label="Pilih Algoritma A"
              className="px-3 py-2 rounded-xl border border-[#D8D5CD] dark:border-[#34342F] bg-[#FAF9F6] dark:bg-[#22221F] text-[#141413] dark:text-[#F4F4F0] text-xs font-semibold"
            >
              {ALGORITHM_ORDER.map((id) => (
                <option key={id} value={id}>
                  Kiri: {ALGORITHMS[id].name}
                </option>
              ))}
            </select>

            <span className="text-xs font-bold text-[#6B6A65] dark:text-[#A6A49C]">VS</span>

            <select
              value={algoB}
              onChange={(e) => {
                setIsPlaying(false);
                setStepIdx(0);
                setAlgoB(e.target.value as AlgorithmId);
              }}
              aria-label="Pilih Algoritma B"
              className="px-3 py-2 rounded-xl border border-[#D8D5CD] dark:border-[#34342F] bg-[#FAF9F6] dark:bg-[#22221F] text-[#141413] dark:text-[#F4F4F0] text-xs font-semibold"
            >
              {ALGORITHM_ORDER.map((id) => (
                <option key={id} value={id}>
                  Kanan: {ALGORITHMS[id].name}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => {
                if (bothDone) setStepIdx(0);
                setIsPlaying((p) => !p);
              }}
              className="tactile-btn flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#141413] dark:bg-[#F4F4F0] text-white dark:text-[#141413] text-xs font-semibold"
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
              className="tactile-btn p-2 rounded-xl border border-[#E7E5E0] dark:border-[#2E2E2A] bg-white dark:bg-[#22221F] hover:bg-[#FAF9F5] dark:hover:bg-[#2B2B27] text-[#141413] dark:text-[#F4F4F0]"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleNewData(preset, arraySize)}
              className="tactile-btn flex items-center gap-1 px-3 py-2 rounded-xl border border-[#E7E5E0] dark:border-[#2E2E2A] bg-[#FAF9F6] dark:bg-[#22221F] text-[#141413] dark:text-[#F4F4F0] text-xs font-semibold"
            >
              <Shuffle className="w-3.5 h-3.5" />
              Data Baru
            </button>
          </div>
        </div>

        {/* Row 2: Jumlah Data & Preset (sama seperti di Visualisasi & Materi) */}
        <div className="pt-3 border-t border-[#EFECE6] dark:border-[#2A2A26] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="text-xs font-medium text-[#6B6A65] dark:text-[#A6A49C]">
              Jumlah Data:
            </span>
            <input
              type="range"
              min={6}
              max={22}
              value={arraySize}
              onChange={(e) => handleNewData(preset, Number(e.target.value))}
              aria-label="Jumlah elemen array duel"
              className="studio-slider w-28"
            />
            <span className="font-mono text-xs font-semibold text-[#141413] dark:text-[#F4F4F0] tabular-nums w-6">
              {arraySize}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            {presets.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleNewData(p.id, arraySize)}
                className={`tactile-btn px-2.5 py-1 rounded-lg text-xs font-medium border ${
                  preset === p.id
                    ? 'bg-[#141413] dark:bg-[#F4F4F0] text-white dark:text-[#141413] border-[#141413] dark:border-[#F4F4F0]'
                    : 'bg-[#FAF9F6] dark:bg-[#22221F] text-[#575651] dark:text-[#A6A49C] border-[#E7E5E0] dark:border-[#2E2E2A] hover:border-[#C9C5BC] dark:hover:border-[#42423D]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Winner Banner */}
      {bothDone && (
        <div className="rounded-2xl border border-[#10B981]/30 bg-[#10B981]/10 dark:bg-[#10B981]/15 px-5 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 text-[#065F46] dark:text-[#6EE7B7]">
            <Trophy className="w-5 h-5 text-[#10B981]" />
            <span className="font-display font-bold text-sm sm:text-base">
              {winner
                ? `Pemenang Duel: ${winner} selesai lebih cepat!`
                : 'Hasil Seri! Kedua algoritma selesai dalam jumlah langkah yang sama.'}
            </span>
          </div>
          <span className="font-mono text-xs text-[#065F46] dark:text-[#6EE7B7] tabular-nums">
            {ALGORITHMS[algoA].shortName}: {stepsA.length} langkah • {ALGORITHMS[algoB].shortName}: {stepsB.length} langkah
          </span>
        </div>
      )}

      {/* Side-by-side stages */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SortingStage
          step={currentA}
          compact
          title={`${ALGORITHMS[algoA].name} (${stepsA.length} langkah)`}
        />
        <SortingStage
          step={currentB}
          compact
          title={`${ALGORITHMS[algoB].name} (${stepsB.length} langkah)`}
        />
      </div>
    </div>
  );
};
