// src/data/frText.ts
// Textes français centralisés pour les actions principales.

export const FR_ACTIONS = {
  play: "JOUER",
  start: "JOUER",
  map: "CARTE",
  back: "RETOUR",
  retry: "REJOUER",
  nextLevel: "NIVEAU SUIVANT",
  selectLevel: "SÉLECTIONNER UN NIVEAU",
  locked: "VERROUILLÉ",
  boss: "BOSS",
  ready: "PRÊT",
  stageClear: "NIVEAU TERMINÉ",
  gameOver: "PERDU",
  pause: "PAUSE",
  resume: "REPRENDRE",
} as const;

export const FR_HUD = {
  score: "SCORE",
  highScore: "MEILLEUR SCORE",
  level: "NIVEAU",
  stage: "STAGE",
  length: "LONGUEUR",
  tokens: "JETONS",
  lives: "VIES",
  energy: "ÉNERGIE",
  objective: "OBJECTIF",
  mechanic: "MÉCANIQUE",
  tip: "ASTUCE",
} as const;
