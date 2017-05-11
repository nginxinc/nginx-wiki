# Makefile for Sphinx documentation
#

# You can set these variables from the command line.
SPHINXOPTS    =
SPHINXBUILD   = sphinx-build
BUILDDIR      = build

# User-friendly check for sphinx-build
ifeq ($(shell which $(SPHINXBUILD) >/dev/null 2>&1; echo $$?), 1)
$(error The '$(SPHINXBUILD)' command was not found. Make sure you have Sphinx installed, then set the SPHINXBUILD environment variable to point to the full path of the '$(SPHINXBUILD)' executable. Alternatively you can add the directory with the executable to your PATH. If you don't have Sphinx installed, grab it from http://sphinx-doc.org/)
endif

# Internal variables.
ALLSPHINXOPTS   = -d $(BUILDDIR)/doctrees $(PAPEROPT_$(PAPER)) $(SPHINXOPTS) source
# the i18n builder cannot share the environment and doctrees with the others
I18NSPHINXOPTS  = $(SPHINXOPTS) source

.PHONY: help clean html dirhtml serve linkcheck gettext

help:
	@echo "Please use \`make <target>' where <target> is one of"
	@echo "  dirhtml    to make HTML files named index.html in directories"
	@echo "  serve      to make HTML files and serve with a local NGINX"
	@echo "  gettext    to make PO message catalogs"
	@echo "  linkcheck  to check all external links for integrity"
	@echo "  linkfix    to update all external links returning 301 (run linkcheck first)"

clean:
	rm -rf $(BUILDDIR)/*

html: dirhtml

dirhtml:
	$(SPHINXBUILD) -W -a -b dirhtml $(ALLSPHINXOPTS) $(BUILDDIR)/dirhtml
	@if [ ! -e $(BUILDDIR)/html ]; then cd $(BUILDDIR); ln -s dirhtml html; cd -; fi
	@echo
	@echo "Build finished. The HTML pages are in $(BUILDDIR)/dirhtml."

serve: dirhtml
	./serve.sh

gettext:
	$(SPHINXBUILD) -b gettext $(I18NSPHINXOPTS) $(BUILDDIR)/locale
	@echo
	@echo "Build finished. The message catalogs are in $(BUILDDIR)/locale."

linkcheck:
	$(SPHINXBUILD) -b linkcheck $(ALLSPHINXOPTS) $(BUILDDIR)/linkcheck
	@echo
	@echo "Link check complete; look for any errors in the above output " \
	      "or in $(BUILDDIR)/linkcheck/output.txt."

linkfix:
	python linkfix.py
	@echo
	@echo "Link fix complete. This script is imperfect; remember to" \
	      "review the changes made and fix broken links manually."
