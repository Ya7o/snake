export type DesignBoardUniverseId =
  | 'castle'
  | 'sonic'
  | 'streets'
  | 'fighter'
  | 'outrun'
  | 'shinobi'
  | 'kombat'
  | 'paperboy';

export type DesignBoardZoneStatus =
  | 'clean'
  | 'containsLabel'
  | 'partial'
  | 'overlapsOtherSection'
  | 'tooWide'
  | 'tooTall'
  | 'ambiguous'
  | 'missing'
  | 'invalid'
  | 'needsManualCrop';

export type DesignBoardZoneType = 'section' | 'item';

export interface DesignBoardCropRect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface DesignBoardCropZone {
  type: DesignBoardZoneType;
  rect: DesignBoardCropRect | null;
  status: DesignBoardZoneStatus;
  note: string;
}

export interface DesignBoardLayoutManifestEntry {
  universeId: DesignBoardUniverseId;
  sourceFile: string;
  image: {
    width: number;
    height: number;
  };
  notes: string;
  zones: Record<
    | 'gameplayPreview'
    | 'hud'
    | 'props'
    | 'pickups'
    | 'obstacles'
    | 'boss'
    | 'borders'
    | 'badges'
    | 'palette'
    | 'borderTop'
    | 'borderBottom'
    | 'borderLeft'
    | 'borderRight',
    DesignBoardCropZone
  >;
}

const s = (
  type: DesignBoardZoneType,
  rect: DesignBoardCropRect | null,
  status: DesignBoardZoneStatus,
  note: string,
): DesignBoardCropZone => ({ type, rect, status, note });

const gone = (type: DesignBoardZoneType, note: string): DesignBoardCropZone =>
  s(type, null, 'missing', note);

