import React, { useState } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  Shuffle,
  SlidersHorizontal,
} from 'lucide-react';
import { PresetType } from '../types/sorting';

interface ControlBarProps {
  isPlaying: boolean;
  onTogglePlay: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onReset: () => void;
  onShuffle: () => void;
  currentStep: number;
  totalSteps: number;
  onScrub: (step: number) => void;
  speed: number;
  onSpeedChange: (speed: number) => void;
  arraySize: number;
  onArraySizeChange: (size: number) => void;
  preset: PresetType;
  onPresetChange: (preset: PresetType) => void;
  onCustomArray: (values: number[]) => void;
}

export const ControlBar: React.FC<ControlBarProps> = ({
  isPlaying,
  onTogglePlay,
  onStepBack,
  onStepForward,
  onReset,
  onShuffle,
  currentStep,
  totalSteps,
  onScrub,
  speed,
  onSpeedChange,
  arraySize,
  onArraySizeChange,
  preset,
  onPresetChange,
  onCustomArray,
}) => {
  const [showCustom, setShowCustom] = useState(false);
  const [customText, setCustomText] = useState('45, 18, 72, 29, 90, 14, 63, 38');
  const [customError, setCustomError] = useState('');

  const presets: { id: PresetType; label: string }[] = [
    { id: 'random', label: 'Acak' },
    { id: 'nearly-sorted', label: 'Hampir Urut' },
    { id: 'reversed', label: 'Terbalik' },
    { id: 'few-unique', label: 'Banyak Kembar' },
  ];

  const speeds = [0.5, 1, 2, 4];

  const handleApplyCustom = (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = customText
      .split(/[\s,]+/)
      .map((s) => parseInt(s.trim(), 10))
      .filter((n) => !Number.isNaN(n));

    if (parsed.length < 4 || parsed.length > 24) {
      setCustomError('Masukkan antara 4 sampai 24 angka (dipisah koma atau spasi).');
      return;
    }
    if (parsed.some((n) => n < 5 || n > 100)) {
      setCustomError('Gunakan angka antara 5 sampai 100 agar visualisasi proporsional.');
      return;
    }
    setCustomError('');
    onCustomArray(parsed);
    setShowCustom(false);
  };

  return (
    <div className="rounded-2xl border border-[#E7E5E0] bg-white p-4 shadow-xs space-y-4">
      {/* Row 1: Playback Controls + Timeline Scrubber */}
      <div className="flex flex-col md:flex-row md:items-center gap-4">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={onReset}
            title="Ulang dari awal"
            className="tactile-btn p-2.5 rounded-xl border border-[#E7E5E0] bg-white hover:bg-[#FAF9F5] text-[#141413]"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onStepBack}
            disabled={currentStep <= 0}
            title="Langkah sebelumnya (Panah Kiri)"
            className="tactile-btn p-2.5 rounded-xl border border-[#E7E5E0] bg-white hover:bg-[#FAF9F5] text-[#141413] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <SkipBack className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onTogglePlay}
            title="Putar / Jeda (Spasi)"
            className="tactile-btn flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#141413] hover:bg-[#2A2A27] text-white font-semibold text-sm shadow-xs"
          >
            {isPlaying ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>Jeda</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                <span>{currentStep >= totalSteps - 1 ? 'Putar Ulang' : 'Mulai'}</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onStepForward}
            disabled={currentStep >= totalSteps - 1}
            title="Langkah berikutnya (Panah Kanan)"
            className="tactile-btn p-2.5 rounded-xl border border-[#E7E5E0] bg-white hover:bg-[#FAF9F5] text-[#141413] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <SkipForward className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={onShuffle}
            title="Acak data baru (R)"
            className="tactile-btn flex items-center gap-1.5 px-3 py-2.5 rounded-xl border border-[#E7E5E0] bg-[#FAF9F5] hover:bg-[#EFECE6] text-[#141413] text-xs font-semibold"
          >
            <Shuffle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Acak Baru</span>
          </button>
        </div>

        {/* Timeline Scrubber */}
        <div className="flex-1 flex items-center gap-3">
          <input
            type="range"
            min={0}
            max={Math.max(0, totalSteps - 1)}
            value={currentStep}
            onChange={(e) => onScrub(Number(e.target.value))}
            aria-label="Timeline langkah sorting"
            className="studio-slider flex-1"
          />
          <span className="font-mono text-xs font-medium text-[#575651] tabular-nums whitespace-nowrap">
            Langkah {currentStep + 1} / {totalSteps}
          </span>
        </div>
      </div>

      {/* Row 2: Speed, Size, Presets, Custom */}
      <div className="pt-3 border-t border-[#EFECE6] flex flex-wrap items-center justify-between gap-4">
        {/* Speed */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-[#6B6A65]">Kecepatan:</span>
          <div className="flex items-center bg-[#F3F1EC] p-0.5 rounded-lg border border-[#E7E5E0]">
            {speeds.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => onSpeedChange(s)}
                className={`tactile-btn px-2.5 py-1 rounded-md text-xs font-mono font-semibold tabular-nums ${
                  speed === s
                    ? 'bg-white text-[#141413] shadow-xs'
                    : 'text-[#6B6A65] hover:text-[#141413]'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>

        {/* Size */}
        <div className="flex items-center gap-2.5">
          <span className="text-xs font-medium text-[#6B6A65]">Jumlah Data:</span>
          <input
            type="range"
            min={6}
            max={22}
            value={arraySize}
            onChange={(e) => onArraySizeChange(Number(e.target.value))}
            aria-label="Jumlah elemen array"
            className="studio-slider w-24"
          />
          <span className="font-mono text-xs font-semibold text-[#141413] tabular-nums w-6">
            {arraySize}
          </span>
        </div>

        {/* Presets + Custom */}
        <div className="flex flex-wrap items-center gap-1.5">
          {presets.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => onPresetChange(p.id)}
              className={`tactile-btn px-2.5 py-1 rounded-lg text-xs font-medium border ${
                preset === p.id
                  ? 'bg-[#141413] text-white border-[#141413]'
                  : 'bg-[#FAF9F6] text-[#575651] border-[#E7E5E0] hover:border-[#C9C5BC]'
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setShowCustom((v) => !v)}
            className={`tactile-btn flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-medium border ${
              showCustom
                ? 'bg-[#2563EB] text-white border-[#2563EB]'
                : 'bg-white text-[#2563EB] border-[#2563EB]/30 hover:bg-[#2563EB]/5'
            }`}
          >
            <SlidersHorizontal className="w-3 h-3" />
            Input Sendiri
          </button>
        </div>
      </div>

      {/* Custom Input Drawer */}
      {showCustom && (
        <form
          onSubmit={handleApplyCustom}
          className="pt-3 border-t border-[#EFECE6] flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5"
        >
          <input
            type="text"
            value={customText}
            onChange={(e) => setCustomText(e.target.value)}
            placeholder="Contoh: 45, 18, 72, 29, 90, 14"
            className="flex-1 px-3 py-2 rounded-xl border border-[#D8D5CD] bg-[#FAF9F6] font-mono text-xs focus:outline-none focus:ring-2 focus:ring-[#2563EB]"
          />
          <button
            type="submit"
            className="tactile-btn px-4 py-2 rounded-xl bg-[#2563EB] text-white text-xs font-semibold hover:bg-[#1D4ED8]"
          >
            Terapkan Angka
          </button>
          {customError && (
            <p className="text-xs text-[#DC2626] font-medium">{customError}</p>
          )}
        </form>
      )}
    </div>
  );
};
