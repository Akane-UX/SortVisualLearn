import React from 'react';
import {
  Volume2,
  VolumeX,
  Swords,
  GraduationCap,
  Sparkles,
  Sun,
  Moon,
  ArrowUpDown,
  Search,
} from 'lucide-react';
import { AppMode, TopicDomain } from '../types/sorting';

interface NavbarProps {
  topic: TopicDomain;
  onTopicChange: (topic: TopicDomain) => void;
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  darkMode: boolean;
  onToggleDarkMode: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  topic,
  onTopicChange,
  mode,
  onModeChange,
  soundEnabled,
  onToggleSound,
  darkMode,
  onToggleDarkMode,
}) => {
  const navItems: { id: AppMode; label: string; icon: React.ReactNode }[] = [
    { id: 'learn', label: 'Visualisasi & Materi', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'race', label: 'Duel Algoritma', icon: <Swords className="w-4 h-4" /> },
    { id: 'quiz', label: 'Kuis Interaktif', icon: <GraduationCap className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-[#E7E5E0] dark:border-[#2A2A26] bg-[#FAFAF8]/85 dark:bg-[#111110]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 min-h-16 py-2 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#141413] dark:bg-[#232320] text-white flex items-center justify-center shadow-sm border border-transparent dark:border-[#34342F]">
            <div className="flex items-end gap-0.5 h-4">
              <span className="w-1 h-2 bg-[#FF5A36] rounded-full" />
              <span className="w-1 h-3.5 bg-[#F59E0B] rounded-full" />
              <span className="w-1 h-4 bg-[#10B981] rounded-full" />
            </div>
          </div>
          <div>
            <span className="font-display font-bold text-lg tracking-tight text-[#141413] dark:text-[#F4F4F0]">
              SortVisual<span className="text-[#FF5A36]">Learn</span>
            </span>
            <p className="text-[11px] text-[#6B6A65] dark:text-[#A6A49C] hidden xl:block leading-none mt-0.5">
              Studio Belajar Sorting & Searching Interaktif
            </p>
          </div>
        </div>

        {/* Dedicated Topic Switcher: Sort vs Search */}
        <div
          role="group"
          aria-label="Pilih Topik Pembelajaran"
          className="flex items-center gap-1.5 bg-[#EFECE6] dark:bg-[#1E1E1B] p-1 rounded-xl border border-[#E2DFD7] dark:border-[#2E2E2A]"
        >
          <button
            type="button"
            onClick={() => onTopicChange('sort')}
            className={`tactile-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold ${
              topic === 'sort'
                ? 'bg-[#FF5A36] text-white shadow-xs'
                : 'text-[#6B6A65] dark:text-[#A6A49C] hover:text-[#141413] dark:hover:text-[#F4F4F0]'
            }`}
          >
            <ArrowUpDown className="w-3.5 h-3.5" />
            <span>Sorting</span>
          </button>
          <button
            type="button"
            onClick={() => onTopicChange('search')}
            className={`tactile-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-semibold ${
              topic === 'search'
                ? 'bg-[#2563EB] text-white shadow-xs'
                : 'text-[#6B6A65] dark:text-[#A6A49C] hover:text-[#141413] dark:hover:text-[#F4F4F0]'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Searching</span>
          </button>
        </div>

        {/* Mode Switcher */}
        <nav
          aria-label="Mode Pembelajaran"
          className="flex items-center bg-[#EFECE6] dark:bg-[#1E1E1B] p-1 rounded-xl border border-[#E2DFD7] dark:border-[#2E2E2A]"
        >
          {navItems.map((item) => {
            const active = mode === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onModeChange(item.id)}
                className={`tactile-btn flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs sm:text-sm font-medium ${
                  active
                    ? 'bg-white dark:bg-[#2B2B27] text-[#141413] dark:text-[#F4F4F0] shadow-xs'
                    : 'text-[#6B6A65] dark:text-[#A6A49C] hover:text-[#141413] dark:hover:text-[#F4F4F0]'
                }`}
              >
                {item.icon}
                <span className="hidden md:inline">{item.label}</span>
                <span className="md:hidden">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Controls: Theme + Sound */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleDarkMode}
            aria-label={darkMode ? 'Beralih ke mode terang' : 'Beralih ke mode gelap'}
            title={darkMode ? 'Mode Terang' : 'Mode Gelap'}
            className="tactile-btn p-2 rounded-xl border border-[#E2DFD7] dark:border-[#2E2E2A] bg-white dark:bg-[#1C1C19] text-[#141413] dark:text-[#F4F4F0] hover:border-[#C9C5BC] dark:hover:border-[#42423D]"
          >
            {darkMode ? (
              <Sun className="w-4 h-4 text-[#F59E0B]" />
            ) : (
              <Moon className="w-4 h-4 text-[#575651]" />
            )}
          </button>

          <button
            type="button"
            onClick={onToggleSound}
            aria-label={soundEnabled ? 'Matikan efek suara' : 'Nyalakan efek suara'}
            title={soundEnabled ? 'Suara Aktif (klik untuk matikan)' : 'Suara Mati (klik untuk nyalakan)'}
            className={`tactile-btn flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium ${
              soundEnabled
                ? 'bg-white dark:bg-[#1C1C19] border-[#E2DFD7] dark:border-[#2E2E2A] text-[#141413] dark:text-[#F4F4F0] hover:border-[#C9C5BC] dark:hover:border-[#42423D]'
                : 'bg-[#F3F1EC] dark:bg-[#181816] border-[#E2DFD7] dark:border-[#2A2A26] text-[#7D7B75] dark:text-[#8E8C84]'
            }`}
          >
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-[#10B981]" />
            ) : (
              <VolumeX className="w-4 h-4" />
            )}
            <span className="hidden sm:inline">{soundEnabled ? 'Suara On' : 'Suara Off'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
