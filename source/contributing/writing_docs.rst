
.. meta::
   :description: How to use reStructuredText to write documentation for the NGINX Wiki.

Writing Documentation
=====================

Adding New Documentation
------------------------

If you are adding any new documentation files, you need to add them to t24-Aug H read O'Reilly/Corona book on NGINX as research for rewrite
25-Aug H mtg: group (1h)
         revise section on sendfile in /blog/tuning-nginx
	 further revision to Google Cloud instrux
26-Aug O mtg: content (.25h)
         watch Ilya Grigorik presentation on HTTP/2 at Velocity (.75h)
	 update /products/session-persistence per owen comments in email dated 23-jun
	 finalize /blog/tuning-nginx info about sendfile
	 work on updating products/technical-specifications with nginx-plus-extras modules
27-Aug O add list of modules in N+ Extras package to /products/technical-specifications
         add missing hyperlinks and revise module descriptions on /products/technical-specifications
	 mtg: peterg 1:1 (.25h)
	 suggest in faisal's dynamic reconfiguration blog post
	 read Perl regexp reference and tutorial
he *toctree* for their section, which is usually in the ``index.rst`` file in the directory where you are adding files. For example, in the ``community/`` directory the ``index.rst`` file contains a toctree similar to this:

.. code-block: rst

   .. toctree::

      github
      writing_docs

Each entry has an implied ``.rst`` extension. Each file will compile to a separate HTML file when built with Sphinx.

Adding a Module Document
^^^^^^^^^^^^^^^^^^^^^^^^

In addition to adding entries to the toctree, you need to add modules to the big table in the ``modules/index.rst`` file, which has three columns. The module language should use the ``:doc:`` directive to point to a ``.rst`` file for the documentation. The description should be a summary of a few words. The repository should use the :rst:role:`github` or :rst:role:`bitbucket` directive if possible, or should be a link to the repository if something else was used.

.. todo::

   document the :doc: directive and link to them in the paragraph above

Please keep the modules in alphabetical order to make it easier for others to find them.

reStructuredText Basics
-----------------------

These are the basics for writing reStructuredText files. For more information we highly recommend looking at the `Sphinx documentation <http://sphinx-doc.org/contents.html>`_ and `Quick reStructuredText <http://docutils.sourceforge.net/docs/user/rst/quickref.html>`_. For more details about what is possible, take a look at the `reStructuredText specification <http://docutils.sourceforge.net/docs/ref/rst/restructuredtext.html>`_.

As in Python, blocks of content are typically nested using whitespace indentation. For example, this markup:

.. code-block:: rst

   .. note::

      This is a note!
      It is multi-line!

results in this output:

.. note::

   This is a note!
   It is multi-line

Inline Markup
^^^^^^^^^^^^^

There are various inline markups you can use for basic text formatting. For example, this markup:

.. code-block:: rst

   * *emphasis*
   * **bold**
   * ``literal``
   * :sub:`subscript`
   * :sup:`superscript`

results in this output:

* *emphasis*
* **bold**
* ``literal``
* :sub:`subscript`
* :sup:`superscript`

Bullets and Lists
^^^^^^^^^^^^^^^^^

It's very simple to create bulleted and ordered (numbered) lists.

.. code-block:: rst

   * bullet points are marked up with asterisks

     * and can be nested
     * but put a blank line between parent and children

   * and another blank line to continue the parent list

* bullet points are marked up with asterisks

  * and can be nested
  * but put a blank line between parent and children

* and another blank line to continue the parent list

.. code-block:: rst

   #. Items in an auto-generated numbered list are marked up with ``#.``

      #. They too can be nested

   #. And continue with the parent

   1. Fixed numbered lists
   2. Are also possible

#. Items in an auto-generated numbered list are marked up with ``#.``

   #. They too can be nested

#. And continue with the parent

1. Fixed numbered lists
2. Are also possible

Links
^^^^^

You can create both internal and external links.

.. code-block:: rst

   .. _reference-location:

   `NGINX, Inc. website <https://www.nginx.com/>`_

   A link to another document: :doc:`index`

   And a link to an :ref:`arbitrary reference <reference-location>`

.. _reference-location:

`NGINX, Inc. website <https://www.nginx.com/>`_

A link to another document: :doc:`index`

And a link to an :ref:`arbitrary reference <reference-location>`

Headings
^^^^^^^^

To indicate that a line of text is a heading, "underline" it with characters on the line below, the equal sign (``=``) for first-level headings, the hyphen (``-``) for the second level, and the caret (``^``) for the third level. Headings are automatically used to build a table of contents for the Wiki:

.. code-block:: rst

   Level-1 Heading
   ===============

   Level-2 Heading
   ---------------

   Level-3 Heading
   ^^^^^^^^^^^^^^^

Tables
^^^^^^

There are two types of table, grid tables and simple tables.

To create a grid table, use ASCII art as in this markup:

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

which results in this table:

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

You can't span cells in simple tables, but the markup is easier to create:

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

You can also use syntax highlighting in NGINX configuration files, as in this example with line numbers:

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

The easiest way to generate a footnotes is to precede the footnote text with ``[1]_``
and then a section of the bottom of the page as follows [1]_:

.. code-block:: rest

   .. rubric:: Footnotes

   .. [1] Like this

Which generates:

.. rubric:: Footnotes

.. [1] Like this


Notes, Warnings, Todo, and See Also
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^

The markup for notes, warnings, and todos is similar. The NGINX Wiki is configured to omit *todo*s from the output:

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


Roles Specific to the NGINX Wiki
--------------------------------

A few extra roles have been added to assist with creating documentation for this Wiki.

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
