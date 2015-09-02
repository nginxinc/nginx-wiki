
.. meta::
   :description: A sample NGINX configuration for Pylons.

Pylons
======

Pylons is pretty simple..

Edit project ini file (``development.ini`` by default) and change ``[server:main]`` to:

.. code-block:: ini

   [server:main]
   use = egg:Flup#fcgi_thread
   host = 0.0.0.0
   port = 8080

If you don't have flup then install it with ``easy_install flup``

Your virtual host config will look like this.

.. code-block:: nginx

   server {
           server_name domain.tld;

           location / {
                   # host and port to fastcgi server
                   fastcgi_pass 127.0.0.1:8080;
                   include fastcgi_params;
                   fastcgi_pass_header Authorization;
                   fastcgi_intercept_errors off;
           }
   }

