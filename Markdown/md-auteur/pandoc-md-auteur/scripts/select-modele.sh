#!/bin/sh
set -e

MODELES_DIR=modeles
CONFIG_DIR=config

ARTICLE_CLASS=modele-article-$1
ARTICLE_CLASS_FILE=${CONFIG_DIR}/article-class

echo "Configuring $ARTICLE_CLASS"
mkdir -p ${CONFIG_DIR}
echo ${ARTICLE_CLASS} >${ARTICLE_CLASS_FILE}