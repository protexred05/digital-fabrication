export interface GameProtocol {
  id: 'oracle' | 'medic';
  title: string;
  tabLabel: string;
  code: string;
  url: string;
  subtitle: string;
  category: string;
  classification: string;
  description: string;
  mechanics: string[];
  cliCommands: string[];
}

export const GAME_PROTOCOLS: Record<'oracle' | 'medic', GameProtocol> = {
  oracle: {
    id: 'oracle',
    title: 'ASTRO-ORACLE',
    tabLabel: 'ASTRO ORACLE',
    code: 'SYS-DIVINE-01',
    url: 'https://astrodice.ai.studio/',
    subtitle: 'Astrological Divination (Knucklebone Dice, Tarot Deck, Crystal Ball Scryer)',
    category: 'Celestial Divination & Mysticism',
    classification: 'RESTRICTED // OCCULT CYBERNETICS',
    description:
      'Ancient astragalomancy meets 3D celestial cartography. Cast knucklebones into planetary quadrants, unveil high-resolution tarot spreads, and gaze into resonant quartz scrying spheres tuned to cosmic frequencies.',
    mechanics: [
      'Knucklebone Dice Casting across 12 Zodiac Houses',
      'Full Tarot Deck Divination with Past / Present / Future Synthesis',
      'Harmonic Crystal Ball Scrying with Frequency Modulation (528Hz / 432Hz)',
      'Cosmic Transit Horizon and Natal Aspect Calculations'
    ],
    cliCommands: ['run oracle', 'run astrodice', 'dice', 'tarot 3', 'scry 528']
  },
  medic: {
    id: 'medic',
    title: 'CORPSMAN-86',
    tabLabel: 'WAR MEDIC',
    code: 'SYS-TRIAGE-02',
    url: 'https://medicdilemma.ai.studio/',
    subtitle: 'War Medic Triage Dilemma (Field Hospital, Arterial Trauma, Moral Sacrifices)',
    category: 'Tactical Casualty Simulation',
    classification: 'COMBAT MEDICINE // PRIORITY 1',
    description:
      'Field hospital under relentless mortar fire. Sift through incoming casualties, identify catastrophic arterial bleeding, manage tension pneumothorax, and allocate scarce plasma and surgical beds under severe triage ethics.',
    mechanics: [
      'Tactical Combat Casualty Care (TCCC) algorithmic triage',
      'Rapid Hemorrhage Control: Tourniquets, Hemostatic Gauze, Pressure Dressings',
      'Respiratory Emergency Interventions (Needle Thoracostomy, Airway Management)',
      'Ethical Rationing of Whole Blood & Resuscitation Facilities'
    ],
    cliCommands: ['run medic', 'triage']
  }
};
