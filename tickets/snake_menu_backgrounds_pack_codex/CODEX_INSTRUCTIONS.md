# Snake Mobile Retro — Menu Background Pack + Codex Instructions

Objectif : intégrer 8 backgrounds interchangeables dans un seul système de menu.
Le code ne doit jamais créer 8 menus séparés. Il doit créer 1 composant `LevelMenu` skinné par `themeId`.

## Assets inclus

`/backgrounds/01_castle_illusion.png`
`/backgrounds/02_sonic2.png`
`/backgrounds/03_streets_of_rage.png`
`/backgrounds/04_street_fighter.png`
`/backgrounds/05_outrun.png`
`/backgrounds/06_shinobi.png`
`/backgrounds/07_mortal_kombat.png`
`/backgrounds/08_paperboy.png`

## Principe d’intégration

Chaque image est un décor de menu avec la même logique :
- zone header en haut,
- grande zone d’illustration centrale,
- panel d’information en bas,
- deux emplacements de boutons.

Le texte, les boutons cliquables, les états, les animations et la logique doivent rester codés en HTML/CSS/React ou Phaser UI. Ne pas écrire les textes dans les images.

## Structure recommandée

```txt
src/
  assets/
    menu-backgrounds/
      01_castle_illusion.png
      02_sonic2.png
      03_streets_of_rage.png
      04_street_fighter.png
      05_outrun.png
      06_shinobi.png
      07_mortal_kombat.png
      08_paperboy.png
  ui/
    LevelMenu.jsx
    menuThemes.js
    levelMenu.css
```

## Zones UI fixes

Utiliser des coordonnées relatives pour que cela tienne sur mobile.

```txt
Screen: 100vw x 100vh
Background: cover, center
Main container max-width: 480px
Safe padding top: env(safe-area-inset-top) + 16px
Safe padding bottom: env(safe-area-inset-bottom) + 16px

Header title slot:
  top: 5vh
  left/right: 12%
  height: 9vh

Info panel slot:
  top: 63vh
  left/right: 10%
  min-height: 20vh

Buttons row:
  top: 86vh
  left/right: 10%
  height: 7vh
```

## Police

Recommandation simple :
- UI gameplay rétro : `Press Start 2P`
- fallback : `monospace`

Option plus riche :
- Castle/Kombat : `Cinzel`, `Cinzel Decorative`
- OutRun : `Monoton` ou `Audiowide`
- Paperboy : `Bangers`
- Streets : `Oxanium`
- Shinobi : `Noto Serif JP`

Attention : trop de polices = incohérence. Pour un premier build, utiliser seulement :
```css
font-family: 'Press Start 2P', monospace;
```

## Exemple `menuThemes.js`

