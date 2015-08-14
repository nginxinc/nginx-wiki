Non-root Web Path
=================

When installing FastCGI applications in non-root web path (for example, ``http://example.com/thisapp/``), some of them expect (and find sufficient) couple fastcgi parameters to be present: ``PATH_INFO`` and ``SCRIPT_NAME``, set in a similar way to how Apache sets them.

So, what in Apache looks like ``FastCgiExternalServer /var/www/thisapp -socket /path/to/thisappfcgi.sock``, in nginx can be done this way:

.. code-block:: nginx

    location ~ /thisapp(?<path_info>/.*|$) {
      fastcgi_pass    unix:/path/to/thisappfcgi.sock;
      include /etc/nginx/fastcgi_params;

      fastcgi_param   PATH_INFO   $path_info;
      fastcgi_param   SCRIPT_NAME "/thisapp";
    }

It is known to work at least for Mercurial, Trac and :doc:`../recipes/fcgizope`.

