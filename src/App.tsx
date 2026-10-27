import React, { useState, useEffect } from 'react';
import { Navbar, TabMode } from './components/Navbar';
import { TerminalView } from './components/TerminalView';
import { GameFrameView } from './components/GameFrameView';
import { sound } from './utils/audio';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabMode>('shell');
  const [theme, setTheme] = useState<string>('green');
  const [scanlines, setScanlines] = useState<boolean>(true);
  const [audioEnabled, setAudioEnabled] = useState<boolean>(true);

  // Sync theme attribute to documentElement
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const handleCycleTheme = () => {
    const themes = ['green', 'amber', 'cyan', 'mono'];
    const currentIdx = themes.indexOf(theme);
    const nextTheme = themes[(currentIdx + 1) % themes.length];
    setTheme(nextTheme);
  };

  const handleToggleScanlines = () => {
    setScanlines((prev) => !prev);
  };

  const handleToggleAudio = () => {
    const next = !audioEnabled;
    setAudioEnabled(next);
    sound.setEnabled(next);
    if (next) {
      sound.playCommandBeep();
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col bg-[var(--theme-bg)] text-[var(--theme-color)] relative selection:bg-[var(--theme-color)] selection:text-black ${
        scanlines ? 'scanlines-overlay' : ''
      }`}
    >
      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        theme={theme}
        onCycleTheme={handleCycleTheme}
        scanlines={scanlines}
        onToggleScanlines={handleToggleScanlines}
        audioEnabled={audioEnabled}
        onToggleAudio={handleToggleAudio}
      />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative z-10 overflow-x-hidden">
        {activeTab === 'shell' ? (
          <TerminalView
            onLaunchGame={(gameId) => setActiveTab(gameId)}
            onSetTheme={(newTheme) => setTheme(newTheme)}
            onToggleScanlines={handleToggleScanlines}
            onToggleAudio={handleToggleAudio}
          />
        ) : (
          <GameFrameView
            gameId={activeTab}
            onBackToShell={() => setActiveTab('shell')}
            onSwitchGame={(gameId) => setActiveTab(gameId)}
          />
        )}
      </main>
    </div>
  );
}
