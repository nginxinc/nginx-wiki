
.. meta::
   :description: The Upstream Ketama CHash module provides upstream load distribution by hashing a configurable variable using ketama consistent hashing algorithm.

Upstream Ketama CHash
=====================

Description
-----------
**usptream_ketama_chash module** - a load balancer which provides upstream load distribution by hashing a configurable variable using ketama consistent hashing algorithm. 

.. note:: *This module is not distributed with the NGINX source.* See the `installation instructions <ketama_chash.installation_>`_.



Directives
----------

hash
^^^^
:Syntax: *ketama_chash $variable*
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



.. _ketama_chash.installation:

Installation
------------
This module is not distributed with the NGINX source. You can download the request_hash module from :github:`Github <flygoast/ngx_http_upstream_ketama_chash>`

.. code-block:: bash

  cd nginx-*version*
  ./configure --add-module=/path/to/this/directory
  make
  make install



Bugs
----
Send bug reports to :github:`FengGu <flygoast/ngx_http_upstream_ketama_chash>`
