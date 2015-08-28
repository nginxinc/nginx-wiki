
.. meta::
   :description: How to translate documentation with Sphinx. Make sure to do this whenever contributing to the NGINX Wiki.

Translating Docs
================

This document uses translation into Russian as an example. For other languages, replace ``ru`` with the appropriate language code.

Setting Up the Translation Environment
--------------------------------------

In addition to the standard ``python-sphinx`` tool, you need the ``sphinx-intl`` tool to help build the files required for translations. Run this command to install it:

.. code-block:: bash

   $ sudo pip install sphinx-intl

The translatable messages are then extracted using ``gettext``:

.. code-block:: bash

   $ make gettext

These should be used to update the locale files:

.. code-block:: bash

   $ sphinx-intl update -p build/locale -c source/conf.py -l ru

Translation Files
-----------------

Once you have updated them as above, you can find the translation source files in ``source/locale/ru/LC_MESSAGES``. In each file with a ``.po`` extension are entries called ``msgid`` and ``msgstr``. ``msgid`` contains the English and ``msgstr`` is where to put the translation. If more context is needed, each entry will state the source file and line it came from.

The ``.po`` files should be added to GitHub when committing so the translations are stored with the source.

Testing Translations
--------------------

Translated versions of the Wiki are built using:

.. code-block:: bash

   $ sphinx-intl build -c source/conf.py
   $ make -e SPHINXOPTS="-D language='ru'" html

The translated output is written to ``build/html``.
