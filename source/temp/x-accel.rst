X-Accel
=======

Synopsis
--------
X-accel allows for internal redirection to a location determined by a header returned from a backend.

This allows you to handle authentication, logging or whatever else you please in your backend and then have Nginx handle serving the contents from redirected location to the end user, thus freeing up the backend to handle other requests.
This feature is commonly known as X-Sendfile.

This feature differs a bit from standard Nginx modules as it does not rely on directives but rather handles headers from upstream in a special way.
The way it works is that you send the header `x-accel.redirect`_ with a URI.
Nginx will match this URI against its locations as if it was a normal request.
It will then serve the location that matches the defined root + URI passed in the header.

Example configuration, notice the difference between alias and root.

.. code-block:: nginx

  # Will serve /var/www/files/myfile.tar.gz
  # When passed URI /protected_files/myfile.tar.gz
  location /protected_files {
    internal;
    alias /var/www/files;
  }

  # Will serve /var/www/protected_files/myfile.tar.gz
  # When passed URI /protected_files/myfile.tar.gz
  location /protected_files {
    internal;
    root /var/www;
  }

You can also proxy to another server.

.. code-block:: nginx

  location /protected_files { 
    internal;
    proxy_pass http://127.0.0.2; 
  }



Special Headers
---------------

.. _x-accel.redirect:

X-Accel-Redirect
^^^^^^^^^^^^^^^^
:Syntax: *X-Accel-Redirect uri*
:Default: *X-Accel-Redirect void*

Sets the URI for Nginx to serve.


X-Accel-Buffering
^^^^^^^^^^^^^^^^^
:Syntax: *X-Accel-Buffering [yes|no]*
:Default: *X-Accel-Buffering yes*

Sets the proxy buffering for this connection.
Setting this to "no" will allow unbuffered responses suitable for Comet and HTTP streaming applications.
Setting this to "yes" will allow the response to be cached.


X-Accel-Charset
^^^^^^^^^^^^^^^
:Syntax: *X-Accel-Charset charset*
:Default: *X-Accel-Charset utf-8*

Sets the charset of the file.


X-Accel-Expires
^^^^^^^^^^^^^^^
:Syntax: *X-Accel-Expires [off|seconds]*
:Default: *X-Accel-Expires off*

Sets when to expire the file in the internal Nginx cache, if one is used.


X-Accel-Limit-Rate
^^^^^^^^^^^^^^^^^^
:Syntax: *X-Accel-Limit-Rate bytes [bytes|off]*
:Default: *X-Accel-Limit-Rate off*

Sets the rate limit for this single request.
Off means unlimited.



References
----------
`Original Documentation <http://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_ignore_headers>`_
