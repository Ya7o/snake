# AUDIT 956 — Licences / propriété assets

## Constats
- Assets runtime alpha OK : 24/24
- Images totales dans projet : 469
- Hits licence/source/crédit : 3065
- Dossiers legacy résiduels : 3

## Risques
- P1 : anciens assets externes conservés inutilement.
- P1 : confusion entre assets runtime et brouillons.
- P2 : absence de note de provenance pour les assets générés.

## Corrections recommandées
- Confirmer que seuls les 24 assets runtime sont utilisés en gameplay.
- Archiver ou supprimer dossiers _audit/_sources/_licenses s'ils ne sont pas requis en runtime.
- Conserver un README de provenance des 24 assets générés.
- Vérifier qu'aucun ancien asset externe n'est embarqué par erreur.
