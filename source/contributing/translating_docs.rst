Translating Docs
================

For the purposes of this document we are assuming you are translating into Russian. For other languages please replace ``ru`` with the language code for your language.

Setting up environment
----------------------

In addition to the standard python-sphinx you need a tool called ``sphinx-intl`` to help build the files required for translations. This can be instlaled as follows:

.. code-block:: bash

   $ sudo pip install sphinx-intl

The translateable messages are then extracted using gettext:

.. code-block:: bash

   $ make gettext

These should be used to update the locale files:

.. code-block:: bash

   $ sphinx-intl update -p build/locale -c source/conf.py -l ru

Translation Files
-----------------

Once you have updated them as above tou can find the translation source files in ``source/locale/ru/LC_MESSAGES``. In each file with a ``.po`` extension you will find entries of ``msgid`` and ``msgstr``. ``msgid`` contains the English and ``msgstr`` is where the translation should go. If more context is needed each entry will state which source file and line it came from.

These .po files should be added to GitHub when committing so the translations are stored with the source.

Testing Translations
--------------------

Translatated versions of the wiki are built using:

.. code-block:: bash

   $ sphinx-intl build -c source/conf.py
   $ make -e SPHINXOPTS="-D language='ru'" html

The output in the ``build/html`` will now be the translated version.
