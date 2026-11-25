# CLAUDE.md

Instructions pour les agents IA (Claude Code) travaillant sur Lootopia.
Source : cahier des charges M2 (§ 9.5 « Production de code assistée par IA », § 10 risque R10, § 11 « Normes de développement »).

## Projet

Prototype de Lootopia, plateforme de chasses au trésor géolocalisées (PWA + API), en monorepo npm workspaces :

- `apps/api` : API NestJS (TypeScript)
- `apps/web` : front React + Vite (TypeScript)

Node.js >= 24.15 (voir `.nvmrc`).

## Rôle et charge de l'IA

La production du code suit trois temps ; l'agent IA n'intervient qu'à l'étape 2 :

1. **Cadrage et conception** (équipe) : architecture, arbitrages techniques, cas d'usage, maquettes, découpage en tickets.
2. **Génération** (agents IA) : traitement des tickets dans le respect des normes ci-dessous, des seuils SonarQube et des contrôles du pipeline.
3. **Revue et intégration** (équipe) : revue de code systématique, validation fonctionnelle, puis fusion.

En pratique, l'agent :

- traite **le ticket qui lui est confié, et seulement lui** ; il ne prend pas de décision d'architecture ou de périmètre à la place de l'équipe : en cas de doute, il pose la question ;
- produit un code **que le relecteur peut expliquer** (risque R10) : simple, lisible, sans dépendance ou abstraction superflue ; il décrit dans la PR ce qu'il a fait et pourquoi ;
- livre **les tests avec le code** (unitaires et, si pertinent, bout en bout) ;
- nomme ses branches selon la convention décrite dans [Branches](#branches) ;
- vérifie en local avant de livrer : `npm run lint`, `npm run typecheck`, `npm run test` (et `npm run test:e2e` si le front est touché) ;
- **ne fusionne jamais** une PR et ne contourne pas les contrôles (pas de `--no-verify`, pas de désactivation de règle ESLint ou Sonar sans accord tracé de l'équipe) ;
- n'introduit aucun secret dans le code ou l'historique.

Une PR jugée non maîtrisée est rejetée et le ticket repris manuellement.

En dehors du code, l'IA sert aussi à **relire et mettre en forme les documents de rendu** (orthographe, clarté, cohérence, mise en page). Elle ne change pas le fond sans le signaler, et chaque document passe par une **dernière relecture humaine** avant d'être rendu.

## Normes de développement

### Commits et titres de PR

Messages de commit **et titres de Pull Request** au format Conventional Commits :

```
<type>(contexte optionnel): <description courte à l'impératif>
```

| Type       | Usage                                                                      |
| ---------- | -------------------------------------------------------------------------- |
| `feat`     | Ajout ou évolution d'une fonctionnalité                                    |
| `fix`      | Correction d'un bug                                                        |
| `docs`     | Ajout ou mise à jour de la documentation                                   |
| `style`    | Mise en forme du code, sans changement de comportement                     |
| `refactor` | Modification du code qui n'est ni un correctif ni un ajout de fonctionnalité |
| `perf`     | Amélioration des performances                                              |
| `test`     | Ajout ou correction de tests                                               |
| `build`    | Modification du processus de build                                         |
| `ci`       | Modification de la configuration d'intégration continue                    |
| `chore`    | Autres tâches de maintenance                                               |

Règles : type en minuscules, contexte en minuscules entre parenthèses (ex. `api`, `web`, `e2e`), `!` optionnel avant `:` pour un changement cassant, un espace après `:`, pas de point final.
Exemple : `feat(api): ajoute l'inscription par e-mail`.

Le titre de PR est vérifié en CI par `.github/workflows/pr-title.yml` (le check bloque tant que le titre n'est pas conforme ; il se relance à la modification du titre).

### Qualité du code

- Code, variables et noms de fonctions **en anglais**.
- Seuils SonarQube : aucun code smell, toutes les notes à A, duplication strictement inférieure à 3 %.
- ESLint strict, zéro warning (`npm run lint`).

### Tests

- Un plan de tests est défini avant le développement de chaque fonctionnalité.
- Tests automatisés : unitaires (Jest, `npm run test`) et bout en bout (Playwright, `npm run test:e2e`).

### Versionnement

La CI attribue automatiquement un numéro de version à chaque Pull Request.

## Branches

Branche d'intégration : `develop` (les PR ciblent `develop` ; `main` pour les livraisons).

Dans la mesure du possible, les noms de branches reprennent les types Conventional Commits (voir [Commits et titres de PR](#commits-et-titres-de-pr)) :

```
<type>/<description-courte>
```

Règles : type de la liste ci-dessus (`feat`, `fix`, `docs`…), puis une description en minuscules, mots séparés par des tirets, sans accents ni espaces.
Exemples : `feat/inscription-email`, `fix/api-geolocalisation`, `docs/conventions-branches`.

Seules exceptions : `main` et `develop`, et les branches nommées par un outil quand on ne peut pas choisir le nom.
