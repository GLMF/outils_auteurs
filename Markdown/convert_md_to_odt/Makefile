
##
## Convert Markdown files to GLMF files
## ────────────────────────────────────
##

.DEFAULT_GOAL := help
help: ## ❓ Show this help.
	@printf "\n Available commands:\n\n"
	@grep -E '(^[a-zA-Z_-]+:.*?##.*$$)|(^##)' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[32m%-25s\033[0m %s\n", $$1, $$2}' | sed -e 's/\[32m## */[33m/'
.PHONY: help

install: ## Install all necessary Python dependencies.
	pip install odfpy ipymd install traitlets jupyter_client nbformat notebook
.PHONY: install

convert: ## Convert a file. Usage: "make convert FILE=your_file_path"
	@if [ -z "$${FILE}" ]; then \
	    echo "Please select a file." && \
	    echo "" && \
	    echo "Usage: " && \
	    echo "    make convert FILE=your_file_path" && \
	    echo "" && \
	    exit 1 ; \
	fi && \
	python markdown_to_glmf.py "$${FILE}"
.PHONY: install
