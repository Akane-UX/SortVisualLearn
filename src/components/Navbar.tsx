import React from 'react';
import { Volume2, VolumeX, Swords, GraduationCap, Sparkles } from 'lucide-react';
import { AppMode } from '../types/sorting';

interface NavbarProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  mode,
  onModeChange,
  soundEnabled,
  onToggleSound,
}) => {
  const navItems: { id: AppMode; label: string; icon: React.ReactNode }[] = [
    { id: 'learn', label: 'Visualisasi & Materi', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'race', label: 'Duel Algoritma', icon: <Swords className="w-4 h-4" /> },
    { id: 'quiz', label: 'Kuis Interaktif', icon: <GraduationCap className="w-4 h-4" /> },
  ];

  return (
    <header className="sticky top-0 z-30 border-b border-[#E7E5E0] bg-[#FAFAF8]/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#141413] text-white flex items-center justify-center shadow-sm">
            <div className="flex items-end gap-0.5 h-4">
              <span className="w-1 h-2 bg-[#FF5A36] rounded-full" />
              <span className="w-1 h-3.5 bg-[#F59E0B] rounded-full" />
              <span className="w-1 h-4 bg-[#10B981] rounded-full" />
            </div>
          </div>
          <div>
            <span className="font-display font-bold text-lg tracking-tight text-[#141413]">
              SortVisual<span className="text-[#FF5A36]">Learn</span>
            </span>
            <p className="text-[11px] text-[#6B6A65] hidden sm:block leading-none mt-0.5">
              Studio Belajar Algoritma Sorting Interaktif
            </p>
          </div>
        </div>

        {/* Mode Switcher */}
        <nav
          aria-label="Mode Pembelajaran"
          className="flex items-center bg-[#EFECE6] p-1 rounded-xl border border-[#E2DFD7]"
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
                    ? 'bg-white text-[#141413] shadow-xs'
                    : 'text-[#6B6A65] hover:text-[#141413]'
                }`}
              >
                {item.icon}
                <span className="hidden md:inline">{item.label}</span>
                <span className="md:hidden">{item.label.split(' ')[0]}</span>
              </button>
            );
          })}
        </nav>

        {/* Sound Toggle */}
        <button
          type="button"
          onClick={onToggleSound}
          aria-label={soundEnabled ? 'Matikan efek suara' : 'Nyalakan efek suara'}
          title={soundEnabled ? 'Suara Aktif (klik untuk matikan)' : 'Suara Mati (klik untuk nyalakan)'}
          className={`tactile-btn flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-medium ${
            soundEnabled
              ? 'bg-white border-[#E2DFD7] text-[#141413] hover:border-[#C9C5BC]'
              : 'bg-[#F3F1EC] border-[#E2DFD7] text-[#7D7B75]'
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
    </header>
  );
};
