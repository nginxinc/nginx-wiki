
.. meta::
   :description: OpenSSL status module.

OpenSSL status
==============

Description
-----------
**ngx_http_ssl_status_module** - module provides access to OpenSSL status counters (`SSL_CTX_sess_* <https://www.openssl.org/docs/man1.0.2/ssl/SSL_CTX_sess_connect.html>`_).
Each worker process appends its OpenSSL status counters to shared memory zone from which this values can be viewed by HTTP-request.
The module allows to collect independent counters for each virtual server or assign multiple virtual servers to one zone and get summed up values for them.

.. note:: *This module is not distributed with the NGINX source.* See the `installation instructions <ssl_status.installation_>`_.



Directives
----------

ssl_status_zone
^^^^^^^^^^^^^^^
:Syntax: *ssl_status_zone <zone>*
:Default: *none*
:Context: *server*

A server saves its SSL status counters to a zone defined by this directive.

ssl_status
^^^^^^^^^^
:Syntax: *ssl_status <zone>*
:Default: *none*
:Context: *location*

Status counters for a zone can be accessed by a location marked by this directive.

Synopsis
--------

.. code-block:: nginx

  server {
      server_name A;
      ...
      ssl_status_zone zone1;
  }

  server {
      server_name B;
      ...
      ssl_status_zone zone1;
  }

  server {
      server_name C;
      ...
      ssl_status_zone zone2;

      location /stat1 {
          ssl_status zone1;
      }

      location /stat2 {
          ssl_status zone2;
      }
  }


* SSL status for servers A and B (with summed up counters) will be available at /stat1 of server C.
* SSL status for server C will be available at /stat2 of server C.

.. note:: Status will not be collected for servers without ssl_status_zone option.

Each field name corresponds apropriate OpenSSL function name: `SSL_CTX_sess_* <https://www.openssl.org/docs/man1.0.2/ssl/SSL_CTX_sess_connect.html>`_

.. code-block:: bash

  $ curl https://localhost/ssl_stat
  number: 0
  connect: 0
  connect_good: 0
  connect_renegotiate: 0
  accept: 21
  accept_good: 21
  accept_renegotiate: 0
  hits: 5
  cb_hits: 0
  misses: 0
  timeouts: 0
  cache_full: 0


.. _ssl_status.installation:

Installation
------------
This module is not distributed with the NGINX source. You can download the ngx_http_ssl_status_module from :github:`Github <andreydomas/ngx_http_ssl_status_module>`

.. code-block:: bash

  cd nginx-*version*
  /configure --with-http_ssl_module --add-module=/path/to/this/directory
  make
  make install
