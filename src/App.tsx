import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { Keyboard } from 'lucide-react';
import { ALGORITHMS } from './data/algorithms';
import {
  createArrayFromValues,
  generatePresetValues,
  generateSortSteps,
} from './algorithms/generators';
import { AlgorithmId, AppMode, PresetType } from './types/sorting';
import { soundEngine } from './utils/sound';
import { Navbar } from './components/Navbar';
import { AlgorithmSelector } from './components/AlgorithmSelector';
import { SortingStage } from './components/SortingStage';
import { ControlBar } from './components/ControlBar';
import { LearningPanel } from './components/LearningPanel';
import { RaceMode } from './components/RaceMode';
import { QuizMode } from './components/QuizMode';

export function App() {
  const [mode, setMode] = useState<AppMode>('learn');
  const [selectedAlgo, setSelectedAlgo] = useState<AlgorithmId>('bubble');
  const [arraySize, setArraySize] = useState<number>(12);
  const [preset, setPreset] = useState<PresetType>('random');
  const [baseValues, setBaseValues] = useState<number[]>(() =>
    generatePresetValues('random', 12)
  );
  const [stepIdx, setStepIdx] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  const pageRef = useRef<HTMLDivElement>(null);

  // Initial GSAP entrance choreography
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.hero-reveal', {
        y: 16,
        opacity: 0,
        duration: 0.55,
        stagger: 0.08,
        ease: 'power3.out',
      });
    }, pageRef);
    return () => ctx.revert();
  }, []);

  const steps = useMemo(
    () => generateSortSteps(selectedAlgo, createArrayFromValues(baseValues)),
    [selectedAlgo, baseValues]
  );

  const currentStep = steps[Math.min(stepIdx, steps.length - 1)];
  const algoMeta = ALGORITHMS[selectedAlgo];

  const triggerStepAudio = useCallback(
    (nextIndex: number) => {
      if (!soundEnabled) return;
      const step = steps[nextIndex];
      if (!step) return;
      if (step.isDone) {
        soundEngine.playComplete();
      } else if (step.swapping.length > 0) {
        const val = step.array[step.swapping[0]]?.value ?? 50;
        soundEngine.playTone(val, 'swap');
      } else if (step.comparing.length > 0) {
        const val = step.array[step.comparing[0]]?.value ?? 50;
        soundEngine.playTone(val, 'compare');
      }
    },
    [soundEnabled, steps]
  );

  // Playback timer
  useEffect(() => {
    if (!isPlaying || mode !== 'learn') return;
    if (stepIdx >= steps.length - 1) {
      setIsPlaying(false);
      return;
    }

    const delayMs = Math.max(45, Math.round(360 / speed));
    const timer = window.setTimeout(() => {
      const next = stepIdx + 1;
      setStepIdx(next);
      triggerStepAudio(next);
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [isPlaying, mode, stepIdx, steps.length, speed, triggerStepAudio]);

  const handleToggleSound = () => {
    const next = !soundEnabled;
    soundEngine.enabled = next;
    setSoundEnabled(next);
  };

  const handleShuffle = useCallback(() => {
    setIsPlaying(false);
    setStepIdx(0);
    setBaseValues(generatePresetValues(preset, arraySize));
  }, [preset, arraySize]);

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

  // Keyboard shortcuts in Learn mode
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
        handleShuffle();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [mode, handleTogglePlay, handleStepForward, handleStepBack, handleShuffle]);

  return (
    <div ref={pageRef} className="min-h-screen flex flex-col bg-[#FAFAF8] text-[#141413]">
      <Navbar
        mode={mode}
        onModeChange={(nextMode) => {
          setIsPlaying(false);
          setMode(nextMode);
        }}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        {mode === 'learn' && (
          <>
            {/* Compact Hero Header + Algorithm Pills */}
            <section className="hero-reveal space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className="px-2 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wide text-white"
                      style={{ backgroundColor: algoMeta.accentColor }}
                    >
                      Level {algoMeta.difficulty}
                    </span>
                    <span className="text-xs text-[#6B6A65] font-mono">
                      Kompleksitas Rata-rata: {algoMeta.complexity.average}
                    </span>
                  </div>
                  <h1 className="font-display font-bold text-2xl sm:text-3xl text-[#141413]">
                    {algoMeta.name}
                  </h1>
                  <p className="text-sm text-[#575651] mt-0.5">{algoMeta.tagline}</p>
                </div>

                <div className="hidden lg:flex items-center gap-1.5 text-[11px] text-[#7D7B75] bg-white px-3 py-1.5 rounded-xl border border-[#E7E5E0]">
                  <Keyboard className="w-3.5 h-3.5" />
                  <span>Spasi: Putar • ←/→: Langkah • R: Acak</span>
                </div>
              </div>

              <AlgorithmSelector
                selected={selectedAlgo}
                onSelect={(id) => {
                  setIsPlaying(false);
                  setStepIdx(0);
                  setSelectedAlgo(id);
                }}
              />
            </section>

            {/* Main Interactive Workbench */}
            <section className="hero-reveal grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              <div className="lg:col-span-7 xl:col-span-8 space-y-4">
                <SortingStage step={currentStep} />

                <ControlBar
                  isPlaying={isPlaying}
                  onTogglePlay={handleTogglePlay}
                  onStepBack={handleStepBack}
                  onStepForward={handleStepForward}
                  onReset={() => {
                    setIsPlaying(false);
                    setStepIdx(0);
                  }}
                  onShuffle={handleShuffle}
                  currentStep={stepIdx}
                  totalSteps={steps.length}
                  onScrub={(idx) => {
                    setIsPlaying(false);
                    setStepIdx(idx);
                  }}
                  speed={speed}
                  onSpeedChange={setSpeed}
                  arraySize={arraySize}
                  onArraySizeChange={(size) => {
                    setIsPlaying(false);
                    setArraySize(size);
                    setStepIdx(0);
                    setBaseValues(generatePresetValues(preset, size));
                  }}
                  preset={preset}
                  onPresetChange={(p) => {
                    setIsPlaying(false);
                    setPreset(p);
                    setStepIdx(0);
                    setBaseValues(generatePresetValues(p, arraySize));
                  }}
                  onCustomArray={(vals) => {
                    setIsPlaying(false);
                    setArraySize(vals.length);
                    setStepIdx(0);
                    setBaseValues(vals);
                  }}
                />
              </div>

              <div className="lg:col-span-5 xl:col-span-4">
                <LearningPanel
                  algo={algoMeta}
                  activeCodeLine={currentStep.codeLine}
                />
              </div>
            </section>
          </>
        )}

        {mode === 'race' && <RaceMode />}

        {mode === 'quiz' && <QuizMode />}
      </main>
    </div>
  );
}

export default App;
