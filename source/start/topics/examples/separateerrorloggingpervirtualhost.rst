
.. meta::
   :description: An example NGINX configuration that keeps a separate error log for each server block.

Separating Error Logs per Virtual Host
======================================

When you have multiple virtual hosts, it makes sense to keep a separate error logs for each one.
Virtual hosts can be completely independent, and even managed by different admins.
Therefore, each should have its own access and error log.

..
   Dead link
   (However, `lighttpd's author refuses to implement this feature <http://www.wikivs.com/wiki/Lighttpd_vs_nginx#Separated_error_logging_per_virtual_server>`_ ).

Here is a configuration example for separate error logging per virtual host:

.. code-block:: nginx

  error_log logs/main_error.log;

  events {
      worker_connections 1024;
  }

  http {
      error_log logs/http_error.log error;
      server {
          server_name one.org;
          access_log logs/one.access;
          error_log logs/one.error error;
      }

      server {
          server_name two.org;
          access_log logs/two.access;
          error_log logs/two.error error;
      }
  }

This way, a request for ``one.org/nonexistent.html`` file will output the following error in ``logs/one.error``::

  2009/01/01 19:45:44 [error]  29874#0: *98 open() "/var/www/one/nonexistent.html" failed (2: No such file or directory), client: 11.22.33.44, server: one.org, request: "GET /nonexistent.html HTTP/1.1", host: "one.org"

.. note:: The `error_log <https://nginx.org/en/docs/http/ngx_http_core_module.html#error_log>`_ directive has different default values depending on the section it appears in.
  This means that you have to explicitly set the error logging level in the `server {...} <https://nginx.org/en/docs/http/ngx_http_core_module.html#server>`_ block.
