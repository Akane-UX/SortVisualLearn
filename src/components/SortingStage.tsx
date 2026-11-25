import React, { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';
import { CheckCircle2, ArrowLeftRight, Eye, Sparkles } from 'lucide-react';
import { SortStep } from '../types/sorting';

interface SortingStageProps {
  step: SortStep;
  compact?: boolean;
  title?: string;
}

export const SortingStage: React.FC<SortingStageProps> = ({
  step,
  compact = false,
  title,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const prevDoneRef = useRef(false);
  const prevLeftMapRef = useRef<Map<string, number>>(new Map());

  const maxVal = Math.max(...step.array.map((el) => el.value), 100);

  // GSAP FLIP animation: bars physically glide/swap horizontally to their new positions
  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const ctx = gsap.context(() => {
      const bars = gsap.utils.toArray<HTMLElement>('.sort-bar');
      if (!bars.length) return;

      const nextLeftMap = new Map<string, number>();

      bars.forEach((bar, idx) => {
        const elId = bar.dataset.elId;
        if (!elId) return;

        // Clear active x transform briefly to measure true layout position
        gsap.set(bar, { x: 0 });
        const rect = bar.getBoundingClientRect();
        nextLeftMap.set(elId, rect.left);

        const prevLeft = prevLeftMapRef.current.get(elId);
        const dx = prevLeft !== undefined ? prevLeft - rect.left : 0;

        const isSwapping = step.swapping.includes(idx);
        const isComparing = step.comparing.includes(idx);
        const isPivot = step.pivot === idx;

        if (Math.abs(dx) > 1) {
          // Physical swap/move: start from previous X and glide smoothly to new X
          gsap.fromTo(
            bar,
            { x: dx, y: isSwapping ? -10 : -4 },
            {
              x: 0,
              y: isSwapping ? -6 : 0,
              duration: 0.28,
              ease: 'power3.out',
              overwrite: 'auto',
            }
          );
        } else {
          gsap.to(bar, {
            x: 0,
            y: isSwapping ? -8 : isComparing || isPivot ? -4 : 0,
            scale: isSwapping ? 1.03 : 1,
            duration: 0.2,
            ease: 'power3.out',
            overwrite: 'auto',
          });
        }
      });

      prevLeftMapRef.current = nextLeftMap;

      if (step.isDone && !prevDoneRef.current) {
        gsap.fromTo(
          bars,
          { y: 0, scaleY: 1 },
          {
            y: -10,
            duration: 0.22,
            stagger: 0.025,
            yoyo: true,
            repeat: 1,
            ease: 'power2.out',
          }
        );
      }
      prevDoneRef.current = Boolean(step.isDone);
    }, containerRef);

    return () => ctx.revert();
  }, [step]);

  const getBarAppearance = (idx: number) => {
    if (step.isDone || step.sorted.includes(idx)) {
      return {
        bg: '#10B981',
        text: '#FFFFFF',
        ring: 'ring-2 ring-[#10B981]/30',
      };
    }
    if (step.swapping.includes(idx)) {
      return {
        bg: '#F59E0B',
        text: '#141413',
        ring: 'ring-2 ring-[#F59E0B]/40',
      };
    }
    if (step.pivot === idx) {
      return {
        bg: '#2563EB',
        text: '#FFFFFF',
        ring: 'ring-2 ring-[#2563EB]/35',
      };
    }
    if (step.comparing.includes(idx)) {
      return {
        bg: '#FF5A36',
        text: '#FFFFFF',
        ring: 'ring-2 ring-[#FF5A36]/35',
      };
    }
    const inRange =
      step.range && idx >= step.range[0] && idx <= step.range[1];
    return {
      bg: inRange ? '#3F3F46' : '#1E1E1C',
      text: '#FFFFFF',
      ring: inRange ? 'ring-1 ring-[#8B5CF6]/30' : '',
    };
  };

  // Group pointers by index so multiple pointers on the same bar stack cleanly
  const pointersByIndex: Record<number, string[]> = {};
  Object.entries(step.pointers).forEach(([label, idx]) => {
    if (idx >= 0 && idx < step.array.length) {
      if (!pointersByIndex[idx]) pointersByIndex[idx] = [];
      pointersByIndex[idx].push(label);
    }
  });

  return (
    <div
      ref={containerRef}
      className="rounded-2xl border border-[#E7E5E0] bg-white shadow-xs overflow-hidden"
    >
      {/* Top Stage Header: Metrics + Legend */}
      <div className="px-4 sm:px-5 py-3 border-b border-[#EFECE6] bg-[#FAF9F6] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {title && (
            <span className="font-display font-bold text-sm text-[#141413]">
              {title}
            </span>
          )}
          <div className="flex items-center gap-2 text-xs font-medium">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#E7E5E0] text-[#141413] tabular-nums">
              <Eye className="w-3.5 h-3.5 text-[#FF5A36]" />
              Banding: <strong>{step.comparisons}</strong>
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white border border-[#E7E5E0] text-[#141413] tabular-nums">
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#F59E0B]" />
              Tukar/Tulis: <strong>{step.swaps}</strong>
            </span>
          </div>
        </div>

        {!compact && (
          <div className="flex flex-wrap items-center gap-3 text-[11px] font-medium text-[#575651]">
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#FF5A36]" /> Bandingkan
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#F59E0B]" /> Tukar
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#2563EB]" /> Pivot / Kunci
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-xs bg-[#10B981]" /> Terurut
            </span>
          </div>
        )}
      </div>

      {/* Live Narration Banner */}
      <div
        className={`px-4 sm:px-5 py-2.5 border-b border-[#EFECE6] flex items-center gap-2.5 text-xs sm:text-sm ${
          step.isDone
            ? 'bg-[#10B981]/10 text-[#065F46]'
            : 'bg-[#FFFDF9] text-[#2B2A27]'
        }`}
      >
        {step.isDone ? (
          <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />
        ) : (
          <Sparkles className="w-4 h-4 text-[#FF5A36] shrink-0" />
        )}
        <p className="font-medium leading-snug">{step.narration}</p>
      </div>

      {/* Visual Bar Arena */}
      <div
        className={`stage-grid px-3 sm:px-6 pt-4 pb-4 flex flex-col justify-end ${
          compact ? 'h-60' : 'h-76 sm:h-84'
        }`}
      >
        {/* Merge Sort Divide & Merge Phase Pill */}
        {step.mergeSplit && (
          <div className="flex justify-center mb-2">
            {step.mergeSplit.phase === 'divide' && (
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-[#E7E5E0] shadow-xs text-[11px] font-medium">
                <span className="inline-flex items-center gap-1 text-[#7C3AED] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
                  Kiri [{step.mergeSplit.left}..{step.mergeSplit.mid}]
                </span>
                <span className="text-[#C9C5BC]">|</span>
                <span className="inline-flex items-center gap-1 text-[#2563EB] font-semibold">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB]" />
                  Kanan [{step.mergeSplit.mid + 1}..{step.mergeSplit.right}]
                </span>
              </div>
            )}
            {step.mergeSplit.phase === 'merge' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#8B5CF6]/10 border border-[#8B5CF6]/30 text-[#6D28D9] text-[11px] font-semibold">
                <span>
                  Menggabungkan [{step.mergeSplit.left}..{step.mergeSplit.mid}] + [
                  {step.mergeSplit.mid + 1}..{step.mergeSplit.right}] → [
                  {step.mergeSplit.left}..{step.mergeSplit.right}]
                </span>
              </div>
            )}
            {step.mergeSplit.phase === 'merged' && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/15 border border-[#10B981]/30 text-[#065F46] text-[11px] font-semibold">
                <span>
                  Tergabung Rapi [{step.mergeSplit.left}..{step.mergeSplit.right}] ✓
                </span>
              </div>
            )}
          </div>
        )}

        <div className="flex items-end justify-center gap-1 sm:gap-2 flex-1 min-h-0 w-full">
          {step.array.map((el, idx) => {
            const heightPct = Math.max(12, Math.round((el.value / maxVal) * 100));
            const appearance = getBarAppearance(idx);
            const showNumber = step.array.length <= 20;

            // Merge Sort boundary box / divider styling per slot
            const ms = step.mergeSplit;
            const inMergeRange = ms && idx >= ms.left && idx <= ms.right;
            let slotClass = '';
            if (ms && inMergeRange) {
              if (ms.phase === 'divide') {
                const isLeftPart = idx <= ms.mid;
                const isMidBoundary = idx === ms.mid;
                slotClass = isLeftPart
                  ? `bg-[#8B5CF6]/[0.07] border-t-2 border-[#8B5CF6] ${
                      idx === ms.left ? 'rounded-tl-lg border-l border-[#8B5CF6]/40' : ''
                    } ${
                      isMidBoundary
                        ? 'border-r-2 border-dashed border-[#8B5CF6] pr-1 sm:pr-1.5'
                        : ''
                    }`
                  : `bg-[#2563EB]/[0.07] border-t-2 border-[#2563EB] ${
                      idx === ms.mid + 1 ? 'pl-1 sm:pl-1.5' : ''
                    } ${
                      idx === ms.right ? 'rounded-tr-lg border-r border-[#2563EB]/40' : ''
                    }`;
              } else if (ms.phase === 'merge') {
                slotClass = `bg-[#8B5CF6]/[0.07] border-t-2 border-[#8B5CF6] ${
                  idx === ms.left ? 'rounded-tl-lg border-l border-[#8B5CF6]/40' : ''
                } ${
                  idx === ms.right ? 'rounded-tr-lg border-r border-[#8B5CF6]/40' : ''
                }`;
              } else if (ms.phase === 'merged') {
                slotClass = `bg-[#10B981]/[0.09] border-t-2 border-[#10B981] ${
                  idx === ms.left ? 'rounded-tl-lg border-l border-[#10B981]/40' : ''
                } ${
                  idx === ms.right ? 'rounded-tr-lg border-r border-[#10B981]/40' : ''
                }`;
              }
            }

            return (
              <div
                key={el.id}
                className={`flex-1 max-w-[48px] h-full flex flex-col justify-end items-center pt-2 px-0.5 transition-colors duration-200 ${slotClass}`}
              >
                <div
                  data-el-id={el.id}
                  className={`sort-bar w-full rounded-t-lg flex items-start justify-center pt-1.5 transition-colors duration-150 ${appearance.ring}`}
                  style={{
                    height: `${heightPct}%`,
                    backgroundColor: appearance.bg,
                    color: appearance.text,
                  }}
                >
                  {showNumber && (
                    <span className="font-mono text-[10px] sm:text-xs font-bold tabular-nums select-none">
                      {el.value}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Index & Pointer Row */}
        <div className="flex items-start justify-center gap-1 sm:gap-2 mt-2 min-h-[26px]">
          {step.array.map((el, idx) => {
            const labels = pointersByIndex[idx] || [];
            return (
              <div
                key={`ptr-${el.id}`}
                className="flex-1 max-w-[48px] flex flex-col items-center gap-0.5"
              >
                {step.array.length <= 18 && (
                  <span className="font-mono text-[9px] text-[#9A9891] tabular-nums">
                    {idx}
                  </span>
                )}
                {labels.length > 0 && (
                  <span className="px-1.5 py-0.5 rounded-md bg-[#141413] text-white font-mono text-[9px] font-semibold leading-none whitespace-nowrap shadow-xs">
                    {labels.join(',')}
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