```js
export const MENU_THEMES = {
  castle: {
    bg: '/assets/menu-backgrounds/01_castle_illusion.png',
    label: 'Castle of Illusion inspired',
    title: 'Jardin enchanté',
    objective: 'Murs clignotants = danger',
    objectiveCount: 10,
    description: 'Les murs apparaissent par pulsations : avance quand la voie est claire.',
    colors: {
      primary: '#F6C45C',
      secondary: '#8B4BFF',
      panel: 'rgba(25,10,42,.88)',
      text: '#F7F1FF',
      danger: '#FFB23E'
    },
    fx: 'magic'
  },
  sonic2: {
    bg: '/assets/menu-backgrounds/02_sonic2.png',
    label: 'Sonic 2 inspired',
    title: 'Green Loop Zone',
    objective: 'Rings instables',
    objectiveCount: 20,
    description: 'Récupère les rings sans heurter les ressorts.',
    colors: {
      primary: '#FFD21F', secondary: '#118CFF', panel: 'rgba(0,36,96,.88)', text: '#FFFFFF', danger: '#FF3B30'
    },
    fx: 'rings'
  },
  streets: {
    bg: '/assets/menu-backgrounds/03_streets_of_rage.png',
    label: 'Streets of Rage inspired',
    title: 'Ruelle néon',
    objective: 'Survie urbaine',
    objectiveCount: 15,
    description: 'Évite les obstacles de rue et collecte les jetons arcade.',
    colors: {
      primary: '#FF4FD8', secondary: '#16D9FF', panel: 'rgba(10,14,25,.88)', text: '#F5F7FF', danger: '#FF3A2F'
    },
    fx: 'rain'
  },
  fighter: {
    bg: '/assets/menu-backgrounds/04_street_fighter.png',
    label: 'Street Fighter inspired',
    title: 'Tournoi dojo',
    objective: 'Round spécial',
    objectiveCount: 12,
    description: 'Accumule l’énergie sans toucher les barrières d’arène.',
    colors: {
      primary: '#FFB13B', secondary: '#C8281D', panel: 'rgba(18,10,8,.9)', text: '#FFF1D6', danger: '#FF3B30'
    },
    fx: 'impact'
  },
  outrun: {
    bg: '/assets/menu-backgrounds/05_outrun.png',
    label: 'OutRun inspired',
    title: 'Sunset Highway',
    objective: 'Turbo route',
    objectiveCount: 18,
    description: 'Atteins les checkpoints avant la fin du chrono.',
    colors: {
      primary: '#FF4FC3', secondary: '#20E6FF', panel: 'rgba(8,13,32,.88)', text: '#FFF8E8', danger: '#FF7A1A'
    },
    fx: 'neon'
  },
  shinobi: {
    bg: '/assets/menu-backgrounds/06_shinobi.png',
    label: 'Shinobi inspired',
    title: 'Temple enneigé',
    objective: 'Focus ninja',
    objectiveCount: 10,
    description: 'Avance dans le silence et évite les blocs de glace.',
    colors: {
      primary: '#B5121B', secondary: '#C9D0D6', panel: 'rgba(8,10,14,.9)', text: '#F2F4F5', danger: '#D32222'
    },
    fx: 'snow'
  },
  kombat: {
    bg: '/assets/menu-backgrounds/07_mortal_kombat.png',
    label: 'Mortal Kombat inspired',
    title: 'Arène infernale',
    objective: 'Finish orb',
    objectiveCount: 10,
    description: 'Traverse l’arène sans toucher les flammes pulsantes.',
    colors: {
      primary: '#B51212', secondary: '#F05A24', panel: 'rgba(10,8,8,.92)', text: '#F7E7D2', danger: '#FF2C16'
    },
    fx: 'embers'
  },
  paperboy: {
    bg: '/assets/menu-backgrounds/08_paperboy.png',
    label: 'Paperboy inspired',
    title: 'Route du matin',
    objective: 'Livraison parfaite',
    objectiveCount: 25,
    description: 'Livre les journaux et évite chiens, haies et boîtes aux lettres.',
    colors: {
      primary: '#E83527', secondary: '#1976E8', panel: 'rgba(8,28,56,.88)', text: '#FFFFFF', danger: '#FFD02F'
    },
    fx: 'paper'
  }
};
```

## Exemple React

```jsx
import { MENU_THEMES } from './menuThemes';
import './levelMenu.css';

export function LevelMenu({ themeId = 'castle', onPlay, onMap }) {
  const theme = MENU_THEMES[themeId];

  return (
    <main
      className={`level-menu fx-${theme.fx}`}
      style={{
        '--bg': `url(${theme.bg})`,
        '--primary': theme.colors.primary,
        '--secondary': theme.colors.secondary,
        '--panel': theme.colors.panel,
        '--text': theme.colors.text,
        '--danger': theme.colors.danger,
      }}
    >
      <section className="menu-ui">
        <div className="menu-title">
          <span>{theme.title}</span>
        </div>

        <div className="menu-panel">
          <div className="objective">{theme.objective}</div>
          <div className="objective-count">Objectif : {theme.objectiveCount}</div>
          <p>{theme.description}</p>
        </div>

        <div className="menu-actions">
          <button className="btn btn-primary" onClick={onPlay}>Jouer</button>
          <button className="btn btn-secondary" onClick={onMap}>Carte</button>
        </div>
      </section>
    </main>
  );
}
```

## CSS recommandé

