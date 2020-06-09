<p align="center"><img width=12.5% src="https://raw.githubusercontent.com/GLMF/outils_auteurs/master/Markdown/logo_glmf.png"></p>
 
[![GLMF](https://img.shields.io/badge/GNU%2FLinux%20Magazine-tools-red)](https://github.com/GLMF/outils_auteurs) [![License](https://img.shields.io/badge/license-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0.fr.html)
&nbsp;
=======
 
**Markdown md-auteur** est un projet permettant aux auteurs de GNU/Linux Magazine de rédiger leurs articles en Markdown et de les exporter en odt dans le format attendu pour une soumission.
L'objet de ce dépôt est de simplifier l'accès à l'excellent travail réalisé par Alain Basty sur [Pandoc md-auteur](https://bitbucket.org/zardoz/pandoc-md-auteur).
La version de Pandoc md-auteur utilisée dans ce dépôt est figée et les mises à jour seront effectuées manuellement par sécurité.
 
## Table des matières
- [Installation](#installation)
- [Utilisation](#utilisation)
    - [Créer un article](#créer-un-article)
    - [Éditer un article](#éditer-un-article)
    - [Générer une version de vérification](#générer-une-version-de-vérification)
    - [Générer l'archive à soumettre](#générer-l'archive-à-soumettre)
- [License](#license)
 
## Installation
L'installation est très simple :
1. Assurez-vous d'avoir bien installé Docker
2. Clonez le dépôt par :
`$ git clone https://github.com/GLMF/outils_auteurs`
3. Rendez-vous dans le répertoire du sous-projet :
`$ cd outils-auteurs/Markdown`
4. Lancez le programme d'installation :
`$ install_glmf`
 
## Utilisation
Pour utiliser cet outil, vous pourrez travailler dans une image et récupérer vos fichiers dans le répertoire `md-auteur/data`.
Plusieurs actions sont possibles après avoir lancé l'image par :

`$ md-auteur`

### Créer un article
Pour créer un article `7653_Mon_Super_Article` :

`$ glmf new 7653_Mon_Super_Article`

Le répertoire `7653_Mon_Super_Article` est créé et il contient tous les fichiers nécessaires pour la rédaction de l'article. Vous y trouverez notamment le fichier `7653_Mon_Super_Article.md` qui contient des
exemples.

L'éditeur défini par la variable d'environnement `EDITOR` (par défaut Visual Studio Code) est lancé immédiatement sur  `7653_Mon_Super_Article.md`.

### Éditer un article
Pour éditer l'article `7653_Mon_Super_Article` :

`$ cd 7653_Mon_Super_Article`

`$ code 7653_Mon_Super_Article.md`

Vous pouvez bien entendu utiliser un autre éditeur. Par défaut les éditeurs suivants sont installés : Vim, Gedit et Typora (et bien sûr Visual Studio Code).

### Générer une version de vérification
Pour générer une version de l'article `7653_Mon_Super_Article` au format odt en y intégrant les images :

`$ cd 7653_Mon_Super_Article`

`$ glmf verify`

### Générer l'archive à soumettre
Pour générer l'archive à transmettre à la rédaction pour l'article `7653_Mon_Super_Article`:

`$ cd 7653_Mon_Super_Article`

`$ glmf make`

Vous devrez ensuite envoyer par mail le fichier `7653_Mon_Super_Article.tgz`. À partir de ce moment c'est le fichier odt qui se trouve dans le répertoire `build` qui devient la référence. Le travail s'effectue sur le fichier odt qui vous sera renvoyé par la rédaction.
 
## Licence
Ce projet est distribué sous licence open source GPLv3.