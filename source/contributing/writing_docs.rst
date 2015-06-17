Writing Documentation
=====================

Adding new documentation
------------------------

If any new documentation files are added the need to be added to the *toctree* for that section. This is usually found in the ``index.rst`` file for the directory you need to add your documentation to.  For example in the ``community/`` directory the ``index.rst`` file contains a toctree similar to this:

.. code-block: rst

   .. toctree::

      github
      writing_docs

Each one are implied to have a ``.rst`` extension. Each file will compile to a seperate HTML file when built with Sphinx.

Adding a module document
^^^^^^^^^^^^^^^^^^^^^^^^

In addition to adding to the tocree, modules should be added to the big table in ``modules/index.rst``. This has three columns, the module language should use the ``:doc:`` directive to point to a ``.rst`` file for the documentation. The description should be a summary of a few words. The repository should use the :rst:role:`github` or :rst:role:`bitbucket` directive if possible, or should be a link to the repository if something else was used.

.. todo::

   document the :doc: directive and link to them in the paragraph above

Please keep the modules in alphabetical order, this makes it easier for others to find them.

reStructuredText Basics
-----------------------

These are the basics for writing reStructuredText files. For more imformation we highly recommend looking at `Sphinx's own documentation <http://sphinx-doc.org/contents.html>`_ and `Quick reStructuredText <http://docutils.sourceforge.net/docs/user/rst/quickref.html>`_. For a more detailed view what is possible, take a look at the `reStructuredText specification <http://docutils.sourceforge.net/docs/ref/rst/restructuredtext.html>`_.

Like Python, blocks of content are typically nested using whitespace indentation. For example:

.. code-block:: rst

   .. note::

      This is a note!
      It is multi-line!

.. note::

   This is a note!
   It is multi-line

Inline Markup
^^^^^^^^^^^^^

There are various inline markups you can use for basic text formatting. For example:

.. code-block:: rst

   * *emphasis*
   * **bold**
   * ``literal``
   * :sub:`subscript`
   * :sup:`superscript`

* *emphasis*
* **bold**
* ``literal``
* :sub:`subscript`
* :sup:`superscript`

Bullets and Lists
^^^^^^^^^^^^^^^^^

Bullets and ordered lists are very simple.

.. code-block:: rst

   * bullet points are asterisks

     * and can be nested
     * but need a blank line between parent and children

   * and another blank line to continue the parent list

* bullet points are asterisks

  * and can be nested
  * but need a blank line between parent and children

* and another blank line to continue the parent list

.. code-block:: rst

   #. An auto-generated numbered list

      #. It too can be nested

   #. And continue with the parent

   1. Fixed numbered lists
   2. Are also possible

#. An auto-generated numbered list

   #. It too can be nested

#. And continue with the parent

1. Fixed numbered lists
2. Are also possible

Links
^^^^^

There are internal links as well as external links that are possible.

.. code-block:: rst

   .. _reference-location:

   `Nginx Website <http://nginx.com/>`_

   A link to another document: :doc:`index`

   And a link to an :ref:`abritrary reference <reference-location>`

.. _reference-location:

`Nginx Website <http://nginx.com/>`_

A link to another document: :doc:`index`

And a link to an :ref:`abritrary reference <reference-location>`

Headings
^^^^^^^^

Headings are signified by using characters on the line below to underline them. Different styles signify level. Headings are automatically used to build the table of contents for the wiki:

.. code-block:: rst

   Heading
   =======

   SubHeading
   ----------

   More depth
   ^^^^^^^^^^

Tables
^^^^^^

There are two ways to create tables, Grid Tables and Simple Tables.

Grid Tables use ASCII art to design the table. An example is as follows:

.. code-block:: rst

   +-----------+----------+----------+
   | Column 1  | Column 2 | Column 3 |
   | Multiline |          |          |
   +===========+==========+==========+
   | item 1    | stuff    | nonsense |
   +-----------+----------+----------+
   | item 2    | horizontal span     |
   +-----------+----------+----------+
   | item 3    | vertical | is       |
   +-----------+ span     | possible |
   | item 4    |          | too.     |
   +-----------+----------+----------+

