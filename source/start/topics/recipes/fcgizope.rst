
.. meta::
   :description: How to use NGINX as a front-end for Zope via FastCGI.

Zope via FastCGI
================

This is an example of how to use NGINX as a front-end for Zope via FastCGI.

.. code-block:: nginx

    location ~ /zope(/|$) {
      fastcgi_pass    unix:/var/run/plone-site.sock;
      include /etc/nginx/fastcgi_params;

      set $fixed_content_length $content_length;
      if ( $fixed_content_length = "" ) {
        set $fixed_content_length "0";
      }

      set $path_info "";
      if ( $document_uri ~ "^/zope/(.*)$" ) {
        set $path_info $1;
      }

      fastcgi_param   CONTENT_LENGTH  $fixed_content_length;
      fastcgi_param   PATH_INFO   $path_info;
      fastcgi_param   SCRIPT_NAME /zope;
    }

``location /zope(/|$)`` is only needed when home URL without trailing ``/`` (i.e. ``http://yoursite.com/zope`` ) should also be accessible. Otherwise ``location /zope/`` is enough.

It can also be done in a slightly more simple form:

.. code-block:: nginx

    location ~ /zope(?<path_info>/.*|$) {
      fastcgi_pass    unix:/var/run/plone-site.sock;
      include /etc/nginx/fastcgi_params;

      set $fixed_content_length $content_length;
      if ( $fixed_content_length = "" ) {
        set $fixed_content_length "0";
      }

      fastcgi_param   CONTENT_LENGTH  $fixed_content_length;
      fastcgi_param   PATH_INFO   $path_info;
      fastcgi_param   SCRIPT_NAME /zope;
    }

Zope (at least version 2.10) call ``atoi`` with ``CONTENT_LENGTH``. So an ``exceptions.ValueError`` will be throw when ``CONTENT_LENGTH`` exists but is empty string.

When mounted on non-root web path (``/zope`` in this example) Zope expects ``SCRIPT_NAME`` and ``PATH_INFO`` in Apache way (``SCRIPT_NAME`` as Zope root, and ``PATH_INFO`` for object reference).

