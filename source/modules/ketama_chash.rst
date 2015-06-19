Upstream Ketama CHash
=====================

Description
-----------

**usptream_ketama_chash module** - a load balancer which provides upstream load distribution by hashing a configurable variable using ketama consistent hashing algorithm. 

.. note:: *This module is not distributed with the Nginx source.* See the installation instructions_.

Directives
----------

hash
^^^^

:Syntax: ``ketama_chash`` *$variable*
:Default: *none*
:Context: *upstream*

Enables upstream ketama consistent hashing of *$variable*.

Synopsis
--------

.. code-block:: nginx

  upstream backend {
      ...
      ketama_chash    $uri;
  }

.. _installation instructions:

Installation
------------

This module is not distributed with the Nginx source. You can download the request_hash module from `Github <https://github.com/flygoast/ngx_http_upstream_ketama_chash>`_.

.. code-block:: bash

  cd nginx-*version*
  ./configure --add-module=/path/to/this/directory
  make
  make install

Bugs
----

Send bug reports to `FengGu <https://github.com/flygoast/ngx_http_upstream_ketama_chash>`_.
