// src/data/universeTheme.ts
// Patch 930 — Lightweight universe theme system.
// Objectif : obtenir une identité modern-retro propre sans dépendre des crops developer assets.

export type UniverseId =
  | "castle"
  | "sonic"
  | "streets"
  | "fighter"
  | "outrun"
  | "shinobi"
  | "kombat"
  | "paperboy";

export type ThemeIconRole =
  | "pickup"
  | "obstacle"
  | "boss"
  | "token"
  | "danger"
  | "special"
  | "play"
  | "map"
  | "retry"
  | "locked"
  | "clear";

export type UniverseTheme = {
  id: UniverseId;
  displayName: string;
  shortName: string;
  stageLabel: string;
  bossName: string;
  colors: {
    background: string;
    panel: string;
    panelSoft: string;
    primary: string;
    secondary: string;
    accent: string;
    danger: string;
    success: string;
    text: string;
    muted: string;
    grid: string;
  };
  labels: {
    pickup: string;
    obstacle: string;
    token: string;
    special: string;
  };
  mechanics: {
    normalTitle: string;
    normalObjective: string;
    normalRule: string;
    normalTip: string;
    bossTitle: string;
    bossObjective: string;
    bossRule: string;
    bossTip: string;
  };
  icons: Record<ThemeIconRole, string>;
  frame: {
    cornerMotif: "star" | "ring" | "brick" | "fist" | "road" | "shuriken" | "dragon" | "paper";
    borderStyle: "ornate" | "speed" | "urban" | "dojo" | "road" | "stealth" | "fatal" | "suburb";
  };
};

