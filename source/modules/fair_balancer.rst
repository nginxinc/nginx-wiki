Upstream Fair Balancer
======================

Description
-----------
**ngx_http_upstream_fair_module** - sends an incoming request to the least-busy backend server, rather than distributing requests round-robin.

Example:

.. code-block:: nginx

  upstream backend {
    server server1;
    server server2;
    fair;
  }

.. note:: *This module is not distributed with the Nginx source.* See the `installation instructions <fair_balancer.installation_>`_.



Directives
----------

fair
^^^^
:Syntax: *fair*
:Default: *none*
:Context: *upstream*

Enables fairness.


upstream_fair_shm_size
^^^^^^^^^^^^^^^^^^^^^^
:Syntax: *upstream_fair_shm_size size*
:Default: *32k*
:Context: *main*

Size of the shared memory for storing information about the busy-ness of backends. Defaults 
to 8 pages (so 32k on most systems).



.. _fair_balancer.installation:

Installation
------------
This module is not distributed with the Nginx source. You can browse its 
:github:`git repository <gnosek/nginx-upstream-fair/tree/master>` 
or :github:`download the tar ball <gnosek/nginx-upstream-fair/tarball/master>`

After extracting, add the following option to your Nginx ``./configure`` command:

.. code-block:: bash

  --add-module=path/to/upstream_fair/directory

Then ``make`` and ``make install`` as usual.
