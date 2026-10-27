import React from 'react';
import { Terminal, Sparkles, Cross, Palette, Monitor, Volume2, VolumeX } from 'lucide-react';
import { sound } from '../utils/audio';

export type TabMode = 'shell' | 'oracle' | 'medic';

interface NavbarProps {
  activeTab: TabMode;
  onSelectTab: (tab: TabMode) => void;
  theme: string;
  onCycleTheme: () => void;
  scanlines: boolean;
  onToggleScanlines: () => void;
  audioEnabled: boolean;
  onToggleAudio: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onSelectTab,
  theme,
  onCycleTheme,
  scanlines,
  onToggleScanlines,
  audioEnabled,
  onToggleAudio
}) => {
  const handleTabClick = (tab: TabMode) => {
    sound.playKeyClick();
    if (tab !== 'shell') {
      sound.playLaunchTone();
    }
    onSelectTab(tab);
  };

  const handleTheme = () => {
    sound.playKeyClick();
    onCycleTheme();
  };

  const handleScanlines = () => {
    sound.playKeyClick();
    onToggleScanlines();
  };

  const handleAudio = () => {
    onToggleAudio();
  };

  const themeDisplayNames: Record<string, string> = {
    green: 'GREEN',
    amber: 'AMBER',
    cyan: 'CYAN',
    mono: 'MONO'
  };

  return (
    <header className="border-b border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-2 sm:px-6 sm:py-3 transition-colors duration-200">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        
        {/* Left: Terminal Protocols Brand */}
        <div className="flex items-center gap-2.5 tracking-wider select-none shrink-0">
          <Terminal className="w-4 h-4 text-[var(--theme-color)] animate-pulse" />
          <span className="font-bold tracking-widest text-[var(--theme-color)] text-sm sm:text-base crt-glow">
            TERMINAL PROTOCOLS
          </span>
          <span className="text-[var(--theme-dim)] text-[11px] font-mono tracking-tight hidden md:inline">
            SYS//v2.86.04
          </span>
        </div>

        {/* Center: Tabs */}
        <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1">
          <button
            onClick={() => handleTabClick('shell')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 border transition-all duration-150 rounded-none font-mono text-xs sm:text-xs font-semibold cursor-pointer ${
              activeTab === 'shell'
                ? 'bg-[var(--theme-color)] text-black border-[var(--theme-color)] shadow-[0_0_12px_rgba(0,255,102,0.5)]'
                : 'text-[var(--theme-color)] border-[var(--theme-border)] hover:border-[var(--theme-color)] hover:bg-[var(--theme-dark)]'
            }`}
          >
            <span>&gt;_</span>
            <span>CLI SHELL</span>
          </button>

          <button
            onClick={() => handleTabClick('oracle')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 border transition-all duration-150 rounded-none font-mono text-xs sm:text-xs font-semibold cursor-pointer ${
              activeTab === 'oracle'
                ? 'bg-[var(--theme-color)] text-black border-[var(--theme-color)] shadow-[0_0_12px_rgba(0,255,102,0.5)]'
                : 'text-[var(--theme-color)] border-[var(--theme-border)] hover:border-[var(--theme-color)] hover:bg-[var(--theme-dark)]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>ASTRO ORACLE</span>
          </button>

          <button
            onClick={() => handleTabClick('medic')}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 border transition-all duration-150 rounded-none font-mono text-xs sm:text-xs font-semibold cursor-pointer ${
              activeTab === 'medic'
                ? 'bg-[var(--theme-color)] text-black border-[var(--theme-color)] shadow-[0_0_12px_rgba(0,255,102,0.5)]'
                : 'text-[var(--theme-color)] border-[var(--theme-border)] hover:border-[var(--theme-color)] hover:bg-[var(--theme-dark)]'
            }`}
          >
            <Cross className="w-3.5 h-3.5" />
            <span>WAR MEDIC</span>
          </button>
        </nav>

        {/* Right: Controls (Theme, Scanlines, Audio) */}
        <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
          {/* Theme Palette Switcher */}
          <button
            onClick={handleTheme}
            title="Cycle Phosphor Color Theme"
            className="flex items-center gap-1 px-2 py-1 text-[11px] sm:text-xs border border-[var(--theme-border)] hover:border-[var(--theme-color)] hover:bg-[var(--theme-dark)] text-[var(--theme-color)] cursor-pointer transition-colors"
          >
            <Palette className="w-3.5 h-3.5" />
            <span className="font-mono">{themeDisplayNames[theme] || 'GREEN'}</span>
          </button>

          {/* Scanlines Toggle */}
          <button
            onClick={handleScanlines}
            title="Toggle CRT Scanline Overlay"
            className={`flex items-center gap-1 px-2 py-1 text-[11px] sm:text-xs border cursor-pointer transition-colors ${
              scanlines
                ? 'border-[var(--theme-color)] bg-[var(--theme-dark)] text-[var(--theme-color)]'
                : 'border-[var(--theme-border)] text-[var(--theme-dim)] hover:border-[var(--theme-color)]'
            }`}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="font-mono hidden sm:inline">SCANLINES</span>
            <span className="font-mono text-[10px]">{scanlines ? 'ON' : 'OFF'}</span>
          </button>

          {/* Audio Toggle */}
          <button
            onClick={handleAudio}
            title="Toggle Synthesized Sound FX"
            className={`flex items-center gap-1 px-2 py-1 text-[11px] sm:text-xs border cursor-pointer transition-colors ${
              audioEnabled
                ? 'border-[var(--theme-color)] bg-[var(--theme-dark)] text-[var(--theme-color)]'
                : 'border-[var(--theme-border)] text-[var(--theme-dim)] hover:border-[var(--theme-color)]'
            }`}
          >
            {audioEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="font-mono hidden sm:inline">AUDIO</span>
            <span className="font-mono text-[10px]">{audioEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