export const UNIVERSE_THEMES: Record<UniverseId, UniverseTheme> = {
  castle: {
    id: "castle",
    displayName: "Castle of Illusion",
    shortName: "Castle",
    stageLabel: "Jardin enchanté",
    bossName: "Miroir sorcier",
    colors: {
      background: "#080719",
      panel: "#11152d",
      panelSoft: "#1b2144",
      primary: "#f1c40f",
      secondary: "#7b3fb2",
      accent: "#9ee7ff",
      danger: "#8e44ad",
      success: "#2ecc71",
      text: "#f8f3d4",
      muted: "#8f91a8",
      grid: "#26345a",
    },
    labels: {
      pickup: "Orbe",
      obstacle: "Mur illusion",
      token: "Jeton étoile",
      special: "Murs clignotants",
    },
    mechanics: {
      normalTitle: "Murs illusion",
      normalObjective: "Collecte les orbes sans percuter les murs.",
      normalRule: "Certains murs clignotent : ils peuvent apparaître ou disparaître.",
      normalTip: "Observe le rythme avant de t’engager.",
      bossTitle: "Miroir sorcier",
      bossObjective: "Bats le miroir sans suivre les faux repères.",
      bossRule: "Le miroir inverse ou brouille une partie des dangers.",
      bossTip: "Fie-toi au danger réel, pas au reflet.",
    },
    icons: {
      pickup: "pickup_star",
      obstacle: "obstacle_block",
      boss: "boss_mirror",
      token: "pickup_star",
      danger: "obstacle_block",
      special: "boss_mirror",
      play: "ui_play",
      map: "ui_map",
      retry: "ui_retry",
      locked: "ui_lock",
      clear: "state_clear",
    },
    frame: { cornerMotif: "star", borderStyle: "ornate" },
  },

  sonic: {
    id: "sonic",
    displayName: "Sonic",
    shortName: "Sonic",
    stageLabel: "Ring Rush Zone",
    bossName: "Loop Serpent",
    colors: {
      background: "#041331",
      panel: "#09225a",
      panelSoft: "#123b8a",
      primary: "#f1c40f",
      secondary: "#0ea5e9",
      accent: "#22d3ee",
      danger: "#ef4444",
      success: "#22c55e",
      text: "#f8fafc",
      muted: "#8fb3d9",
      grid: "#17457a",
    },
    labels: {
      pickup: "Anneau",
      obstacle: "Ressort",
      token: "Anneau bonus",
      special: "Chaîne d’anneaux",
    },
    mechanics: {
      normalTitle: "Chaînes d’anneaux",
      normalObjective: "Ramasse les anneaux en chaîne.",
      normalRule: "Plus tu gardes le rythme, plus la chaîne est rentable.",
      normalTip: "Prépare ton virage avant le prochain anneau.",
      bossTitle: "Loop Serpent",
      bossObjective: "Survis aux boucles du serpent.",
      bossRule: "La boucle modifie ta trajectoire et ta sortie.",
      bossTip: "Anticipe la sortie, pas seulement l’entrée.",
    },
    icons: {
      pickup: "pickup_ring",
      obstacle: "obstacle_block",
      boss: "boss_loop_serpent",
      token: "pickup_ring",
      danger: "obstacle_block",
      special: "pickup_ring",
      play: "ui_play",
      map: "ui_map",
      retry: "ui_retry",
      locked: "ui_lock",
      clear: "state_clear",
    },
    frame: { cornerMotif: "ring", borderStyle: "speed" },
  },

  streets: {
    id: "streets",
    displayName: "Streets of Rage",
    shortName: "Streets",
    stageLabel: "Rue nocturne",
    bossName: "Crime Lord",
    colors: {
      background: "#090b16",
      panel: "#141827",
      panelSoft: "#252b3b",
      primary: "#38bdf8",
      secondary: "#e11d48",
      accent: "#facc15",
      danger: "#fb7185",
      success: "#22c55e",
      text: "#f8fafc",
      muted: "#94a3b8",
      grid: "#233049",
    },
    labels: {
      pickup: "Bonus rue",
      obstacle: "Foule",
      token: "Jeton",
      special: "Bloqueurs temporaires",
    },
    mechanics: {
      normalTitle: "Foule mouvante",
      normalObjective: "Traverse la rue et récupère les bonus.",
      normalRule: "La foule bloque certains passages temporairement.",
      normalTip: "Attends l’ouverture plutôt que forcer.",
      bossTitle: "Crime Lord",
      bossObjective: "Échappe aux barrages du boss.",
      bossRule: "Ses hommes ferment des routes pendant quelques secondes.",
      bossTip: "Garde toujours une voie de secours.",
    },
    icons: {
      pickup: "pickup_orb",
      obstacle: "obstacle_crowd",
      boss: "boss_crime_lord",
      token: "pickup_star",
      danger: "obstacle_crowd",
      special: "obstacle_crowd",
      play: "ui_play",
      map: "ui_map",
      retry: "ui_retry",
      locked: "ui_lock",
      clear: "state_clear",
    },
    frame: { cornerMotif: "brick", borderStyle: "urban" },
  },

  fighter: {
    id: "fighter",
    displayName: "Street Fighter",
    shortName: "Fighter",
    stageLabel: "Round de charge",
    bossName: "Final Challenger",
    colors: {
      background: "#0c1222",
      panel: "#151b2e",
      panelSoft: "#2a2334",
      primary: "#facc15",
      secondary: "#dc2626",
      accent: "#60a5fa",
      danger: "#ef4444",
      success: "#22c55e",
      text: "#fff7ed",
      muted: "#c4b5a5",
      grid: "#18325c",
    },
    labels: {
      pickup: "Énergie",
      obstacle: "Sac de frappe",
      token: "Médaille",
      special: "Charge",
    },
    mechanics: {
      normalTitle: "Charge contrôlée",
      normalObjective: "Survis au round et collecte l’énergie.",
      normalRule: "La charge engage ton déplacement plus fortement.",
      normalTip: "Ne charge jamais sans sortie.",
      bossTitle: "Final Challenger",
      bossObjective: "Gagne le duel final.",
      bossRule: "Le boss punit les trajectoires prévisibles.",
      bossTip: "Varie ton rythme et garde de l’espace.",
    },
    icons: {
      pickup: "pickup_orb",
      obstacle: "obstacle_block",
      boss: "boss_challenger",
      token: "pickup_star",
      danger: "obstacle_block",
      special: "boss_challenger",
      play: "ui_play",
      map: "ui_map",
      retry: "ui_retry",
      locked: "ui_lock",
      clear: "state_clear",
    },
    frame: { cornerMotif: "fist", borderStyle: "dojo" },
  },

  outrun: {
    id: "outrun",
    displayName: "OutRun",
    shortName: "OutRun",
    stageLabel: "Route turbo",
    bossName: "Turbo Rival",
    colors: {
      background: "#071629",
      panel: "#10213b",
      panelSoft: "#1d3557",
      primary: "#ff7a18",
      secondary: "#ec4899",
      accent: "#fde68a",
      danger: "#f97316",
      success: "#22c55e",
      text: "#fff7ed",
      muted: "#cbd5e1",
      grid: "#17457a",
    },
    labels: {
      pickup: "Checkpoint",
      obstacle: "Cône",
      token: "Turbo",
      special: "Dérive de voies",
    },
    mechanics: {
      normalTitle: "Voies et checkpoints",
      normalObjective: "Atteins les checkpoints sans sortir de route.",
      normalRule: "La route te pousse entre les voies.",
      normalTip: "Corrige tôt, pas au dernier moment.",
      bossTitle: "Turbo Rival",
      bossObjective: "Tiens la pression du rival.",
      bossRule: "Le rival accélère le rythme et réduit les fenêtres sûres.",
      bossTip: "Reste propre dans les virages.",
    },
    icons: {
      pickup: "pickup_checkpoint",
      obstacle: "obstacle_cone",
      boss: "boss_rival",
      token: "pickup_checkpoint",
      danger: "obstacle_cone",
      special: "pickup_checkpoint",
      play: "ui_play",
      map: "ui_map",
      retry: "ui_retry",
      locked: "ui_lock",
      clear: "state_clear",
    },
    frame: { cornerMotif: "road", borderStyle: "road" },
  },

  shinobi: {
    id: "shinobi",
    displayName: "Shinobi",
    shortName: "Shinobi",
    stageLabel: "Temple de l’ombre",
    bossName: "Shadow Ninja",
    colors: {
      background: "#05070c",
      panel: "#0f172a",
      panelSoft: "#1f2937",
      primary: "#e5e7eb",
      secondary: "#b91c1c",
      accent: "#93c5fd",
      danger: "#ef4444",
      success: "#22c55e",
      text: "#f8fafc",
      muted: "#94a3b8",
      grid: "#223047",
    },
    labels: {
      pickup: "Shuriken",
      obstacle: "Leurre",
      token: "Jeton ninja",
      special: "Focus",
    },
    mechanics: {
      normalTitle: "Focus et leurres",
      normalObjective: "Repère la vraie cible.",
      normalRule: "Des leurres peuvent t’attirer dans un piège.",
      normalTip: "Utilise le focus avant de t’engager.",
      bossTitle: "Shadow Ninja",
      bossObjective: "Bats l’ombre sans poursuivre le leurre.",
      bossRule: "L’ombre copie ou détourne tes mouvements.",
      bossTip: "Ne poursuis pas ce qui bouge trop facilement.",
    },
    icons: {
      pickup: "pickup_shuriken",
      obstacle: "obstacle_block",
      boss: "boss_shadow_ninja",
      token: "pickup_shuriken",
      danger: "obstacle_block",
      special: "pickup_orb",
      play: "ui_play",
      map: "ui_map",
      retry: "ui_retry",
      locked: "ui_lock",
      clear: "state_clear",
    },
    frame: { cornerMotif: "shuriken", borderStyle: "stealth" },
  },

  kombat: {
    id: "kombat",
    displayName: "Mortal Kombat",
    shortName: "Kombat",
    stageLabel: "Arène fatale",
    bossName: "Dragon Gate",
    colors: {
      background: "#130202",
      panel: "#1c0b0b",
      panelSoft: "#301313",
      primary: "#f59e0b",
      secondary: "#dc2626",
      accent: "#facc15",
      danger: "#ef4444",
      success: "#22c55e",
      text: "#fff7ed",
      muted: "#a8a29e",
      grid: "#2b2b2b",
    },
    labels: {
      pickup: "Finish",
      obstacle: "Zone fatale",
      token: "Jeton dragon",
      special: "Fenêtre de finish",
    },
    mechanics: {
      normalTitle: "Zones fatales",
      normalObjective: "Survis jusqu’à la fenêtre de finish.",
      normalRule: "Les zones fatales deviennent dangereuses par séquences.",
      normalTip: "Entre seulement quand la fenêtre est ouverte.",
      bossTitle: "Dragon Gate",
      bossObjective: "Traverse le portail au bon moment.",
      bossRule: "Le portail alterne danger et ouverture.",
      bossTip: "Patiente, puis frappe vite.",
    },
    icons: {
      pickup: "pickup_finish",
      obstacle: "obstacle_fire",
      boss: "boss_dragon_gate",
      token: "pickup_finish",
      danger: "obstacle_fire",
      special: "pickup_finish",
      play: "ui_play",
      map: "ui_map",
      retry: "ui_retry",
      locked: "ui_lock",
      clear: "state_clear",
    },
    frame: { cornerMotif: "dragon", borderStyle: "fatal" },
  },

  paperboy: {
    id: "paperboy",
    displayName: "Paperboy",
    shortName: "Paperboy",
    stageLabel: "Route du quartier",
    bossName: "Neighborhood Chaos",
    colors: {
      background: "#06121f",
      panel: "#102033",
      panelSoft: "#17324d",
      primary: "#facc15",
      secondary: "#22c55e",
      accent: "#60a5fa",
      danger: "#ef4444",
      success: "#22c55e",
      text: "#fff7ed",
      muted: "#a7b3c2",
      grid: "#14385d",
    },
    labels: {
      pickup: "Journal",
      obstacle: "Obstacle de rue",
      token: "Jeton journal",
      special: "Livraison",
    },
    mechanics: {
      normalTitle: "Livraisons",
      normalObjective: "Livre les bonnes maisons.",
      normalRule: "La route se remplit d’obstacles et de cibles.",
      normalTip: "Vise la livraison sûre plutôt que tous les bonus.",
      bossTitle: "Neighborhood Chaos",
      bossObjective: "Survis au chaos du quartier.",
      bossRule: "Les dangers se multiplient et bloquent la route.",
      bossTip: "Priorise les livraisons sûres.",
    },
    icons: {
      pickup: "pickup_newspaper",
      obstacle: "obstacle_mailbox",
      boss: "boss_bulldog",
      token: "pickup_newspaper",
      danger: "obstacle_dog",
      special: "pickup_newspaper",
      play: "ui_play",
      map: "ui_map",
      retry: "ui_retry",
      locked: "ui_lock",
      clear: "state_clear",
    },
    frame: { cornerMotif: "paper", borderStyle: "suburb" },
  },
};

export function getUniverseTheme(id: UniverseId): UniverseTheme {
  return UNIVERSE_THEMES[id];
}
