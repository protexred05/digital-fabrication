import { GAME_PROTOCOLS } from '../data/games';

export interface TerminalOutputLine {
  id: string;
  type: 'system' | 'command' | 'output' | 'error' | 'ascii' | 'highlight' | 'table';
  text: string;
  timestamp?: string;
}

const TAROT_DECK = [
  { name: 'THE FOOL (0)', meaning: 'New beginnings, infinite potential, leap of faith into uncharted cyberspace.' },
  { name: 'THE MAGICIAN (I)', meaning: 'Mastery over digital elements, conscious creation, focused willpower.' },
  { name: 'THE HIGH PRIESTESS (II)', meaning: 'Hidden algorithms, cryptic data intuition, subconscious gateway.' },
  { name: 'THE EMPRESS (III)', meaning: 'Abundance, flourishing creative computation, organic synthesis.' },
  { name: 'THE EMPEROR (IV)', meaning: 'Strict network architecture, security protocols, structural dominance.' },
  { name: 'THE HIEROPHANT (V)', meaning: 'Ancient codices, algorithmic dogma, esoteric traditions.' },
  { name: 'THE CHARIOT (VII)', meaning: 'Overcoming firewall resistance, relentless momentum, triumph through discipline.' },
  { name: 'THE HERMIT (IX)', meaning: 'Isolated debugging, deep introspective meditation, beacon of clarity.' },
  { name: 'WHEEL OF FORTUNE (X)', meaning: 'Entropy fluctuations, cyclical shifts in probability, sudden packet windfalls.' },
  { name: 'THE TOWER (XVI)', meaning: 'Catastrophic system breach, collapse of false firewalls, revelation through rupture.' },
  { name: 'THE STAR (XVII)', meaning: 'Renewed hope, celestial calibration, crystal transmission clarity.' },
  { name: 'THE MOON (XVIII)', meaning: 'Deceptive sensory illusions, hallucinated anomalies, navigation through shadows.' },
  { name: 'THE SUN (XIX)', meaning: 'Full radiant enlightenment, uncorrupted memory, peak operational glory.' },
  { name: 'THE WORLD (XXI)', meaning: 'Holistic synthesis, complete protocol execution, cosmic convergence.' }
];

const ZODIAC_HOUSES = [
  'Aries (Cardinal Fire - Initiative & Ignition)',
  'Taurus (Fixed Earth - Material Grounding)',
  'Gemini (Mutable Air - Rapid Data Interchange)',
  'Cancer (Cardinal Water - Subconscious Resonance)',
  'Leo (Fixed Fire - Radiance & Solar Will)',
  'Virgo (Mutable Earth - Analytical Optimization)',
  'Libra (Cardinal Air - Harmonic Equilibrium)',
  'Scorpio (Fixed Water - Depth Cryptography & Rebirth)',
  'Sagittarius (Mutable Fire - Quest for Cosmic Truth)',
  'Capricorn (Cardinal Earth - Architectural Supremacy)',
  'Aquarius (Fixed Air - Disruptive Innovation)',
  'Pisces (Mutable Water - Boundless Oceanic Dreamscape)'
];

const CASUALTY_SCENARIOS = [
  {
    patient: 'SGT. VASQUEZ // CALLSIGN: VAPOR-4',
    vitals: 'HR: 142 bpm (Thready) · BP: 82/48 mmHg · RR: 28 rpm · SpO2: 88%',
    injury: 'Traumatic right femoral transection via 82mm mortar shrapnel. Arterial jetting present. Altered mental status.',
    dilemma: 'Tourniquet slippage upstream. Patient losing ~300mL/min. Surgical theater has 1 remaining whole-blood unit.',
    protocols: 'TCCC PRIORITY: 1. High & tight CAT tourniquet immediately. 2. Push TXA within 3h window. 3. Tag: RED (IMMEDIATE).'
  },
  {
    patient: 'CPL. CHEN // CALLSIGN: ROOK-2',
    vitals: 'HR: 130 bpm · BP: 90/55 mmHg · RR: 36 rpm · SpO2: 84% (Labored)',
    injury: 'Tension pneumothorax right hemithorax. Tracheal deviation left, absent right breath sounds, hyperresonance.',
    dilemma: 'Severe respiratory distress. Imminent cardiac arrest if thoracic pressure is not relieved within 90 seconds.',
    protocols: 'TCCC PRIORITY: 1. 14G 3.25in needle decompression 2nd intercostal space. 2. Vented chest seal. 3. Tag: RED (IMMEDIATE).'
  },
  {
    patient: 'PVT. KOWALSKI // CALLSIGN: ANCHOR-9',
    vitals: 'HR: 96 bpm · BP: 124/80 mmHg · RR: 16 rpm · SpO2: 98%',
    injury: 'Closed compound fracture left tibia-fibula. Distal dorsalis pedis pulse intact, capillary refill 2s.',
    dilemma: 'Severe agonizing pain, but hemodynamically stable. 4 critical bleeding casualties waiting on gurneys.',
    protocols: 'TCCC PRIORITY: 1. Splint in position of function. 2. Analgesia via fentanyl lozenge. 3. Tag: YELLOW (DELAYED).'
  }
];

