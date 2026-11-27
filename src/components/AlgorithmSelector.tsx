import React from 'react';
import { ALGORITHMS, ALGORITHM_ORDER } from '../data/algorithms';
import { AlgorithmId } from '../types/sorting';

interface AlgorithmSelectorProps {
  selected: AlgorithmId;
  onSelect: (id: AlgorithmId) => void;
}

export const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div
      className="flex items-center gap-1.5 overflow-x-auto bento-scroll pb-1 sm:pb-0 sm:flex-wrap"
      role="tablist"
      aria-label="Pilih Algoritma Sorting"
    >
      {ALGORITHM_ORDER.map((id) => {
        const algo = ALGORITHMS[id];
        const isActive = selected === id;
        return (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onSelect(id)}
            className={`tactile-btn group shrink-0 relative flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-left ${
              isActive
                ? 'bg-[#141413] dark:bg-[#F4F4F0] text-white dark:text-[#141413] border-[#141413] dark:border-[#F4F4F0] shadow-xs'
                : 'bg-[#FAF9F6] dark:bg-[#22221F] text-[#141413] dark:text-[#F4F4F0] border-[#E7E5E0] dark:border-[#2E2E2A] hover:border-[#C9C5BC] dark:hover:border-[#42423D] hover:bg-white dark:hover:bg-[#2A2A26]'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0 transition-transform group-hover:scale-110"
              style={{ backgroundColor: algo.accentColor }}
            />
            <span className="font-display font-semibold text-xs sm:text-[13px] whitespace-nowrap">
              {algo.name}
            </span>
            <span
              className={`text-[10px] font-mono px-1.5 py-0.5 rounded-md ${
                isActive
                  ? 'bg-white/15 dark:bg-[#141413]/15 text-white/90 dark:text-[#141413]'
                  : 'bg-[#EFECE6] dark:bg-[#1A1A18] text-[#6B6A65] dark:text-[#A6A49C]'
              }`}
            >
              {algo.complexity.average}
            </span>
          </button>
        );
      })}
    </div>
  );
};
