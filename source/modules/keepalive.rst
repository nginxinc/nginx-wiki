Upstream Keepalive
==================

Description
-----------

**upstream_keepalive** - enables keep-alive connections for upstream servers.

.. note:: Description below is obsolete and needs editing.  Keepalive connections to upstream servers are in the main code since 1.1.4, including the latest stable branch of 1.2.x. Check the documentation at `nginx.org <http://nginx.org/en/docs/http/ngx_http_upstream_module.html#keepalive>`_.

Example:

.. code-block:: nginx

  upstream memcached {
      server 10.0.0.1:11211;
      server 10.0.0.2:11211;
      keepalive 1024 single;
  }

Directives
----------

keepalive
^^^^^^^^^

:Syntax: ``keepalive ``\ *num*\ `` [``\ *single*\ ``]``
:Context: *upstream*

Enables keep-alive connections for the upstream.

*num* specifies the max number of connections to keep open before, if the max is reached it will close the least recently used connections.

*single* treats everything as a single host. With this flag connections to different backends are treated as equal. 

This module was tested to work with standard round-robin balancing, but it's believed to be compatible with more sophisticated balancers. The only requirement is to activate them *before* this module, e.g:

.. code-block:: nginx

  upstream memcached {
      server 10.0.0.1:11211;
      server 10.0.0.2:11211;
      ip_hash;
      keepalive 512;
  }

Installation
-------------

`Download <http://mdounin.ru/hg/ngx_http_upstream_keepalive/>`_ the module.

.. code-block:: bash

    --add-module=<path>
