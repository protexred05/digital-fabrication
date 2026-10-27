import React, { useState, useRef, useEffect } from 'react';
import { executeCommand, TerminalOutputLine } from '../utils/terminalEngine';
import { GAME_PROTOCOLS } from '../data/games';
import { sound } from '../utils/audio';
import { Play, ExternalLink, Sparkles, Cross, Terminal as TerminalIcon } from 'lucide-react';

interface TerminalViewProps {
  onLaunchGame: (gameId: 'oracle' | 'medic') => void;
  onSetTheme: (theme: string) => void;
  onToggleScanlines: () => void;
  onToggleAudio: () => void;
}

const INITIAL_ASCII_BANNER = `========================================================================
 _____ _____ ____  __  __ ___ _   _    _    _       ___  ____  
|_   _| ____|  _ \\|  \\/  |_ _| \\ | |  / \\  | |     / _ \\/ ___| 
  | | |  _| | |_) | |\\/| || ||  \\| | / _ \\ | |    | | | \\___ \\ 
  | | | |___|  _ <| |  | || || |\\  |/ ___ \\| |___ | |_| |___) |
  |_| |_____|_| \\_\\_|  |_|___|_| \\_/_/   \\_\\_____(_)___/|____/ 
========================================================================`;

const BOOT_SYSTEM_LINES = [
  'VT100 HACKER INTERFACE // HOST: CYBER-OS-86 // KERNEL 6.12-x86_64',
  'Connected to Local Workstation. Type "help" or "list" for executable games.',
  '',
  '[SYSTEM BOOT OK]: Ready. 2 Game Protocols loaded in memory:',
  '',
  '[1] ASTRO-ORACLE  - Astrological Divination (Knucklebone Dice, Tarot Deck, Crystal Ball Scryer)',
  '[2] CORPSMAN-86   - War Medic Triage Dilemma (Field Hospital, Arterial Trauma, Moral Sacrifices)',
  '',
  'Type "run oracle" or "run medic" to launch dedicated game view,',
  'or execute inline CLI commands ("dice", "tarot", "scry", "triage").'
];

const SHORTKEYS = [
  { label: 'run oracle', cmd: 'run oracle', desc: 'Launch Astro Oracle 3D' },
  { label: 'run medic', cmd: 'run medic', desc: 'Launch War Medic Triage' },
  { label: 'dice', cmd: 'dice', desc: 'Roll Celestial Knucklebones' },
  { label: 'tarot 3', cmd: 'tarot 3', desc: 'Draw 3 Cosmic Tarot Cards' },
  { label: 'scry 528', cmd: 'scry 528', desc: 'Tune Crystal Resonator' },
  { label: 'cat readme.txt', cmd: 'cat readme.txt', desc: 'System Briefing' },
  { label: 'help', cmd: 'help', desc: 'Command Directory' },
  { label: 'clear', cmd: 'clear', desc: 'Wipe History' }
];

