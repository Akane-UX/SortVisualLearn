import React, { useState } from 'react';
import { BookOpen, Code2, Cpu, Lightbulb, Check, X } from 'lucide-react';
import { CodeLanguage } from '../types/sorting';
import { SearchAlgorithmMeta } from '../types/searching';

interface SearchLearningPanelProps {
  algo: SearchAlgorithmMeta;
  activeCodeLine: number;
}

const LANGUAGE_OPTIONS: { id: CodeLanguage; label: string }[] = [
  { id: 'pseudo', label: 'Pseudo' },
  { id: 'python', label: 'Python' },
  { id: 'javascript', label: 'JS' },
  { id: 'dart', label: 'Dart' },
  { id: 'java', label: 'Java' },
  { id: 'cpp', label: 'C++' },
];

export const SearchLearningPanel: React.FC<SearchLearningPanelProps> = ({
  algo,
  activeCodeLine,
}) => {
  const [tab, setTab] = useState<'materi' | 'kode'>('materi');
  const [language, setLanguage] = useState<CodeLanguage>('pseudo');

  const lines = algo.codeSnippets[language] ?? algo.codeSnippets.pseudo;

  return (
    <div className="h-full min-h-0 flex flex-col gap-3 lg:gap-3.5">
      {/* Bento Tile 1 (Top): Live Code Tracker */}
      <div className="flex-1 min-h-[220px] lg:min-h-0 flex flex-col rounded-2xl border border-[#E7E5E0] dark:border-[#2A2A26] bg-white dark:bg-[#1A1A18] shadow-xs overflow-hidden">
        <div className="shrink-0 px-3.5 py-2.5 border-b border-[#EFECE6] dark:border-[#2A2A26] bg-[#FAF9F6] dark:bg-[#151513] space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5">
              <Code2 className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />
              <h3 className="font-display font-bold text-xs sm:text-sm text-[#141413] dark:text-[#F4F4F0]">
                Pelacak Kode Langsung
              </h3>
            </div>
            <span className="text-[10px] font-mono text-[#6B6A65] dark:text-[#A6A49C] bg-white dark:bg-[#22221F] px-2 py-0.5 rounded-md border border-[#E7E5E0] dark:border-[#2E2E2A] tabular-nums">
              Baris {activeCodeLine}
            </span>
          </div>

          <div
            className="grid grid-cols-6 gap-1 bg-[#EFECE6] dark:bg-[#22221F] p-1 rounded-xl"
            role="tablist"
            aria-label="Pilih bahasa pemrograman"
          >
            {LANGUAGE_OPTIONS.map((opt) => {
              const active = language === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setLanguage(opt.id)}
                  className={`tactile-btn px-1.5 py-1 rounded-lg font-mono text-[10px] sm:text-[11px] font-semibold text-center truncate ${
                    active
                      ? 'bg-white dark:bg-[#32322D] text-[#141413] dark:text-[#F4F4F0] shadow-xs'
                      : 'text-[#6B6A65] dark:text-[#A6A49C] hover:text-[#141413] dark:hover:text-[#F4F4F0]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-1 min-h-0 p-3 bg-[#171715] text-[#E7E5E0] font-mono text-xs overflow-auto bento-scroll">
          {lines.map((line, idx) => {
            const lineNum = idx + 1;
            const isActive = activeCodeLine === lineNum;
            return (
              <div
                key={`${language}-${lineNum}`}
                className={`flex items-center gap-2.5 px-2 py-1 rounded-md transition-colors duration-150 ${
                  isActive
                    ? 'bg-[#FF5A36]/20 text-white border-l-2 border-[#FF5A36]'
                    : 'text-[#A8A69E] border-l-2 border-transparent'
                }`}
              >
                <span className="w-4 text-right text-[10px] opacity-50 select-none tabular-nums shrink-0">
                  {lineNum}
                </span>
                <pre className="whitespace-pre font-mono text-[11px] sm:text-xs">{line}</pre>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bento Tile 2 (Bottom): Educational Material Card */}
      <div className="flex-1 min-h-[240px] lg:min-h-0 flex flex-col rounded-2xl border border-[#E7E5E0] dark:border-[#2A2A26] bg-white dark:bg-[#1A1A18] shadow-xs overflow-hidden">
        <div className="shrink-0 px-3.5 py-2.5 border-b border-[#EFECE6] dark:border-[#2A2A26] bg-[#FAF9F6] dark:bg-[#151513] space-y-2">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 min-w-0">
              <BookOpen className="w-4 h-4 shrink-0" style={{ color: algo.accentColor }} />
              <h3 className="font-display font-bold text-xs sm:text-sm text-[#141413] dark:text-[#F4F4F0] truncate">
                Materi: {algo.name}
              </h3>
            </div>
            <span
              className={`shrink-0 px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                algo.requiresSorted
                  ? 'bg-[#2563EB]/15 text-[#1D4ED8] dark:text-[#60A5FA]'
                  : 'bg-[#10B981]/15 text-[#065F46] dark:text-[#6EE7B7]'
              }`}
            >
              {algo.requiresSorted ? 'Wajib Urut' : 'Bebas'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1 bg-[#EFECE6] dark:bg-[#22221F] p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setTab('materi')}
              className={`tactile-btn px-2 py-1 rounded-lg text-[11px] font-semibold text-center ${
                tab === 'materi'
                  ? 'bg-white dark:bg-[#32322D] text-[#141413] dark:text-[#F4F4F0] shadow-xs'
                  : 'text-[#6B6A65] dark:text-[#A6A49C]'
              }`}
            >
              Analogi & Langkah
            </button>
            <button
              type="button"
              onClick={() => setTab('kode')}
              className={`tactile-btn px-2 py-1 rounded-lg text-[11px] font-semibold text-center ${
                tab === 'kode'
                  ? 'bg-white dark:bg-[#32322D] text-[#141413] dark:text-[#F4F4F0] shadow-xs'
                  : 'text-[#6B6A65] dark:text-[#A6A49C]'
              }`}
            >
              Kompleksitas
            </button>
          </div>
        </div>

        <div className="flex-1 min-h-0 overflow-y-auto bento-scroll p-3.5 sm:p-4">
          {tab === 'materi' ? (
            <div className="space-y-3.5 text-sm">
              <div className="p-3 rounded-xl bg-[#FAF9F6] dark:bg-[#22221F] border border-[#EFECE6] dark:border-[#2E2E2A]">
                <div className="flex items-center gap-1.5 font-display font-bold text-xs sm:text-sm text-[#141413] dark:text-[#F4F4F0] mb-1">
                  <Lightbulb className="w-3.5 h-3.5 text-[#F59E0B] shrink-0" />
                  <span>Analogi: {algo.analogyTitle}</span>
                </div>
                <p className="text-[#4A4944] dark:text-[#C8C6BE] text-xs leading-relaxed">
                  {algo.analogyDesc}
                </p>
              </div>

              <div>
                <h4 className="font-display font-bold text-[11px] uppercase tracking-wider text-[#6B6A65] dark:text-[#A6A49C] mb-2">
                  Langkah-Langkah Utama
                </h4>
                <ol className="space-y-1.5">
                  {algo.howItWorks.map((stepText, idx) => (
                    <li
                      key={idx}
                      className="flex items-start gap-2 text-xs text-[#2B2A27] dark:text-[#E2E0D8]"
                    >
                      <span
                        className="w-4 h-4 rounded-full text-white font-mono text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                        style={{ backgroundColor: algo.accentColor }}
                      >
                        {idx + 1}
                      </span>
                      <span className="leading-relaxed">{stepText}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="pt-2.5 border-t border-[#EFECE6] dark:border-[#2A2A26]">
                <p className="text-xs text-[#575651] dark:text-[#A6A49C] leading-relaxed">
                  <strong className="text-[#141413] dark:text-[#F4F4F0]">Kapan dipakai? </strong>
                  {algo.whenToUse}
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3.5">
              <div className="grid grid-cols-2 gap-2">
                <div className="p-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#22221F] border border-[#EFECE6] dark:border-[#2E2E2A]">
                  <span className="text-[10px] text-[#6B6A65] dark:text-[#A6A49C] block">
                    Terbaik (Best)
                  </span>
                  <span className="font-mono font-bold text-xs sm:text-sm text-[#10B981]">
                    {algo.complexity.best}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#22221F] border border-[#EFECE6] dark:border-[#2E2E2A]">
                  <span className="text-[10px] text-[#6B6A65] dark:text-[#A6A49C] block">
                    Rata-rata (Avg)
                  </span>
                  <span className="font-mono font-bold text-xs sm:text-sm text-[#141413] dark:text-[#F4F4F0]">
                    {algo.complexity.average}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#22221F] border border-[#EFECE6] dark:border-[#2E2E2A]">
                  <span className="text-[10px] text-[#6B6A65] dark:text-[#A6A49C] block">
                    Terburuk (Worst)
                  </span>
                  <span className="font-mono font-bold text-xs sm:text-sm text-[#FF5A36]">
                    {algo.complexity.worst}
                  </span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#22221F] border border-[#EFECE6] dark:border-[#2E2E2A]">
                  <span className="text-[10px] text-[#6B6A65] dark:text-[#A6A49C] block">
                    Memori (Space)
                  </span>
                  <span className="font-mono font-bold text-xs sm:text-sm text-[#2563EB] dark:text-[#60A5FA]">
                    {algo.complexity.space}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between px-3 py-2 rounded-xl bg-[#FAF9F6] dark:bg-[#22221F] border border-[#EFECE6] dark:border-[#2E2E2A]">
                <div className="flex items-center gap-1.5 text-xs font-medium text-[#141413] dark:text-[#F4F4F0]">
                  <Cpu className="w-3.5 h-3.5 text-[#6B6A65] dark:text-[#A6A49C]" />
                  <span>Syarat Data</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                    algo.requiresSorted
                      ? 'bg-[#2563EB]/15 text-[#1D4ED8] dark:text-[#60A5FA]'
                      : 'bg-[#10B981]/15 text-[#065F46] dark:text-[#6EE7B7]'
                  }`}
                >
                  {algo.requiresSorted ? 'Wajib Terurut' : 'Bisa Acak / Terurut'}
                </span>
              </div>

              <div className="space-y-2.5 pt-1">
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#065F46] dark:text-[#6EE7B7] block">
                    Kelebihan
                  </span>
                  {algo.pros.map((pro, i) => (
                    <p
                      key={i}
                      className="flex items-start gap-1.5 text-xs text-[#4A4944] dark:text-[#C8C6BE]"
                    >
                      <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                      <span>{pro}</span>
                    </p>
                  ))}
                </div>
                <div className="space-y-1">
                  <span className="text-xs font-bold text-[#9A3412] dark:text-[#FDBA74] block">
                    Kekurangan
                  </span>
                  {algo.cons.map((con, i) => (
                    <p
                      key={i}
                      className="flex items-start gap-1.5 text-xs text-[#4A4944] dark:text-[#C8C6BE]"
                    >
                      <X className="w-3.5 h-3.5 text-[#FF5A36] shrink-0 mt-0.5" />
                      <span>{con}</span>
                    </p>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
