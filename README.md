# Generation procedurale de terrain V2
TP de WebGL

## Todo

- Ajouter la possibilité de définir la taille de la sphère
- Ajouter différentes couches simplex pour définir les hauteurs de terrain
- Ajouter des optimisations mémoire
  - ne pas créer les vertices derrière la planète (pas de subdivision)
- Ajouter les textures
  - selon la hauteur
  - à l'aide de simplex

## Fonctionnalité principale

- rendu d'une planète (terrain en forme de boule) icosaèdre
- rendu avec de simples couleurs selon la hauteur du terrain (eau, herbe, neige)
- optimisation basique : subdivision (voisin déjà créé le vertice ?), ne pas subdiviser les triangles hors de la vue

## Fonctionnalité secondaire

- rendu d'un planète avec les textures
- utilisation d'un LOD évolué
