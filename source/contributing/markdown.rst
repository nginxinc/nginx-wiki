Docs in Markdown
================

For those who are not comfortable with writing documentation in reStructuredText form the wiki also supports documentation written in Markdown (GitHub flavoured).

Ideally we would prefer this entire documentation to be in reStructuredText form, but understand that this could introduce a learning curve for some people.

Creating new files
------------------

To create a new Markdown document simply create a file in the relevant directory with the ``.md`` extension. Sphinx will automatically understand that this is a Markdown document and render it appropriately.

Caveats
-------

Markdown is not modular so does not support a lot of the Sphinx reStructuredText directives and roles. Internal linking should be done using a relative path and things such as the ``:github:`` role has no equivalent in Markdown.

Additional for new documents you will still need to edit the relevant ``index.rst`` file to add the Markdown document to the ``tocree``. Markdown does not support toctrees itself.

Code syntax highlighting is supported and parsed using `Pygments <http://pygments.org/>`_, so a compatible language name should be used where appropriate.
