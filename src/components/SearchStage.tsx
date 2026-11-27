import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import {
  Crosshair,
  CheckCircle2,
  XCircle,
  Search,
  Sparkles,
  MousePointerClick,
} from 'lucide-react';
import { SearchStep } from '../types/searching';

interface SearchStageProps {
  step: SearchStep;
  compact?: boolean;
  title?: string;
  onSelectTarget?: (value: number) => void;
}

export const SearchStage: React.FC<SearchStageProps> = ({
  step,
  compact = false,
  title,
  onSelectTarget,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>('.search-card');
      cards.forEach((card, idx) => {
        const isFound = step.foundIndex === idx;
        const isChecking = step.checking.includes(idx);
        const isEliminated = step.eliminated.includes(idx);

        gsap.to(card, {
          y: isFound ? -10 : isChecking ? -6 : 0,
          scale: isFound ? 1.08 : isChecking ? 1.04 : isEliminated ? 0.94 : 1,
          opacity: isEliminated && !isFound ? 0.32 : 1,
          duration: 0.24,
          ease: 'power3.out',
          overwrite: 'auto',
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, [step]);

  const pointersByIndex: Record<number, string[]> = {};
  Object.entries(step.pointers).forEach(([label, idx]) => {
    if (idx >= 0 && idx < step.array.length) {
      if (!pointersByIndex[idx]) pointersByIndex[idx] = [];
      pointersByIndex[idx].push(label);
    }
  });

  const isNotFound = step.isDone && step.foundIndex === null;

  return (
    <div
      ref={containerRef}
      className="h-full flex flex-col rounded-2xl border border-[#E7E5E0] dark:border-[#2A2A26] bg-white dark:bg-[#1A1A18] shadow-xs overflow-hidden"
    >
      {/* Header */}
      <div className="shrink-0 px-3.5 sm:px-4 py-2.5 border-b border-[#EFECE6] dark:border-[#2A2A26] bg-[#FAF9F6] dark:bg-[#151513] flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-2">
          {title && (
            <span className="font-display font-bold text-xs sm:text-sm text-[#141413] dark:text-[#F4F4F0]">
              {title}
            </span>
          )}
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#2563EB]/10 dark:bg-[#2563EB]/20 border border-[#2563EB]/30 text-[#1D4ED8] dark:text-[#60A5FA] text-xs font-mono font-bold tabular-nums">
            <Crosshair className="w-3.5 h-3.5" />
            Target: {step.target}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white dark:bg-[#22221F] border border-[#E7E5E0] dark:border-[#2E2E2A] text-[#141413] dark:text-[#F4F4F0] text-xs font-medium tabular-nums">
            <Search className="w-3.5 h-3.5 text-[#FF5A36]" />
            Cek: <strong>{step.checks}x</strong>
          </span>
        </div>

        {!compact && (
          <div className="flex flex-wrap items-center gap-2.5 text-[11px] font-medium text-[#575651] dark:text-[#A6A49C]">
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#FF5A36]" /> Diperiksa
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#10B981]" /> Ketemu
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#D4D2CA] dark:bg-[#3A3A35]" /> Dibuang
            </span>
          </div>
        )}
      </div>

      {/* Live Narration */}
      <div
        className={`shrink-0 px-3.5 sm:px-4 py-2 border-b border-[#EFECE6] dark:border-[#2A2A26] flex items-center gap-2 text-xs sm:text-[13px] ${
          step.foundIndex !== null
            ? 'bg-[#10B981]/10 dark:bg-[#10B981]/15 text-[#065F46] dark:text-[#6EE7B7]'
            : isNotFound
            ? 'bg-[#F59E0B]/10 dark:bg-[#F59E0B]/15 text-[#92400E] dark:text-[#FCD34D]'
            : 'bg-[#FFFDF9] dark:bg-[#1E1E1B] text-[#2B2A27] dark:text-[#E7E5E0]'
        }`}
      >
        {step.foundIndex !== null ? (
          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
        ) : isNotFound ? (
          <XCircle className="w-4 h-4 text-[#F59E0B] shrink-0" />
        ) : (
          <Sparkles className="w-4 h-4 text-[#FF5A36] shrink-0" />
        )}
        <p className="font-medium leading-snug line-clamp-2">{step.narration}</p>
      </div>

      {/* Interactive Array Cards Arena */}
      <div
        className={`stage-grid px-3 sm:px-5 py-4 flex-1 flex flex-col justify-center ${
          compact ? 'min-h-[190px] lg:min-h-0' : 'min-h-[220px] sm:min-h-[250px] lg:min-h-0'
        }`}
      >
        {onSelectTarget && (
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#7D7B75] dark:text-[#A6A49C] mb-3 shrink-0">
            <MousePointerClick className="w-3.5 h-3.5" />
            <span>Tips: Klik angka mana saja di bawah untuk menjadikannya Target!</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
          {step.array.map((val, idx) => {
            const isFound = step.foundIndex === idx;
            const isChecking = step.checking.includes(idx);
            const isTargetVal = val === step.target;
            const inWindow =
              step.windowRange &&
              idx >= step.windowRange[0] &&
              idx <= step.windowRange[1];
            const labels = pointersByIndex[idx] || [];

            let cardStyle =
              'bg-white dark:bg-[#232320] text-[#141413] dark:text-[#F4F4F0] border-[#D8D5CD] dark:border-[#3A3A35]';
            if (isFound) {
              cardStyle =
                'bg-[#10B981] text-white border-[#059669] ring-4 ring-[#10B981]/25 shadow-md';
            } else if (isChecking) {
              cardStyle =
                'bg-[#FF5A36] text-white border-[#EA580C] ring-4 ring-[#FF5A36]/25 shadow-md';
            } else if (inWindow) {
              cardStyle =
                'bg-white dark:bg-[#252522] text-[#141413] dark:text-[#F4F4F0] border-[#2563EB]/60 dark:border-[#60A5FA]/50 ring-2 ring-[#2563EB]/10';
            }

            return (
              <div key={idx} className="flex flex-col items-center gap-1">
                {/* Index Label */}
                <span className="font-mono text-[10px] text-[#8E8C84] dark:text-[#8E8C84] tabular-nums">
                  [{idx}]
                </span>

                {/* Value Card */}
                <button
                  type="button"
                  disabled={!onSelectTarget}
                  onClick={() => onSelectTarget?.(val)}
                  title={onSelectTarget ? `Jadikan ${val} sebagai target` : undefined}
                  className={`search-card relative w-10 h-11 sm:w-12 sm:h-13 rounded-xl border-2 font-mono font-bold text-sm sm:text-base tabular-nums flex items-center justify-center transition-colors ${cardStyle} ${
                    onSelectTarget ? 'cursor-pointer hover:border-[#2563EB]' : 'cursor-default'
                  }`}
                >
                  {val}
                  {isTargetVal && !isFound && (
                    <span
                      title="Nilai Target"
                      className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full bg-[#2563EB] ring-2 ring-white dark:ring-[#181816]"
                    />
                  )}
                </button>

                {/* Pointer Badges */}
                <div className="min-h-[18px] flex items-center justify-center">
                  {labels.length > 0 && (
                    <span className="px-1.5 py-0.5 rounded-md bg-[#141413] dark:bg-[#F4F4F0] text-white dark:text-[#141413] font-mono text-[9px] font-bold leading-none whitespace-nowrap">
                      {labels.join(',')}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