export const DESIGN_BOARD_LAYOUT_MANIFEST: Record<DesignBoardUniverseId, DesignBoardLayoutManifestEntry> = {
  castle: {
    universeId: 'castle',
    sourceFile: 'design_boards/castle/developper assets.png',
    image: { width: 1024, height: 1536 },
    notes: 'Layout de reference. Statuts patch 928 issus de bad_outputs; toutes les zones necessitent revue debug avant promotion clean.',
    zones: {
      gameplayPreview: s('section', { x: 52, y: 154, width: 452, height: 418 }, 'needsManualCrop', 'Reference uniquement; ne pas utiliser comme decor gameplay.'),
      hud: s('section', { x: 588, y: 158, width: 350, height: 172 }, 'needsManualCrop', 'Coordonnees estimees; verifier bords haut/bas.'),
      props: s('section', { x: 58, y: 604, width: 420, height: 170 }, 'needsManualCrop', 'Props gothiques; verifier labels et separateurs.'),
      pickups: s('section', { x: 548, y: 604, width: 406, height: 156 }, 'needsManualCrop', 'Pickups; verifier bords section.'),
      obstacles: s('section', { x: 58, y: 804, width: 420, height: 170 }, 'containsLabel', 'Label OBSTACLES inclus dans crop; relever y pour passer sous le label.'),
      boss: s('section', { x: 548, y: 790, width: 406, height: 220 }, 'overlapsOtherSection', 'Fin section pickups visible en haut du crop; relever y.'),
      borders: s('section', { x: 58, y: 1038, width: 896, height: 160 }, 'containsLabel', 'Titre de section inclus; recadrer pour exclure le label.'),
      badges: s('section', { x: 58, y: 1230, width: 500, height: 116 }, 'containsLabel', 'Titre BORDURES visible au lieu des badges; corriger y.'),
      palette: s('item', { x: 610, y: 1290, width: 344, height: 104 }, 'needsManualCrop', 'Verifier >= 8 couleurs fiables avant de promouvoir clean.'),
      borderTop: gone('item', 'Bande top de cadre non definie; definir apres revue image debug.'),
      borderBottom: gone('item', 'Bande bottom de cadre non definie.'),
      borderLeft: gone('item', 'Bande left de cadre non definie.'),
      borderRight: gone('item', 'Bande right de cadre non definie.'),
    },
  },
  sonic: {
    universeId: 'sonic',
    sourceFile: 'design_boards/sonic/developper assets.png',
    image: { width: 1024, height: 1536 },
    notes: 'Titre plus compact; sections remontees. Memes defauts de pipeline presumes; verifier via debug.',
    zones: {
      gameplayPreview: s('section', { x: 48, y: 136, width: 456, height: 430 }, 'needsManualCrop', 'Reference; ne pas afficher brut.'),
      hud: s('section', { x: 590, y: 142, width: 354, height: 160 }, 'needsManualCrop', 'Coordonnees estimees.'),
      props: s('section', { x: 54, y: 588, width: 424, height: 168 }, 'needsManualCrop', 'Props Green Hill; verifier separateurs.'),
      pickups: s('section', { x: 548, y: 586, width: 408, height: 164 }, 'needsManualCrop', 'Anneaux/etoiles; verifier bords.'),
      obstacles: s('section', { x: 54, y: 792, width: 424, height: 174 }, 'containsLabel', 'Presume containsLabel par analogie castle; verifier debug.'),
      boss: s('section', { x: 548, y: 780, width: 408, height: 214 }, 'overlapsOtherSection', 'Presume overlap par analogie castle; verifier debug.'),
      borders: s('section', { x: 54, y: 1028, width: 902, height: 150 }, 'containsLabel', 'Presume containsLabel; verifier debug.'),
      badges: s('section', { x: 54, y: 1210, width: 520, height: 128 }, 'containsLabel', 'Presume containsLabel; verifier debug.'),
      palette: s('item', { x: 600, y: 1282, width: 356, height: 112 }, 'needsManualCrop', 'Verifier >= 8 couleurs fiables.'),
      borderTop: gone('item', 'Non definie; definir apres revue debug.'),
      borderBottom: gone('item', 'Non definie.'),
      borderLeft: gone('item', 'Non definie.'),
      borderRight: gone('item', 'Non definie.'),
    },
  },
  streets: {
    universeId: 'streets',
    sourceFile: 'design_boards/streets/developper assets.png',
    image: { width: 1024, height: 1536 },
    notes: 'Sections sombres; separations parfois moins contrastees.',
    zones: {
      gameplayPreview: s('section', { x: 54, y: 150, width: 450, height: 416 }, 'needsManualCrop', 'Reference urbaine.'),
      hud: s('section', { x: 584, y: 154, width: 360, height: 170 }, 'needsManualCrop', 'Coordonnees estimees.'),
      props: s('section', { x: 54, y: 598, width: 424, height: 170 }, 'needsManualCrop', 'Props urbains.'),
      pickups: s('section', { x: 548, y: 598, width: 406, height: 162 }, 'needsManualCrop', 'Pickups soda/bonus.'),
      obstacles: s('section', { x: 54, y: 802, width: 424, height: 174 }, 'containsLabel', 'Presume containsLabel.'),
      boss: s('section', { x: 548, y: 790, width: 406, height: 222 }, 'overlapsOtherSection', 'Presume overlap.'),
      borders: s('section', { x: 54, y: 1034, width: 900, height: 156 }, 'containsLabel', 'Presume containsLabel.'),
      badges: s('section', { x: 54, y: 1226, width: 520, height: 120 }, 'containsLabel', 'Presume containsLabel.'),
      palette: s('item', { x: 606, y: 1292, width: 348, height: 104 }, 'ambiguous', 'Palette sombre; produire PNG uniquement, JSON non fiable.'),
      borderTop: gone('item', 'Non definie.'),
      borderBottom: gone('item', 'Non definie.'),
      borderLeft: gone('item', 'Non definie.'),
      borderRight: gone('item', 'Non definie.'),
    },
  },
  fighter: {
    universeId: 'fighter',
    sourceFile: 'design_boards/fighter/developper assets.png',
    image: { width: 1024, height: 1536 },
    notes: 'Separateurs sombres; boss plus hauts que Castle.',
    zones: {
      gameplayPreview: s('section', { x: 52, y: 146, width: 452, height: 420 }, 'needsManualCrop', 'Preview dojo.'),
      hud: s('section', { x: 584, y: 148, width: 360, height: 176 }, 'needsManualCrop', 'Coordonnees estimees.'),
      props: s('section', { x: 56, y: 604, width: 420, height: 176 }, 'needsManualCrop', 'Props dojo; separateurs discrets.'),
      pickups: s('section', { x: 548, y: 604, width: 406, height: 166 }, 'needsManualCrop', 'Hadouken/fireball.'),
      obstacles: s('section', { x: 56, y: 816, width: 420, height: 180 }, 'containsLabel', 'Presume containsLabel.'),
      boss: s('section', { x: 548, y: 800, width: 406, height: 230 }, 'overlapsOtherSection', 'Presume overlap.'),
      borders: s('section', { x: 56, y: 1052, width: 898, height: 150 }, 'containsLabel', 'Presume containsLabel.'),
      badges: s('section', { x: 56, y: 1232, width: 520, height: 120 }, 'containsLabel', 'Presume containsLabel.'),
      palette: s('item', { x: 596, y: 1288, width: 358, height: 112 }, 'ambiguous', 'Palette saturee; PNG reference uniquement.'),
      borderTop: gone('item', 'Non definie.'),
      borderBottom: gone('item', 'Non definie.'),
      borderLeft: gone('item', 'Non definie.'),
      borderRight: gone('item', 'Non definie.'),
    },
  },
  outrun: {
    universeId: 'outrun',
    sourceFile: 'design_boards/outrun/developper assets.png',
    image: { width: 1024, height: 1536 },
    notes: 'Palette et badges plus etales en bas.',
    zones: {
      gameplayPreview: s('section', { x: 50, y: 140, width: 454, height: 424 }, 'needsManualCrop', 'Preview route.'),
      hud: s('section', { x: 586, y: 144, width: 358, height: 166 }, 'needsManualCrop', 'Coordonnees estimees.'),
      props: s('section', { x: 54, y: 592, width: 424, height: 166 }, 'needsManualCrop', 'Props route/sunset.'),
      pickups: s('section', { x: 546, y: 592, width: 410, height: 164 }, 'needsManualCrop', 'Checkpoint/turbo.'),
      obstacles: s('section', { x: 54, y: 794, width: 424, height: 172 }, 'containsLabel', 'Presume containsLabel.'),
      boss: s('section', { x: 546, y: 784, width: 410, height: 220 }, 'overlapsOtherSection', 'Presume overlap.'),
      borders: s('section', { x: 54, y: 1030, width: 902, height: 150 }, 'containsLabel', 'Presume containsLabel.'),
      badges: s('section', { x: 54, y: 1210, width: 534, height: 132 }, 'containsLabel', 'Presume containsLabel.'),
      palette: s('item', { x: 588, y: 1278, width: 368, height: 120 }, 'needsManualCrop', 'Verifier >= 8 couleurs fiables.'),
      borderTop: gone('item', 'Non definie.'),
      borderBottom: gone('item', 'Non definie.'),
      borderLeft: gone('item', 'Non definie.'),
      borderRight: gone('item', 'Non definie.'),
    },
  },
  shinobi: {
    universeId: 'shinobi',
    sourceFile: 'design_boards/shinobi/developper assets.png.png',
    image: { width: 1024, height: 1536 },
    notes: 'Nom de fichier historique avec double extension conserve.',
    zones: {
      gameplayPreview: s('section', { x: 52, y: 150, width: 452, height: 416 }, 'needsManualCrop', 'Preview enneigee.'),
      hud: s('section', { x: 586, y: 150, width: 358, height: 168 }, 'needsManualCrop', 'Coordonnees estimees.'),
      props: s('section', { x: 56, y: 598, width: 422, height: 170 }, 'needsManualCrop', 'Lanternes/props.'),
      pickups: s('section', { x: 548, y: 598, width: 406, height: 164 }, 'needsManualCrop', 'Shuriken/dague.'),
      obstacles: s('section', { x: 56, y: 802, width: 422, height: 174 }, 'containsLabel', 'Presume containsLabel.'),
      boss: s('section', { x: 548, y: 790, width: 406, height: 222 }, 'overlapsOtherSection', 'Presume overlap.'),
      borders: s('section', { x: 56, y: 1034, width: 898, height: 154 }, 'containsLabel', 'Presume containsLabel.'),
      badges: s('section', { x: 56, y: 1222, width: 520, height: 124 }, 'containsLabel', 'Presume containsLabel.'),
      palette: s('item', { x: 604, y: 1288, width: 350, height: 108 }, 'needsManualCrop', 'Verifier >= 8 couleurs fiables.'),
      borderTop: gone('item', 'Non definie.'),
      borderBottom: gone('item', 'Non definie.'),
      borderLeft: gone('item', 'Non definie.'),
      borderRight: gone('item', 'Non definie.'),
    },
  },
  kombat: {
    universeId: 'kombat',
    sourceFile: 'design_boards/kombat/developper assets.png',
    image: { width: 1024, height: 1536 },
    notes: 'Univers le plus sombre; separateurs rouges discrets.',
    zones: {
      gameplayPreview: s('section', { x: 52, y: 150, width: 452, height: 418 }, 'needsManualCrop', 'Preview arene sombre.'),
      hud: s('section', { x: 586, y: 152, width: 358, height: 174 }, 'needsManualCrop', 'Coordonnees estimees.'),
      props: s('section', { x: 56, y: 606, width: 422, height: 174 }, 'needsManualCrop', 'Props sombres; separateurs rouges peu visibles.'),
      pickups: s('section', { x: 548, y: 606, width: 406, height: 166 }, 'needsManualCrop', 'Dragon token/fire orb.'),
      obstacles: s('section', { x: 56, y: 814, width: 422, height: 182 }, 'containsLabel', 'Presume containsLabel.'),
      boss: s('section', { x: 548, y: 800, width: 406, height: 230 }, 'overlapsOtherSection', 'Presume overlap.'),
      borders: s('section', { x: 56, y: 1050, width: 898, height: 152 }, 'containsLabel', 'Presume containsLabel.'),
      badges: s('section', { x: 56, y: 1232, width: 520, height: 122 }, 'containsLabel', 'Presume containsLabel.'),
      palette: s('item', { x: 596, y: 1288, width: 358, height: 112 }, 'ambiguous', 'Palette tres sombre; PNG reference uniquement.'),
      borderTop: gone('item', 'Non definie.'),
      borderBottom: gone('item', 'Non definie.'),
      borderLeft: gone('item', 'Non definie.'),
      borderRight: gone('item', 'Non definie.'),
    },
  },
  paperboy: {
    universeId: 'paperboy',
    sourceFile: 'design_boards/paperboy/developper assets.png',
    image: { width: 1024, height: 1536 },
    notes: 'Badges et palette plus bas; assets suburbains occupent plus de hauteur.',
    zones: {
      gameplayPreview: s('section', { x: 50, y: 142, width: 454, height: 424 }, 'needsManualCrop', 'Preview quartier.'),
      hud: s('section', { x: 586, y: 146, width: 358, height: 170 }, 'needsManualCrop', 'Coordonnees estimees.'),
      props: s('section', { x: 54, y: 594, width: 424, height: 174 }, 'needsManualCrop', 'Props banlieue.'),
      pickups: s('section', { x: 546, y: 594, width: 410, height: 164 }, 'needsManualCrop', 'Journal/piece.'),
      obstacles: s('section', { x: 54, y: 806, width: 424, height: 184 }, 'containsLabel', 'Presume containsLabel.'),
      boss: s('section', { x: 546, y: 796, width: 410, height: 232 }, 'overlapsOtherSection', 'Presume overlap.'),
      borders: s('section', { x: 54, y: 1054, width: 902, height: 148 }, 'containsLabel', 'Presume containsLabel.'),
      badges: s('section', { x: 54, y: 1234, width: 540, height: 126 }, 'containsLabel', 'Presume containsLabel.'),
      palette: s('item', { x: 588, y: 1290, width: 368, height: 112 }, 'needsManualCrop', 'Verifier >= 8 couleurs fiables.'),
      borderTop: gone('item', 'Non definie.'),
      borderBottom: gone('item', 'Non definie.'),
      borderLeft: gone('item', 'Non definie.'),
      borderRight: gone('item', 'Non definie.'),
    },
  },
};

export const DESIGN_BOARD_ZONE_KEYS = [
  'gameplayPreview',
  'hud',
  'props',
  'pickups',
  'obstacles',
  'boss',
  'borders',
  'badges',
  'palette',
  'borderTop',
  'borderBottom',
  'borderLeft',
  'borderRight',
] as const;

export type DesignBoardZoneKey = typeof DESIGN_BOARD_ZONE_KEYS[number];

/** Only zones with this status are safe for gameplay use. */
export const CLEAN_STATUSES: DesignBoardZoneStatus[] = ['clean'];

/** Statuses that block a zone from gameplay use. */
export const BLOCKED_STATUSES: DesignBoardZoneStatus[] = [
  'containsLabel',
  'partial',
  'overlapsOtherSection',
  'tooWide',
  'tooTall',
  'invalid',
];
