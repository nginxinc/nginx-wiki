NGINX wiki
==========

.. image:: https://travis-ci.org/nginxinc/nginx-wiki.svg
    :target: https://travis-ci.org/nginxinc/nginx-wiki

This is the source repository for the new NGINX wiki. It is written in reStructuredText format as intended to be compiled into HTML using `Sphinx Documentation Generator <http://sphinx-doc.org/>`_.

Compiling
---------

To compile a local copy of the documentation you will need Sphinx installed. It can be installed with Python's pip package manager:

.. code-block:: bash

   $ sudo pip install -r requirements.txt

You can then build the docs with:

.. code-block:: bash

   $ make dirhtml

The HTML output is stored in the ``build/dirhtml`` directory. You can view this any way you desire, a very easy way to do it is to use NGINX. The build system can execute NGINX using:

.. code-block:: bash

   $ make serve

Or if you have NGINX in a non-standard path (for example ``/opt/nginx/``) you can point to the path of the NGINX binary with:

.. code-block:: bash

   $ NGINX_PATH=/opt/nginx/sbin make serve

NGINX will be started on port 8080 so you can view the wiki by browsing to http://localhost:8080/

When you are done, **CTRL-C** will exit NGINX.

Contributing
------------

We welcome edits and additions to this wiki. To find out more about how to do this please see out `Submitting Contributions <https://github.com/nginxinc/nginx-wiki/blob/master/source/contributing/github.rst>`_ page. If you spot any problems please file a `GitHub Issue <https://github.com/nginxinc/nginx-wiki/issues>`_.

If you have any questions or require any help with this wiki please use the `NGINX Mailing List <http://mailman.nginx.org/mailman/listinfo/nginx>`_.