```css
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

.level-menu {
  width: 100vw;
  height: 100dvh;
  min-height: 100vh;
  background-image: var(--bg);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  image-rendering: pixelated;
  overflow: hidden;
  color: var(--text);
  font-family: 'Press Start 2P', monospace;
  position: relative;
}

.level-menu::after {
  content: '';
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    repeating-linear-gradient(
      to bottom,
      rgba(255,255,255,.035) 0px,
      rgba(255,255,255,.035) 1px,
      transparent 1px,
      transparent 4px
    );
  opacity: .28;
  mix-blend-mode: screen;
}

.menu-ui {
  position: relative;
  z-index: 1;
  width: min(100vw, 480px);
  height: 100%;
  margin: 0 auto;
  padding: calc(env(safe-area-inset-top) + 18px) 32px calc(env(safe-area-inset-bottom) + 18px);
  box-sizing: border-box;
}

.menu-title {
  position: absolute;
  top: 5.8%;
  left: 12%;
  right: 12%;
  height: 8.5%;
  display: grid;
  place-items: center;
  color: var(--primary);
  text-transform: uppercase;
  text-align: center;
  font-size: clamp(12px, 3.2vw, 18px);
  line-height: 1.35;
  text-shadow: 0 2px 0 #000, 0 0 10px var(--secondary);
}

.menu-panel {
  position: absolute;
  top: 63%;
  left: 10%;
  right: 10%;
  min-height: 19%;
  padding: 22px 18px;
  box-sizing: border-box;
  background: var(--panel);
  border: 2px solid color-mix(in srgb, var(--primary) 60%, #000);
  box-shadow:
    inset 0 0 18px rgba(255,255,255,.05),
    0 0 18px rgba(0,0,0,.55);
  display: flex;
  flex-direction: column;
  justify-content: center;
  text-align: center;
}

.objective {
  color: var(--primary);
  font-size: clamp(10px, 2.8vw, 14px);
  line-height: 1.45;
  text-transform: uppercase;
  margin-bottom: 14px;
}

.objective-count {
  color: var(--secondary);
  font-size: clamp(9px, 2.4vw, 12px);
  margin-bottom: 16px;
}

.menu-panel p {
  margin: 0;
  font-family: system-ui, sans-serif;
  font-size: clamp(14px, 3.4vw, 17px);
  line-height: 1.45;
  font-weight: 800;
  color: var(--text);
}

.menu-actions {
  position: absolute;
  top: 86.5%;
  left: 10%;
  right: 10%;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18px;
}

.btn {
  height: 64px;
  border: 2px solid var(--primary);
  border-radius: 10px;
  font-family: 'Press Start 2P', monospace;
  font-size: clamp(10px, 2.6vw, 13px);
  text-transform: uppercase;
  color: var(--text);
  background: rgba(0,0,0,.72);
  box-shadow: 0 4px 0 #000, 0 0 12px rgba(255,255,255,.08);
  cursor: pointer;
}

.btn-primary {
  color: #111;
  background: linear-gradient(180deg, var(--primary), color-mix(in srgb, var(--primary) 55%, #000));
}

.btn-secondary {
  border-color: var(--secondary);
  color: var(--text);
}

.btn:active {
  transform: translateY(3px);
  box-shadow: 0 1px 0 #000;
}

@media (max-height: 720px) {
  .menu-panel { top: 61%; min-height: 20%; }
  .menu-actions { top: 85%; }
  .btn { height: 56px; }
}
```

## FX simples par univers

À coder en pseudo-elements ou petits overlays CSS.

- `fx-magic`: particules dorées lentes.
- `fx-rings`: léger shimmer bleu/jaune.
- `fx-rain`: rain overlay vertical très léger.
- `fx-impact`: flash subtil au clic sur Jouer.
- `fx-neon`: pulse magenta/cyan.
- `fx-snow`: neige légère.
- `fx-embers`: braises orange qui montent.
- `fx-paper`: petits journaux/papiers subtils, pas trop nombreux.

## Contraintes importantes

1. Ne pas coder 8 composants.
2. Ne pas écrire de texte dans les images.
3. Ne pas changer les positions par thème, sauf bug mobile extrême.
4. Ne pas utiliser de logos ou personnages officiels en runtime.
5. Pour la production finale, prévoir une seconde passe d’assets plus propres : certains backgrounds actuels contiennent encore des éléments narratifs ou des textes baked.

## Points faibles actuels à connaître

Ces backgrounds sont bons pour prototype visuel, mais pas encore parfaits pour production :
- Sonic contient encore une tête/personnage trop proche de la référence.
- Paperboy contient trop de narration centrale.
- OutRun contient une voiture trop identifiable et du texte baked.
- Street Fighter contient du texte baked et des personnages sur panneaux.
- Kombat contient des symboles dragon trop proches de la référence et trop de détails.

Pour un vrai build commercial, demander une passe “clean production” :
- aucun personnage identifiable,
- aucun logo,
- aucun texte baked,
- décor plus calme au centre,
- mêmes coordonnées strictes.
