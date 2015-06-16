Upstream Fair Balancer
======================

ngx_http_upstream_fair_module
-----------------------------

The upstream_fair module sends an incoming request to the least-busy backend server, rather 
than distributing requests round-robin.

Example:

.. code-block:: nginx

  upstream backend {
    server server1;
    server server2;
    fair;
  }

.. note:: *This module is not distributed with the Nginx source.* See the `installation instructions`_.

fair
^^^^

:Syntax: ``fair``
:Default: *none*
:Context: *upstream*

Enables fairness.

upstream_fair_shm_size
^^^^^^^^^^^^^^^^^^^^^^

:Syntax: ``upstream_fair_shm_size`` *size*
:Default: ``32k``
:Context: *main*

Size of the shared memory for storing information about the busy-ness of backends. Defaults 
to 8 pages (so 32k on most systems).

.. _installation instructions:

Installation
------------

This module is not distributed with the Nginx source. You can browse its 
`git repository <http://github.com/gnosek/nginx-upstream-fair/tree/master>`_, 
or `download the tar ball <http://github.com/gnosek/nginx-upstream-fair/tarball/master>`_.

After extracting, add the following option to your Nginx ``./configure`` command:

.. code-block:: bash

  --add-module=path/to/upstream_fair/directory

Then ``make`` and ``make install`` as usual.