export const TerminalView: React.FC<TerminalViewProps> = ({
  onLaunchGame,
  onSetTheme,
  onToggleScanlines,
  onToggleAudio
}) => {
  const [history, setHistory] = useState<TerminalOutputLine[]>([]);
  const [inputVal, setInputVal] = useState('');
  const [cmdHistory, setCmdHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState<number>(-1);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto focus input
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Scroll to bottom on new output
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  const runCommand = (commandStr: string) => {
    const trimmed = commandStr.trim();
    if (!trimmed) return;

    sound.playCommandBeep();

    // Add user command entry
    const userLine: TerminalOutputLine = {
      id: Math.random().toString(),
      type: 'command',
      text: `HACKER@CONSOLE:~$ ${trimmed}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    // Execute through engine
    const output = executeCommand(trimmed, {
      launchGame: (gameId) => {
        sound.playLaunchTone();
        onLaunchGame(gameId);
      },
      setTheme: onSetTheme,
      toggleScanlines: onToggleScanlines,
      toggleAudio: onToggleAudio,
      clearTerminal: () => {
        setHistory([]);
      }
    });

    if (trimmed.toLowerCase() !== 'clear') {
      setHistory((prev) => [...prev, userLine, ...output]);
      setCmdHistory((prev) => [...prev, trimmed]);
      setHistoryIdx(-1);
    }

    setInputVal('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    sound.playKeyClick();

    if (e.key === 'Enter') {
      runCommand(inputVal);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (cmdHistory.length === 0) return;
      const nextIdx = historyIdx === -1 ? cmdHistory.length - 1 : Math.max(0, historyIdx - 1);
      setHistoryIdx(nextIdx);
      setInputVal(cmdHistory[nextIdx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIdx === -1) return;
      const nextIdx = historyIdx + 1;
      if (nextIdx >= cmdHistory.length) {
        setHistoryIdx(-1);
        setInputVal('');
      } else {
        setHistoryIdx(nextIdx);
        setInputVal(cmdHistory[nextIdx]);
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();
      // Auto complete
      const candidates = [
        'run oracle',
        'run medic',
        'dice',
        'tarot',
        'tarot 3',
        'scry',
        'scry 528',
        'triage',
        'cat readme.txt',
        'help',
        'list',
        'clear',
        'theme green',
        'theme amber',
        'theme cyan',
        'theme mono'
      ];
      const match = candidates.find((c) => c.startsWith(inputVal.trim().toLowerCase()));
      if (match) {
        setInputVal(match);
      }
    }
  };

  const handleShortkey = (cmd: string) => {
    sound.playKeyClick();
    runCommand(cmd);
    inputRef.current?.focus();
  };

  return (
    <div className="flex flex-col flex-1 max-w-7xl w-full mx-auto p-2 sm:p-4 md:p-6 font-mono text-xs sm:text-sm">
      {/* Outer VT100 Terminal Box with border and phosphor glow */}
      <div
        className="flex flex-col flex-1 border border-[var(--theme-border)] bg-[var(--theme-card)] shadow-[0_0_20px_-5px_var(--theme-glow)] overflow-hidden"
        onClick={() => inputRef.current?.focus()}
      >
        {/* Terminal Header Bar */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-[var(--theme-border)] bg-[var(--theme-bg)] text-[11px] select-none">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[var(--theme-color)] shadow-[0_0_6px_var(--theme-color)]" />
            <span className="text-[var(--theme-color)] font-bold tracking-wide">
              TERMINAL_OS // VT100 SESSION
            </span>
          </div>
          <div className="flex items-center gap-4 text-[var(--theme-dim)]">
            <span>TTY1: 9600 BAUD</span>
            <span className="hidden sm:inline">UTF-8 // VT100</span>
          </div>
        </div>

        {/* Scrollable Terminal Output Screen */}
        <div
          ref={scrollRef}
          className="flex-1 p-3 sm:p-5 overflow-y-auto space-y-2 select-text font-mono text-xs sm:text-sm leading-relaxed"
        >
          {/* Top ASCII Art Banner */}
          <pre className="text-[var(--theme-color)] font-mono leading-none tracking-tighter text-[9px] sm:text-[11px] md:text-xs overflow-x-auto select-none crt-glow">
            {INITIAL_ASCII_BANNER}
          </pre>

          {/* System Boot Lines */}
          <div className="space-y-1 text-[var(--theme-color)] font-mono">
            {BOOT_SYSTEM_LINES.map((line, idx) => (
              <div key={idx} className={line.startsWith('[1]') || line.startsWith('[2]') ? 'font-bold' : ''}>
                {line}
              </div>
            ))}
          </div>

          {/* Appended History */}
          {history.map((item) => {
            if (item.type === 'command') {
              return (
                <div key={item.id} className="pt-2 text-[var(--theme-color)] font-bold flex items-center gap-2">
                  <span className="text-[var(--theme-color)] crt-glow">{item.text}</span>
                  {item.timestamp && (
                    <span className="text-[10px] text-[var(--theme-dim)] opacity-60">
                      [{item.timestamp}]
                    </span>
                  )}
                </div>
              );
            }
            if (item.type === 'ascii') {
              return (
                <pre
                  key={item.id}
                  className="p-2 border border-[var(--theme-border)] bg-[var(--theme-bg)] text-[var(--theme-color)] font-mono text-xs overflow-x-auto crt-glow"
                >
                  {item.text}
                </pre>
              );
            }
            if (item.type === 'highlight') {
              return (
                <div key={item.id} className="text-[var(--theme-color)] font-semibold crt-glow">
                  {item.text}
                </div>
              );
            }
            if (item.type === 'error') {
              return (
                <div key={item.id} className="text-red-400 font-semibold">
                  {item.text}
                </div>
              );
            }
            return (
              <div key={item.id} className="text-[var(--theme-dim)] whitespace-pre-wrap">
                {item.text}
              </div>
            );
          })}
        </div>

        {/* CLI SHORTKEYS Row (Matching the screenshot precisely) */}
        <div className="border-t border-[var(--theme-border)] bg-[var(--theme-bg)] px-3 py-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
          <span className="text-[10px] sm:text-[11px] text-[var(--theme-dim)] tracking-wider font-semibold mr-1 select-none">
            CLI SHORTKEYS:
          </span>
          {SHORTKEYS.map((item) => (
            <button
              key={item.cmd}
              onClick={(e) => {
                e.stopPropagation();
                handleShortkey(item.cmd);
              }}
              title={item.desc}
              className="px-2 py-0.5 text-[11px] font-mono border border-[var(--theme-border)] bg-black/40 text-[var(--theme-color)] hover:bg-[var(--theme-color)] hover:text-black hover:border-[var(--theme-color)] transition-colors cursor-pointer select-none active:scale-95"
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Input Command Line (Matching prompt styling from screenshot) */}
        <div className="border-t border-[var(--theme-border)] bg-black px-3 py-2.5 sm:py-3 flex items-center gap-2">
          <label htmlFor="cli-input" className="text-[var(--theme-color)] font-bold font-mono tracking-wide whitespace-nowrap crt-glow select-none">
            HACKER@CONSOLE:~$
          </label>
          <div className="relative flex-1 flex items-center">
            <input
              id="cli-input"
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type 'run oracle', 'run medic', 'dice', 'tarot', 'cat readme.txt', or 'help'..."
              className="w-full bg-transparent text-[var(--theme-color)] font-mono text-xs sm:text-sm focus:outline-none placeholder:text-[var(--theme-dim)]/50 tracking-wide"
              autoComplete="off"
              spellCheck={false}
            />
            {/* Blinking green block cursor */}
            <span className="inline-block w-2.5 h-4 bg-[var(--theme-color)] animate-cursor ml-0.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Game Protocols Showcase Deck below terminal */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 select-none">
        {/* Game 1: ASTRO-ORACLE */}
        <div className="border border-[var(--theme-border)] bg-[var(--theme-card)] p-3 sm:p-4 flex flex-col justify-between hover:border-[var(--theme-color)] transition-all group">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[var(--theme-color)]" />
                <h3 className="font-bold text-[var(--theme-color)] text-sm sm:text-base tracking-wide crt-glow">
                  {GAME_PROTOCOLS.oracle.title}
                </h3>
              </div>
              <span className="text-[10px] border border-[var(--theme-border)] px-1.5 py-0.5 text-[var(--theme-dim)] font-mono">
                {GAME_PROTOCOLS.oracle.code}
              </span>
            </div>
            <p className="text-xs text-[var(--theme-dim)] mb-3 leading-relaxed">
              {GAME_PROTOCOLS.oracle.subtitle}
            </p>
            <div className="space-y-1 mb-4 text-[11px] text-[var(--theme-color)]/90 font-mono">
              <div>✦ 3D Astragaloi Knucklebone Casting</div>
              <div>✦ High-Resolution Major/Minor Arcana Tarot Spreads</div>
              <div>✦ 528Hz Solfeggio Quartz Crystal Ball Scryer</div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-[var(--theme-border)]">
            <button
              onClick={() => {
                sound.playLaunchTone();
                onLaunchGame('oracle');
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-[var(--theme-color)] text-black font-bold font-mono text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-[0_0_10px_var(--theme-glow)]"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>LAUNCH GAME</span>
            </button>
            <a
              href={GAME_PROTOCOLS.oracle.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-[var(--theme-border)] text-[var(--theme-color)] hover:border-[var(--theme-color)] hover:bg-[var(--theme-dark)] transition-colors cursor-pointer"
              title="Open External URL in New Tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Game 2: CORPSMAN-86 / WAR MEDIC */}
        <div className="border border-[var(--theme-border)] bg-[var(--theme-card)] p-3 sm:p-4 flex flex-col justify-between hover:border-[var(--theme-color)] transition-all group">
          <div>
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-2">
                <Cross className="w-4 h-4 text-[var(--theme-color)]" />
                <h3 className="font-bold text-[var(--theme-color)] text-sm sm:text-base tracking-wide crt-glow">
                  {GAME_PROTOCOLS.medic.title}
                </h3>
              </div>
              <span className="text-[10px] border border-[var(--theme-border)] px-1.5 py-0.5 text-[var(--theme-dim)] font-mono">
                {GAME_PROTOCOLS.medic.code}
              </span>
            </div>
            <p className="text-xs text-[var(--theme-dim)] mb-3 leading-relaxed">
              {GAME_PROTOCOLS.medic.subtitle}
            </p>
            <div className="space-y-1 mb-4 text-[11px] text-[var(--theme-color)]/90 font-mono">
              <div>✚ Frontline TCCC Arterial Hemorrhage Control</div>
              <div>✚ Tension Pneumothorax Thoracostomy Simulation</div>
              <div>✚ Catastrophic Mass-Casualty Resource Rationing</div>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2 border-t border-[var(--theme-border)]">
            <button
              onClick={() => {
                sound.playLaunchTone();
                onLaunchGame('medic');
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 bg-[var(--theme-color)] text-black font-bold font-mono text-xs hover:opacity-90 transition-opacity cursor-pointer shadow-[0_0_10px_var(--theme-glow)]"
            >
              <Play className="w-3.5 h-3.5 fill-black" />
              <span>LAUNCH GAME</span>
            </button>
            <a
              href={GAME_PROTOCOLS.medic.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 border border-[var(--theme-border)] text-[var(--theme-color)] hover:border-[var(--theme-color)] hover:bg-[var(--theme-dark)] transition-colors cursor-pointer"
              title="Open External URL in New Tab"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