+-----------+----------+----------+
| Column 1  | Column 2 | Column 3 |
| Multiline |          |          |
+===========+==========+==========+
| item 1    | stuff    | nonsense |
+-----------+----------+----------+
| item 2    | horizontal span     |
+-----------+----------+----------+
| item 3    | vertical | is       |
+-----------+ span     | possible |
| item 4    |          | too.     |
+-----------+----------+----------+

Simple tables on the other hand are less flexible but are easier to create:

.. code-block:: rst

   ======== ======== ========
   Column 1 Column 2 Column 3
   ======== ======== ========
   item a   item b   item c
   item d   item e   item f
   ======== ======== ========

======== ======== ========
Column 1 Column 2 Column 3
======== ======== ========
item a   item b   item c
item d   item e   item f
======== ======== ========

Syntax Highlighting
^^^^^^^^^^^^^^^^^^^

Sphinx can highlight the syntax of code blocks. For example:

.. code-block:: rst

   .. code-block:: c

      #include <stdio.h>

      int main(void)
      {
        printf("Hello World!");
        return 0;
      }


.. code-block:: c

   #include <stdio.h>

   int main(void)
   {
     printf("Hello World!");
     return 0;
   }

There is also syntax highlighting for Nginx configuration files, here is an example of this with line numbers:

.. code-block:: rst

   .. code-block:: nginx
      :linenos:

      server {
          listen          80;
          server_name     domain.com *.domain.com;
          return          301 $scheme://www.domain.com$request_uri;
      }

      server {
          listen          80;
          server_name     www.domain.com;

          index           index.html;
          root            /home/domain.com;
      }

.. code-block:: nginx
   :linenos:

   server {
       listen          80;
       server_name     domain.com *.domain.com;
       return          301 $scheme://www.domain.com$request_uri;
   }

   server {
       listen          80;
       server_name     www.domain.com;

       index           index.html;
       root            /home/domain.com;
   }

.. seealso::

   `Pygments Demo <http://pygments.org/demo/>`_ - A demo of the available syntax highlighting types.

Footnotes
^^^^^^^^^

Footnotes in their most simple form can be generated using ``[1]_`` in the text
and then a section of the bottom of the page as follows [1]_:

.. code-block:: rest

   .. rubric:: Footnotes

   .. [1] Like this

Which generates:

.. rubric:: Footnotes

.. [1] Like this


Notes, Warnings, Todo and See Also
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

Notes, warnings and todos all take similar forms. The wiki is configured to hide *todo* whilst rendering:

.. code-block:: rest

   .. note::
      This is a note

   .. warning::
      This is a warning

   .. todo::
      This is a todo

   .. seealso::
      This is a See Also

Which generates:

.. note::
   This is a note

.. warning::
   This is a warning

.. todo::
   This is a todo

.. seealso::
   This is a See Also


Nginx Wiki specific rols
------------------------

A few extra roles have been added to assist with creating documentation for this wiki.

.. rst:role:: icon

   The icon role lets you use `Font Awesome <https://fortawesome.github.io/Font-Awesome/icons/>`_ icons in text. Simply use as described in the Font Awesome documentation but without the *fa* prefix and the options comma separated. For example:

   .. code-block:: rst

      A globe example: :icon:`globe`

   A globe example: :icon:`globe`

.. rst:role:: github

   This creates a GitHub icon with link based on a GitHub path. For example:

   .. code-block:: rst

      :github:`nginxinc/nginx-wiki`

   :github:`nginxinc/nginx-wiki`

.. rst:role:: bitbucket

   This creates a Bitbucket icon with link based on a Bitbucket path. For example:

   .. code-block:: rst

      :bitbucket:`nginx-goodies/nginx-sticky-module-ng`

   :bitbucket:`nginx-goodies/nginx-sticky-module-ng`