export function executeCommand(
  rawCmd: string,
  callbacks: {
    launchGame: (gameId: 'oracle' | 'medic') => void;
    setTheme: (theme: string) => void;
    toggleScanlines: () => void;
    toggleAudio: () => void;
    clearTerminal: () => void;
  }
): TerminalOutputLine[] {
  const clean = rawCmd.trim();
  const lower = clean.toLowerCase();
  const args = clean.split(/\s+/);
  const mainCmd = args[0]?.toLowerCase() || '';

  if (!clean) return [];

  // Launch Commands
  if (
    mainCmd === 'run' ||
    mainCmd === 'launch' ||
    mainCmd === 'play' ||
    mainCmd === 'start'
  ) {
    const target = args[1]?.toLowerCase();
    if (target === 'oracle' || target === 'astro' || target === 'astrodice' || target === '1') {
      callbacks.launchGame('oracle');
      return [
        { id: Math.random().toString(), type: 'highlight', text: '[LAUNCH]: Booting ASTRO-ORACLE celestial protocol...' },
        { id: Math.random().toString(), type: 'output', text: 'Target URL: https://astrodice.ai.studio/' },
        { id: Math.random().toString(), type: 'output', text: 'Display pipeline allocated. Switching to dedicated game viewport.' }
      ];
    }
    if (target === 'medic' || target === 'corpsman' || target === '2') {
      callbacks.launchGame('medic');
      return [
        { id: Math.random().toString(), type: 'highlight', text: '[LAUNCH]: Booting CORPSMAN-86 War Medic protocol...' },
        { id: Math.random().toString(), type: 'output', text: 'Target URL: https://medicdilemma.ai.studio/' },
        { id: Math.random().toString(), type: 'output', text: 'Triage telemetry uplink connected. Switching to dedicated game viewport.' }
      ];
    }
    return [
      { id: Math.random().toString(), type: 'error', text: `ERR: Unknown protocol target "${args[1] || ''}". Use "run oracle" or "run medic".` }
    ];
  }

  // Direct game names as commands
  if (mainCmd === 'oracle' || mainCmd === 'astro-oracle' || mainCmd === 'astrodice' || mainCmd === 'astro') {
    callbacks.launchGame('oracle');
    return [
      { id: Math.random().toString(), type: 'highlight', text: '[LAUNCH]: Switching to ASTRO-ORACLE viewport...' }
    ];
  }

  if (mainCmd === 'medic' || mainCmd === 'corpsman' || mainCmd === 'war-medic') {
    callbacks.launchGame('medic');
    return [
      { id: Math.random().toString(), type: 'highlight', text: '[LAUNCH]: Switching to CORPSMAN-86 viewport...' }
    ];
  }

  // Help command
  if (mainCmd === 'help' || mainCmd === '?') {
    return [
      { id: Math.random().toString(), type: 'highlight', text: '==================== COMMAND DIRECTORY ====================' },
      { id: Math.random().toString(), type: 'output', text: '  run oracle      - Launch Astro Oracle 3D divination game' },
      { id: Math.random().toString(), type: 'output', text: '  run medic       - Launch War Medic triage dilemma game' },
      { id: Math.random().toString(), type: 'output', text: '  list            - Display full dossiers of loaded games' },
      { id: Math.random().toString(), type: 'output', text: '  dice            - Cast 3 astrological knucklebones in terminal' },
      { id: Math.random().toString(), type: 'output', text: '  tarot [1-3]     - Draw and synthesize cosmic tarot cards' },
      { id: Math.random().toString(), type: 'output', text: '  scry [freq]     - Tune quartz scrying crystal (e.g. scry 528)' },
      { id: Math.random().toString(), type: 'output', text: '  triage          - Inspect incoming frontline casualty dilemma' },
      { id: Math.random().toString(), type: 'output', text: '  cat readme.txt  - Print system documentation & game overview' },
      { id: Math.random().toString(), type: 'output', text: '  theme [color]   - Change CRT phosphor (green | amber | cyan | mono)' },
      { id: Math.random().toString(), type: 'output', text: '  scanlines       - Toggle CRT scanline mesh filter' },
      { id: Math.random().toString(), type: 'output', text: '  audio           - Toggle synthesized Web Audio FX' },
      { id: Math.random().toString(), type: 'output', text: '  whoami / date   - Display terminal environment credentials' },
      { id: Math.random().toString(), type: 'output', text: '  clear           - Wipe console history buffer' },
      { id: Math.random().toString(), type: 'highlight', text: '===========================================================' }
    ];
  }

  // List command
  if (mainCmd === 'list' || mainCmd === 'games' || mainCmd === 'ls') {
    return [
      { id: Math.random().toString(), type: 'highlight', text: 'LOADED GAME PROTOCOLS IN CYBER-OS-86 KERNEL:' },
      { id: Math.random().toString(), type: 'output', text: '------------------------------------------------------------' },
      { id: Math.random().toString(), type: 'highlight', text: '[1] PROTOCOL: ASTRO-ORACLE (SYS-DIVINE-01)' },
      { id: Math.random().toString(), type: 'output', text: '    Endpoint: ' + GAME_PROTOCOLS.oracle.url },
      { id: Math.random().toString(), type: 'output', text: '    Category: ' + GAME_PROTOCOLS.oracle.category },
      { id: Math.random().toString(), type: 'output', text: '    Features: Knucklebone Dice, Tarot Deck, Crystal Ball Scryer' },
      { id: Math.random().toString(), type: 'output', text: '    CLI Exec: "run oracle", "dice", "tarot 3", "scry 528"' },
      { id: Math.random().toString(), type: 'output', text: '------------------------------------------------------------' },
      { id: Math.random().toString(), type: 'highlight', text: '[2] PROTOCOL: CORPSMAN-86 (SYS-TRIAGE-02)' },
      { id: Math.random().toString(), type: 'output', text: '    Endpoint: ' + GAME_PROTOCOLS.medic.url },
      { id: Math.random().toString(), type: 'output', text: '    Category: ' + GAME_PROTOCOLS.medic.category },
      { id: Math.random().toString(), type: 'output', text: '    Features: Field Hospital, Arterial Trauma, Moral Sacrifices' },
      { id: Math.random().toString(), type: 'output', text: '    CLI Exec: "run medic", "triage"' },
      { id: Math.random().toString(), type: 'output', text: '------------------------------------------------------------' },
      { id: Math.random().toString(), type: 'output', text: 'Tip: Click tab buttons in the top navbar or type "run <target>".' }
    ];
  }

  // Dice roll command
  if (mainCmd === 'dice' || mainCmd === 'roll') {
    const dice1 = Math.floor(Math.random() * 6) + 1;
    const dice2 = Math.floor(Math.random() * 6) + 1;
    const dice3 = Math.floor(Math.random() * 6) + 1;
    const total = dice1 + dice2 + dice3;
    const house = ZODIAC_HOUSES[Math.floor(Math.random() * ZODIAC_HOUSES.length)];
    const diceAscii = [
      `┌─────────┐ ┌─────────┐ ┌─────────┐`,
      `│ DIE I: ${dice1}│ │ DIE II:${dice2}│ │ DIE III:${dice3}│`,
      `└─────────┘ └─────────┘ └─────────┘`
    ];

    let omen = 'AUSPICIOUS CELESTIAL ALIGNMENT';
    if (total <= 6) omen = 'SATURNINE TRIAL // Proceed with maximum encryption and prudence.';
    else if (total <= 12) omen = 'MERCURIAL FLUX // Swift communicative breakthrough detected.';
    else omen = 'SOLAR EXALTATION // Radiant breakthrough; fortune smiles on high-risk plays.';

    return [
      { id: Math.random().toString(), type: 'highlight', text: 'CASTING CELESTIAL KNUCKLEBONE RUNES...' },
      { id: Math.random().toString(), type: 'ascii', text: diceAscii.join('\n') },
      { id: Math.random().toString(), type: 'output', text: `Sum of Astragaloi: ${total} // House of Descent: ${house}` },
      { id: Math.random().toString(), type: 'highlight', text: `DIVINATION: ${omen}` },
      { id: Math.random().toString(), type: 'output', text: 'Want the full 3D interactive chamber? Type "run oracle"!' }
    ];
  }

  // Tarot command
  if (mainCmd === 'tarot') {
    let count = parseInt(args[1], 10);
    if (isNaN(count) || count < 1) count = 3;
    if (count > 5) count = 5;

    const shuffled = [...TAROT_DECK].sort(() => Math.random() - 0.5);
    const drawn = shuffled.slice(0, count);
    const positions = ['[PAST / ROOT ANCHOR]', '[PRESENT / OPERATIONAL REALITY]', '[FUTURE / CELESTIAL TRAJECTORY]', '[HIDDEN FORCES]', '[OUTCOME CLIMAX]'];

    const lines: TerminalOutputLine[] = [
      { id: Math.random().toString(), type: 'highlight', text: `SHUFFLING MAJOR ARCANA DECK... DRAWING ${count} CARDS:` }
    ];

    drawn.forEach((card, idx) => {
      const isReversed = Math.random() > 0.7;
      const orientation = isReversed ? '(REVERSED)' : '(UPRIGHT)';
      lines.push({
        id: Math.random().toString(),
        type: 'highlight',
        text: `\n${positions[idx]} -> ${card.name} ${orientation}`
      });
      lines.push({
        id: Math.random().toString(),
        type: 'output',
        text: `   Meaning: ${card.meaning} ${isReversed ? 'Blocked energy or internal reflection advised.' : ''}`
      });
    });

    lines.push({
      id: Math.random().toString(),
      type: 'output',
      text: '\nExperience high-def interactive 3D tarot spreads via "run oracle".'
    });

    return lines;
  }

  // Scry command
  if (mainCmd === 'scry') {
    const freq = args[1] ? args[1] + ' Hz' : '528 Hz (Solfeggio Love/Miracle)';
    const ballAscii = [
      `     .---.     `,
      `    /  *  \\    `,
      `   |   ✦   |   [ CRYSTAL RESONANCE AT ${freq} ]`,
      `    \\  .  /    `,
      `     '---'     `,
      `    /=====\\    `
    ].join('\n');

    return [
      { id: Math.random().toString(), type: 'highlight', text: 'TUNING QUARTZ SCRYING SPHERE HARMONICS...' },
      { id: Math.random().toString(), type: 'ascii', text: ballAscii },
      { id: Math.random().toString(), type: 'output', text: 'Ethereal transmission locked. Astral noise filtered to 0.04%.' },
      { id: Math.random().toString(), type: 'highlight', text: 'VISION: A distant star system aligns with Cyber-OS nodes. Clarity achieved.' },
      { id: Math.random().toString(), type: 'output', text: 'Type "run oracle" to enter the 3D crystal divination sanctum.' }
    ];
  }

  // Triage scenario command
  if (mainCmd === 'triage') {
    const scenario = CASUALTY_SCENARIOS[Math.floor(Math.random() * CASUALTY_SCENARIOS.length)];
    return [
      { id: Math.random().toString(), type: 'highlight', text: '🚨 INCOMING COMBAT CASUALTY ARRIVAL // FORWARD OPERATING BASE ECHO:' },
      { id: Math.random().toString(), type: 'output', text: '------------------------------------------------------------' },
      { id: Math.random().toString(), type: 'highlight', text: `CASUALTY: ${scenario.patient}` },
      { id: Math.random().toString(), type: 'output', text: `VITALS:   ${scenario.vitals}` },
      { id: Math.random().toString(), type: 'output', text: `TRAUMA:   ${scenario.injury}` },
      { id: Math.random().toString(), type: 'highlight', text: `DILEMMA:  ${scenario.dilemma}` },
      { id: Math.random().toString(), type: 'output', text: '------------------------------------------------------------' },
      { id: Math.random().toString(), type: 'output', text: scenario.protocols },
      { id: Math.random().toString(), type: 'highlight', text: 'To take command of the full surgical field hospital, type "run medic"!' }
    ];
  }

  // cat readme.txt
  if (mainCmd === 'cat' && args[1]?.toLowerCase().includes('readme')) {
    return [
      { id: Math.random().toString(), type: 'highlight', text: '=== TERMINAL PROTOCOLS // OPERATIONAL README ===' },
      { id: Math.random().toString(), type: 'output', text: 'HOST: CYBER-OS-86 VT100 DUAL PROTOCOL GATEWAY' },
      { id: Math.random().toString(), type: 'output', text: 'DESIGNED TO UNIFY CUTTING-EDGE WEB GAME SIMULATIONS.' },
      { id: Math.random().toString(), type: 'output', text: '' },
      { id: Math.random().toString(), type: 'highlight', text: 'EMBEDDED SIMULATIONS:' },
      { id: Math.random().toString(), type: 'output', text: '1. ASTRO-ORACLE (https://astrodice.ai.studio/)' },
      { id: Math.random().toString(), type: 'output', text: '   - Astrological Divination & Celestial Scrying' },
      { id: Math.random().toString(), type: 'output', text: '   - 3D knucklebones, tarot spread arrays, vibrational quartz' },
      { id: Math.random().toString(), type: 'output', text: '2. CORPSMAN-86 (https://medicdilemma.ai.studio/)' },
      { id: Math.random().toString(), type: 'output', text: '   - War Medic Triage Dilemma simulator' },
      { id: Math.random().toString(), type: 'output', text: '   - Real-time hemorrhage triage under severe ethical constraints' },
      { id: Math.random().toString(), type: 'output', text: '' },
      { id: Math.random().toString(), type: 'highlight', text: 'FEATURES & CONTROLS:' },
      { id: Math.random().toString(), type: 'output', text: '· Switch seamlessly between CLI Shell and full embedded games' },
      { id: Math.random().toString(), type: 'output', text: '· 4 CRT Phosphor colorways: Green, Amber, Cyan, Mono White' },
      { id: Math.random().toString(), type: 'output', text: '· Dynamic CRT scanlines and synthesized retro Web Audio clicks' },
      { id: Math.random().toString(), type: 'output', text: '· Fullscreen and external tab expansion controls' },
      { id: Math.random().toString(), type: 'highlight', text: '================================================' }
    ];
  }

  // Theme switch command
  if (mainCmd === 'theme') {
    const val = args[1]?.toLowerCase();
    if (['green', 'amber', 'cyan', 'mono'].includes(val)) {
      callbacks.setTheme(val);
      return [
        { id: Math.random().toString(), type: 'highlight', text: `[THEME]: Switched CRT phosphor to ${val.toUpperCase()}.` }
      ];
    }
    return [
      { id: Math.random().toString(), type: 'output', text: 'Usage: theme <green | amber | cyan | mono>' }
    ];
  }

  // Scanlines toggle
  if (mainCmd === 'scanlines' || mainCmd === 'crt') {
    callbacks.toggleScanlines();
    return [
      { id: Math.random().toString(), type: 'highlight', text: '[DISPLAY]: Toggled CRT scanlines rasterization.' }
    ];
  }

  // Audio toggle
  if (mainCmd === 'audio' || mainCmd === 'sound' || mainCmd === 'sfx') {
    callbacks.toggleAudio();
    return [
      { id: Math.random().toString(), type: 'highlight', text: '[AUDIO]: Toggled Web Audio synthesis feedback.' }
    ];
  }

  // Clear command
  if (mainCmd === 'clear' || mainCmd === 'cls') {
    callbacks.clearTerminal();
    return [];
  }

  // Environment info
  if (mainCmd === 'whoami') {
    return [
      { id: Math.random().toString(), type: 'output', text: 'USER: hacker@cyber-os-86 // ACCESS LEVEL: ROOT (0) // TERMINAL: VT100-ANSI' }
    ];
  }

  if (mainCmd === 'date') {
    return [
      { id: Math.random().toString(), type: 'output', text: `SYSTEM TIME: ${new Date().toISOString()} // UTC TIMESTAMP` }
    ];
  }

  // Default unrecognized command
  return [
    { id: Math.random().toString(), type: 'error', text: `bash: command not found: "${clean}". Type "help" or "list" for options.` }
  ];
}
