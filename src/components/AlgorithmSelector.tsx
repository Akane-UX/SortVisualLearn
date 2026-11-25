import React from 'react';
import { ALGORITHMS, ALGORITHM_ORDER } from '../data/algorithms';
import { AlgorithmId } from '../types/sorting';

interface AlgorithmSelectorProps {
  selected: AlgorithmId;
  onSelect: (id: AlgorithmId) => void;
}

export const AlgorithmSelector: React.FC<AlgorithmSelectorProps> = ({ selected, onSelect }) => {
  return (
    <div className="flex flex-wrap gap-2" role="tablist" aria-label="Pilih Algoritma Sorting">
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
            className={`tactile-btn group relative flex items-center gap-2 px-3.5 py-2 rounded-xl border text-left ${
              isActive
                ? 'bg-[#141413] dark:bg-[#F4F4F0] text-white dark:text-[#141413] border-[#141413] dark:border-[#F4F4F0] shadow-sm'
                : 'bg-white dark:bg-[#1A1A18] text-[#141413] dark:text-[#F4F4F0] border-[#E7E5E0] dark:border-[#2A2A26] hover:border-[#C9C5BC] dark:hover:border-[#42423D] hover:bg-[#FAF9F5] dark:hover:bg-[#22221F]'
            }`}
          >
            <span
              className="w-2.5 h-2.5 rounded-full shrink-0 transition-transform group-hover:scale-110"
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
  );
};
