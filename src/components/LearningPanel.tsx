import React, { useState } from 'react';
import { BookOpen, Code2, Cpu, Lightbulb, Check, X } from 'lucide-react';
import { AlgorithmMeta, CodeLanguage } from '../types/sorting';

interface LearningPanelProps {
  algo: AlgorithmMeta;
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

export const LearningPanel: React.FC<LearningPanelProps> = ({ algo, activeCodeLine }) => {
  const [tab, setTab] = useState<'materi' | 'kode'>('materi');
  const [language, setLanguage] = useState<CodeLanguage>('pseudo');

  const lines = algo.codeSnippets[language] ?? algo.codeSnippets.pseudo;

  return (
    <div className="space-y-4">
      {/* Live Code / Pseudocode Card */}
      <div className="rounded-2xl border border-[#E7E5E0] dark:border-[#2A2A26] bg-white dark:bg-[#1A1A18] shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-[#EFECE6] dark:border-[#2A2A26] bg-[#FAF9F6] dark:bg-[#151513] space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA]" />
              <h3 className="font-display font-bold text-sm text-[#141413] dark:text-[#F4F4F0]">
                Pelacak Kode Langsung
              </h3>
            </div>
            <span className="text-[11px] font-mono text-[#6B6A65] dark:text-[#A6A49C] bg-white dark:bg-[#22221F] px-2 py-0.5 rounded-md border border-[#E7E5E0] dark:border-[#2E2E2A] tabular-nums">
              Baris {activeCodeLine}
            </span>
          </div>

          {/* Language Switcher */}
          <div
            className="flex flex-wrap items-center gap-1 bg-[#EFECE6] dark:bg-[#22221F] p-1 rounded-xl"
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
                  className={`tactile-btn flex-1 min-w-[46px] px-2 py-1 rounded-lg font-mono text-[11px] font-semibold text-center ${
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

        <div className="p-3 bg-[#171715] text-[#E7E5E0] font-mono text-xs overflow-x-auto">
          {lines.map((line, idx) => {
            const lineNum = idx + 1;
            const isActive = activeCodeLine === lineNum;
            return (
              <div
                key={`${language}-${lineNum}`}
                className={`flex items-center gap-3 px-2.5 py-1 rounded-md transition-colors duration-150 ${
                  isActive
                    ? 'bg-[#FF5A36]/20 text-white border-l-2 border-[#FF5A36]'
                    : 'text-[#A8A69E] border-l-2 border-transparent'
                }`}
              >
                <span className="w-4 text-right text-[10px] opacity-50 select-none tabular-nums">
                  {lineNum}
                </span>
                <pre className="whitespace-pre font-mono">{line}</pre>
              </div>
            );
          })}
        </div>
      </div>

      {/* Educational Concept & Complexity Card */}
      <div className="rounded-2xl border border-[#E7E5E0] dark:border-[#2A2A26] bg-white dark:bg-[#1A1A18] shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-[#EFECE6] dark:border-[#2A2A26] bg-[#FAF9F6] dark:bg-[#151513] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" style={{ color: algo.accentColor }} />
            <h3 className="font-display font-bold text-sm text-[#141413] dark:text-[#F4F4F0]">
              Materi: {algo.name}
            </h3>
          </div>
          <div className="flex items-center gap-1 bg-[#EFECE6] dark:bg-[#22221F] p-0.5 rounded-lg">
            <button
              type="button"
              onClick={() => setTab('materi')}
              className={`tactile-btn px-2.5 py-1 rounded-md text-xs font-medium ${
                tab === 'materi'
                  ? 'bg-white dark:bg-[#32322D] text-[#141413] dark:text-[#F4F4F0] shadow-xs'
                  : 'text-[#6B6A65] dark:text-[#A6A49C]'
              }`}
            >
              Analogi & Cara Kerja
            </button>
            <button
              type="button"
              onClick={() => setTab('kode')}
              className={`tactile-btn px-2.5 py-1 rounded-md text-xs font-medium ${
                tab === 'kode'
                  ? 'bg-white dark:bg-[#32322D] text-[#141413] dark:text-[#F4F4F0] shadow-xs'
                  : 'text-[#6B6A65] dark:text-[#A6A49C]'
              }`}
            >
              Kompleksitas
            </button>
          </div>
        </div>

        {tab === 'materi' ? (
          <div className="p-4 sm:p-5 space-y-4 text-sm">
            {/* Analogy */}
            <div className="p-3.5 rounded-xl bg-[#FAF9F6] dark:bg-[#22221F] border border-[#EFECE6] dark:border-[#2E2E2A]">
              <div className="flex items-center gap-2 font-display font-bold text-[#141413] dark:text-[#F4F4F0] mb-1">
                <Lightbulb className="w-4 h-4 text-[#F59E0B]" />
                <span>Analogi: {algo.analogyTitle}</span>
              </div>
              <p className="text-[#4A4944] dark:text-[#C8C6BE] text-xs sm:text-sm leading-relaxed">
                {algo.analogyDesc}
              </p>
            </div>

            {/* How it works */}
            <div>
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-[#6B6A65] dark:text-[#A6A49C] mb-2">
                Langkah-Langkah Utama
              </h4>
              <ol className="space-y-2">
                {algo.howItWorks.map((stepText, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#2B2A27] dark:text-[#E2E0D8]">
                    <span
                      className="w-5 h-5 rounded-full text-white font-mono text-[11px] font-bold flex items-center justify-center shrink-0 mt-0.5"
                      style={{ backgroundColor: algo.accentColor }}
                    >
                      {idx + 1}
                    </span>
                    <span className="leading-relaxed">{stepText}</span>
                  </li>
                ))}
              </ol>
            </div>

            {/* When to use */}
            <div className="pt-2 border-t border-[#EFECE6] dark:border-[#2A2A26]">
              <p className="text-xs text-[#575651] dark:text-[#A6A49C] leading-relaxed">
                <strong className="text-[#141413] dark:text-[#F4F4F0]">Kapan dipakai? </strong>
                {algo.whenToUse}
              </p>
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-5 space-y-4">
            {/* Complexity Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-[#FAF9F6] dark:bg-[#22221F] border border-[#EFECE6] dark:border-[#2E2E2A]">
                <span className="text-[11px] text-[#6B6A65] dark:text-[#A6A49C] block">Terbaik (Best)</span>
                <span className="font-mono font-bold text-sm text-[#10B981]">
                  {algo.complexity.best}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF9F6] dark:bg-[#22221F] border border-[#EFECE6] dark:border-[#2E2E2A]">
                <span className="text-[11px] text-[#6B6A65] dark:text-[#A6A49C] block">Rata-rata (Avg)</span>
                <span className="font-mono font-bold text-sm text-[#141413] dark:text-[#F4F4F0]">
                  {algo.complexity.average}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF9F6] dark:bg-[#22221F] border border-[#EFECE6] dark:border-[#2E2E2A]">
                <span className="text-[11px] text-[#6B6A65] dark:text-[#A6A49C] block">Terburuk (Worst)</span>
                <span className="font-mono font-bold text-sm text-[#FF5A36]">
                  {algo.complexity.worst}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#FAF9F6] dark:bg-[#22221F] border border-[#EFECE6] dark:border-[#2E2E2A]">
                <span className="text-[11px] text-[#6B6A65] dark:text-[#A6A49C] block">Memori (Space)</span>
                <span className="font-mono font-bold text-sm text-[#2563EB] dark:text-[#60A5FA]">
                  {algo.complexity.space}
                </span>
              </div>
            </div>

            {/* Stability */}
            <div className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#FAF9F6] dark:bg-[#22221F] border border-[#EFECE6] dark:border-[#2E2E2A]">
              <div className="flex items-center gap-2 text-xs font-medium text-[#141413] dark:text-[#F4F4F0]">
                <Cpu className="w-4 h-4 text-[#6B6A65] dark:text-[#A6A49C]" />
                <span>Sifat Stabilitas (Stable Sort)</span>
              </div>
              <span
                className={`px-2 py-0.5 rounded-md text-xs font-semibold ${
                  algo.stable
                    ? 'bg-[#10B981]/15 text-[#065F46] dark:text-[#6EE7B7]'
                    : 'bg-[#F59E0B]/15 text-[#92400E] dark:text-[#FCD34D]'
                }`}
              >
                {algo.stable ? 'Stabil' : 'Tidak Stabil'}
              </span>
            </div>

            {/* Pros & Cons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#065F46] dark:text-[#6EE7B7] block">Kelebihan</span>
                {algo.pros.map((pro, i) => (
                  <p key={i} className="flex items-start gap-1.5 text-xs text-[#4A4944] dark:text-[#C8C6BE]">
                    <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                    <span>{pro}</span>
                  </p>
                ))}
              </div>
              <div className="space-y-1.5">
                <span className="text-xs font-bold text-[#9A3412] dark:text-[#FDBA74] block">Kekurangan</span>
                {algo.cons.map((con, i) => (
                  <p key={i} className="flex items-start gap-1.5 text-xs text-[#4A4944] dark:text-[#C8C6BE]">
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
  );
};
