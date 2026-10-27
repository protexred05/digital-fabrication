import React, { useState, useRef } from 'react';
import { GameProtocol, GAME_PROTOCOLS } from '../data/games';
import { sound } from '../utils/audio';
import {
  ArrowLeft,
  RotateCcw,
  ExternalLink,
  Maximize2,
  Minimize2,
  Sparkles,
  Cross,
  Info,
  ShieldAlert,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface GameFrameViewProps {
  gameId: 'oracle' | 'medic';
  onBackToShell: () => void;
  onSwitchGame: (gameId: 'oracle' | 'medic') => void;
}

export const GameFrameView: React.FC<GameFrameViewProps> = ({
  gameId,
  onBackToShell,
  onSwitchGame
}) => {
  const [iframeKey, setIframeKey] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [showDossier, setShowDossier] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const game: GameProtocol = GAME_PROTOCOLS[gameId];
  const otherGameId: 'oracle' | 'medic' = gameId === 'oracle' ? 'medic' : 'oracle';
  const otherGame: GameProtocol = GAME_PROTOCOLS[otherGameId];

  // Auto-dismiss loading screen after timeout so it never blocks the user
  React.useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);
    return () => clearTimeout(timer);
  }, [gameId, iframeKey]);

  const handleReload = () => {
    sound.playCommandBeep();
    setIsLoading(true);
    setIframeKey((prev) => prev + 1);
  };

  const handleToggleFullscreen = () => {
    sound.playKeyClick();
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(() => {});
      setIsFullscreen(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className={`flex flex-col flex-1 w-full bg-black font-mono ${
        isFullscreen ? 'p-0 fixed inset-0 z-50' : 'max-w-7xl mx-auto p-2 sm:p-4'
      }`}
    >
      {/* Top Game Navigation & Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2 sm:px-4 sm:py-2.5 bg-[var(--theme-bg)] border border-[var(--theme-border)] text-xs select-none">
        {/* Left: Back button & Title */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            onClick={() => {
              sound.playKeyClick();
              onBackToShell();
            }}
            className="flex items-center gap-1.5 px-2.5 py-1 border border-[var(--theme-border)] text-[var(--theme-color)] hover:border-[var(--theme-color)] hover:bg-[var(--theme-dark)] transition-colors cursor-pointer font-bold"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">BACK TO</span>
            <span>CLI SHELL</span>
          </button>

          <div className="flex items-center gap-2 pl-2 border-l border-[var(--theme-border)]">
            {gameId === 'oracle' ? (
              <Sparkles className="w-4 h-4 text-[var(--theme-color)]" />
            ) : (
              <Cross className="w-4 h-4 text-[var(--theme-color)]" />
            )}
            <span className="font-bold text-[var(--theme-color)] text-xs sm:text-sm tracking-wider crt-glow">
              {game.title}
            </span>
            <span className="hidden md:inline text-[10px] text-[var(--theme-dim)]">
              [{game.code}]
            </span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Switch to other game */}
          <button
            onClick={() => {
              sound.playLaunchTone();
              onSwitchGame(otherGameId);
            }}
            className="hidden sm:flex items-center gap-1 px-2.5 py-1 text-[11px] border border-[var(--theme-border)] text-[var(--theme-dim)] hover:text-[var(--theme-color)] hover:border-[var(--theme-color)] transition-colors cursor-pointer"
            title={`Switch to ${otherGame.title}`}
          >
            <span>SWITCH:</span>
            <span className="font-bold">{otherGame.tabLabel}</span>
          </button>

          {/* Dossier Toggle */}
          <button
            onClick={() => {
              sound.playKeyClick();
              setShowDossier((prev) => !prev);
            }}
            className={`flex items-center gap-1 px-2 py-1 text-[11px] border transition-colors cursor-pointer ${
              showDossier
                ? 'border-[var(--theme-color)] bg-[var(--theme-dark)] text-[var(--theme-color)]'
                : 'border-[var(--theme-border)] text-[var(--theme-dim)] hover:border-[var(--theme-color)]'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span className="hidden md:inline">DOSSIER</span>
            {showDossier ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {/* Reload iframe */}
          <button
            onClick={handleReload}
            title="Reload Game Frame"
            className="flex items-center gap-1 px-2 py-1 text-[11px] border border-[var(--theme-border)] text-[var(--theme-color)] hover:border-[var(--theme-color)] hover:bg-[var(--theme-dark)] transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">RELOAD</span>
          </button>

          {/* Open in New Window */}
          <a
            href={game.url}
            target="_blank"
            rel="noopener noreferrer"
            title="Open in new window / external tab"
            className="flex items-center gap-1 px-2 py-1 text-[11px] border border-[var(--theme-border)] text-[var(--theme-color)] hover:border-[var(--theme-color)] hover:bg-[var(--theme-dark)] transition-colors cursor-pointer"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">POP-OUT</span>
          </a>

          {/* Fullscreen Toggle */}
          <button
            onClick={handleToggleFullscreen}
            title="Toggle Fullscreen"
            className="p-1 sm:px-2 sm:py-1 border border-[var(--theme-border)] text-[var(--theme-color)] hover:border-[var(--theme-color)] hover:bg-[var(--theme-dark)] transition-colors cursor-pointer"
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Expandable Dossier Briefing Drawer */}
      {showDossier && (
        <div className="border-x border-b border-[var(--theme-border)] bg-[var(--theme-card)] p-3 sm:p-4 text-xs animate-in fade-in duration-150">
          <div className="flex flex-col md:flex-row gap-4 justify-between">
            <div className="space-y-1.5 flex-1">
              <div className="text-[var(--theme-color)] font-bold text-sm tracking-wide">
                MISSION BRIEFING: {game.title}
              </div>
              <div className="text-[var(--theme-dim)] leading-relaxed">
                {game.description}
              </div>
              <div className="text-[11px] text-[var(--theme-dim)]">
                TARGET ENDPOINT: <span className="text-[var(--theme-color)] underline">{game.url}</span>
              </div>
            </div>

            <div className="md:w-80 border-t md:border-t-0 md:border-l border-[var(--theme-border)] pt-2 md:pt-0 md:pl-4 space-y-1.5">
              <div className="text-[var(--theme-color)] font-bold text-xs">
                SIMULATION MECHANICS:
              </div>
              <ul className="space-y-1 text-[11px] text-[var(--theme-dim)] list-disc list-inside">
                {game.mechanics.map((m, idx) => (
                  <li key={idx} className="leading-snug">
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Main Game Viewport Frame Container */}
      <div className="relative flex-1 min-h-[550px] sm:min-h-[640px] md:min-h-[720px] border-x border-b border-[var(--theme-border)] bg-black overflow-hidden flex flex-col">
        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/95 p-4 text-center">
            <div className="w-12 h-12 border-2 border-[var(--theme-border)] border-t-[var(--theme-color)] rounded-full animate-spin mb-4" />
            <div className="text-[var(--theme-color)] font-bold tracking-widest text-sm mb-1 crt-glow">
              INITIALIZING CYBERNETIC UPLINK...
            </div>
            <div className="text-xs text-[var(--theme-dim)] mb-3">
              Allocating VT100 graphics raster to {game.title}
            </div>
            <div className="text-[11px] text-[var(--theme-dim)] max-w-md mb-4">
              Connecting to secure runtime endpoint: <span className="text-[var(--theme-color)] font-mono">{game.url}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsLoading(false)}
                className="px-3 py-1.5 text-xs border border-[var(--theme-border)] text-[var(--theme-color)] hover:bg-[var(--theme-dark)] cursor-pointer"
              >
                [ FORCE SHOW FRAME ]
              </button>
              <a
                href={game.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1.5 text-xs bg-[var(--theme-color)] text-black font-bold hover:opacity-90 flex items-center gap-1.5 shadow-[0_0_10px_var(--theme-glow)]"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>OPEN STANDALONE</span>
              </a>
            </div>
          </div>
        )}

        {/* Embedded Iframe */}
        <iframe
          key={iframeKey}
          src={game.url}
          title={game.title}
          onLoad={() => setIsLoading(false)}
          className="w-full flex-1 border-0 bg-black min-h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-downloads allow-modals"
        />

        {/* Bottom Game Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-3 py-1.5 bg-[var(--theme-bg)] border-t border-[var(--theme-border)] text-[10px] sm:text-[11px] text-[var(--theme-dim)] select-none">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[var(--theme-color)] shadow-[0_0_5px_var(--theme-color)]" />
              <span className="text-[var(--theme-color)] font-semibold">UPLINK ACTIVE</span>
            </span>
            <span className="hidden sm:inline">SANDBOX: ISOLATED</span>
            <span className="hidden md:inline">FRAME PROTOCOL: HTTPS</span>
          </div>

          <div className="flex items-center gap-3">
            <span>IF DISPLAY IS CLIPPED:</span>
            <a
              href={game.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[var(--theme-color)] hover:underline flex items-center gap-1"
            >
              <span>LAUNCH STANDALONE</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
