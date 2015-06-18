HTTP Redis
==========

Description
-----------

You can use this module to perform simple caching.  There are plans to extend this module in the near future.

Latest version available at http://people.FreeBSD.org/~osa/ngx_http_redis-0.3.7.tar.gz.

Example configuration

.. code-block:: nginx

  server {
      location / {
          set $redis_key $uri;

          redis_pass     name:6379;
          default_type   text/html;
          error_page     404 = /fallback;
      }

      location = /fallback {
          proxy_pass backend;
      }
  }



Directives
----------

redis_pass
^^^^^^^^^^

:Syntax: ``redis_pass [`` *name*\ ``:``\ *port* ``]``
:Default: *none*
:Context: *http, server, location*

The backend should set the data in redis. The redis key is ``/uri?args``.

redis_bind
^^^^^^^^^^

:Syntax: ``redis_bind [`` *addr* ``]``
:Default: *none*
:Context: *http, server, localtion*

Use the following IP address as the source address for redis connections.

redis_connect_timeout
^^^^^^^^^^^^^^^^^^^^^

:Syntax: ``redis_connect_timeout [`` *time* ``]``
:Default: ``60000``
:Context: *http, server, location*

The timeout for connecting to redis, in milliseconds.

redis_read_timeout
^^^^^^^^^^^^^^^^^^

:Syntax: ``redis_read_timeout [`` *time* ``]``
:Default: ``60000``
:Context: *http, server, location*

The timeout for reading from redis, in milliseconds.

redis_send_timeout
^^^^^^^^^^^^^^^^^^

:Syntax: ``redis_send_timeout [`` *time* ``]``
:Default: ``60000``
:Context: *http, server, location*

The timeout for sending to redis, in milliseconds.

redis_buffer_size
^^^^^^^^^^^^^^^^^

:Syntax: ``redis_buffer_size [`` *size* ``]``
:Default: see getpagesize(2)
:Context: *http, server, location*

The recv/send buffer size, in bytes.

redis_next_upstream
^^^^^^^^^^^^^^^^^^^

:Syntax: ``redis_next_upstream [ error ] [ timeout ] [ invalid_response ] [ not_found ] [ off ]``
:Default: *error timeout*
:Context: *http, server, location*

Which failure conditions should cause the request to be forwarded to another upstream server? Applies only when the value in redis_pass_ is an upstream with two or more servers.

redis_gzip_flag
^^^^^^^^^^^^^^^

:Syntax: ``redis_gzip_flag [`` *number* ``]``
:Default: *unset*
:Context: *location*

Reimplementation of memcached_gzip_flag, see http://forum.nginx.org/read.php?29,34332,34463 for details.

Variables
---------

$redis_key
^^^^^^^^^^

The value of the redis key.

$redis_db
^^^^^^^^^

The number of redis database (required for < 0.3.4).

For ngx_http_redis >= 0.3.4 is not obligatory, default value is ``0`` if not defined.

Keep-alive connections to redis servers
---------------------------------------

In 0.3.5 support of keep-alive connection backported from original ngx_http_memcached module of nginx 1.1.4.
For previous versions of nginx you should use following instruction.

You need Maxim Dounin's third party ngx_upstream_keepalive module together with this module for keep-alive TCP connections to your backend redis servers.

Here's a sample configuration:

.. code-block:: nginx

  http {
      upstream redisbackend {
          server 127.0.0.1:6379;

          # a pool with at most 1024 connections
          # and do not distinguish the servers:
          keepalive 1024 single;
      }

      server {
          ...
          location /redis {
              ...
              redis_pass redisbackend;
          }
      }
  }



Support
-------

Please use author's email address for submit bug reports, patches and fixes.

Author
------

Sergey A. Osokin <osa@FreeBSD.ORG.ru>

See Also
--------

* :doc:`redis2` that implements almost the whole Redis 2.0 protocol.
* :doc:`sr_cache` that can be used with this module to do transparent response caching for arbitrary Nginx locations.
* The `lua-resty-redis <http://github.com/agentzh/lua-resty-redis>`_ library for :doc:`lua`.
