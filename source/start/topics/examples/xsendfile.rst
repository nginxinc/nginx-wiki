
.. meta::
   :description: Examples that demonstrate how to use the X-Accel-Redirect header with NGINX.

XSendfile
=========

This feature is documented in standard format here: :doc:`x-accel`

The delivery of a static file which depends on an application header is known as the X-Sendfile feature.

`Lighttpd <http://www.lighttpd.net>`_  has this feature and there is a `mod_xsendfile <https://tn123.org/mod_xsendfile/>`_ for Apache2.

Nginx also has this feature, but implemented a little bit differently. In Nginx this feature is called ``X-Accel-Redirect``.

There are two main differences:

#. The header must contain a ``URI``.
#. The location ``should`` be defined as ``internal;`` to prevent the client from going directly to the URI.

Example nginx configuration:

.. code-block:: nginx

    location /protected/ {
     internal;
     root   /some/path;
    }

If the application adds an header X-Accel-Redirect for the location ``/protected/iso.img``:

.. code-block:: http

   X-Accel-Redirect: /protected/iso.img;

Then nginx will serve the file ``/some/path/protected/iso.img`` - note that the root and internal redirect paths are concatenated.

If you want to deliver ``/some/path/iso.img`` then configure nginx like this:

.. code-block:: nginx

    location /protected/ {
      internal;
      alias   /some/path/; # note the trailing slash
    }

Note that the following HTTP headers aren't ``modified`` by nginx::

    Content-Type
    Content-Disposition
    Accept-Ranges
    Set-Cookie
    Cache-Control
    Expires

If some of these header lines are not set, then they will be set by the redirected response.

The application can also have some control over the process, sending the following headers prior to X-Accel-Redirect.

.. code-block:: http

   X-Accel-Limit-Rate: 1024
   X-Accel-Buffering: yes|no
   X-Accel-Charset: utf-8

Links to this issue
-------------------
* `Using X-Accel-Redirect Header With Nginx to Implement Controlled Downloads (with rails and php examples) <http://kovyrin.net/2006/11/01/nginx-x-accel-redirect-php-rails/>`_ from `Alexey Kovyrin <http://kovyrin.net/>`_

* `Nginx-Fu: X-Accel-Redirect From Remote Servers <http://kovyrin.net/2010/07/24/nginx-fu-x-accel-redirect-remote/>`_ from `Alexey Kovyrin <http://kovyrin.net/>`_

* `Rails 3.x assets pipeline support for X-Accel-Redirect <http://guides.rubyonrails.org/asset_pipeline.html#x-sendfile-headers>`_

* `proxy_ignore_headers <http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_ignore_headers>`_ Ignoring Content Type headers when using X-Accel-Redirect

* `proxy_hide_header <http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_hide_header>`_ Hide headers from upstream servers when using X-Accel-Redirect

