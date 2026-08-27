# Geometry for Architects — version web

Version web statique des documents de cours du cours **« Geometry for Architects »** de **Bernard Cache** (EPFL, laboratoire CNPA).

Le cours réunit 11 thèmes (00–10) et ~27 documents. Chaque document est converti à partir de l'export HTML original de Google Docs, en conservant la couleur et le gras avec lesquels Bernard annote ses figures — ce n'est pas de la décoration, cela fait partie de la notation. Le site est trilingue : français (langue d'origine des documents), anglais et espagnol.

## Structure

```
index.html, a-propos.html      Page d'accueil et « à propos » (FR)
en/, es/                       Mêmes pages en anglais et en espagnol
00-introduction/ … 10-projections/
                                Un thème par dossier ; si le thème compte
                                plusieurs documents, un sous-dossier par lettre
                                (a/, b/, c/…), chacun avec son index.html + images/
assets/css/base.css            Feuille de style unique pour tout le site
assets/js/                     theme.js (clair/sombre), lang-switch.js,
                                doc-toc.js (sommaire de chaque document)
```

Pas de build ni de framework : du HTML/CSS/JS statique classique, pensé pour être publié tel quel avec GitHub Pages, sans aucune étape de compilation.

## Crédits

Contenu du cours : **Bernard Cache**, EPFL — laboratoire [CNPA](https://cnpa.epfl.ch) (*Laboratoire des Cultures Numériques du Projet Architectural*).

## Licence

*(Proposition à confirmer avec Bernard Cache et le laboratoire avant publication.)*

Deux licences distinctes cohabitent dans ce dépôt, selon la nature du contenu :

- **Le code** (gabarits HTML/CSS/JS dans `assets/`, script de conversion `scripts/convert-doc.py`) est sous licence **[MIT](LICENSE)**.
- **Le contenu du cours** (textes, figures et mises en couleur de Bernard Cache) est sous licence **[Creative Commons BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/deed.fr)** : réutilisation autorisée avec attribution, à des fins non commerciales, et à condition de partager toute œuvre dérivée sous la même licence.

  Attribution suggérée : *« Bernard Cache — Geometry for Architects, EPFL/CNPA »*, avec lien vers ce dépôt.

**Exception** : certaines images reproduites à des fins illustratives (œuvres d'art, photographies de musée citées par Bernard dans ses documents — par ex. le Doryphore de Polyclète ou la Léda de Léonard de Vinci dans `04-symetrie/c`) conservent le copyright de leur titulaire d'origine et ne sont pas couvertes par la licence CC BY-NC-SA ci-dessus.

*(Note technique : GitHub ne détecte automatiquement qu'une seule licence par dépôt — il affichera « MIT » dans la barre latérale à partir du fichier `LICENSE`, même si cette section du README fait foi pour le contenu du cours.)*
