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
                ? 'bg-[#141413] text-white border-[#141413] shadow-sm'
                : 'bg-white text-[#141413] border-[#E7E5E0] hover:border-[#C9C5BC] hover:bg-[#FAF9F5]'
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
                  ? 'bg-white/15 text-white/90'
                  : 'bg-[#F3F1EC] text-[#6B6A65]'
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
