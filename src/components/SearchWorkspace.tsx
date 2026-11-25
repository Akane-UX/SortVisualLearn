import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Shuffle,
  Crosshair,
  ArrowUpDown,
  Keyboard,
} from 'lucide-react';
import { SEARCH_ALGORITHMS, SEARCH_ALGORITHM_ORDER } from '../data/searchAlgorithms';
import { generateSearchArray, generateSearchSteps } from '../algorithms/searchGenerators';
import { SearchAlgorithmId } from '../types/searching';
import { AppMode } from '../types/sorting';
import { soundEngine } from '../utils/sound';
import { SearchStage } from './SearchStage';
import { SearchLearningPanel } from './SearchLearningPanel';
import { SearchRaceMode } from './SearchRaceMode';
import { SearchQuizMode } from './SearchQuizMode';

interface SearchWorkspaceProps {
  mode: AppMode;
  soundEnabled: boolean;
}

export const SearchWorkspace: React.FC<SearchWorkspaceProps> = ({
  mode,
  soundEnabled,
}) => {
  const [selectedAlgo, setSelectedAlgo] = useState<SearchAlgorithmId>('binary');
  const [arraySize, setArraySize] = useState<number>(12);
  const [isSortedData, setIsSortedData] = useState<boolean>(true);
  const [values, setValues] = useState<number[]>(() => generateSearchArray(12, true));
  const [target, setTarget] = useState<number>(() => values[Math.floor(values.length * 0.65)] ?? 42);
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  const algoMeta = SEARCH_ALGORITHMS[selectedAlgo];

  const steps = useMemo(
    () => generateSearchSteps(selectedAlgo, values, target),
    [selectedAlgo, values, target]
  );

  const currentStep = steps[Math.min(stepIdx, steps.length - 1)];

  const triggerStepAudio = useCallback(
    (nextIndex: number) => {
      if (!soundEnabled) return;
      const step = steps[nextIndex];
      if (!step) return;
      if (step.foundIndex !== null) {
        soundEngine.playComplete();
      } else if (step.checking.length > 0) {
        const val = step.array[step.checking[0]] ?? 50;
        soundEngine.playTone(val, 'compare');
      }
    },
    [soundEnabled, steps]
  );

  useEffect(() => {
    if (!isPlaying || mode !== 'learn') return;
    if (stepIdx >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }
    const delayMs = Math.max(120, Math.round(520 / speed));
    const timer = window.setTimeout(() => {
      const next = stepIdx + 1;
      setStepIdx(next);
      triggerStepAudio(next);
    }, delayMs);
    return () => window.clearTimeout(timer);
  }, [isPlaying, mode, stepIdx, steps.length, speed, triggerStepAudio]);

  const handleSelectAlgo = (id: SearchAlgorithmId) => {
    setIsPlaying(false);
    setStepIdx(0);
    setSelectedAlgo(id);
    if (SEARCH_ALGORITHMS[id].requiresSorted && !isSortedData) {
      setIsSortedData(true);
      setValues((prev) => [...prev].sort((a, b) => a - b));
    }
  };

  const handleRegenerate = useCallback(
    (newSize: number = arraySize, sortedFlag: boolean = isSortedData) => {
      setIsPlaying(false);
      setStepIdx(0);
      setArraySize(newSize);
      setIsSortedData(sortedFlag);
      const nextVals = generateSearchArray(newSize, sortedFlag);
      setValues(nextVals);
      setTarget(nextVals[Math.floor(Math.random() * nextVals.length)]);
    },
    [arraySize, isSortedData]
  );

  const handleTogglePlay = useCallback(() => {
    if (stepIdx >= steps.length - 1) {
      setStepIdx(0);
      setIsPlaying(true);
    } else {
      setIsPlaying((p) => !p);
    }
  }, [stepIdx, steps.length]);

  const handleStepForward = useCallback(() => {
    setIsPlaying(false);
    setStepIdx((prev) => {
      const next = Math.min(prev + 1, steps.length - 1);
      if (next !== prev) triggerStepAudio(next);
      return next;
    });
  }, [steps.length, triggerStepAudio]);

  const handleStepBack = useCallback(() => {
    setIsPlaying(false);
    setStepIdx((prev) => Math.max(0, prev - 1));
  }, []);

  useEffect(() => {
    if (mode !== 'learn') return;
    const onKeyDown = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return;
      if (e.code === 'Space') {
        e.preventDefault();
        handleTogglePlay();
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        handleStepForward();
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        handleStepBack();
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        handleRegenerate();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mode, handleTogglePlay, handleStepForward, handleStepBack, handleRegenerate]);

  if (mode === 'race') {
    return <SearchRaceMode />;
  }

  if (mode === 'quiz') {
    return <SearchQuizMode />;
  }

  return (
    <div className="space-y-6">
      {/* Header + Algorithm Pills */}
      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span
                className="px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wide text-white"
                style={{ backgroundColor: algoMeta.accentColor }}
              >
                Level {algoMeta.difficulty}
              </span>
              <span className="text-xs text-[#6B6A65] dark:text-[#A6A49C] font-mono">
                Kompleksitas Rata-rata: {algoMeta.complexity.average}
              </span>
              <span className="text-[11px] px-2 py-0.5 rounded-md bg-[#EFECE6] dark:bg-[#22221F] text-[#575651] dark:text-[#A6A49C] font-medium">
                {algoMeta.requiresSorted ? 'Wajib Data Terurut' : 'Bisa Data Acak'}
              </span>
            </div>
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#141413] dark:text-[#F4F4F0]">
              {algoMeta.name}
            </h1>
            <p className="text-sm text-[#575651] dark:text-[#A6A49C] mt-0.5">
              {algoMeta.tagline}
            </p>
          </div>

          <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-[#7D7B75] dark:text-[#A6A49C] bg-white dark:bg-[#1A1A18] px-3 py-1.5 rounded-xl border border-[#E7E5E0] dark:border-[#2A2A26]">
            <Keyboard className="w-3.5 h-3.5" />
            <span>Spasi: Putar • ←/→: Langkah • R: Acak</span>
          </div>
        </div>

        {/* Search Algorithm Selector */}
        <div className="flex flex-wrap gap-2" role="tablist" aria-label="Pilih Algoritma Search">
          {SEARCH_ALGORITHM_ORDER.map((id) => {
            const algo = SEARCH_ALGORITHMS[id];
            const isActive = selectedAlgo === id;
            return (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => handleSelectAlgo(id)}
                className={`tactile-btn group flex items-center gap-2 px-3.5 py-2 rounded-xl border text-left ${
                  isActive
                    ? 'bg-[#141413] dark:bg-[#F4F4F0] text-white dark:text-[#141413] border-[#141413] dark:border-[#F4F4F0] shadow-sm'
                    : 'bg-white dark:bg-[#1A1A18] text-[#141413] dark:text-[#F4F4F0] border-[#E7E5E0] dark:border-[#2A2A26] hover:border-[#C9C5BC] dark:hover:border-[#42423D]'
                }`}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: algo.accentColor }}
                />
                <span className="font-display font-semibold text-sm">{algo.name}</span>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                    isActive
                      ? 'bg-white/15 dark:bg-[#141413]/15 text-white/90 dark:text-[#141413]'
                      : 'bg-[#F3F1EC] dark:bg-[#252522] text-[#6B6A65] dark:text-[#A6A49C]'
                  }`}
                >
                  {algo.complexity.average}
                </span>
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Grid */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        <div className="lg:col-span-7 xl:col-span-8 space-y-4">
          <SearchStage
            step={currentStep}
            onSelectTarget={(val) => {
              setIsPlaying(false);
              setStepIdx(0);
              setTarget(val);
            }}
          />

          {/* Search Control Bar */}
          <div className="rounded-2xl border border-[#E7E5E0] dark:border-[#2A2A26] bg-white dark:bg-[#1A1A18] p-4 shadow-xs space-y-4">
            {/* Row 1: Playback + Timeline */}
            <div className="flex flex-col md:flex-row md:items-center gap-4">
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setStepIdx(0);
                  }}
                  title="Ulang dari awal"
                  className="tactile-btn p-2.5 rounded-xl border border-[#E7E5E0] dark:border-[#2E2E2A] bg-white dark:bg-[#22221F] text-[#141413] dark:text-[#F4F4F0]"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleStepBack}
                  disabled={stepIdx <= 0}
                  title="Langkah sebelumnya"
                  className="tactile-btn p-2.5 rounded-xl border border-[#E7E5E0] dark:border-[#2E2E2A] bg-white dark:bg-[#22221F] text-[#141413] dark:text-[#F4F4F0] disabled:opacity-40"
                >
                  <SkipBack className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleTogglePlay}
                  className="tactile-btn flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#141413] dark:bg-[#F4F4F0] text-white dark:text-[#141413] font-semibold text-sm shadow-xs"
                >
                  {isPlaying ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" />
                      <span>Jeda</span>
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" />
                      <span>{stepIdx >= steps.length - 1 ? 'Cari Ulang' : 'Mulai Cari'}</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleStepForward}
                  disabled={stepIdx >= steps.length - 1}
                  title="Langkah berikutnya"
                  className="tactile-btn p-2.5 rounded-xl border border-[#E7E5E0] dark:border-[#2E2E2A] bg-white dark:bg-[#22221F] text-[#141413] dark:text-[#F4F4F0] disabled:opacity-40"
                >
                  <SkipForward className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleRegenerate(arraySize, isSortedData)}
                  className="tactile-btn flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#E7E5E0] dark:border-[#2E2E2A] bg-[#FAF9F5] dark:bg-[#22221F] text-[#141413] dark:text-[#F4F4F0] text-xs font-semibold"
                >
                  <Shuffle className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Data Baru</span>
                </button>
              </div>

              <div className="flex-1 flex items-center gap-3">
                <input
                  type="range"
                  min={0}
                  max={Math.max(0, steps.length - 1)}
                  value={stepIdx}
                  onChange={(e) => {
                    setIsPlaying(false);
                    setStepIdx(Number(e.target.value));
                  }}
                  aria-label="Timeline langkah pencarian"
                  className="studio-slider flex-1"
                />
                <span className="font-mono text-xs font-medium text-[#575651] dark:text-[#A6A49C] tabular-nums whitespace-nowrap">
                  Langkah {stepIdx + 1} / {steps.length}
                </span>
              </div>
            </div>

            {/* Row 2: Target Picker, Speed, Size, Sorted Toggle */}
            <div className="pt-3 border-t border-[#EFECE6] dark:border-[#2A2A26] flex flex-wrap items-center justify-between gap-3">
              {/* Target Input + Quick Buttons */}
              <div className="flex flex-wrap items-center gap-2">
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
                  aria-label="Nilai target yang dicari"
                  className="w-18 px-2.5 py-1 rounded-lg border border-[#D8D5CD] dark:border-[#34342F] bg-[#FAF9F6] dark:bg-[#141413] text-[#141413] dark:text-[#F4F4F0] font-mono text-xs font-bold tabular-nums"
                />
                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    setStepIdx(0);
                    setTarget(values[Math.floor(Math.random() * values.length)]);
                  }}
                  className="tactile-btn px-2.5 py-1 rounded-lg border border-[#E7E5E0] dark:border-[#2E2E2A] bg-[#FAF9F6] dark:bg-[#22221F] text-xs font-medium text-[#575651] dark:text-[#A6A49C]"
                >
                  Target Ada
                </button>
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

              {/* Speed */}
              <div className="flex items-center gap-1 bg-[#F3F1EC] dark:bg-[#22221F] p-0.5 rounded-lg border border-[#E7E5E0] dark:border-[#2E2E2A]">
                {[0.5, 1, 2, 4].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSpeed(s)}
                    className={`tactile-btn px-2 py-1 rounded-md text-xs font-mono font-semibold tabular-nums ${
                      speed === s
                        ? 'bg-white dark:bg-[#32322D] text-[#141413] dark:text-[#F4F4F0] shadow-xs'
                        : 'text-[#6B6A65] dark:text-[#A6A49C]'
                    }`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              {/* Size + Sorted Toggle (for Linear) */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-[#6B6A65] dark:text-[#A6A49C]">
                    Data:
                  </span>
                  <input
                    type="range"
                    min={6}
                    max={20}
                    value={arraySize}
                    onChange={(e) => handleRegenerate(Number(e.target.value), isSortedData)}
                    aria-label="Jumlah data pencarian"
                    className="studio-slider w-20"
                  />
                  <span className="font-mono text-xs font-semibold tabular-nums w-5">
                    {arraySize}
                  </span>
                </div>

                {!algoMeta.requiresSorted && (
                  <button
                    type="button"
                    onClick={() => handleRegenerate(arraySize, !isSortedData)}
                    className="tactile-btn flex items-center gap-1 px-2.5 py-1 rounded-lg border border-[#E7E5E0] dark:border-[#2E2E2A] bg-[#FAF9F6] dark:bg-[#22221F] text-xs font-medium"
                  >
                    <ArrowUpDown className="w-3 h-3" />
                    <span>{isSortedData ? 'Terurut' : 'Acak'}</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 xl:col-span-4">
          <SearchLearningPanel algo={algoMeta} activeCodeLine={currentStep.codeLine} />
        </div>
      </section>
    </div>
  );
};
