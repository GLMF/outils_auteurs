---
title: "Titre de l'article"
author:
- name: "Prénom Nom"
  job: "Fonction ou métier et/ou contribution à des projets libres"
  email: "nom@domaine.cn"
description:
  Ceci est le chapeau de l'article. Il s'agit d'une courte introduction au sujet
  ou à la problématique. Essayez d'être explicite et de donner envie au lecteur
  de poursuivre la lecture de l'article.
abstract:
  Le résumé de l'article (hors série)
outil: nom et version du composant (tuto)
site: http://site.exemple (tuto)
keywords: [Underscore.js, Javascript, Programmation fonctionnelle, Web, Python, Filtre]
lang: fr-FR
---

Indiquez si votre code a été testé sur Debian, Raspberry Pi, etc ou si vous nous
avez fourni le code et qu'il est présent sur le Github de GNU Linux Magazine

::: Logos
Debian
Raspberry Pi
Github
:::

Un article commence **TOUJOURS** par une introduction qui n'est pas numérotée
(regardez dans le magazine, il y a une lettrine sur la première lettre de cette
section). L'objectif étant le plus souvent possible (si le thème s'y prête) de
partir d'un cas concret puis de détailler sa résolution (le cas concret pouvant
être un prétexte à la présentation d'une notion théorique également), présentez
l'objectif dans l'introduction.

Pour avoir une évaluation du nombre de pages qu'occupera votre article dans le
magazine utilisez la macro `Stats_DiamondEditions()` fournie (ajoutez environ 1
page toutes les 4 figures). Attention, il ne s'agit que d'une estimation. La
majeure partie des articles font entre 6 et 10 pages mais il n'y a pas vraiment
de limite basse ou haute (bien sûr il sera difficile de publier un article d'un
quart de page ou de 50 pages... ;-)).

Pour les termes techniques, très spécifiques au domaine (n'oubliez pas que les
devs lisent des articles sysadmin et réciproquement), je vous recommande
l'utilisation d'encadrés contenant la définition ou le rappel technique.
Introduction sans titre.

# Titre de niveau 1

Paragraphe en style « Normal » (et non « Standard » ou « Corps de texte »). 

```code
# Ceci est du code
# Une entrée typique de menu.lst
# Le style employé est « code »
title= DEBIAN GNU/Linux 2.6.24 (hdc3 - ext3)
kernel= (hd1,2)/boot/vmlinuz-2.6.24-1-686 root=/dev/hdc3 vga=extended
initusrd (hd1,2)/boot/initrd.img-2.6.24-1-686
```

Paragraphe en « Normal ». On fait ici mention d'un élément de la configuration :
l'étiquette `title` (style de caractère « code_par » pour du code dans du texte)
permet d'ajouter un titre dans les menus de GRUB. La commande `grub-install`
permet l'installation du _bootloader_ (Attention ! Cet italique est généré par
le style de caractère « italic » et non par l'icône italique de LibreOffice,
idem pour le gras). Nous pouvons spécifier le mode graphique à utiliser avec
l'option `vga `:

```code
01: # Une entrée typique de menu.lst
02: title= DEBIAN GNU/Linux 2.6.24 (hdc3 - ext3)
03: kernel= (hd1,2)/boot/vmlinuz-2.6.24-1-686 root=/dev/hdc3 __vga=extended__
04: initrd (hd1,2)/boot/initrd.img-2.6.24-1-686
```

Si vous souhaitez faire référence à des lignes de code pour les expliquer, vous
pouvez les numéroter comme dans le code ci-dessus. Essayez de commenter votre
code et vos commandes shell de manière à ne pas avoir d'immenses blocs de code
ou de sorties shell qui rendent l'article illisible.

::: PAO
Le texte ici est destiné à indiquer des informations supplémentaires à la
rédaction. Il n'apparaîtra pas dans l'article final.
:::

Le texte ici est destiné à indiquer des informations supplémentaires à la
rédaction. Il n'apparaîtra pas dans l'article final.our une note apparaissant
dans l'article final il faut seulement supprimer le terme PAO :

