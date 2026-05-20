# Snake Drive V4 — Perfect PC Package

Package all-in-one pour développer Snake Drive V4 from scratch avec Claude Code / Codex.

## Objectif

Obtenir une première V4 stable dès l’envoi du package sur PC :

- web mobile ;
- Snake jouable ;
- world map ;
- 8 univers ;
- 16 niveaux ;
- 8 boss ;
- mécanique différente par univers ;
- boss différenciés ;
- design pack utilisé ;
- fallback si assets incertains ;
- audit post-build prévu.

## Prérequis PC

Installer :

- Node.js LTS
- Git
- VS Code
- Chrome
- Claude Code ou Codex CLI

Vérifier :

```bash
node -v
npm -v
git --version
```

## Démarrage

```bash
npm install
npm run check
npm run dev
```

## Test téléphone

PC et téléphone sur le même Wi-Fi.  
Ouvrir l’URL Vite locale affichée, par exemple :

```text
http://192.168.x.x:5173/
```

## Instruction principale Claude Code / Codex

```text
Lis START_HERE_FOR_CLAUDE.md puis CLAUDE.md.
Objectif : produire une première build V4 stable from scratch.
Exécute tickets/000_MASTER_BUILD_V4_STABLE.md.
Respecte docs/13_ACCEPTANCE_MATRIX.md et docs/14_UNIVERSE_IMPLEMENTATION_SPEC.md.
Utilise le design pack dans design_boards/_incoming/.
Lance npm run check à la fin.
```

## Après première build

```text
Exécute tickets/900_AUDIT_CONFORMITE_PROJET.md.
```

Puis si nécessaire :

```text
Exécute tickets/901_PLAN_CORRECTIONS_POST_AUDIT.md.
```

## Dossiers clés

- `docs/13_ACCEPTANCE_MATRIX.md` : critères de validation.
- `docs/14_UNIVERSE_IMPLEMENTATION_SPEC.md` : mécaniques détaillées.
- `design_boards/_incoming/` : 8 planches design.
- `design_boards/BOARD_MAPPING.md` : mapping à compléter.
- `tickets/000_MASTER_BUILD_V4_STABLE.md` : ticket principal.
