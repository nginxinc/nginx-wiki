NGINX wiki
==========

.. image:: https://travis-ci.org/nginxinc/nginx-wiki.svg
    :target: https://travis-ci.org/nginxinc/nginx-wiki

This is the source repository for the new NGINX wiki. It is written in reStructuredText format as intended to be compiled into HTML using `Sphinx Documentation Generator <http://sphinx-doc.org/>`_.

Compiling
---------

To compile a local copy of the documentation you will need Sphinx installed. Most Linux distributions have this in their repositories and can be installed with commands such as:

.. code-block:: bash

   $ sudo apt-get install python-sphinx

or

.. code-block:: bash

   $ sudo yum install python-sphinx

Alternatively it can be installed with Python's pip package manager:

.. code-block:: bash

   $ sudo pip install Sphinx

There are a couple of extra dependencies you will also need to build the Markdown parts of the documentation:

.. code-block:: bash

   $ sudo pip install recommonmark commonmark

You can then build the docs with:

.. code-block:: bash

   $ make html

The HTML output is stored in the ``build/html`` directory. You can view this any way you desire, a very easy way to do it is to use PHP's built-in web server:

.. code-block:: bash

   $ cd build/html
   $ php -S localhost:8000

Contributing
------------

We welcome edits and additions to this wiki. To find out more about how to do this please see out `Submitting Contributions <https://github.com/nginxinc/nginx-wiki/blob/master/source/contributing/github.rst>`_ page. If you spot any problems please file a `GitHub Issue <https://github.com/nginxinc/nginx-wiki/issues>`_.

If you have any questions or require any help with this wiki please use the `NGINX Mailing List <http://mailman.nginx.org/mailman/listinfo/nginx>`_.