::: Note
Le texte présent ici, rédigé en style « Normal », apparaîtra dans l'article
final dans une boîte spéciale « note ».
:::

Les indications en style « pragma », comme ci-dessus, doivent toujours être
encadrées de 3 slashs /// … ///. Si vous souhaitez une note ayant pour titre :
Avertissement ou Attention (avec la petite icône associée), il faut utiliser :

::: Attention
Le texte présent ici, rédigé en style « Normal », apparaîtra dans l'article
final dans une boîte spéciale « Attention ».
:::

::: Avertissement
Le texte présent ici, rédigé en style « Normal », apparaîtra dans l'article
final dans une boîte spéciale « Avertissement ».
:::

Les sessions de commandes interactives sont à utiliser avec le style de
paragraphe « console ». On peut également mettre en évidence certaines parties,
grâce au style de caractère « code_em » :

```console
$ cat dma
2: floppy
3: __parport0__ # mise en évidence avec __code_em__
4: cascade
```

Le prompt en utilisateur standard est `$` et en root il s'agit de `#`.

::: Encadré
Titre encadré

Vous pouvez créer des encadrés de quelques lignes pour expliquer, définir des
éléments de manière un peu plus pointue et/ou pour les mettre en exergue.
:::

Plus d'informations sur GRUB sur le site officiel :
<http://www.gnu.org/software/grub/> (notez l'utilisation du style de caractère
« url » et la désactivation de l'hyperlien).

Vous pouvez également insérer des listes à puces ou numérotées dans votre
article, comme ceci :

- item 1
- item 2
- item 3
- etc.

Notez que nous n'utilisons pas les puces/numérotations automatiques de
LibreOffice ici !!

De même, les tableaux doivent être présentés le plus simplement possible, le contenu doit être en style « Normal », par exemple :

blabla | blabla | blabla
-------|--------|-------
blabla | blabla | blabla

Les références, à mettre en style « gras », doivent être intégrées dans le
discours du texte et leur étiquette sera un nombre (attention à bien respecter
un ordre croissant 1, 2, 3, etc.). Exemple : Comme on peut le voir sur le site
de Linux Magazine [^ref1] et dans l'article de T. Colombo [^ref2], blablablabla
blablabla. C'est seulement lorsqu'une citation apparaît dans le texte quelle
peut être développée dans la section « Références » en fin d'article. Dans cette
section il faudra donner des références bibliographiques ou des urls mais il
faudra indiquer aussi à quoi elles correspondent (voir le format à respecter en
fin d'article dans la section « Références »).

[^ref1]:  Site officiel de _GNU/Linux Magazine_ : <http://www.gnulinuxmagazine.com>
[^ref2]:  COLOMBO T., _« Titre de l'article »_, _GNU/Linux Magazine_ n°171, Mai 2014, p. x à y.
[^ref_autre]: NOM P. et AUTRENOM P., _« Titre livre »_, éditeur, année.

N'intégrez pas vos images dans le fichier LibreOffice, mais faites-en mention
avec le style « pragma ». Les fichiers images seront placés dans le même
répertoire que l'article et leur nom sera composé à partir du nom de l'article
et de leur position dans celui-ci. Il devra en outre toujours être précédé d'un
underscore. Vous devez également toujours faire référence à une figure dans le
texte : comme on peut le voir en figure [@fig], ... ou encore (voir
figure [@fig])).

![fig](modele.png "Exemple d'écran de démarrage GRUB. Une légende peut être une
simple phrase ou même la mention du numéro de figure. Cependant, pour certains
articles, il peut s'agir de plusieurs paragraphes, d'où la nécessité d'utiliser
le style « pragma ». Le style utilisé pour une légende.... est « legende ».")

Lorsqu'on décrit une interface graphique ou texte (pas les lignes de commandes,
les interfaces en mode texte comme Midnight Commander par exemple), il est
possible de faire référence aux menus et options avec le style de caractères
« menu ». Exemple : Cochez l'option [Auto-connexion]{.menu} dans la fenêtre des
options qui apparaît via le menu [Fichier > Préférences]{.menu}. 

