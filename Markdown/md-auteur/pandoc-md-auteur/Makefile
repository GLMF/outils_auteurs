# Tools (use legacy pandoc)
PANDOC := /usr/bin/pandoc

# Colors

_RED := \x1b[31m
_GREEN := \x1b[32m
_END := \x1b[0m

# Dirs
SOURCES_DIR := $(CURDIR)
SCRIPTS_DIR := $(CURDIR)/scripts
MODELES_DIR := $(CURDIR)/modeles

BUILD_DIR := $(CURDIR)/build
CONFIG_DIR := $(CURDIR)/config
CACHE_DIR := $(CURDIR)/cache

# Input files
SOURCES := $(foreach dir, $(SOURCES_DIR), $(wildcard $(dir)/*.md))

ifneq ("$(wildcard $(CONFIG_DIR)/article-class)", "")
	ARTICLE_CLASS := $(shell cat $(CONFIG_DIR)/article-class || exit 1)
	PANDOC_TEMPLATE_FILE := $(MODELES_DIR)/$(ARTICLE_CLASS).template
	EXEMPLE_ARTICLE_ODT := $(MODELES_DIR)/$(ARTICLE_CLASS).odt
else
	ARTICLE_CLASS := ""
endif

# ODT Build dir
EXEMPLE_ARTICLE_ODT_BUILD_DIR := $(addprefix $(BUILD_DIR)/, $(notdir $(EXEMPLE_ARTICLE_ODT)))

# Filter/Writer files
FILTERS := $(foreach dir, $(SCRIPTS_DIR), $(wildcard $(dir)/*.lua))
WRITER := $(SCRIPTS_DIR)/writer-article-gnulinuxmagazine.lua

# Ouput files
ODT_CONTENT_XML := $(EXEMPLE_ARTICLE_ODT_BUILD_DIR)/content.xml
ODT_GLMF := $(addprefix $(BUILD_DIR)/, $(notdir $(SOURCES:.md=.odt)))
ZIP_PUBLISH := $(addprefix $(BUILD_DIR)/, $(notdir $(SOURCES:.md=.zip)))

# ENV info
IMAGES ?= OFF
dir ?= ""

# Targets

article: $(ODT_GLMF)

publish: clean article $(ZIP_PUBLISH)

# Rules
$(BUILD_DIR)/%.odt : %.md $(FILTERS) $(PANDOC_TEMPLATE_FILE)
ifeq ($(ARTICLE_CLASS), "")
	@echo -e '$(_RED)Pas de configuration : Faire un "make select <TAB>" pour choisir.$(_END)'
	@exit 1
else
	@echo Preparing files and directories
	@mkdir -p $(BUILD_DIR)
	@mkdir -p $(CACHE_DIR)
	@rm -rf $(EXEMPLE_ARTICLE_ODT_BUILD_DIR) 2>/dev/null
	@unzip $(EXEMPLE_ARTICLE_ODT) -d $(EXEMPLE_ARTICLE_ODT_BUILD_DIR) >/dev/null
	@echo Building $(ODT_CONTENT_XML)
	@$(PANDOC) $< -M prefix='$(notdir $(basename $<))' -M images=$(IMAGES) -M class=$(ARTICLE_CLASS)  --template=$(PANDOC_TEMPLATE_FILE) -t $(WRITER) -o $(ODT_CONTENT_XML)
	@echo -e 'Zipping to $(_GREEN)$@$(_END)'
	@rm -f "$@"
	@cd $(EXEMPLE_ARTICLE_ODT_BUILD_DIR) && zip -r "$@" * >/dev/null
	@chmod 444 "$@"
endif

$(BUILD_DIR)/%.zip :$(BUILD_DIR)/%.odt
	@echo Creating archive $@
	@rm "$@" 2>/dev/null || true
	@zip "$@" build/$(notdir $(basename $<)).odt build/$(notdir $(basename $<))_figure_*
	@echo -e 'Ready to publish: $(_GREEN)$@$(_END)'

.PHONY: new
new:
ifeq ($(dir), "")
	@echo -e '$(_RED)Exemple : make $(@) dir=../article$(_END)'
	@exit 1
else
	@echo "Creating article $(dir)"
	@mkdir -p $(dir)
	@cp -n .gitignore $(dir)/
	@cp -n -a .vscode $(dir)/
	@cp -n $(MODELES_DIR)/modele.md "$(dir)/$(notdir $(shell realpath $(dir))).md"
	@ln -sf $(shell realpath Makefile --relative-to $(dir)) $(dir)/
	@ln -sf $(shell realpath $(SCRIPTS_DIR) --relative-to $(dir)) $(dir)/
	@ln -sf $(shell realpath $(MODELES_DIR) --relative-to $(dir)) $(dir)/
endif

.PHONY: select-glmf
select-glmf: clean
	@scripts/select-modele.sh gnulinuxmagazine

.PHONY: select-glmf-hs
select-glmf-hs: clean
	@scripts/select-modele.sh gnulinuxmagazine-hors-serie

.PHONY: select-hackable
select-hackable: clean
	@scripts/select-modele.sh hackable

.PHONY: select-misc
select-misc: clean
	@scripts/select-modele.sh misc

.PHONY: select-lp
select-lp: clean
	@scripts/select-modele.sh linuxpratique

.PHONY: select-lp-tuto
select-lp-tuto: clean
	@scripts/select-modele.sh linuxpratique-tutoriel

.PHONY: clean clean-cache clean-all
clean:
	@echo "Removing build dir"
	@rm -rf $(BUILD_DIR) 2>/dev/null
	@exit 0

clean-cache:
	@echo "Removing cache"
	@rm -rf $(CACHE_DIR) 2>/dev/null
	@exit 0

clean-all: clean clean-cache