Lorsque vous indiquez des noms de touches appliquez le style gras et encadrez la
touche par des < et > : [Ctrl + C]{.k} par exemple.

Bla blabla bla blabla, bla bla bla blabla. Bla blabla bla blabla, bla bla bla
blabla. Bla blabla bla blabla, bla bla bla blabla. Bla blabla bla blabla, bla
bla bla blabla. Bla blabla bla blabla, bla bla bla blabla. Bla blabla bla
blabla, bla bla bla blabla. Bla blabla bla blabla, bla bla bla blabla. Bla
blabla bla blabla, bla bla bla blabla.

## Titre de niveau 2

Attention à l'enchaînement des sections et sous-sections ! Il ne peut pas y
avoir de section 1.1 s'il n'y a pas de 1.2, ni de 3.2.1 sans 3.2.2 !

Bla blabla bla blabla, bla bla bla blabla. Bla blabla bla blabla, bla bla bla
blabla. Bla blabla bla blabla, bla bla bla blabla. Bla blabla bla blabla, bla
bla bla blabla. Bla blabla bla blabla, bla bla bla blabla. Bla blabla bla
blabla, bla bla bla blabla. Bla blabla bla blabla, bla bla bla blabla. Bla
blabla bla blabla, bla bla bla blabla.

Bla blabla bla blabla, bla bla bla blabla. Bla blabla bla blabla, bla bla bla
blabla. Bla blabla bla blabla, bla bla bla blabla. Bla blabla bla blabla, bla
bla bla blabla.

### Titre de niveau 3

Bla blabla bla blabla, bla bla bla blabla. Bla blabla bla blabla, bla bla bla
blabla. Bla blabla bla blabla, bla bla bla blabla. Bla blabla bla blabla, bla
bla bla blabla. Bla blabla bla blabla, bla bla bla blabla. Bla blabla bla
blabla, bla bla bla blabla. Bla blabla bla blabla, bla bla bla blabla. Bla
blabla bla blabla, bla bla bla blabla.

Bla blabla bla blabla, bla bla bla blabla. Bla blabla bla blabla, bla bla bla
blabla. Bla blabla bla blabla, bla bla bla blabla. Bla blabla bla blabla, bla
bla bla blabla.

#### Titre de niveau 4

Bla blabla bla blabla, bla bla bla blabla. Bla blabla bla blabla, bla bla bla
blabla. Bla blabla bla blabla, bla bla bla blabla. Bla blabla bla blabla, bla
bla bla blabla. Bla blabla bla blabla, bla bla bla blabla. Bla blabla bla
blabla, bla bla bla blabla. Bla blabla bla blabla, bla bla bla blabla. Bla
blabla bla blabla, bla bla bla blabla.

Bla blabla bla blabla, bla bla bla blabla. Bla blabla bla blabla, bla bla bla
blabla. Bla blabla bla blabla, bla bla bla blabla. Bla blabla bla blabla, bla
bla bla blabla.

# Conclusion

La conclusion ne comporte pas de numérotation. Il s'agit de la dernière section
de l'article. N'oubliez pas que pour vous faciliter la tâche, un fichier de
raccourcis clavier ainsi que des directives de configuration de LibreOffice sont
à votre disposition sur https://github.com/GLMF/outils_auteurs.

<!-- 
# Références
Les références sont ajoutées automatiquement
-->

# Pour aller plus loin

Dans cette partie (**optionnelle**) vous pouvez donner une liste de liens,
références bibliographiques sans les avoir cités dans le texte. Attention, il
faut tout de même un petit texte indiquant à quoi se rapporte le lien :

Conférence de R. Stallman du 28 septembre 2012 :
<https://www.youtube.com/watch?v=2onsOFWme-Q>

Le livre de R. Stallman, S. Williams et C. Masutti, « Richard Stallman et la
révolution du logiciel libre », Eyrolles, 2010.note